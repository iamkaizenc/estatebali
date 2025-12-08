"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import EmptyState from "@/components/EmptyState";
import { useProperties } from "@/hooks/useProperties";
import { Property } from "@/types";
import { Search, Filter, MapPin, X, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { BALI_LOCATIONS } from "@/lib/locations";

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[70vh] bg-dark-100 rounded-2xl flex items-center justify-center border border-dark-300">
      <div className="text-center">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400">Loading map...</p>
      </div>
    </div>
  ),
});

export default function MapPage() {
  const { properties: initialProperties, loading, error, refetch } = useProperties({ includeHidden: false });
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(initialProperties);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPriceMin, setFilterPriceMin] = useState<number | undefined>();
  const [filterPriceMax, setFilterPriceMax] = useState<number | undefined>();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Update properties when fetched
  useEffect(() => {
    setProperties(initialProperties);
    setFilteredProperties(initialProperties);
  }, [initialProperties]);

  // Apply filters
  useEffect(() => {
    let filtered = [...properties];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((p) => {
        const title = p.title?.toLowerCase() || '';
        const description = p.description?.toLowerCase() || '';
        const area = p.location?.area?.toLowerCase() || '';
        const city = p.location?.city?.toLowerCase() || '';
        return title.includes(query) || description.includes(query) || area.includes(query) || city.includes(query);
      });
    }

    // Location filter
    if (filterLocation && filterLocation !== 'all') {
      filtered = filtered.filter((p) => {
        const area = p.location?.area?.toLowerCase() || '';
        const city = p.location?.city?.toLowerCase() || '';
        const address = p.location?.address?.toLowerCase() || '';
        const filterLower = filterLocation.toLowerCase();
        return area.includes(filterLower) || city.includes(filterLower) || address.includes(filterLower);
      });
    }

    // Type filter
    if (filterType && filterType !== 'all') {
      filtered = filtered.filter((p) => {
        return p.type === filterType || p.category === filterType;
      });
    }

    // Price filters
    if (filterPriceMin !== undefined) {
      filtered = filtered.filter((p) => p.price >= filterPriceMin);
    }
    if (filterPriceMax !== undefined) {
      filtered = filtered.filter((p) => p.price <= filterPriceMax);
    }

    setFilteredProperties(filtered);
  }, [properties, searchQuery, filterLocation, filterType, filterPriceMin, filterPriceMax]);

  // Realtime subscription for property updates
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Import supabase only on client side
    import('@/lib/supabase').then(({ supabase }) => {
      if (!supabase) return;

      const channel = supabase
        .channel('map-properties-realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'properties',
          },
          (payload) => {
            console.log('Property changed:', payload);
            // Refetch properties when changes occur
            refetch();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    });
  }, [refetch]);

  // Get unique locations from properties
  const locations = Array.from(
    new Set(
      properties
        .map((p) => p.location?.area || p.location?.city || '')
        .filter(Boolean)
    )
  ).sort();

  // Get unique property types
  const propertyTypes = Array.from(
    new Set(properties.map((p) => p.type || p.category).filter(Boolean))
  ).sort();

  // Price range
  const priceRange = {
    min: properties.length > 0 ? Math.min(...properties.map((p) => p.price)) : 0,
    max: properties.length > 0 ? Math.max(...properties.map((p) => p.price)) : 10000000000,
  };

  const clearFilters = () => {
    setSearchQuery("");
    setFilterLocation("all");
    setFilterType("all");
    setFilterPriceMin(undefined);
    setFilterPriceMax(undefined);
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
    // Scroll to property card if visible
    const element = document.getElementById(`property-${property.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Map Search</h1>
          <p className="text-gray-400">Find properties by location on the map</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties by title, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white placeholder-gray-500"
            />
          </div>

          {/* Filter Toggle and Quick Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-dark-200 hover:bg-dark-300 rounded-xl border border-dark-300 transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
              {(filterLocation !== 'all' || filterType !== 'all' || filterPriceMin || filterPriceMax) && (
                <span className="px-2 py-0.5 bg-primary text-black text-xs font-bold rounded-full">
                  Active
                </span>
              )}
            </button>

            {/* Quick Location Filter */}
            <select
              value={filterLocation}
              onChange={(e) => setFilterLocation(e.target.value)}
              className="px-4 py-2 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none text-white"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            {(filterLocation !== 'all' || filterType !== 'all' || filterPriceMin || filterPriceMax) && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="bg-dark-200 rounded-xl p-6 border border-dark-300 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Property Type Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Property Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-2 bg-dark-100 rounded-lg border border-dark-300 focus:border-primary focus:outline-none text-white"
                  >
                    <option value="all">All Types</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Min Price (IDR)</label>
                  <input
                    type="number"
                    value={filterPriceMin || ''}
                    onChange={(e) => setFilterPriceMin(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="0"
                    className="w-full px-4 py-2 bg-dark-100 rounded-lg border border-dark-300 focus:border-primary focus:outline-none text-white placeholder-gray-500"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Max Price (IDR)</label>
                  <input
                    type="number"
                    value={filterPriceMax || ''}
                    onChange={(e) => setFilterPriceMax(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder={priceRange.max.toLocaleString()}
                    className="w-full px-4 py-2 bg-dark-100 rounded-lg border border-dark-300 focus:border-primary focus:outline-none text-white placeholder-gray-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="text-sm text-gray-400">
            Showing {filteredProperties.length} of {properties.length} properties
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <p className="text-gray-400">Please try again later.</p>
          </div>
        ) : filteredProperties.length > 0 ? (
          <>
            {/* Map */}
            <div className="mb-8">
              <MapComponent 
                properties={filteredProperties} 
                onPropertyClick={handlePropertyClick}
                filterLocation={filterLocation}
                filterType={filterType}
                filterPriceMin={filterPriceMin}
                filterPriceMax={filterPriceMax}
              />
            </div>

            {/* Property List */}
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Properties on Map ({filteredProperties.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <div
                    key={property.id}
                    id={`property-${property.id}`}
                    className={selectedProperty?.id === property.id ? 'ring-2 ring-primary rounded-xl' : ''}
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Empty Map */}
            <div className="mb-8">
              <MapComponent properties={[]} />
            </div>
            <EmptyState
              icon="map"
              title="No Properties Found"
              description={searchQuery || filterLocation !== 'all' || filterType !== 'all' || filterPriceMin || filterPriceMax
                ? "No properties match your filters. Try adjusting your search criteria."
                : "We couldn't find any properties to display on the map. Check back soon or browse all properties."}
              actionLabel="Browse All Properties"
              actionHref="/properties"
            />
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}


