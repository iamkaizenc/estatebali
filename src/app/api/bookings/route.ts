import { NextRequest, NextResponse } from 'next/server';

// Bookings API - DISABLED FOR PRODUCTION
// This feature is not ready for production release

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { success: false, error: "Booking system is currently unavailable" },
    { status: 503 }
  );
}

export async function GET(request: NextRequest) {
  // Booking system disabled for production
  return NextResponse.json(
    { success: true, bookings: [], total: 0 },
    { status: 200 }
  );
}
