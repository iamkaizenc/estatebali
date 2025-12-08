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
      // Only pass available if explicitly set (for admin panel, omit to see all)
      // For public pages (rent-motorbike), pass available=true
      if (params?.available === true) {
        queryParams.append('available', 'true');
      } else if (params?.available === false) {
        queryParams.append('available', 'false');
      }
      // If params?.available is undefined, don't add filter (shows all)
      if (params?.featured) queryParams.append('featured', 'true');
      if (params?.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
      if (params?.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params?.transmission) queryParams.append('transmission', params.transmission);
      if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

      const apiUrl = `/api/motorcycles?${queryParams.toString()}`;
      console.log('[useMotorcycles] Fetching from API:', apiUrl);
      console.log('[useMotorcycles] With params:', params);
      console.log('[useMotorcycles] Query params string:', queryParams.toString());
      
      const response = await fetch(apiUrl);
      
      console.log('[useMotorcycles] Response status:', response.status);
      console.log('[useMotorcycles] Response ok:', response.ok);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('[useMotorcycles] Error response text:', errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || `HTTP ${response.status}` };
        }
        throw new Error(errorData.error || `Failed to fetch motorcycles (${response.status})`);
      }

      const result = await response.json();
      console.log('[useMotorcycles] API Response:', result);
      
      if (!result.success) {
        console.error('[useMotorcycles] API returned success=false:', result);
        throw new Error(result.error || 'Failed to fetch motorcycles');
      }

      const motorcycles = result.data || [];
      console.log('[useMotorcycles] Fetched from API:', motorcycles.length, 'motorcycles');
      
      if (motorcycles.length > 0) {
        console.log('[useMotorcycles] First motorcycle sample:', motorcycles[0]);
      } else {
        console.warn('[useMotorcycles] ⚠️ No motorcycles returned from API');
        console.warn('[useMotorcycles] API URL was:', apiUrl);
        console.warn('[useMotorcycles] Full API response:', result);
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
