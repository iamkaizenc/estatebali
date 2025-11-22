import { NextRequest, NextResponse } from 'next/server';
import {
  apiSuccess,
  apiMessage,
  apiError,
  apiForbidden,
  apiNotFound,
  apiServiceUnavailable,
} from '@/lib/api-response';
import { verifyAuth } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin';

// Investment Lead Detail API
// GET /api/investment-leads/[id] - Get specific lead (admin only)
// PATCH /api/investment-leads/[id] - Update lead status/notes (admin only)
// DELETE /api/investment-leads/[id] - Delete lead (admin only)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and admin role
    const auth = verifyAuth(request);
    if (!auth.success) {
      return apiForbidden(auth.error || 'Unauthorized');
    }

    if (auth.role !== 'admin' && auth.role !== 'super_admin') {
      return apiForbidden('Admin access required');
    }

    // Check Supabase configuration
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return apiServiceUnavailable('Database is not configured');
    }

    const leadId = params.id;

    // Fetch from Supabase
    const { data: lead, error } = await supabaseAdmin
      .from('investment_leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (error || !lead) {
      console.error('Investment lead fetch error:', error);
      return apiNotFound('Investment lead not found');
    }

    return apiSuccess(lead);
  } catch (error) {
    console.error('Investment lead fetch error:', error);
    return apiError('Failed to fetch investment lead');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and admin role
    const auth = verifyAuth(request);
    if (!auth.success) {
      return apiForbidden(auth.error || 'Unauthorized');
    }

    if (auth.role !== 'admin' && auth.role !== 'super_admin') {
      return apiForbidden('Admin access required');
    }

    // Check Supabase configuration
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return apiServiceUnavailable('Database is not configured');
    }

    const leadId = params.id;
    const body = await request.json();
    const { status, notes, assignedTo } = body;

    // Validate status
    const validStatuses = ['pending', 'contacted', 'converted', 'closed'];
    if (status && !validStatuses.includes(status)) {
      return apiError('Invalid status value', 400);
    }

    // Build update data
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };
    if (status) updateData.status = status;
    if (notes !== undefined) updateData.notes = notes;
    if (assignedTo !== undefined) updateData.assigned_to = assignedTo;

    // Update in Supabase
    const { data: lead, error } = await supabaseAdmin
      .from('investment_leads')
      .update(updateData)
      .eq('id', leadId)
      .select()
      .single();

    if (error) {
      console.error('Investment lead update error:', error);
      return apiError('Failed to update investment lead', 500);
    }

    return apiSuccess(lead, 'Investment lead updated successfully');
  } catch (error) {
    console.error('Investment lead update error:', error);
    return apiError('Failed to update investment lead');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and admin role
    const auth = verifyAuth(request);
    if (!auth.success) {
      return apiForbidden(auth.error || 'Unauthorized');
    }

    if (auth.role !== 'admin' && auth.role !== 'super_admin') {
      return apiForbidden('Admin access required');
    }

    // Check Supabase configuration
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return apiServiceUnavailable('Database is not configured');
    }

    const leadId = params.id;

    // Delete from Supabase
    const { error } = await supabaseAdmin
      .from('investment_leads')
      .delete()
      .eq('id', leadId);

    if (error) {
      console.error('Investment lead deletion error:', error);
      return apiError('Failed to delete investment lead', 500);
    }

    return apiMessage('Investment lead deleted successfully');
  } catch (error) {
    console.error('Investment lead deletion error:', error);
    return apiError('Failed to delete investment lead');
  }
}
