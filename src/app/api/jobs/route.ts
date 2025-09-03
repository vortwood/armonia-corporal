import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { emailQueue } from '@/lib/jobs/emailQueue';
import { apiRateLimiter } from '@/lib/rateLimiter';
import { isAdmin } from '@/lib/auth';

/**
 * GET /api/jobs
 * Get job queue status and statistics
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
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

    // Check admin authentication
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const includeJobs = searchParams.get('jobs') === 'true';

    // Get queue statistics
    const stats = emailQueue.getStats();

    // Build response
    const response = {
      success: true,
      data: {
        stats,
        timestamp: new Date().toISOString(),
        ...(includeJobs && {
          jobs: status 
            ? emailQueue.getJobsByStatus(status as 'pending' | 'processing' | 'completed' | 'failed')
            : emailQueue.getAllJobs().slice(0, 50)
        })
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('GET /api/jobs error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/jobs
 * Job queue management actions
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
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

    // Check admin authentication
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON format' },
        { status: 400 }
      );
    }

    const { action, jobId } = body;

    switch (action) {
      case 'retry':
        if (!jobId) {
          return NextResponse.json(
            { success: false, error: 'jobId required for retry action' },
            { status: 400 }
          );
        }

        const retrySuccess = emailQueue.retryJob(jobId);
        if (!retrySuccess) {
          return NextResponse.json(
            { success: false, error: 'Job not found or cannot be retried' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Job queued for retry',
          jobId
        });

      case 'cancel':
        if (!jobId) {
          return NextResponse.json(
            { success: false, error: 'jobId required for cancel action' },
            { status: 400 }
          );
        }

        const cancelSuccess = emailQueue.cancelJob(jobId);
        if (!cancelSuccess) {
          return NextResponse.json(
            { success: false, error: 'Job not found or cannot be cancelled' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          message: 'Job cancelled',
          jobId
        });

      case 'get_status':
        if (!jobId) {
          return NextResponse.json(
            { success: false, error: 'jobId required for get_status action' },
            { status: 400 }
          );
        }

        const job = emailQueue.getJob(jobId);
        if (!job) {
          return NextResponse.json(
            { success: false, error: 'Job not found' },
            { status: 404 }
          );
        }

        return NextResponse.json({
          success: true,
          data: {
            job: {
              id: job.id,
              type: job.type,
              status: job.status,
              attempts: job.attempts,
              maxAttempts: job.maxAttempts,
              createdAt: new Date(job.createdAt).toISOString(),
              processAt: new Date(job.processAt).toISOString(),
              lastError: job.lastError
            }
          }
        });

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid action',
            validActions: ['retry', 'cancel', 'get_status']
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('POST /api/jobs error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/jobs
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}