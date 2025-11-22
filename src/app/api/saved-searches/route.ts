import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Saved Searches API
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString());
    const userId = payload.id;

    const body = await request.json();
    const { name, filters, alertEnabled, alertFrequency } = body;

    if (!name || !filters) {
      return NextResponse.json({ error: 'Name and filters are required' }, { status: 400 });
    }

    // TODO: Insert into Supabase
    const savedSearch = {
      id: `search_${Date.now()}`,
      userId,
      name,
      filters,
      alertEnabled: alertEnabled || false,
      alertFrequency: alertFrequency || 'daily',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, savedSearch, message: 'Search saved successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save search' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = JSON.parse(Buffer.from(authToken.split('.')[1], 'base64').toString());
    const userId = payload.id;

    // TODO: Fetch from Supabase
    // const { data: searches } = await supabase
    //   .from('saved_searches')
    //   .select('*')
    //   .eq('user_id', userId)
    //   .order('created_at', { ascending: false });

    return NextResponse.json({ success: true, searches: [] });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch saved searches' }, { status: 500 });
  }
}
