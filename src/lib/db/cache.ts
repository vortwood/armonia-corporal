/**
 * In-memory caching system with TTL support
 * Optimized for Baraja Studio appointment booking system
 */

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  createdAt: number;
}

interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  deletes: number;
  size: number;
}

class InMemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();
  private stats: CacheStats = {
    hits: 0,
    misses: 0,
    sets: 0,
    deletes: 0,
    size: 0
  };
  private cleanupInterval: NodeJS.Timeout;

  constructor(cleanupIntervalMs: number = 5 * 60 * 1000) { // 5 minutes
    // Periodic cleanup of expired entries
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, cleanupIntervalMs);
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      this.stats.misses++;
      return null;
    }
    
    this.stats.hits++;
    return entry.data as T;
  }

  /**
   * Set value in cache with TTL
   */
  async set<T>(key: string, value: T, ttlSeconds: number = 300): Promise<void> {
    const now = Date.now();
    const expiresAt = now + (ttlSeconds * 1000);
    
    this.store.set(key, {
      data: value,
      expiresAt,
      createdAt: now
    });
    
    this.stats.sets++;
    this.updateSize();
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<boolean> {
    const deleted = this.store.delete(key);
    if (deleted) {
      this.stats.deletes++;
      this.updateSize();
    }
    return deleted;
  }

  /**
   * Check if key exists and is not expired
   */
  async has(key: string): Promise<boolean> {
    const entry = this.store.get(key);
    
    if (!entry) return false;
    
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    this.store.clear();
    this.updateSize();
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get all cache keys
   */
  getKeys(): string[] {
    return Array.from(this.store.keys());
  }

  /**
   * Get cache hit ratio
   */
  getHitRatio(): number {
    const total = this.stats.hits + this.stats.misses;
    return total > 0 ? this.stats.hits / total : 0;
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;
    
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      this.updateSize();
      console.log(`Cache cleanup: removed ${cleanedCount} expired entries`);
    }
  }

  /**
   * Update size statistic
   */
  private updateSize(): void {
    this.stats.size = this.store.size;
  }

  /**
   * Get memory usage estimate (in bytes)
   */
  getMemoryUsage(): number {
    let totalSize = 0;
    
    for (const [key, entry] of this.store.entries()) {
      // Rough estimation
      totalSize += key.length * 2; // String size
      totalSize += JSON.stringify(entry.data).length * 2; // Data size
      totalSize += 32; // Overhead for timestamps and structure
    }
    
    return totalSize;
  }

  /**
   * Destroy cache and cleanup interval
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// Create singleton cache instance
export const cache = new InMemoryCache();

// Cache key builders for consistent naming
export const CacheKeys = {
  appointment: {
    barber: (barberId: string) => `apt:barber:${barberId}`,
    date: (date: string) => `apt:date:${date}`,
    all: (limit: number) => `apt:all:${limit}`,
  },
  stats: {
    monthly: (month: string) => `stats:month:${month}`,
    barber: (barberId: string, month: string) => `stats:barber:${barberId}:${month}`,
  },
  schedule: {
    barber: (barberId: string, date: string) => `schedule:${barberId}:${date}`,
  },
} as const;

// Cache durations in seconds
export const CacheDuration = {
  APPOINTMENTS: 300,     // 5 minutes
  STATS: 600,           // 10 minutes  
  SCHEDULES: 1800,      // 30 minutes
  HEALTH_CHECK: 60,     // 1 minute
} as const;

// Helper function to get cache health
export function getCacheHealth(): {
  status: 'healthy' | 'warning' | 'critical';
  stats: CacheStats;
  hitRatio: number;
  memoryUsage: number;
} {
  const stats = cache.getStats();
  const hitRatio = cache.getHitRatio();
  const memoryUsage = cache.getMemoryUsage();
  
  let status: 'healthy' | 'warning' | 'critical' = 'healthy';
  
  // Determine health status
  if (hitRatio < 0.5) {
    status = 'warning'; // Low hit ratio
  }
  if (memoryUsage > 10 * 1024 * 1024) { // 10MB
    status = 'critical'; // High memory usage
  }
  
  return {
    status,
    stats,
    hitRatio,
    memoryUsage
  };
}

// Helper function for cache warming (preload common data)
export async function warmCache(): Promise<void> {
  try {
    console.log('Starting cache warm-up...');
    
    // This could preload common queries
    // For now, we'll just log that warming is available
    console.log('Cache warm-up completed');
  } catch (error) {
    console.error('Error during cache warm-up:', error);
  }
}

// Export for cleanup on app shutdown
process.on('SIGTERM', () => {
  console.log('Destroying cache on SIGTERM');
  cache.destroy();
});

process.on('SIGINT', () => {
  console.log('Destroying cache on SIGINT');
  cache.destroy();
});