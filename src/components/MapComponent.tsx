"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Property } from "@/types";
import { getLocationCoordinates, BALI_CENTER } from "@/lib/locations";

interface MapComponentProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  filterLocation?: string;
  filterType?: string;
  filterPriceMin?: number;
  filterPriceMax?: number;
}

// Get coordinates for a property
function getPropertyCoordinates(property: Property): { lat: number; lng: number } | null {
  // First try to use provided coordinates
  if (property.location?.coordinates?.lat && property.location?.coordinates?.lng) {
    const lat = Number(property.location.coordinates.lat);
    const lng = Number(property.location.coordinates.lng);
    // Validate coordinates are not 0,0 (invalid)
    if (lat !== 0 && lng !== 0) {
      return { lat, lng };
    }
  }
  
  // Fallback to location-based coordinates
  const locationCoords = getLocationCoordinates(property.location?.area || property.location?.city || property.location?.address);
  if (locationCoords) {
    return locationCoords;
  }
  
  // Default to Bali center if nothing matches
  return BALI_CENTER;
}

export default function MapComponent({ 
  properties, 
  onPropertyClick,
  filterLocation,
  filterType,
  filterPriceMin,
  filterPriceMax,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Filter properties based on filters
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Location filter
      if (filterLocation && filterLocation !== 'all') {
        const area = property.location?.area?.toLowerCase() || '';
        const city = property.location?.city?.toLowerCase() || '';
        const location = property.location?.address?.toLowerCase() || '';
        const filterLower = filterLocation.toLowerCase();
        
        if (!area.includes(filterLower) && !city.includes(filterLower) && !location.includes(filterLower)) {
          return false;
        }
      }
      
      // Type filter
      if (filterType && filterType !== 'all') {
        if (property.type !== filterType && property.category !== filterType) {
          return false;
        }
      }
      
      // Price filter
      if (filterPriceMin !== undefined && property.price < filterPriceMin) {
        return false;
      }
      if (filterPriceMax !== undefined && property.price > filterPriceMax) {
        return false;
      }
      
      return true;
    });
  }, [properties, filterLocation, filterType, filterPriceMin, filterPriceMax]);

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

        // Custom marker icons based on property type
        const getMarkerIcon = (propertyType: string) => {
          const colorMap: Record<string, string> = {
            'villa': '#00FF66', // Primary green
            'apartment': '#3B82F6', // Blue
            'house': '#F59E0B', // Orange
            'land': '#10B981', // Green
            'motorcycle': '#EF4444', // Red
            'scooter': '#EF4444',
            'car': '#6366F1', // Indigo
            'suv': '#6366F1',
          };
          
          const color = colorMap[propertyType.toLowerCase()] || '#00FF66';
          
          return L.divIcon({
            html: `<div style="
              background-color: ${color};
              width: 32px;
              height: 32px;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: 3px solid white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <div style="
                transform: rotate(45deg);
                color: white;
                font-size: 14px;
                font-weight: bold;
              ">${propertyType === 'villa' ? '🏠' : propertyType === 'apartment' ? '🏢' : propertyType === 'land' ? '🏞️' : '📍'}</div>
            </div>`,
            className: 'custom-marker',
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });
        };

        // Initialize map centered on Bali
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = L.map(mapRef.current!, {
            center: [BALI_CENTER.lat, BALI_CENTER.lng],
            zoom: BALI_CENTER.zoom,
            zoomControl: true,
          });

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(mapInstanceRef.current);
          
          setMapLoaded(true);
        }

        // Clear existing markers
        markersRef.current.forEach(marker => {
          mapInstanceRef.current.removeLayer(marker);
        });
        markersRef.current = [];

        // Add markers for each property
        const validProperties = filteredProperties.filter(p => {
          const coords = getPropertyCoordinates(p);
          return coords !== null;
        });
        
        if (validProperties.length > 0) {
          validProperties.forEach((property) => {
            const coords = getPropertyCoordinates(property);
            
            if (coords) {
              const marker = L.marker([coords.lat, coords.lng], {
                icon: getMarkerIcon(property.type || property.category || 'villa'),
              }).addTo(mapInstanceRef.current);

              const formatPrice = (price: number) => {
                if (price >= 1000000000) {
                  return `Rp ${(price / 1000000000).toFixed(1)}B`;
                } else if (price >= 1000000) {
                  return `Rp ${(price / 1000000).toFixed(0)}M`;
                }
                return `Rp ${price.toLocaleString('id-ID')}`;
              };

              const mainImage = property.images && property.images.length > 0 
                ? property.images[0] 
                : '/placeholder.jpg';

              const popupContent = `
                <div style="color: #000; min-width: 250px; max-width: 300px;">
                  ${mainImage !== '/placeholder.jpg' ? `
                    <img 
                      src="${mainImage}" 
                      alt="${property.title}" 
                      style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;"
                      onerror="this.src='/placeholder.jpg'"
                    />
                  ` : ''}
                  <h3 style="font-weight: bold; margin-bottom: 8px; font-size: 16px; line-height: 1.4;">${property.title}</h3>
                  <p style="margin-bottom: 4px; color: #666; font-size: 14px;">
                    📍 ${property.location?.area || ''}${property.location?.city ? `, ${property.location.city}` : ''}
                  </p>
                  ${property.details?.bedrooms ? `
                    <p style="margin-bottom: 4px; color: #666; font-size: 13px;">
                      🛏️ ${property.details.bedrooms} bed${property.details.bathrooms ? ` • 🛁 ${property.details.bathrooms} bath` : ''}
                    </p>
                  ` : ''}
                  <p style="color: #00FF66; font-weight: bold; margin-bottom: 12px; font-size: 18px;">
                    ${formatPrice(property.price)}
                    ${property.listingType === "rent" ? "/mo" : ""}
                  </p>
                  <a 
                    href="/property/${property.id}" 
                    style="
                      display: inline-block;
                      background-color: #00FF66;
                      color: #000;
                      padding: 8px 16px;
                      border-radius: 6px;
                      text-decoration: none;
                      font-weight: bold;
                      font-size: 14px;
                      transition: background-color 0.2s;
                    "
                    onmouseover="this.style.backgroundColor='#00CC52'"
                    onmouseout="this.style.backgroundColor='#00FF66'"
                  >
                    View Details →
                  </a>
                </div>
              `;

              marker.bindPopup(popupContent);

              // Handle marker click
              marker.on('click', () => {
                if (onPropertyClick) {
                  onPropertyClick(property);
                }
              });

              markersRef.current.push(marker);
            }
          });

          // Fit map to show all markers with padding
          if (markersRef.current.length > 0) {
            const group = new L.FeatureGroup(markersRef.current);
            mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1), {
              maxZoom: 16,
            });
          } else {
            // No markers, center on Bali
            mapInstanceRef.current.setView([BALI_CENTER.lat, BALI_CENTER.lng], BALI_CENTER.zoom);
          }
        } else {
          // No valid properties, center on Bali
          mapInstanceRef.current.setView([BALI_CENTER.lat, BALI_CENTER.lng], BALI_CENTER.zoom);
        }
      } catch (error) {
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
  }, [filteredProperties, onPropertyClick]);

  return (
    <div 
      ref={mapRef} 
      className="h-[70vh] w-full rounded-2xl bg-dark-100 border border-dark-300 overflow-hidden"
      style={{ zIndex: 1 }}
    />
  );
}
