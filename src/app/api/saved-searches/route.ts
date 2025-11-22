import { NextRequest } from 'next/server';
import {
  apiSuccess,
  apiCollection,
  apiError,
  apiUnauthorized,
  apiServiceUnavailable,
  validateRequiredFields,
  apiValidationError,
  getPaginationParams,
} from '@/lib/api-response';
import { verifyAuth } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin';

// Saved Searches API
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
    const { name, filters, alertEnabled, alertFrequency } = body;

    // Validate required fields
    const validation = validateRequiredFields(body, ['name', 'filters']);
    if (!validation.isValid) {
      return apiValidationError(validation.errors);
    }

    // Insert into Supabase
    const { data: savedSearch, error } = await supabaseAdmin
      .from('saved_searches')
      .insert([{
        user_id: auth.userId,
        name,
        filters,
        alert_enabled: alertEnabled || false,
        alert_frequency: alertFrequency || 'daily',
      }])
      .select()
      .single();

    if (error) {
      console.error('Saved search creation error:', error);
      return apiError('Failed to save search', 500);
    }

    return apiSuccess(savedSearch, 'Search saved successfully', 201);
  } catch (error) {
    console.error('Saved search creation error:', error);
    return apiError('Failed to save search');
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

    // Fetch saved searches from Supabase
    const { data: searches, error, count } = await supabaseAdmin
      .from('saved_searches')
      .select('*', { count: 'exact' })
      .eq('user_id', auth.userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Saved searches fetch error:', error);
      return apiError('Failed to fetch saved searches', 500);
    }

    return apiCollection(searches || [], count || 0, limit, offset);
  } catch (error) {
    console.error('Saved searches fetch error:', error);
    return apiError('Failed to fetch saved searches');
  }
}
