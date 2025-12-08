import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabaseAdmin";

// GET /api/motorcycles - Get all motorcycles (public endpoint)
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
    if (available !== null && available !== undefined) {
      query = query.eq('available', available === 'true');
    } else {
      // Default to only available motorcycles for public access
      query = query.eq('available', true);
    }
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

