import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Motorcycle, MotorcycleFilters } from '@/types/motorcycle';

interface UseMotorcyclesParams extends MotorcycleFilters {
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'popular';
}

export function useMotorcycles(params?: UseMotorcyclesParams) {
  const [data, setData] = useState<Motorcycle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchMotorcycles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)]);

  const fetchMotorcycles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!supabase || !isSupabaseConfigured) {
        console.error('[useMotorcycles] Supabase client is null or not configured');
        console.error('[useMotorcycles] isSupabaseConfigured:', isSupabaseConfigured);
        console.error('[useMotorcycles] supabase client:', supabase);
        throw new Error('Supabase client is not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
      }

      console.log('[useMotorcycles] Starting fetch with params:', params);
      let query = supabase.from('motorcycles').select('*');

      // Filters
      // Note: available filter is handled by RLS policy (available = true for public)
      // Only add explicit available filter if we want to show unavailable items (admin only)
      if (params?.available === false) {
        // Only filter for false if explicitly requested (admin scenario)
        query = query.eq('available', false);
      }
      // For available = true, rely on RLS policy, don't add explicit filter
      
      if (params?.type) {
        query = query.eq('type', params.type);
      }
      if (params?.location) {
        query = query.eq('location', params.location);
      }
      if (params?.featured) {
        query = query.eq('featured', true);
      }
      if (params?.minPrice !== undefined) {
        query = query.gte('price', params.minPrice);
      }
      if (params?.maxPrice !== undefined) {
        query = query.lte('price', params.maxPrice);
      }
      if (params?.transmission) {
        query = query.eq('transmission', params.transmission);
      }

      // Sorting
      if (params?.sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (params?.sortBy === 'price-asc') {
        query = query.order('price', { ascending: true });
      } else if (params?.sortBy === 'price-desc') {
        query = query.order('price', { ascending: false });
      } else if (params?.sortBy === 'popular') {
        query = query.order('views', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data: motorcycles, error: fetchError } = await query;

      if (fetchError) {
        console.error('[useMotorcycles] Supabase Error:', fetchError);
        console.error('[useMotorcycles] Error Code:', fetchError.code);
        console.error('[useMotorcycles] Error Message:', fetchError.message);
        console.error('[useMotorcycles] Error Details:', fetchError.details);
        console.error('[useMotorcycles] Error Hint:', fetchError.hint);
        throw fetchError;
      }

      console.log('[useMotorcycles] Raw data from Supabase:', motorcycles);
      console.log('[useMotorcycles] Fetched:', motorcycles?.length || 0, 'motorcycles');
      
      if (motorcycles && motorcycles.length > 0) {
        console.log('[useMotorcycles] First motorcycle sample:', motorcycles[0]);
      }
      
      setData((motorcycles as Motorcycle[]) || []);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching motorcycles:', err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    data, 
    isLoading, 
    error, 
    refetch: fetchMotorcycles 
  };
}

