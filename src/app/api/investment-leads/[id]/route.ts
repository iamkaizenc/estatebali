import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin';

// Investment Lead Detail API
// GET /api/investment-leads/[id] - Get specific lead (admin only)
// PATCH /api/investment-leads/[id] - Update lead status/notes (admin only)
// DELETE /api/investment-leads/[id] - Delete lead (admin only)

async function checkAdminAuth(request: NextRequest): Promise<{ authorized: boolean; userId?: string; role?: string }> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token')?.value;

  if (!authToken) {
    return { authorized: false };
  }

  try {
    const payload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString());
    const userRole = payload.role;
    const userId = payload.id;

    if (userRole === 'admin' || userRole === 'super_admin') {
      return { authorized: true, userId, role: userRole };
    }
  } catch {
    return { authorized: false };
  }

  return { authorized: false };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase is not configured' },
        { status: 503 }
      );
    }

    const leadId = params.id;

    // Fetch from Supabase
    const { data: lead, error } = await supabaseAdmin
      .from('investment_leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (error || !lead) {
      return NextResponse.json(
        { error: 'Investment lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      lead,
    });
  } catch (error) {
    console.error('Investment lead fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investment lead' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    const leadId = params.id;
    const body = await request.json();
    const { status, notes, assignedTo } = body;

    // Validate status
    const validStatuses = ['pending', 'contacted', 'converted', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase is not configured' },
        { status: 503 }
      );
    }

    // Update in Supabase
    const updateData: any = {};
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (assignedTo !== undefined) {
      // Get user_id if assignedTo is email
      if (typeof assignedTo === 'string' && assignedTo.includes('@')) {
        const { data: userData } = await supabaseAdmin
          .from('users')
          .select('id')
          .eq('email', assignedTo)
          .single();
        updateData.assigned_to = userData?.id || null;
      } else {
        updateData.assigned_to = assignedTo;
      }
    }

    const { data: lead, error } = await supabaseAdmin
      .from('investment_leads')
      .update(updateData)
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update investment lead: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Investment lead updated successfully',
      lead,
    });
  } catch (error) {
    console.error('Investment lead update error:', error);
    return NextResponse.json(
      { error: 'Failed to update investment lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await checkAdminAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase is not configured' },
        { status: 503 }
      );
    }

    const leadId = params.id;

    // Delete from Supabase
    const { error } = await supabaseAdmin
      .from('investment_leads')
      .delete()
      .eq('id', leadId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete investment lead: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Investment lead deleted successfully',
    });
  } catch (error) {
    console.error('Investment lead deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete investment lead' },
      { status: 500 }
    );
  }
}
