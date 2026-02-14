import { Redis } from "@upstash/redis";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);
const RESERVED_CODES = new Set(["api", "put", "r", "del"]);

function getRedisOrNull() {
  const candidates = [
    {
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    },
    {
      url: process.env.UPSTASH_REDIS_REST_API_URL,
      token: process.env.UPSTASH_REDIS_REST_API_TOKEN,
    },
    {
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    },
    {
      url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL,
      token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN,
    },
    {
      url: process.env.UPSTASH_REDIS_REST_KV_URL,
      token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN,
    },
  ];

  const resolved = candidates.find(
    (c) =>
      typeof c.url === "string" &&
      typeof c.token === "string" &&
      c.url &&
      c.token,
  );
  if (!resolved) return null;
  return new Redis({ url: resolved.url, token: resolved.token });
}

function safeErrorMessage(err) {
  const name =
    err && typeof err === "object" && "name" in err
      ? String(err.name)
      : "Error";
  const message =
    err && typeof err === "object" && "message" in err
      ? String(err.message)
      : String(err);
  const combined = `${name}: ${message}`;
  return combined.length > 300 ? `${combined.slice(0, 300)}…` : combined;
}

function normalizeUrl(raw) {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }

  if (!ALLOWED_PROTOCOLS.has(url.protocol)) return null;
  return url.toString();
}

function normalizeCode(raw) {
  if (typeof raw !== "string") return null;
  let trimmed = raw.trim();
  if (!trimmed) return null;

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    try {
      const parsed = new URL(trimmed);
      trimmed = parsed.pathname || "";
    } catch {
      // fall through
    }
  }

  while (trimmed.startsWith("/")) trimmed = trimmed.slice(1);
  if (!trimmed) return null;

  const firstSegment = trimmed.split("/")[0];
  if (!firstSegment) return null;

  const code = firstSegment;
  if (code.length > 64) return null;
  if (!/^[A-Za-z0-9_-]+$/.test(code)) return null;
  if (RESERVED_CODES.has(code.toLowerCase())) return null;
  return code;
}

function isAuthorized(req) {
  const expected = process.env.CC_ADMIN_TOKEN;
  if (!expected) return true;

  const header = req.headers?.authorization;
  const bearer = typeof header === "string" ? header.trim() : "";
  if (
    bearer.startsWith("Bearer ") &&
    bearer.slice("Bearer ".length) === expected
  )
    return true;

  const alt = req.headers?.["x-cc-admin-token"];
  if (typeof alt === "string" && alt === expected) return true;

  return false;
}

async function scanKeys(redis, match) {
  const allKeys = [];
  let cursor = "0";
  // Safety bound to avoid infinite loops if something changes.
  for (let i = 0; i < 5000; i++) {
    const res = await redis.scan(cursor, { match, count: 1000 });

    let nextCursor;
    let keys;

    if (Array.isArray(res)) {
      nextCursor = res[0];
      keys = res[1];
    } else if (res && typeof res === "object") {
      // Some clients return { cursor, keys }
      nextCursor = res.cursor;
      keys = res.keys;
    }

    if (typeof nextCursor !== "string") nextCursor = "0";
    if (!Array.isArray(keys)) keys = [];

    for (const key of keys) {
      if (typeof key === "string" && key.length > 0) allKeys.push(key);
    }

    cursor = nextCursor;
    if (cursor === "0") break;
  }

  return allKeys;
}

async function deleteAllEntries(redis) {
  const patterns = ["c2u:*", "u2c:*", "u2cs:*"];
  const deletedByPattern = {};
  let totalDeleted = 0;

  for (const pattern of patterns) {
    const keys = await scanKeys(redis, pattern);
    deletedByPattern[pattern] = keys.length;

    for (let i = 0; i < keys.length; i += 500) {
      const batch = keys.slice(i, i + 500);
      if (batch.length === 0) continue;
      // del supports variadic keys
      await redis.del(...batch);
    }

    totalDeleted += keys.length;
  }

  return { totalDeleted, deletedByPattern };
}

async function deleteByCode(redis, code) {
  const url = await redis.get(`c2u:${code}`);
  if (typeof url !== "string" || url.length === 0) {
    return { ok: false, status: 404, msg: "not found" };
  }

  await redis.del(`c2u:${code}`);

  // Best-effort cleanup of reverse index.
  await redis.srem(`u2cs:${url}`, code);

  const canonical = await redis.get(`u2c:${url}`);
  if (canonical === code) {
    const remaining = await redis.smembers(`u2cs:${url}`);
    const next = Array.isArray(remaining)
      ? remaining.find((c) => typeof c === "string" && c.length > 0)
      : null;
    if (next) {
      await redis.set(`u2c:${url}`, next);
    } else {
      await redis.del(`u2c:${url}`);
      await redis.del(`u2cs:${url}`);
    }
  }

  return { ok: true, status: 200, msg: "deleted" };
}

async function deleteByUrl(redis, url) {
  const normalized = normalizeUrl(url);
  if (!normalized) return { ok: false, status: 400, msg: "invalid url" };

  let codes = await redis.smembers(`u2cs:${normalized}`);
  if (!Array.isArray(codes)) codes = [];

  const canonical = await redis.get(`u2c:${normalized}`);
  if (
    typeof canonical === "string" &&
    canonical.length > 0 &&
    !codes.includes(canonical)
  ) {
    codes.push(canonical);
  }

  for (const code of codes) {
    if (typeof code !== "string" || code.length === 0) continue;
    await redis.del(`c2u:${code}`);
  }

  await redis.del(`u2c:${normalized}`);
  await redis.del(`u2cs:${normalized}`);

  return { ok: true, status: 200, msg: `deleted ${codes.length} code(s)` };
}

export default async function handler(req, res) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    res.status(405).json({ ok: false, msg: "method not allowed" });
    return;
  }

  const redis = getRedisOrNull();
  if (!redis) {
    res.status(500).json({
      ok: false,
      msg: "missing redis env vars (expected UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN or UPSTASH_REDIS_REST_KV_REST_API_URL/UPSTASH_REDIS_REST_KV_REST_API_TOKEN)",
    });
    return;
  }

  try {
    const queryAll = typeof req.query?.all === "string" ? req.query.all : "";
    const queryConfirm = typeof req.query?.confirm === "string" ? req.query.confirm : "";

    const queryCode = typeof req.query?.code === "string" ? req.query.code : "";
    const queryUrl = typeof req.query?.url === "string" ? req.query.url : "";

    let bodyCode = "";
    let bodyUrl = "";
    let bodyAll = false;
    let bodyConfirm = "";

    if (typeof req.body === "string") {
      const trimmed = req.body.trim();
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
        bodyUrl = trimmed;
      else bodyCode = trimmed;
    } else if (Buffer.isBuffer(req.body)) {
      const trimmed = req.body.toString("utf8").trim();
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://"))
        bodyUrl = trimmed;
      else bodyCode = trimmed;
    } else if (req.body && typeof req.body === "object") {
      if (typeof req.body.code === "string") bodyCode = req.body.code;
      if (typeof req.body.url === "string") bodyUrl = req.body.url;
      if (typeof req.body.all === "boolean") bodyAll = req.body.all;
      if (typeof req.body.confirm === "string") bodyConfirm = req.body.confirm;
    }

    const wantsAll = bodyAll || queryAll === "1" || queryAll.toLowerCase() === "true";
    if (wantsAll) {
      // For safety: require CC_ADMIN_TOKEN to be set for delete-all.
      if (!process.env.CC_ADMIN_TOKEN) {
        res.status(400).json({ ok: false, msg: "set CC_ADMIN_TOKEN before using delete-all" });
        return;
      }
      if (!isAuthorized(req)) {
        res.status(401).json({ ok: false, msg: "unauthorized" });
        return;
      }

      const confirm = (bodyConfirm || queryConfirm || "").trim();
      if (confirm !== "DELETE_ALL") {
        res.status(400).json({ ok: false, msg: "to delete all, set confirm=DELETE_ALL" });
        return;
      }

      const result = await deleteAllEntries(redis);
      res.status(200).json({ ok: true, msg: `deleted ${result.totalDeleted} keys`, ...result });
      return;
    }

    if (!isAuthorized(req)) {
      res.status(401).json({ ok: false, msg: "unauthorized" });
      return;
    }

    const code = normalizeCode(queryCode || bodyCode);
    if (code) {
      const result = await deleteByCode(redis, code);
      res.status(result.status).json({ ok: result.ok, msg: result.msg });
      return;
    }

    const url = queryUrl || bodyUrl;
    if (url) {
      const result = await deleteByUrl(redis, url);
      res.status(result.status).json({ ok: result.ok, msg: result.msg });
      return;
    }

    res.status(400).json({ ok: false, msg: "provide code or url" });
  } catch (e) {
    console.error("cc del error", e);
    res
      .status(500)
      .json({
        ok: false,
        msg: `problem with database (${safeErrorMessage(e)})`,
      });
  }
}
