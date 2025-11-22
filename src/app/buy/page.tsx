"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import EmptyState from "@/components/EmptyState";
import SearchBar from "@/components/SearchBar";
import { useProperties } from "@/hooks/useProperties";
import { SearchFilters } from "@/types";

export default function BuyPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({ listingType: "sale" });

  // Initialize filters from URL parameters
  useEffect(() => {
    const initialFilters: SearchFilters = { listingType: "sale" };

    if (searchParams.get("query")) initialFilters.query = searchParams.get("query") || undefined;
    if (searchParams.get("type")) initialFilters.propertyType = [searchParams.get("type") as any];
    if (searchParams.get("area")) initialFilters.location = searchParams.get("area") || undefined;
    if (searchParams.get("priceMin")) initialFilters.priceMin = parseInt(searchParams.get("priceMin") || "0");
    if (searchParams.get("priceMax")) initialFilters.priceMax = parseInt(searchParams.get("priceMax") || "0");
    if (searchParams.get("bedrooms")) initialFilters.bedrooms = parseInt(searchParams.get("bedrooms") || "0");

    setFilters(initialFilters);
  }, [searchParams]);

  const { properties: saleProperties, loading, error } = useProperties(filters);

  const handleSearch = (newFilters: SearchFilters) => {
    // Always keep listingType as "sale"
    setFilters({ ...newFilters, listingType: "sale" });
  };

  const handleClearFilters = () => {
    setFilters({ listingType: "sale" });
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Properties for Sale</h1>
          <p className="text-gray-400">Find your dream property in Bali</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-400">
              {saleProperties.length} {saleProperties.length === 1 ? 'property' : 'properties'} found
            </p>
            {(filters.query || filters.propertyType || filters.location || filters.priceMin || filters.priceMax || filters.bedrooms) && (
              <button
                onClick={handleClearFilters}
                className="text-primary hover:underline text-sm"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
          </div>
        ) : saleProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saleProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="home"
            title="No Properties for Sale"
            description="We don't have any properties listed for sale at the moment. Check back soon or browse rental properties."
            actionLabel="Browse Rental Properties"
            actionHref="/rent"
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

