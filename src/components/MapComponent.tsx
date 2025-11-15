"use client";

import { useEffect, useRef } from "react";
import { Property } from "@/types";

interface MapComponentProps {
  properties: Property[];
}

export default function MapComponent({ properties }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

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

          // Add markers for each property
          properties.forEach((property) => {
            if (property.location.coordinates) {
              const marker = L.marker([
                property.location.coordinates.lat,
                property.location.coordinates.lng,
              ]).addTo(mapInstanceRef.current);

              marker.bindPopup(`
                <div style="color: #000;">
                  <h3 style="font-weight: bold; margin-bottom: 8px;">${property.title}</h3>
                  <p style="margin-bottom: 4px;">${property.location.area}, ${property.location.city}</p>
                  <p style="color: #00FF66; font-weight: bold; margin-bottom: 8px;">
                    Rp ${property.price >= 1000000000 
                      ? `${(property.price / 1000000000).toFixed(1)}B` 
                      : `${(property.price / 1000000).toFixed(0)}M`}
                  </p>
                  <a href="/property/${property.id}" style="color: #00FF66; text-decoration: underline;">
                    View Details →
                  </a>
                </div>
              `);
            }
          });
        }
      } catch (error) {
        console.error("Error loading map:", error);
      }
    };

    loadMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [properties]);

  return <div ref={mapRef} className="h-[70vh] w-full rounded-2xl bg-dark-100" />;
}

