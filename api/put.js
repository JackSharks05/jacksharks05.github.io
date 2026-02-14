import { Redis } from "@upstash/redis";
import crypto from "node:crypto";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);
const RESERVED_CODES = new Set(["api", "put", "r"]);

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

  const resolved = candidates.find((c) => typeof c.url === "string" && typeof c.token === "string" && c.url && c.token);
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

function normalizeRequestedCode(raw) {
  if (typeof raw !== "string") return null;
  let trimmed = raw.trim();
  if (!trimmed) return null;

  // If they paste a full short URL, extract the first path segment.
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

  // Only keep the first segment if a path was provided.
  const firstSegment = trimmed.split("/")[0];
  if (!firstSegment) return null;

  const code = firstSegment;
  if (code.length > 64) return null;
  if (!/^[A-Za-z0-9_-]+$/.test(code)) return null;
  if (RESERVED_CODES.has(code.toLowerCase())) return null;

  return code;
}

async function generateUniqueCode(redis) {
  // 4 bytes => 6 chars base64url; matches the Rust cc feel.
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = crypto.randomBytes(4).toString("base64url");
    const existing = await redis.get(`c2u:${code}`);
    if (!existing) return code;
  }
  // Extremely unlikely, but be safe.
  return crypto.randomBytes(8).toString("base64url");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, msg: "method not allowed" });
    return;
  }

  const redis = getRedisOrNull();
  if (!redis) {
    res.status(500).json({
      ok: false,
      msg:
        "missing redis env vars (expected UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN or UPSTASH_REDIS_REST_KV_REST_API_URL/UPSTASH_REDIS_REST_KV_REST_API_TOKEN)",
    });
    return;
  }

  let rawBody = "";
  let requestedCode = null;
  if (typeof req.body === "string") rawBody = req.body;
  else if (Buffer.isBuffer(req.body)) rawBody = req.body.toString("utf8");
  else if (req.body && typeof req.body === "object") {
    if (typeof req.body.url === "string") rawBody = req.body.url;
    if (typeof req.body.code === "string") requestedCode = normalizeRequestedCode(req.body.code);
    else if (typeof req.body.custom === "string") requestedCode = normalizeRequestedCode(req.body.custom);
  }
  const normalized = normalizeUrl(rawBody);
  if (!normalized) {
    res.status(400).json({ ok: false, msg: "invalid url" });
    return;
  }

  // If the client tried to send a code but it didn't validate, return a clear error.
  if (req.body && typeof req.body === "object" && ("code" in req.body || "custom" in req.body)) {
    const raw = typeof req.body.code === "string" ? req.body.code : typeof req.body.custom === "string" ? req.body.custom : "";
    if (raw && !requestedCode) {
      res.status(400).json({ ok: false, msg: "invalid custom code (use 1-64 chars: A-Z a-z 0-9 _ -)" });
      return;
    }
  }

  try {
    const canonicalCode = await redis.get(`u2c:${normalized}`);

    // If no custom code requested, behave like classic cc: return the existing canonical code.
    if (!requestedCode) {
      if (typeof canonicalCode === "string" && canonicalCode.length > 0) {
        res.status(200).json({ ok: true, msg: canonicalCode });
        return;
      }

      const code = await generateUniqueCode(redis);
      await redis.set(`c2u:${code}`, normalized);
      await redis.set(`u2c:${normalized}`, code);
      await redis.sadd(`u2cs:${normalized}`, code);

      res.status(201).json({ ok: true, msg: code });
      return;
    }

    // Custom code requested:
    // - If code is taken for another URL => 409
    // - If code already points to this URL => return it
    // - Otherwise create mapping and add to URL's set of codes
    const existingUrlForCode = await redis.get(`c2u:${requestedCode}`);
    if (typeof existingUrlForCode === "string" && existingUrlForCode.length > 0) {
      if (existingUrlForCode !== normalized) {
        res.status(409).json({ ok: false, msg: "custom code already in use" });
        return;
      }

      // Idempotent: already exists for this URL.
      await redis.sadd(`u2cs:${normalized}`, requestedCode);
      if (!(typeof canonicalCode === "string" && canonicalCode.length > 0)) {
        await redis.set(`u2c:${normalized}`, requestedCode);
      }
      res.status(200).json({ ok: true, msg: requestedCode });
      return;
    }

    await redis.set(`c2u:${requestedCode}`, normalized);
    await redis.sadd(`u2cs:${normalized}`, requestedCode);

    // If this URL doesn't yet have a canonical code, let the first created code be canonical.
    if (!(typeof canonicalCode === "string" && canonicalCode.length > 0)) {
      await redis.set(`u2c:${normalized}`, requestedCode);
    }

    res.status(201).json({ ok: true, msg: requestedCode });
  } catch (e) {
    console.error("cc put error", e);
    res.status(500).json({ ok: false, msg: `problem with database (${safeErrorMessage(e)})` });
  }
}
