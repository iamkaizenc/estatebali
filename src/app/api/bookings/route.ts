import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Bookings API
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString());
    const userId = payload.id;

    const body = await request.json();
    const {
      propertyId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      specialRequests,
      guestName,
      guestEmail,
      guestPhone,
    } = body;

    // Validation
    if (!propertyId || !checkIn || !checkOut || !guests || !totalPrice || !guestName || !guestEmail) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      return NextResponse.json({ error: 'Check-out must be after check-in' }, { status: 400 });
    }

    // TODO: Insert into Supabase
    const booking = {
      id: `booking_${Date.now()}`,
      propertyId,
      userId,
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      guests,
      totalPrice,
      bookingStatus: 'pending',
      paymentStatus: 'pending',
      specialRequests,
      guestName,
      guestEmail,
      guestPhone,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, booking, message: 'Booking created successfully' });
  } catch (error) {
    console.error('Booking creation error:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString());
    const userId = payload.id;

    // TODO: Fetch from Supabase
    // const { data: bookings } = await supabase
    //   .from('bookings')
    //   .select('*, properties(*)')
    //   .eq('user_id', userId)
    //   .order('created_at', { ascending: false });

    return NextResponse.json({ success: true, bookings: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}
