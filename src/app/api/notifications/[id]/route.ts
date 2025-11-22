import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Mark notification as read
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString());
    const userId = payload.id;
    const notificationId = params.id;

    // TODO: Update in Supabase
    // await supabase
    //   .from('notifications')
    //   .update({ read: true })
    //   .eq('id', notificationId)
    //   .eq('user_id', userId);

    return NextResponse.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

// Delete notification
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString());
    const userId = payload.id;
    const notificationId = params.id;

    // TODO: Delete from Supabase
    // await supabase
    //   .from('notifications')
    //   .delete()
    //   .eq('id', notificationId)
    //   .eq('user_id', userId);

    return NextResponse.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
