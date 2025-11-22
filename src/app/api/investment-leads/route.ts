import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Investment Leads API
// POST /api/investment-leads - Create new investment lead
// GET /api/investment-leads - Get all leads (admin only)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, investmentAmount, investmentType, preferredLocation, message } = body;

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get user ID from auth token if available
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    let userId = null;

    if (authToken) {
      try {
        const payload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString());
        userId = payload.id;
      } catch {
        // Invalid token, continue without user ID
      }
    }

    // In production, this would insert into Supabase
    // For now, we'll return a success response
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

    // TODO: Insert into Supabase database
    // const { data, error } = await supabase
    //   .from('investment_leads')
    //   .insert([lead])
    //   .select()
    //   .single();

    // Send notification email to admin (optional)
    // TODO: Integrate with SendGrid

    return NextResponse.json({
      success: true,
      lead,
      message: 'Investment lead created successfully. We will contact you soon.',
    });
  } catch (error) {
    console.error('Investment lead creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create investment lead' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get user from auth token
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token and check if user is admin
    try {
      const payload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString());
      const userRole = payload.role;

      if (userRole !== 'admin' && userRole !== 'super_admin') {
        return NextResponse.json(
          { error: 'Forbidden: Admin access required' },
          { status: 403 }
        );
      }

      // Get query params for filtering
      const searchParams = request.nextUrl.searchParams;
      const status = searchParams.get('status');
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = parseInt(searchParams.get('offset') || '0');

      // TODO: Fetch from Supabase
      // let query = supabase
      //   .from('investment_leads')
      //   .select('*')
      //   .order('created_at', { ascending: false })
      //   .range(offset, offset + limit - 1);
      //
      // if (status) {
      //   query = query.eq('status', status);
      // }
      //
      // const { data: leads, error } = await query;

      // Mock data for now
      const leads = [];

      return NextResponse.json({
        success: true,
        leads,
        total: leads.length,
        limit,
        offset,
      });
    } catch {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Investment leads fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investment leads' },
      { status: 500 }
    );
  }
}
