"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import SearchBar from "@/components/SearchBar";
import { useProperties } from "@/hooks/useProperties";
import { SearchFilters } from "@/types";

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({});
  const { properties, loading, error } = useProperties(filters);

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
            setFilters({
              listingType: searchFilters.listingType,
              propertyType: searchFilters.propertyType,
              priceMin: searchFilters.priceMin,
              priceMax: searchFilters.priceMax,
              bedrooms: searchFilters.bedrooms,
              location: searchFilters.location || searchFilters.query,
              query: searchFilters.query,
            });
          }} />
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading properties...</p>
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
          <div className="text-center py-20">
            <p className="text-gray-400">No properties found.</p>
          </div>
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

