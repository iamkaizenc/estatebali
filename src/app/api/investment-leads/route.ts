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
import { verifyAuth } from '@/lib/auth';
import { cookies } from 'next/headers';

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

    // Get user ID from auth token if available (optional for this endpoint)
    const auth = verifyAuth(request);
    const userId = auth.success ? auth.userId : null;

    // TODO: Insert into Supabase database
    const lead = {
      id: `lead_${Date.now()}`,
      userId,
      name,
      email,
      phone: phone || null,
      investmentAmount: investmentAmount || null,
      investmentType: investmentType || null,
      preferredLocation: preferredLocation || null,
      message: message || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // TODO: Insert into Supabase
    // const { data, error } = await supabase
    //   .from('investment_leads')
    //   .insert([lead])
    //   .select()
    //   .single();

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

    // TODO: Fetch from Supabase
    // let query = supabase
    //   .from('investment_leads')
    //   .select('*', { count: 'exact' })
    //   .order('created_at', { ascending: false })
    //   .range(offset, offset + limit - 1);
    //
    // if (status) {
    //   query = query.eq('status', status);
    // }
    //
    // const { data: leads, error, count } = await query;

    // Mock data
    const leads: any[] = [];
    const total = 0;

    return apiCollection(leads, total, limit, offset);
  } catch (error) {
    console.error('Investment leads fetch error:', error);
    return apiError('Failed to fetch investment leads');
  }
}
