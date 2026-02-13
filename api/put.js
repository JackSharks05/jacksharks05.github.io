import { Redis } from "@upstash/redis";
import crypto from "node:crypto";

const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);
const redis = Redis.fromEnv();

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

  const rawBody = typeof req.body === "string" ? req.body : "";
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
    res.status(500).json({ ok: false, msg: "problem with database" });
  }
}
