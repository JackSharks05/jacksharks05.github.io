import { Redis } from "@upstash/redis";
import crypto from "node:crypto";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

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

async function generateUniqueCode() {
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
  if (typeof req.body === "string") rawBody = req.body;
  else if (Buffer.isBuffer(req.body)) rawBody = req.body.toString("utf8");
  else if (req.body && typeof req.body === "object" && typeof req.body.url === "string") {
    rawBody = req.body.url;
  }
  const normalized = normalizeUrl(rawBody);
  if (!normalized) {
    res.status(400).json({ ok: false, msg: "invalid url" });
    return;
  }

  try {
    const existingCode = await redis.get(`u2c:${normalized}`);
    if (typeof existingCode === "string" && existingCode.length > 0) {
      res.status(200).json({ ok: true, msg: existingCode });
      return;
    }

    const code = await generateUniqueCode();
    await redis.set(`c2u:${code}`, normalized);
    await redis.set(`u2c:${normalized}`, code);

    res.status(201).json({ ok: true, msg: code });
  } catch (e) {
    console.error("cc put error", e);
    res.status(500).json({ ok: false, msg: `problem with database (${safeErrorMessage(e)})` });
  }
}
