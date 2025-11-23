import { NextRequest } from 'next/server';
import { apiMessage, apiError, apiUnauthorized } from '@/lib/api-response';
import { verifyAuth } from '@/lib/api-auth';
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

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return apiError('Supabase is not configured', 503);
    }

    const notificationId = params.id;

    // Get user_id from users table
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', auth.user?.email || '')
      .single();

    if (!userData) {
      return apiError('User not found', 404);
    }

    // Update in Supabase
    const { error } = await supabaseAdmin
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userData.id);

    if (error) {
      console.error('Notification update error:', error);
      return apiError('Failed to update notification: ' + error.message);
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

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return apiError('Supabase is not configured', 503);
    }

    const notificationId = params.id;

    // Get user_id from users table
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', auth.user?.email || '')
      .single();

    if (!userData) {
      return apiError('User not found', 404);
    }

    // Delete from Supabase
    const { error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', notificationId)
      .eq('user_id', userData.id);

    if (error) {
      console.error('Notification delete error:', error);
      return apiError('Failed to delete notification: ' + error.message);
    }

    return apiMessage('Notification deleted');
  } catch (error) {
    console.error('Notification delete error:', error);
    return apiError('Failed to delete notification');
  }
}
