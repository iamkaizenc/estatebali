import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";
import { verifyAuth } from "@/lib/api-auth";

// GET /api/motorcycles - Get all motorcycles
// Public endpoint, but can filter by available status
export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured" },
        { status: 503 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const location = searchParams.get('location');
    const available = searchParams.get('available');
    const featured = searchParams.get('featured');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'newest';

    let query = supabaseAdmin.from('motorcycles').select('*');

    // Filters
    if (type) {
      query = query.eq('type', type);
    }
    if (location) {
      query = query.eq('location', location);
    }
    // Only filter by available if explicitly provided as 'true' or 'false'
    // If not provided (null/undefined), show all motorcycles
    // Public pages should pass available=true, admin pages can omit it to see all
    if (available !== null && available !== undefined && available !== '') {
      query = query.eq('available', available === 'true');
    }
    // Otherwise show all (no filter on available)
    if (featured === 'true') {
      query = query.eq('featured', true);
    }
    if (minPrice) {
      query = query.gte('price', parseInt(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', parseInt(maxPrice));
    }

    // Sorting
    if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'price-asc') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'price-desc') {
      query = query.order('price', { ascending: false });
    } else if (sortBy === 'popular') {
      query = query.order('views', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data: motorcycles, error } = await query;

    if (error) {
      console.error("Error fetching motorcycles:", error);
      return NextResponse.json(
        { success: false, error: error.message || "Failed to fetch motorcycles" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: motorcycles || [],
    });
  } catch (error: any) {
    console.error("Error fetching motorcycles:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch motorcycles" },
      { status: 500 }
    );
  }
}

// POST /api/motorcycles - Create new motorcycle (admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = verifyAuth(request);
    if (!auth.success) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized" },
        { status: 401 }
      );
    }

    if (!isSupabaseConfigured || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, error: "Supabase is not configured" },
        { status: 503 }
      );
    }

    const body = await request.json();

    const { data, error } = await supabaseAdmin
      .from('motorcycles')
      .insert({
        ...body,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating motorcycle:", error);
      throw error;
    }

    return NextResponse.json({
      success: true,
      data,
    }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating motorcycle:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create motorcycle" },
      { status: 500 }
    );
  }
}

