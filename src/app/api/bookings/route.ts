import { NextRequest } from 'next/server';
import {
  apiSuccess,
  apiCollection,
  apiError,
  apiUnauthorized,
  apiValidationError,
  apiServiceUnavailable,
  validateRequiredFields,
  getPaginationParams,
} from '@/lib/api-response';
import { verifyAuth } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin';

// Bookings API
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = verifyAuth(request);
    if (!auth.success) {
      return apiUnauthorized(auth.error);
    }

    // Check Supabase configuration
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return apiServiceUnavailable('Database is not configured');
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

    // Insert booking into Supabase
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert([{
        property_id: propertyId,
        user_id: auth.userId,
        check_in: checkInDate.toISOString(),
        check_out: checkOutDate.toISOString(),
        guests,
        total_price: totalPrice,
        booking_status: 'pending',
        payment_status: 'pending',
        special_requests: specialRequests,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
      }])
      .select()
      .single();

    if (error) {
      console.error('Booking creation error:', error);
      return apiError('Failed to create booking', 500);
    }

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

    // Check Supabase configuration
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return apiServiceUnavailable('Database is not configured');
    }

    // Get pagination params
    const searchParams = request.nextUrl.searchParams;
    const { limit, offset } = getPaginationParams(searchParams, { defaultLimit: 50 });

    // Fetch bookings from Supabase with property details
    const { data: bookings, error, count } = await supabaseAdmin
      .from('bookings')
      .select('*, properties(*)', { count: 'exact' })
      .eq('user_id', auth.userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Bookings fetch error:', error);
      return apiError('Failed to fetch bookings', 500);
    }

    return apiCollection(bookings || [], count || 0, limit, offset);
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return apiError('Failed to fetch bookings');
  }
}
