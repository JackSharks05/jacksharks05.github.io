import { Redis } from "@upstash/redis";

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

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).send("method not allowed");
    return;
  }

  const code = typeof req.query?.code === "string" ? req.query.code : "";

  const redis = getRedisOrNull();
  if (!redis) {
    res
      .status(500)
      .send(
        "missing redis env vars (expected UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN or UPSTASH_REDIS_REST_KV_REST_API_URL/UPSTASH_REDIS_REST_KV_REST_API_TOKEN)"
      );
    return;
  }

  if (!code) {
    res.status(404).send("not found");
    return;
  }

  try {
    const url = await redis.get(`c2u:${code}`);
    if (typeof url !== "string" || url.length === 0) {
      res.status(404).send("not found");
      return;
    }

    res.setHeader("Location", url);
    res.status(308).end();
  } catch (e) {
    console.error("cc redirect error", e);
    res.status(500).send(`problem with database (${safeErrorMessage(e)})`);
  }
}
