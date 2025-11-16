"use client";

import { useEffect, useRef } from "react";
import { Property } from "@/types";

interface MapComponentProps {
  properties: Property[];
}

// Default coordinates for popular Bali areas
const areaCoordinates: Record<string, { lat: number; lng: number }> = {
  "Seminyak": { lat: -8.6846, lng: 115.1702 },
  "Canggu": { lat: -8.6489, lng: 115.1382 },
  "Ubud": { lat: -8.5069, lng: 115.2625 },
  "Sanur": { lat: -8.6899, lng: 115.2604 },
  "Uluwatu": { lat: -8.8294, lng: 115.0851 },
  "Nusa Dua": { lat: -8.7919, lng: 115.2245 },
  "Jimbaran": { lat: -8.8045, lng: 115.1768 },
  "Kuta": { lat: -8.7222, lng: 115.1687 },
  "Denpasar": { lat: -8.6705, lng: 115.2126 },
  "Pecatu": { lat: -8.8424, lng: 115.0932 },
  "Pererenan": { lat: -8.6444, lng: 115.1394 },
  "Berawa": { lat: -8.6525, lng: 115.1442 },
  "Mengwi": { lat: -8.5725, lng: 115.1836 },
  "Tabanan": { lat: -8.5411, lng: 115.1259 },
  "Gianyar": { lat: -8.5419, lng: 115.3222 },
};

// Get coordinates for a property (from coordinates or area fallback)
function getPropertyCoordinates(property: Property): { lat: number; lng: number } | null {
  // First try to use provided coordinates
  if (property.location.coordinates) {
    return property.location.coordinates;
  }
  
  // Fallback to area-based coordinates
  const area = property.location.area;
  if (area && areaCoordinates[area]) {
    return areaCoordinates[area];
  }
  
  // Fallback to city-based coordinates
  const city = property.location.city;
  if (city === "Denpasar") {
    return areaCoordinates["Denpasar"];
  }
  
  // Default to Bali center if nothing matches
  return { lat: -8.3405, lng: 115.092 };
}

export default function MapComponent({ properties }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    // Only load Leaflet on client side
    if (typeof window === "undefined" || !mapRef.current) return;

    const loadMap = async () => {
      try {
        const L = (await import("leaflet")).default;
        
        // Fix for default marker icon issue
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        });

        // Initialize map centered on Bali
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = L.map(mapRef.current!, {
            center: [-8.3405, 115.092],
            zoom: 10,
          });

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(mapInstanceRef.current);
        }

        // Clear existing markers
        markersRef.current.forEach(marker => {
          mapInstanceRef.current.removeLayer(marker);
        });
        markersRef.current = [];

        // Add markers for each property
        const validProperties = properties.filter(p => p.location && (p.location.coordinates || p.location.area || p.location.city));
        
        if (validProperties.length > 0) {
          validProperties.forEach((property) => {
            const coords = getPropertyCoordinates(property);
            
            if (coords) {
              const marker = L.marker([coords.lat, coords.lng]).addTo(mapInstanceRef.current);

              const formatPrice = (price: number) => {
                if (price >= 1000000000) {
                  return `Rp ${(price / 1000000000).toFixed(1)}B`;
                } else if (price >= 1000000) {
                  return `Rp ${(price / 1000000).toFixed(0)}M`;
                }
                return `Rp ${price.toLocaleString()}`;
              };

              marker.bindPopup(`
                <div style="color: #000; min-width: 200px;">
                  <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px;">${property.title}</h3>
                  <p style="margin-bottom: 4px; color: #666; font-size: 14px;">${property.location.area || ''}${property.location.city ? `, ${property.location.city}` : ''}</p>
                  <p style="color: #00FF66; font-weight: bold; margin-bottom: 8px; font-size: 16px;">
                    ${formatPrice(property.price)}
                    ${property.listingType === "rent" ? "/mo" : ""}
                  </p>
                  <a href="/property/${property.id}" style="color: #00FF66; text-decoration: underline; font-size: 14px;">
                    View Details →
                  </a>
                </div>
              `);

              markersRef.current.push(marker);
            }
          });

          // Fit map to show all markers
          if (markersRef.current.length > 0) {
            const group = new L.FeatureGroup(markersRef.current);
            mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error loading map:", error);
      }
    };

    loadMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        markersRef.current.forEach(marker => {
          mapInstanceRef.current.removeLayer(marker);
        });
        markersRef.current = [];
      }
    };
  }, [properties]);

  return <div ref={mapRef} className="h-[70vh] w-full rounded-2xl bg-dark-100" />;
}

