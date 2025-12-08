import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
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

      let query = supabase.from('motorcycles').select('*');

      // Filters
      if (params?.type) {
        query = query.eq('type', params.type);
      }
      if (params?.location) {
        query = query.eq('location', params.location);
      }
      if (params?.available !== undefined) {
        query = query.eq('available', params.available);
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
        console.error('[useMotorcycles] Error:', fetchError);
        throw fetchError;
      }

      console.log('[useMotorcycles] Fetched:', motorcycles?.length || 0, 'motorcycles');
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

