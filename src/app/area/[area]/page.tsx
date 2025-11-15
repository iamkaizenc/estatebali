"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { mockProperties } from "@/data/mockData";

export default function AreaPage() {
  const params = useParams();
  const area = params.area as string;
  const [properties] = useState(mockProperties);

  const filterPropertiesByArea = useCallback((props: typeof mockProperties, areaParam: string) => {
    const searchArea = areaParam.toLowerCase().replace(/-/g, '').replace(/\s+/g, '');
    return props.filter(p => {
      const propertyArea = p.location.area.toLowerCase();
      // Check if area name contains the search term or vice versa
      // Also handle cases like "Uluwatu, Pecatu" -> "uluwatu"
      const areaParts = propertyArea.split(',').map(part => part.trim().replace(/\s+/g, ''));
      const normalizedPropertyArea = propertyArea.replace(/\s+/g, '').replace(/,/g, '');
      
      const matches = areaParts.some(part => 
        part === searchArea || 
        part.includes(searchArea) || 
        searchArea.includes(part)
      ) || normalizedPropertyArea.includes(searchArea) || searchArea.includes(normalizedPropertyArea);
      
      return matches;
    });
  }, []);

  const [areaProperties, setAreaProperties] = useState(
    filterPropertiesByArea(properties, area)
  );

  useEffect(() => {
    const filtered = filterPropertiesByArea(properties, area);
    setAreaProperties(filtered);
  }, [area, properties, filterPropertiesByArea]);

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

        {areaProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {areaProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">No properties found in {areaName}.</p>
            <Link href="/" className="btn-primary">
              Browse All Properties
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

