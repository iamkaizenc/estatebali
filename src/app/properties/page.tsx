"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import EmptyState from "@/components/EmptyState";
import SearchBar from "@/components/SearchBar";
import { PropertyCardSkeleton } from "@/components/SkeletonLoader";
import { useProperties } from "@/hooks/useProperties";
import { SearchFilters } from "@/types";

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({});
  const { properties, loading, error } = useProperties(filters);

  // Load filters from URL on mount
  useEffect(() => {
    const urlFilters: SearchFilters = {};
    
    const query = searchParams.get("query");
    const listingType = searchParams.get("listingType");
    const type = searchParams.get("type");
    const area = searchParams.get("area");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    
    if (query) urlFilters.query = query;
    if (listingType) urlFilters.listingType = listingType as "sale" | "rent";
    if (type) urlFilters.propertyType = [type as "villa" | "apartment" | "house" | "land"];
    if (area) urlFilters.location = area;
    if (priceMin) urlFilters.priceMin = parseInt(priceMin);
    if (priceMax) urlFilters.priceMax = parseInt(priceMax);
    if (bedrooms) urlFilters.bedrooms = parseInt(bedrooms);
    if (bathrooms) urlFilters.bathrooms = parseInt(bathrooms);
    
    setFilters(urlFilters);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">All Properties</h1>
          <p className="text-gray-400">Browse all available properties in Bali</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={(searchFilters) => {
            const newFilters: SearchFilters = {
              listingType: searchFilters.listingType,
              propertyType: searchFilters.propertyType,
              priceMin: searchFilters.priceMin,
              priceMax: searchFilters.priceMax,
              bedrooms: searchFilters.bedrooms,
              bathrooms: searchFilters.bathrooms,
              location: searchFilters.location || searchFilters.query,
              query: searchFilters.query,
            };
            setFilters(newFilters);
            
            // Update URL with new filters
            const params = new URLSearchParams();
            if (newFilters.query) params.append("query", newFilters.query);
            if (newFilters.listingType) params.append("listingType", newFilters.listingType);
            if (newFilters.propertyType && newFilters.propertyType.length > 0) {
              params.append("type", newFilters.propertyType[0]);
            }
            if (newFilters.location) params.append("area", newFilters.location);
            if (newFilters.priceMin) params.append("priceMin", newFilters.priceMin.toString());
            if (newFilters.priceMax) params.append("priceMax", newFilters.priceMax.toString());
            if (newFilters.bedrooms) params.append("bedrooms", newFilters.bedrooms.toString());
            if (newFilters.bathrooms) params.append("bathrooms", newFilters.bathrooms.toString());
            
            const newUrl = `/properties?${params.toString()}`;
            window.history.pushState({}, "", newUrl);
          }} />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <PropertyCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-gray-400">Please try again later.</p>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="search"
            title="No Properties Found"
            description="We couldn't find any properties matching your search criteria. Try adjusting your filters or clearing your search."
            actionLabel="Clear Filters"
            onAction={() => {
              setFilters({});
              window.location.href = "/properties";
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  );
}

