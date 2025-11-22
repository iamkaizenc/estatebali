import { NextRequest } from 'next/server';
import {
  apiSuccess,
  apiCollection,
  apiError,
  apiUnauthorized,
  validateRequiredFields,
  apiValidationError,
} from '@/lib/api-response';
import { verifyAuth } from '@/lib/auth';

// Saved Searches API
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const auth = verifyAuth(request);
    if (!auth.success) {
      return apiUnauthorized(auth.error);
    }

    const body = await request.json();
    const { name, filters, alertEnabled, alertFrequency } = body;

    // Validate required fields
    const validation = validateRequiredFields(body, ['name', 'filters']);
    if (!validation.isValid) {
      return apiValidationError(validation.errors);
    }

    // TODO: Insert into Supabase
    const savedSearch = {
      id: `search_${Date.now()}`,
      userId: auth.userId,
      name,
      filters,
      alertEnabled: alertEnabled || false,
      alertFrequency: alertFrequency || 'daily',
      createdAt: new Date().toISOString(),
    };

    return apiSuccess(savedSearch, 'Search saved successfully', 201);
  } catch (error) {
    console.error('Saved search creation error:', error);
    return apiError('Failed to save search');
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const auth = verifyAuth(request);
    if (!auth.success) {
      return apiUnauthorized(auth.error);
    }

    // TODO: Fetch from Supabase
    // const { data: searches } = await supabase
    //   .from('saved_searches')
    //   .select('*')
    //   .eq('user_id', auth.userId)
    //   .order('created_at', { ascending: false });

    // Mock data
    const searches: any[] = [];
    const total = 0;

    return apiCollection(searches, total, 50, 0);
  } catch (error) {
    console.error('Saved searches fetch error:', error);
    return apiError('Failed to fetch saved searches');
  }
}
