"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import EmptyState from "@/components/EmptyState";
import { useProperties } from "@/hooks/useProperties";

export default function AreaPage() {
  const params = useParams();
  const area = params.area as string;
  
  // Normalize area name for search (e.g., "uluwatu" or "uluwatu-pecatu" -> search for "uluwatu")
  const normalizedArea = area.toLowerCase().replace(/-/g, ' ').split(' ')[0];
  const { properties: areaProperties, loading, error } = useProperties({ area: normalizedArea });

  // Get the actual area name from the first property if available
  const areaName = areaProperties.length > 0 
    ? areaProperties[0].location.area
    : area.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Properties in {areaName}</h1>
          <p className="text-gray-400">
            {areaProperties.length} {areaProperties.length === 1 ? 'property' : 'properties'} found
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
            <Link href="/" className="btn-primary mt-4">
              Browse All Properties
            </Link>
          </div>
        ) : areaProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areaProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="map"
            title={`No Properties in ${areaName}`}
            description={`We don't have any properties available in ${areaName} at the moment. Check back soon or explore other areas in Bali.`}
            actionLabel="Browse All Properties"
            actionHref="/properties"
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

