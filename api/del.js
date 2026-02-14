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
    (c) => typeof c.url === "string" && typeof c.token === "string" && c.url && c.token
  );
  if (!resolved) return null;
  return new Redis({ url: resolved.url, token: resolved.token });
}

function safeErrorMessage(err) {
  const name = err && typeof err === "object" && "name" in err ? String(err.name) : "Error";
  const message = err && typeof err === "object" && "message" in err ? String(err.message) : String(err);
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
  if (bearer.startsWith("Bearer ") && bearer.slice("Bearer ".length) === expected) return true;

  const alt = req.headers?.["x-cc-admin-token"];
  if (typeof alt === "string" && alt === expected) return true;

  return false;
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
    const next = Array.isArray(remaining) ? remaining.find((c) => typeof c === "string" && c.length > 0) : null;
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
  if (typeof canonical === "string" && canonical.length > 0 && !codes.includes(canonical)) {
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

  if (!isAuthorized(req)) {
    res.status(401).json({ ok: false, msg: "unauthorized" });
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
    const queryCode = typeof req.query?.code === "string" ? req.query.code : "";
    const queryUrl = typeof req.query?.url === "string" ? req.query.url : "";

    let bodyCode = "";
    let bodyUrl = "";

    if (typeof req.body === "string") {
      const trimmed = req.body.trim();
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) bodyUrl = trimmed;
      else bodyCode = trimmed;
    } else if (Buffer.isBuffer(req.body)) {
      const trimmed = req.body.toString("utf8").trim();
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) bodyUrl = trimmed;
      else bodyCode = trimmed;
    } else if (req.body && typeof req.body === "object") {
      if (typeof req.body.code === "string") bodyCode = req.body.code;
      if (typeof req.body.url === "string") bodyUrl = req.body.url;
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
    res.status(500).json({ ok: false, msg: `problem with database (${safeErrorMessage(e)})` });
  }
}
