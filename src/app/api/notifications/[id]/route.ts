import { NextRequest } from 'next/server';
import { apiMessage, apiError, apiUnauthorized } from '@/lib/api-response';
import { verifyAuth } from '@/lib/auth';

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

    const notificationId = params.id;

    // TODO: Update in Supabase
    // await supabase
    //   .from('notifications')
    //   .update({ read: true })
    //   .eq('id', notificationId)
    //   .eq('user_id', auth.userId);

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

    const notificationId = params.id;

    // TODO: Delete from Supabase
    // await supabase
    //   .from('notifications')
    //   .delete()
    //   .eq('id', notificationId)
    //   .eq('user_id', auth.userId);

    return apiMessage('Notification deleted');
  } catch (error) {
    console.error('Notification delete error:', error);
    return apiError('Failed to delete notification');
  }
}
