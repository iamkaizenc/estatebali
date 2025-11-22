import { NextRequest } from 'next/server';
import {
  apiSuccess,
  apiCollection,
  apiError,
  apiUnauthorized,
  apiForbidden,
  apiValidationError,
  apiServiceUnavailable,
  getPaginationParams,
  validateRequiredFields,
} from '@/lib/api-response';
import { verifyAuth } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin';

// Investment Leads API
// POST /api/investment-leads - Create new investment lead
// GET /api/investment-leads - Get all leads (admin only)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, investmentAmount, investmentType, preferredLocation, message } = body;

    // Validate required fields
    const validation = validateRequiredFields(body, ['name', 'email']);
    if (!validation.isValid) {
      return apiValidationError(validation.errors);
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return apiValidationError({
        email: 'Invalid email address format'
      });
    }

    // Check Supabase configuration
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return apiServiceUnavailable('Database is not configured');
    }

    // Get user ID from auth token if available (optional for this endpoint)
    const auth = verifyAuth(request);
    const userId = auth.success ? auth.userId : null;

    // Insert into Supabase database
    const { data: lead, error } = await supabaseAdmin
      .from('investment_leads')
      .insert([{
        user_id: userId,
        name,
        email,
        phone: phone || null,
        investment_amount: investmentAmount || null,
        investment_type: investmentType || null,
        preferred_location: preferredLocation || null,
        message: message || null,
        status: 'pending',
      }])
      .select()
      .single();

    if (error) {
      console.error('Investment lead creation error:', error);
      return apiError('Failed to create investment lead', 500);
    }

    // TODO: Send notification email to admin (requires email service configuration)
    // This will be implemented after email service is set up
    // await sendAdminNotification(lead);

    return apiSuccess(
      lead,
      'Investment lead created successfully. We will contact you soon.',
      201
    );
  } catch (error) {
    console.error('Investment lead creation error:', error);
    return apiError('Failed to create investment lead');
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication and admin role
    const auth = verifyAuth(request);
    if (!auth.success) {
      return apiUnauthorized(auth.error);
    }

    // Check admin role
    if (auth.role !== 'admin' && auth.role !== 'super_admin') {
      return apiForbidden('Admin access required');
    }

    // Check Supabase configuration
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return apiServiceUnavailable('Database is not configured');
    }

    // Get pagination and filter params
    const searchParams = request.nextUrl.searchParams;
    const { limit, offset } = getPaginationParams(searchParams);
    const status = searchParams.get('status');

    // Build query
    let query = supabaseAdmin
      .from('investment_leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: leads, error, count } = await query;

    if (error) {
      console.error('Investment leads fetch error:', error);
      return apiError('Failed to fetch investment leads', 500);
    }

    return apiCollection(leads || [], count || 0, limit, offset);
  } catch (error) {
    console.error('Investment leads fetch error:', error);
    return apiError('Failed to fetch investment leads');
  }
}
