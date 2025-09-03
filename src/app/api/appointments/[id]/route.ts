import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { deleteAppointment } from '@/lib/db/appointments';
import { apiRateLimiter } from '@/lib/rateLimiter';
import { isAdmin } from '@/lib/auth';

/**
 * DELETE /api/appointments/[id]
 * Delete specific appointment
 */
export async function DELETE(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
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

    const params = await context.params;
    const appointmentId = params.id;

    // Validate appointment ID format
    if (!appointmentId || appointmentId.length < 5) {
      return NextResponse.json(
        { success: false, error: 'Invalid appointment ID' },
        { status: 400 }
      );
    }

    // Delete appointment (modern API only needs appointmentId)
    const result = await deleteAppointment(appointmentId);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete appointment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        deleted: true,
        appointmentId
      }
    });

  } catch (error) {
    console.error(`DELETE /api/appointments/[id] error:`, error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/appointments/[id]
 * Get specific appointment (future feature)
 */
export async function GET() {
  // Future implementation for getting single appointment
  return NextResponse.json(
    { success: false, error: 'Not implemented yet' },
    { status: 501 }
  );
}

/**
 * PUT /api/appointments/[id]  
 * Update specific appointment (future feature)
 */
export async function PUT() {
  // Future implementation for updating appointment
  return NextResponse.json(
    { success: false, error: 'Not implemented yet' },
    { status: 501 }
  );
}

/**
 * OPTIONS /api/appointments/[id]
 * Handle CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}