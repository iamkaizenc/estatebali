"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { mockProperties } from "@/data/mockData";

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[70vh] bg-dark-100 rounded-2xl flex items-center justify-center">
      <p className="text-gray-400">Loading map...</p>
    </div>
  ),
});

export default function MapPage() {
  const [properties] = useState(mockProperties);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Map Search</h1>
          <p className="text-gray-400">Find properties by location on the map</p>
        </div>

        <div className="mb-8">
          <MapComponent properties={properties} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="card p-4">
              <h3 className="font-semibold mb-2">{property.title}</h3>
              <p className="text-sm text-gray-400 mb-2">
                {property.location.area}, {property.location.city}
              </p>
              <Link
                href={`/property/${property.id}`}
                className="text-primary hover:underline text-sm"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

