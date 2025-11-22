import { NextRequest } from 'next/server';
import { apiMessage, apiError, apiUnauthorized, apiServiceUnavailable } from '@/lib/api-response';
import { verifyAuth } from '@/lib/auth';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabaseAdmin';

// Mark notification as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const notificationId = params.id;

    // Update notification in Supabase
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', auth.userId);

    if (error) {
      console.error('Notification update error:', error);
      return apiError('Failed to update notification', 500);
    }

    return apiMessage('Notification marked as read');
  } catch (error) {
    console.error('Notification update error:', error);
    return apiError('Failed to update notification');
  }
}

// Delete notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const notificationId = params.id;

    // Delete notification from Supabase
    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', auth.userId);

    if (error) {
      console.error('Notification delete error:', error);
      return apiError('Failed to delete notification', 500);
    }

    return apiMessage('Notification deleted');
  } catch (error) {
    console.error('Notification delete error:', error);
    return apiError('Failed to delete notification');
  }
}
