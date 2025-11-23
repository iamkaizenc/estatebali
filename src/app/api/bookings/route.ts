import { NextRequest } from 'next/server';
import {
  apiSuccess,
  apiCollection,
  apiError,
  apiUnauthorized,
  apiValidationError,
  validateRequiredFields,
} from '@/lib/api-response';
import { verifyAuth } from '@/lib/api-auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin';

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

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return apiError('Supabase is not configured', 503);
    }

    // Get user_id from users table
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', auth.user?.email || '')
      .single();

    if (!userData) {
      return apiError('User not found', 404);
    }

    // Insert into Supabase
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        property_id: propertyId,
        user_id: userData.id,
        check_in: checkInDate.toISOString().split('T')[0],
        check_out: checkOutDate.toISOString().split('T')[0],
        guests,
        total_price: totalPrice,
        booking_status: 'pending',
        payment_status: 'pending',
        special_requests: specialRequests,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
      })
      .select()
      .single();

    if (error) {
      console.error('Booking creation error:', error);
      return apiError('Failed to create booking: ' + error.message);
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

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return apiError('Supabase is not configured', 503);
    }

    // Get user_id from users table
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', auth.user?.email || '')
      .single();

    if (!userData) {
      return apiError('User not found', 404);
    }

    // Fetch from Supabase
    const { data: bookings, error, count } = await supabaseAdmin
      .from('bookings')
      .select('*, properties(*)', { count: 'exact' })
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Bookings fetch error:', error);
      return apiError('Failed to fetch bookings: ' + error.message);
    }

    return apiCollection(bookings || [], count || 0, 50, 0);
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return apiError('Failed to fetch bookings');
  }
}
