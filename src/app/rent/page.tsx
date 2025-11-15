"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { mockProperties } from "@/data/mockData";

export default function RentPage() {
  const [properties] = useState(mockProperties);
  const rentProperties = properties.filter(p => p.listingType === "rent");

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Properties for Rent</h1>
          <p className="text-gray-400">Find your perfect rental property in Bali</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rentProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {rentProperties.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No properties found for rent.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

