import { NextRequest, NextResponse } from "next/server";
import { enhancedHandleSubmit } from "@/util/form/enhancedActions";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Call the server-side submission handler
    const result = await enhancedHandleSubmit(formData);
    
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: result.error, errorType: result.errorType },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("API appointment error:", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor", errorType: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}