import { NextRequest, NextResponse } from "next/server";
import { getAvailableTimeSlots } from "@/util/dynamicScheduling";

/**
 * GET /api/availability?professionalId={id}&date={YYYY-MM-DD}
 * Returns available time slots for a professional on a specific date
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const professionalId = searchParams.get('professionalId');
    const dateString = searchParams.get('date');

    if (!professionalId || !dateString) {
      return NextResponse.json(
        { success: false, error: 'Missing professionalId or date parameter' },
        { status: 400 }
      );
    }

    // Parse date string to Date object
    const selectedDate = new Date(dateString);
    if (isNaN(selectedDate.getTime())) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Get available time slots
    const availableSlots = await getAvailableTimeSlots(professionalId, selectedDate);
    
    return NextResponse.json({
      success: true,
      availableSlots,
      date: dateString,
      professionalId
    });

  } catch (error) {
    console.error("Availability API error:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}