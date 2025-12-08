import { useState, useEffect } from 'react';
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

      // Use API route to avoid RLS issues and use service role key
      const queryParams = new URLSearchParams();
      if (params?.type) queryParams.append('type', params.type);
      if (params?.location) queryParams.append('location', params.location);
      if (params?.available !== undefined) queryParams.append('available', params.available.toString());
      if (params?.featured) queryParams.append('featured', 'true');
      if (params?.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
      if (params?.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params?.transmission) queryParams.append('transmission', params.transmission);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

      console.log('[useMotorcycles] Fetching from API with params:', params);
      const response = await fetch(`/api/motorcycles?${queryParams.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch motorcycles (${response.status})`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch motorcycles');
      }

      const motorcycles = result.data || [];
      console.log('[useMotorcycles] Fetched from API:', motorcycles.length, 'motorcycles');
      
      if (motorcycles.length > 0) {
        console.log('[useMotorcycles] First motorcycle sample:', motorcycles[0]);
      } else {
        console.warn('[useMotorcycles] No motorcycles returned from API');
      }
      
      setData(motorcycles);
      setError(null);
    } catch (err) {
      const error = err as Error;
      setError(error);
      console.error('[useMotorcycles] Error fetching motorcycles:', error);
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
