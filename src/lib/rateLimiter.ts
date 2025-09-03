import { getRedis } from './redis';

/**
 * Production-ready rate limiter with Redis fallback to in-memory
 */
export class ProductionRateLimiter {
  private inMemoryStore: Map<string, { count: number; resetTime: number }> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  private readonly keyPrefix: string;

  constructor(
    maxAttempts = 5,
    windowMs = 15 * 60 * 1000, // 15 minutes
    keyPrefix = 'rate_limit'
  ) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.keyPrefix = keyPrefix;
  }

  /**
   * Check if identifier is allowed to make a request
   */
  async isAllowed(identifier: string): Promise<boolean> {
    const redis = getRedis();
    const key = `${this.keyPrefix}:${identifier}`;

    if (redis) {
      return await this.checkRedis(redis, key);
    } else {
      return this.checkInMemory(identifier);
    }
  }

  /**
   * Reset rate limiting for identifier
   */
  async reset(identifier: string): Promise<void> {
    const redis = getRedis();
    const key = `${this.keyPrefix}:${identifier}`;

    if (redis) {
      try {
        await redis.del(key);
      } catch (error) {
        console.error('Redis reset error:', error);
      }
    } else {
      this.inMemoryStore.delete(identifier);
    }
  }

  /**
   * Get current attempt count for identifier
   */
  async getAttempts(identifier: string): Promise<number> {
    const redis = getRedis();
    const key = `${this.keyPrefix}:${identifier}`;

    if (redis) {
      try {
        const count = await redis.get(key);
        return count ? parseInt(count, 10) : 0;
      } catch (error) {
        console.error('Redis get attempts error:', error);
        return 0;
      }
    } else {
      const data = this.inMemoryStore.get(identifier);
      const now = Date.now();
      
      if (!data || now > data.resetTime) {
        return 0;
      }
      
      return data.count;
    }
  }

  /**
   * Get time until reset (in seconds)
   */
  async getTimeUntilReset(identifier: string): Promise<number> {
    const redis = getRedis();
    const key = `${this.keyPrefix}:${identifier}`;

    if (redis) {
      try {
        const ttl = await redis.ttl(key);
        return ttl > 0 ? ttl : 0;
      } catch (error) {
        console.error('Redis TTL error:', error);
        return 0;
      }
    } else {
      const data = this.inMemoryStore.get(identifier);
      const now = Date.now();
      
      if (!data || now > data.resetTime) {
        return 0;
      }
      
      return Math.ceil((data.resetTime - now) / 1000);
    }
  }

  /**
   * Redis-based rate limiting
   */
  private async checkRedis(redis: any, key: string): Promise<boolean> { // eslint-disable-line @typescript-eslint/no-explicit-any
    try {
      const current = await redis.incr(key);
      
      if (current === 1) {
        // First attempt, set expiration
        await redis.expire(key, Math.ceil(this.windowMs / 1000));
      }
      
      return current <= this.maxAttempts;
    } catch (error) {
      console.error('Redis rate limit error:', error);
      // Fallback to in-memory on Redis error
      return this.checkInMemory(key.split(':').pop() || key);
    }
  }

  /**
   * In-memory fallback rate limiting
   */
  private checkInMemory(identifier: string): boolean {
    const now = Date.now();
    const data = this.inMemoryStore.get(identifier);

    if (!data || now > data.resetTime) {
      // Reset or first time
      this.inMemoryStore.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (data.count >= this.maxAttempts) {
      return false;
    }

    data.count++;
    return true;
  }

  /**
   * Clean up expired in-memory entries (call periodically)
   */
  cleanupInMemory(): void {
    const now = Date.now();
    for (const [key, data] of this.inMemoryStore.entries()) {
      if (now > data.resetTime) {
        this.inMemoryStore.delete(key);
      }
    }
  }
}

// Export singleton instances for different use cases
export const loginRateLimiter = new ProductionRateLimiter(5, 15 * 60 * 1000, 'login');
export const apiRateLimiter = new ProductionRateLimiter(100, 60 * 1000, 'api'); // 100 req/min
export const emailRateLimiter = new ProductionRateLimiter(10, 60 * 60 * 1000, 'email'); // 10 emails/hour

// Cleanup task for in-memory fallback
setInterval(() => {
  loginRateLimiter.cleanupInMemory();
  apiRateLimiter.cleanupInMemory();
  emailRateLimiter.cleanupInMemory();
}, 5 * 60 * 1000); // Clean every 5 minutes