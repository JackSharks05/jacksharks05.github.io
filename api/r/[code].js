import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const { code } = req.query || {};
  if (req.method !== "GET") {
    res.status(405).send("method not allowed");
    return;
  }

  if (typeof code !== "string" || code.length === 0) {
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
    res.status(500).send("problem with database");
  }
}
