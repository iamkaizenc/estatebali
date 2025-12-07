"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import EmptyState from "@/components/EmptyState";
import { useProperties } from "@/hooks/useProperties";

export default function RentPage() {
  const { properties: allProperties, loading, error } = useProperties({ 
    listingType: "rent"
  });
  
  // Filter out motorcycles (they should only appear in rent-motorbike page)
  const rentProperties = (allProperties || []).filter((p: any) => {
    const category = (p as any).category || p.type;
    return category !== 'motorcycle' && category !== 'motorbike' && category !== 'scooter';
  });

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Properties for Rent</h1>
          <p className="text-gray-400">Find your perfect rental property in Bali</p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading properties...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
          </div>
        ) : rentProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="home"
            title="No Properties for Rent"
            description="We don't have any rental properties available at the moment. Check back soon or browse properties for sale."
            actionLabel="Browse Properties for Sale"
            actionHref="/buy"
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

