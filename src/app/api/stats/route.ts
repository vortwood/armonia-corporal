import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { getMonthlyStats } from '@/lib/db/appointments';
import { apiRateLimiter } from '@/lib/rateLimiter';
import { isAdmin } from '@/lib/auth';

/**
 * GET /api/stats
 * Get dashboard statistics
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
    const month = searchParams.get('month') || undefined;
    const barberId = searchParams.get('barberId') || undefined;
    const year = searchParams.get('year') ? parseInt(searchParams.get('year')!) : undefined;

    // Basic validation for month format (MM/YYYY)
    if (month && !/^[0-9]{2}\/[0-9]{4}$/.test(month)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid month format. Use MM/YYYY format.'
        },
        { status: 400 }
      );
    }

    // Basic validation for year
    if (year && (year < 2020 || year > 2030)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Year must be between 2020 and 2030.'
        },
        { status: 400 }
      );
    }

    // Default to current month if not specified
    const currentDate = new Date();
    const currentMonth = month || `${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;

    // Get statistics
    const monthlyStats = await getMonthlyStats(currentMonth);

    // Calculate additional metrics
    const totalAppointments = Object.values(monthlyStats).reduce((sum, count) => sum + count, 0);
    const avgPerBarber = totalAppointments > 0 ? totalAppointments / Object.keys(monthlyStats).length : 0;

    // Format response with dynamic barber data
    const formattedStats = Object.entries(monthlyStats).map(([id, count]) => ({
      barberId: id,
      barberName: id, // Use ID as name (frontend can resolve to display name if needed)
      appointmentCount: count,
      percentage: totalAppointments > 0 ? Math.round((count / totalAppointments) * 100) : 0
    }));

    // Generate historical data for the past 6 months
    const historicalData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const historyMonth = `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
      
      const historyStats = await getMonthlyStats(historyMonth, false); // Don't use cache for historical
      const historyTotal = Object.values(historyStats).reduce((sum, count) => sum + count, 0);
      
      historicalData.push({
        month: historyMonth,
        total: historyTotal,
        barbers: historyStats
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        currentMonth,
        totalAppointments,
        avgPerBarber: Math.round(avgPerBarber * 100) / 100,
        barberStats: formattedStats,
        rawStats: monthlyStats,
        historical: historicalData,
        filters: { month, barberId, year }
      }
    });

  } catch (error) {
    console.error('GET /api/stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stats
 * Trigger statistics recalculation (future feature)
 */
export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const isAdminUser = await isAdmin();
    if (!isAdminUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, month } = body;

    switch (action) {
      case 'recalculate':
        // Future: Trigger statistics recalculation
        return NextResponse.json({
          success: true,
          message: 'Statistics recalculation triggered',
          month: month || 'current'
        });

      case 'export':
        // Future: Export statistics to CSV/Excel
        return NextResponse.json({
          success: true,
          message: 'Statistics export not implemented yet'
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('POST /api/stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/stats
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