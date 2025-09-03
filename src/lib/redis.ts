import Redis from "ioredis";

let redis: Redis | null = null;

/**
 * Get Redis connection instance
 * Falls back to in-memory if Redis is not available
 */
export function getRedis(): Redis | null {
  // Return null if Redis URL is not configured (development fallback)
  if (!process.env.REDIS_URL && process.env.NODE_ENV === "development") {
    return null;
  }

  if (!redis) {
    try {
      redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
        enableOfflineQueue: false,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        connectTimeout: 3000,
      });

      redis.on("error", (err) => {
        console.error("Redis connection error:", err);
        redis = null;
      });

      redis.on("connect", () => {
        console.log("Redis connected successfully");
      });
    } catch (error) {
      console.error("Failed to initialize Redis:", error);
      return null;
    }
  }

  return redis;
}

/**
 * Close Redis connection
 */
export async function closeRedis() {
  if (redis) {
    await redis.quit();
    redis = null;
  }
}

/**
 * Test Redis connection
 */
export async function testRedisConnection(): Promise<boolean> {
  const redisInstance = getRedis();
  if (!redisInstance) return false;

  try {
    await redisInstance.ping();
    return true;
  } catch (error) {
    console.error("Redis ping failed:", error);
    return false;
  }
}
