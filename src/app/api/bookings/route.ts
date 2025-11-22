import { NextRequest } from 'next/server';
import {
  apiSuccess,
  apiCollection,
  apiError,
  apiUnauthorized,
  apiValidationError,
  validateRequiredFields,
} from '@/lib/api-response';
import { verifyAuth } from '@/lib/auth';

// Bookings API
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = verifyAuth(request);
    if (!auth.success) {
      return apiUnauthorized(auth.error);
    }

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

    // Validate required fields
    const validation = validateRequiredFields(body, [
      'propertyId',
      'checkIn',
      'checkOut',
      'guests',
      'totalPrice',
      'guestName',
      'guestEmail'
    ]);
    if (!validation.isValid) {
      return apiValidationError(validation.errors);
    }

    // Validate dates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkOutDate <= checkInDate) {
      return apiValidationError({
        checkOut: 'Check-out date must be after check-in date'
      });
    }

    // TODO: Insert into Supabase
    const booking = {
      id: `booking_${Date.now()}`,
      propertyId,
      userId: auth.userId,
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

    return apiSuccess(booking, 'Booking created successfully', 201);
  } catch (error) {
    console.error('Booking creation error:', error);
    return apiError('Failed to create booking');
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const auth = verifyAuth(request);
    if (!auth.success) {
      return apiUnauthorized(auth.error);
    }

    // TODO: Fetch from Supabase
    // const { data: bookings } = await supabase
    //   .from('bookings')
    //   .select('*, properties(*)')
    //   .eq('user_id', auth.userId)
    //   .order('created_at', { ascending: false });

    // Mock data
    const bookings: any[] = [];
    const total = 0;

    return apiCollection(bookings, total, 50, 0);
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return apiError('Failed to fetch bookings');
  }
}
