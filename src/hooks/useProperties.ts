"use client";

import { useState, useEffect } from "react";
import { Property, SearchFilters } from "@/types";

interface UsePropertiesOptions extends SearchFilters {
  featured?: boolean;
  userId?: string;
  excludeTypes?: string[]; // Types to exclude (e.g., ['motorbike', 'scooter'])
  sortBy?: 'views' | 'created_at' | 'price'; // Sorting option
  includeHidden?: boolean; // Include hidden (available=false) properties (admin only)
  showOnRentMotorbike?: boolean; // Show only properties marked for rent-motorbike page
}

export function useProperties(options: UsePropertiesOptions = {}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize options to prevent infinite loops
  const optionsString = JSON.stringify(options);

  useEffect(() => {
    let isMounted = true;
    let abortController = new AbortController();
    
    const fetchProperties = async () => {
      if (!isMounted) return;
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (options.listingType) params.append("listingType", options.listingType);
        if (options.featured) params.append("featured", "true");
        if (options.location) params.append("area", options.location);
        if (options.query) params.append("query", options.query);
        if (options.sortBy) params.append("sortBy", options.sortBy);
        if (options.includeHidden) params.append("includeHidden", "true");
        if (options.showOnRentMotorbike) params.append("showOnRentMotorbike", "true");
        // propertyType maps to category field in database
        // For motorcycle filtering, we need to send 'motorcycle' to API
        // since database uses 'motorcycle' category, not 'motorbike' or 'scooter'
        if (options.propertyType && options.propertyType.length > 0) {
          // Check if any of the requested types is motorcycle-related
          const hasMotorcycle = options.propertyType.some(t => 
            ['motorcycle', 'motorbike', 'scooter'].includes(t.toLowerCase())
          );
          if (hasMotorcycle) {
            // Send 'motorcycle' as category filter since that's what database uses
            params.append("type", "motorcycle");
          } else {
            // For other property types, use the first one
            params.append("type", options.propertyType[0].toLowerCase());
          }
        }
        if (options.userId) params.append("userId", options.userId);
        if (options.priceMin) params.append("priceMin", options.priceMin.toString());
        if (options.priceMax) params.append("priceMax", options.priceMax.toString());
        if (options.bedrooms) params.append("bedrooms", options.bedrooms.toString());
        if (options.bathrooms) params.append("bathrooms", options.bathrooms.toString());

        const response = await fetch(`/api/properties?${params.toString()}`);
        const result = await response.json();

        if (result.success) {
          setProperties(result.data);
        } else {
          setError(result.error || "Failed to fetch properties");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
    
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [optionsString]);

  return { properties, loading, error, refetch: () => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (options.listingType) params.append("listingType", options.listingType);
        if (options.featured) params.append("featured", "true");
        if (options.location) params.append("area", options.location);
        if (options.propertyType && options.propertyType.length > 0) {
          params.append("type", options.propertyType[0]);
        }
        if (options.includeHidden) params.append("includeHidden", "true");
        if (options.sortBy) params.append("sortBy", options.sortBy);

        const response = await fetch(`/api/properties?${params.toString()}`);
        const result = await response.json();

        if (result.success) {
          let filteredData = result.data;
          
          // Client-side filtering: exclude certain types
          if (options.excludeTypes && options.excludeTypes.length > 0) {
            filteredData = filteredData.filter(
              (property: Property) => !options.excludeTypes!.includes(property.type)
            );
          }
          
          setProperties(filteredData);
        } else {
          setError(result.error || "Failed to fetch properties");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }};
}

export function useProperty(id: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/properties/${id}`);
        const result = await response.json();

        if (result.success) {
          setProperty(result.data);
        } else {
          setError(result.error || "Property not found");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch property");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id]);

  return { property, loading, error };
}

