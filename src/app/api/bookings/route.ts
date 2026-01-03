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
import { logger } from '@/lib/logger';

// Bookings API - DISABLED FOR PRODUCTION
// This feature is not ready for production release
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { success: false, error: "Booking system is currently unavailable" },
    { status: 503 }
  );
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

    // Get property owner_id for booking
    const { data: propertyData } = await supabaseAdmin
      .from('properties')
      .select('owner_id, user_id')
      .eq('id', propertyId)
      .single();

    // Insert into Supabase (using correct schema: start_date, end_date, status, guest_count)
    const { data: booking, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        property_id: propertyId,
        customer_id: userData.id,
        owner_id: propertyData?.owner_id || propertyData?.user_id || null,
        start_date: checkInDate.toISOString().split('T')[0],
        end_date: checkOutDate.toISOString().split('T')[0],
        guest_count: guests,
        total_price: totalPrice,
        status: 'pending',
        special_requests: specialRequests || null,
      })
      .select()
      .single();

    if (error) {
      logger.error('Booking creation error', error instanceof Error ? error : new Error(String(error)));
      return apiError('Failed to create booking: ' + error.message);
    }

    return apiSuccess(booking, 'Booking created successfully', 201);
  } catch (error) {
    console.error('Booking creation error:', error);
    return apiError('Failed to create booking');
  }
}

export async function GET(request: NextRequest) {
  // Booking system disabled for production
  return NextResponse.json(
    { success: true, bookings: [], total: 0 },
    { status: 200 }
  );
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

    // Fetch from Supabase (using customer_id instead of user_id)
    const { data: bookings, error, count } = await supabaseAdmin
      .from('bookings')
      .select('*, properties(*)', { count: 'exact' })
      .eq('customer_id', userData.id)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Bookings fetch error', error instanceof Error ? error : new Error(String(error)));
      return apiError('Failed to fetch bookings: ' + error.message);
    }

    return apiCollection(bookings || [], count || 0, 50, 0);
  } catch (error) {
    console.error('Bookings fetch error:', error);
    return apiError('Failed to fetch bookings');
  }
}
