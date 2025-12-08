"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedUserRoute } from "@/components/ProtectedUserRoute";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import LoadingState, { PropertyGridSkeleton } from "@/components/LoadingState";
import { Property } from "@/types";
import { Heart } from "lucide-react";
import Link from "next/link";

function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token');
        const response = await fetch("/api/favorites", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.success) {
          // Transform favorites data to Property format
          // Use correct schema: location (not address), type (listing type), category (property type)
          const properties = result.data.map((fav: any) => {
            const prop = fav.properties;
            if (!prop) return null;
            
            // Use location field (not address) - location contains full address string
            const locationString = prop.location || "";
            const area = prop.area || "";
            // Try to extract city from location if available, otherwise use area
            const city = locationString.split(",")[0]?.trim() || area || "";
            
            // Map category to type (property type)
            // Database: category = property type, type = listing type
            // Frontend: type = property type, listingType = listing type
            const propertyType = prop.category || prop.type || "villa";
            const listingType = prop.type === 'sale' || prop.type === 'rent' ? prop.type : 'rent';
            
            return {
              id: prop.id,
              title: prop.title,
              type: propertyType as any,
              listingType: listingType as any,
              price: prop.price || 0,
              location: {
                area: area,
                city: city,
                address: locationString,
              },
              details: {
                bedrooms: 0,
                bathrooms: 0,
                area: 0,
              },
              images: prop.images || [],
              featured: prop.featured || false,
              verified: prop.verified || false,
              available: prop.available !== undefined ? prop.available : true,
            } as Property;
          }).filter(Boolean); // Remove any null entries
          setFavorites(properties);
        } else {
          setError(result.error || "Failed to fetch favorites");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch favorites");
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const handleRemoveFavorite = async (propertyId: string) => {
    try {
      const token = localStorage.getItem('auth_token') || localStorage.getItem('admin_token');
      const response = await fetch(`/api/favorites/property/${propertyId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        // Remove from local state
        setFavorites(favorites.filter(fav => fav.id !== propertyId));
      } else {
        alert(result.error || "Failed to remove favorite");
      }
    } catch (err: any) {
      alert(err.message || "Failed to remove favorite");
    }
  };

  return (
    <ProtectedUserRoute>
      <div className="min-h-screen bg-black">
        <Header />

        <main className="container mx-auto px-4 pt-24 pb-20">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary fill-primary" />
              My Favorites
            </h1>
            <p className="text-gray-400">Properties you've saved</p>
          </div>

          {loading ? (
            <PropertyGridSkeleton count={6} />
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400 mb-4">{error}</p>
              <Link href="/properties" className="btn-primary">
                Browse Properties
              </Link>
            </div>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((property) => (
                <div key={property.id} className="relative">
                  <PropertyCard property={property} />
                  <button
                    onClick={() => handleRemoveFavorite(property.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500/90 hover:bg-red-500 rounded-lg transition-colors"
                    title="Remove from favorites"
                  >
                    <Heart className="h-4 w-4 text-white fill-white" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 card">
              <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
              <p className="text-gray-400 mb-6">Start exploring and save your favorite properties</p>
              <Link href="/properties" className="btn-primary">
                Browse Properties
              </Link>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </ProtectedUserRoute>
  );
}

export default function FavoritesPageWrapper() {
  return (
    <ProtectedUserRoute>
      <FavoritesPage />
    </ProtectedUserRoute>
  );
}

