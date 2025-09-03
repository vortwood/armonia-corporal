import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getCacheHealth } from '@/lib/db/cache';
import { testRedisConnection } from '@/lib/redis';
import { apiRateLimiter } from '@/lib/rateLimiter';
import db from '@/util/firestore';
import { collection, limit, getDocs, query } from 'firebase/firestore';

/**
 * GET /api/health
 * System health check endpoint
 */
export async function GET(request: NextRequest) {
  try {
    // Light rate limiting for health checks
    const headersList = await headers();
    const forwarded = headersList.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    
    const isAllowed = await apiRateLimiter.isAllowed(ip);
    if (!isAllowed) {
      return NextResponse.json(
        { success: false, error: 'Too many requests' },
        { status: 429 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get('details') === 'true';
    
    const startTime = Date.now();
    const health = {
      status: 'healthy' as 'healthy' | 'degraded' | 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      services: {} as Record<string, unknown>,
      performance: {} as Record<string, unknown>
    };

    // Test Firestore connection
    try {
      const testQuery = query(collection(db, 'gonzalo'), limit(1));
      await getDocs(testQuery);
      health.services.firestore = {
        status: 'connected',
        responseTime: Date.now() - startTime
      };
    } catch {
      health.services.firestore = {
        status: 'error',
        error: 'Connection failed'
      };
      health.status = 'degraded';
    }

    // Test Redis connection (optional)
    const redisStartTime = Date.now();
    const redisConnected = await testRedisConnection();
    health.services.redis = {
      status: redisConnected ? 'connected' : 'not_configured',
      responseTime: Date.now() - redisStartTime,
      note: redisConnected ? 'Connected' : 'Using in-memory fallback'
    };

    // Cache health
    const cacheHealth = getCacheHealth();
    health.services.cache = {
      status: cacheHealth.status,
      hitRatio: Math.round(cacheHealth.hitRatio * 100) / 100,
      memoryUsage: Math.round(cacheHealth.memoryUsage / 1024), // KB
      entries: cacheHealth.stats.size
    };

    // Rate limiter health  
    health.services.rateLimiter = {
      status: 'operational',
      type: redisConnected ? 'redis' : 'in-memory'
    };

    // Email service check (basic)
    health.services.email = {
      status: process.env.RESEND_API_KEY ? 'configured' : 'not_configured',
      provider: 'resend'
    };

    // Performance metrics
    const totalResponseTime = Date.now() - startTime;
    health.performance = {
      responseTime: totalResponseTime,
      memoryUsage: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024), // MB
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) // MB
      }
    };

    // Determine overall health status
    const hasErrors = Object.values(health.services).some(
      (service: unknown) => (service as Record<string, unknown>).status === 'error'
    );
    const hasWarnings = Object.values(health.services).some(
      (service: unknown) => (service as Record<string, unknown>).status === 'degraded'
    );

    if (hasErrors) {
      health.status = 'unhealthy';
    } else if (hasWarnings || totalResponseTime > 1000) {
      health.status = 'degraded';
    }

    // Include detailed information if requested
    if (includeDetails) {
      health.services.system = {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        environment: process.env.NODE_ENV || 'development'
      };

      health.services.dependencies = {
        next: '15.4.6',
        firebase: '11.0.1',
        zod: '4.0.15',
        ioredis: '5.7.0'
      };
    }

    // Return appropriate status code
    const statusCode = health.status === 'healthy' ? 200 : 
                      health.status === 'degraded' ? 200 : 503;

    return NextResponse.json(health, { status: statusCode });

  } catch {
    console.error('Health check error');
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      services: {
        system: { status: 'error', error: 'Internal server error' }
      }
    }, { status: 503 });
  }
}

/**
 * POST /api/health
 * Trigger health check actions (future feature)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'clear_cache':
        // Future: Clear application cache
        return NextResponse.json({
          success: true,
          message: 'Cache clear not implemented yet'
        });

      case 'warm_cache':
        // Future: Warm up cache with common queries
        return NextResponse.json({
          success: true,  
          message: 'Cache warm not implemented yet'
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}

/**
 * OPTIONS /api/health
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}