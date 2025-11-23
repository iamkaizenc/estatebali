import { NextRequest } from 'next/server';
import {
  apiSuccess,
  apiCollection,
  apiError,
  apiUnauthorized,
  validateRequiredFields,
  apiValidationError,
} from '@/lib/api-response';
import { verifyAuth } from '@/lib/api-auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin';

// Saved Searches API
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = verifyAuth(request);
    if (!auth.success) {
      return apiUnauthorized(auth.error);
    }

    const body = await request.json();
    const { name, filters, alertEnabled, alertFrequency } = body;

    // Validate required fields
    const validation = validateRequiredFields(body, ['name', 'filters']);
    if (!validation.isValid) {
      return apiValidationError(validation.errors);
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
    const { data: savedSearch, error } = await supabaseAdmin
      .from('saved_searches')
      .insert({
        user_id: userData.id,
        name,
        filters,
        alert_enabled: alertEnabled || false,
        alert_frequency: alertFrequency || 'daily',
      })
      .select()
      .single();

    if (error) {
      console.error('Saved search creation error:', error);
      return apiError('Failed to save search: ' + error.message);
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
    const { data: searches, error, count } = await supabaseAdmin
      .from('saved_searches')
      .select('*', { count: 'exact' })
      .eq('user_id', userData.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Saved searches fetch error:', error);
      return apiError('Failed to fetch saved searches: ' + error.message);
    }

    return apiCollection(searches || [], count || 0, 50, 0);
  } catch (error) {
    console.error('Saved searches fetch error:', error);
    return apiError('Failed to fetch saved searches');
  }
}
