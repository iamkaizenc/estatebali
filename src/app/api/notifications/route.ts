import { NextRequest } from 'next/server';
import {
  apiCollection,
  apiSuccess,
  apiError,
  apiUnauthorized,
  apiForbidden,
  apiValidationError,
  getPaginationParams,
  validateRequiredFields,
} from '@/lib/api-response';
import { verifyAuth } from '@/lib/auth';

// Notifications API
// GET /api/notifications - Get user notifications
// POST /api/notifications - Create notification (admin only)

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const auth = verifyAuth(request);
    if (!auth.success) {
      return apiUnauthorized(auth.error);
    }

    // Get pagination params
    const searchParams = request.nextUrl.searchParams;
    const { limit, offset } = getPaginationParams(searchParams, { defaultLimit: 20 });
    const unreadOnly = searchParams.get('unread') === 'true';

    // TODO: Fetch from Supabase
    // let query = supabase
    //   .from('notifications')
    //   .select('*', { count: 'exact' })
    //   .eq('user_id', auth.userId)
    //   .order('created_at', { ascending: false })
    //   .range(offset, offset + limit - 1);
    //
    // if (unreadOnly) {
    //   query = query.eq('read', false);
    // }
    //
    // const { data: notifications, error, count } = await query;

    // Mock data
    const notifications: any[] = [];
    const total = 0;

    return apiCollection(notifications, total, limit, offset);
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return apiError('Failed to fetch notifications');
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { userId, title, message, type, actionUrl, data } = body;

    // Validate required fields
    const validation = validateRequiredFields(body, ['userId', 'title', 'message', 'type']);
    if (!validation.isValid) {
      return apiValidationError(validation.errors);
    }

    // Validate notification type
    const validTypes = ['info', 'success', 'warning', 'error', 'property', 'message', 'booking', 'price_drop', 'new_listing'];
    if (!validTypes.includes(type)) {
      return apiValidationError({
        type: 'Invalid notification type. Must be one of: ' + validTypes.join(', ')
      });
    }

    // TODO: Insert into Supabase
    // const { data: notification, error } = await supabase
    //   .from('notifications')
    //   .insert([{
    //     user_id: userId,
    //     title,
    //     message,
    //     type,
    //     action_url: actionUrl,
    //     data,
    //   }])
    //   .select()
    //   .single();

    const notification = {
      id: `notif_${Date.now()}`,
      userId,
      title,
      message,
      type,
      actionUrl,
      data,
      read: false,
      createdAt: new Date().toISOString(),
    };

    return apiSuccess(notification, 'Notification created successfully', 201);
  } catch (error) {
    console.error('Notification creation error:', error);
    return apiError('Failed to create notification');
  }
}
