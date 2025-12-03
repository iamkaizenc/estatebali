import { NextRequest } from 'next/server';
import {
  apiSuccess,
  apiCollection,
  apiError,
  apiUnauthorized,
  apiForbidden,
  apiValidationError,
  getPaginationParams,
  validateRequiredFields,
} from '@/lib/api-response';
import { verifyAuth } from '@/lib/api-auth';
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

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return apiError('Supabase is not configured', 503);
    }

    // Get user ID from auth token if available (optional for this endpoint)
    const auth = verifyAuth(request);
    let userId = null;
    if (auth.success && auth.user?.email) {
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', auth.user.email)
        .single();
      userId = userData?.id || null;
    }

    // Insert into Supabase
    const { data: lead, error } = await supabaseAdmin
      .from('investment_leads')
      .insert({
        user_id: userId,
        name,
        email,
        phone: phone || null,
        investment_amount: investmentAmount || null,
        investment_type: investmentType || null,
        preferred_location: preferredLocation || null,
        message: message || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      console.error('Investment lead creation error:', error);
      return apiError('Failed to create investment lead: ' + error.message);
    }

    // TODO: Send notification email to admin
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
    if (auth.user!.role !== 'admin' && auth.user!.role !== 'super_admin') {
      return apiForbidden('Admin access required');
    }

    // Get pagination and filter params
    const searchParams = request.nextUrl.searchParams;
    const { limit, offset } = getPaginationParams(searchParams);
    const status = searchParams.get('status');

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return apiError('Supabase is not configured', 503);
    }

    // Fetch from Supabase
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
      return apiError('Failed to fetch investment leads: ' + error.message);
    }

    return apiCollection(leads || [], count || 0, limit, offset);
  } catch (error) {
    console.error('Investment leads fetch error:', error);
    return apiError('Failed to fetch investment leads');
  }
}
