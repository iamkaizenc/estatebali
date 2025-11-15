"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";

export default function BuyPage() {
  const { properties: saleProperties, loading, error } = useProperties({ listingType: "sale" });

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Properties for Sale</h1>
          <p className="text-gray-400">Find your dream property in Bali</p>
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
        ) : saleProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {saleProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No properties found for sale.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

