"use client";

import { useState, useEffect } from "react";
import { Property, SearchFilters } from "@/types";

interface UsePropertiesOptions extends SearchFilters {
  featured?: boolean;
  userId?: string;
}

export function useProperties(options: UsePropertiesOptions = {}) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [options.listingType, options.featured, options.area, options.type]);

  return { properties, loading, error, refetch: () => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (options.listingType) params.append("listingType", options.listingType);
        if (options.featured) params.append("featured", "true");
        if (options.area) params.append("area", options.area);
        if (options.type) params.append("type", options.type);

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

