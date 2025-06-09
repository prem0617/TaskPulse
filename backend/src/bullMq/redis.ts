import { Redis } from "ioredis";

export const connection = new Redis(process.env.UPSTASH_REDIS_URL as string, {
  maxRetriesPerRequest: null,
  tls: {},
});
