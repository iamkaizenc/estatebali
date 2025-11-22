import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Notifications API
// GET /api/notifications - Get user notifications
// POST /api/notifications - Create notification (admin only)

async function getUserFromToken(): Promise<{ userId: string | null; role: string | null }> {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token')?.value;

  if (!authToken) {
    return { userId: null, role: null };
  }

  try {
    const payload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString());
    return { userId: payload.id, role: payload.role };
  } catch {
    return { userId: null, role: null };
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await getUserFromToken();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query params
    const searchParams = request.nextUrl.searchParams;
    const unreadOnly = searchParams.get('unread') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // TODO: Fetch from Supabase
    // let query = supabase
    //   .from('notifications')
    //   .select('*')
    //   .eq('user_id', userId)
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
    const unreadCount = 0;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
      total: notifications.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Notifications fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { role } = await getUserFromToken();

    // Only admins can create notifications
    if (role !== 'admin' && role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, title, message, type, actionUrl, data } = body;

    // Validation
    if (!userId || !title || !message || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const validTypes = ['info', 'success', 'warning', 'error', 'property', 'message', 'booking', 'price_drop', 'new_listing'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid notification type' },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      message: 'Notification created successfully',
      notification: {
        id: `notif_${Date.now()}`,
        userId,
        title,
        message,
        type,
        actionUrl,
        data,
        read: false,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Notification creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}
