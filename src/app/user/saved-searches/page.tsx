"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthSafe } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Bookmark, Trash2, Bell, BellOff, Search } from "lucide-react";
import { SavedSearch } from "@/types";

export default function SavedSearchesPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthSafe();
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    fetchSearches();
  }, []);

  const fetchSearches = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/saved-searches");
      if (response.ok) {
        const data = await response.json();
        setSearches(data.searches || []);
      }
    } catch (error) {
      console.error("Failed to fetch saved searches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSearch = async (id: string) => {
    try {
      await fetch(`/api/saved-searches/${id}`, { method: "DELETE" });
      fetchSearches();
    } catch (error) {
      console.error("Failed to delete search:", error);
    }
  };

  const runSearch = (search: SavedSearch) => {
    const params = new URLSearchParams();
    const filters = search.filters;

    if (filters.query) params.append("query", filters.query);
    if (filters.listingType) params.append("listingType", filters.listingType);
    if (filters.location) params.append("area", filters.location);
    if (filters.priceMin) params.append("priceMin", filters.priceMin.toString());
    if (filters.priceMax) params.append("priceMax", filters.priceMax.toString());
    if (filters.bedrooms) params.append("bedrooms", filters.bedrooms.toString());

    router.push(`/properties?${params.toString()}`);
  };

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-20">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Saved Searches</h1>
          <p className="text-gray-400">Quick access to your favorite property searches</p>
        </div>

        {/* Searches */}
        {isLoading ? (
          <div className="text-center py-20">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          </div>
        ) : searches.length === 0 ? (
          <div className="text-center py-20">
            <Bookmark className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No saved searches yet</h3>
            <p className="text-gray-400 mb-6">
              Save your property searches for quick access later!
            </p>
            <button onClick={() => router.push("/properties")} className="btn-primary">
              Browse Properties
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {searches.map((search) => (
              <div key={search.id} className="bg-dark-100 rounded-xl p-6 border border-dark-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                      <Bookmark className="h-5 w-5 text-primary" />
                      {search.name}
                    </h3>

                    {/* Filter Summary */}
                    <div className="flex flex-wrap gap-2">
                      {search.filters.listingType && (
                        <span className="px-3 py-1 bg-dark-200 rounded-full text-sm">
                          {search.filters.listingType === "sale" ? "For Sale" : "For Rent"}
                        </span>
                      )}
                      {search.filters.location && (
                        <span className="px-3 py-1 bg-dark-200 rounded-full text-sm">
                          📍 {search.filters.location}
                        </span>
                      )}
                      {search.filters.priceMin && (
                        <span className="px-3 py-1 bg-dark-200 rounded-full text-sm">
                          Min: Rp {search.filters.priceMin.toLocaleString()}
                        </span>
                      )}
                      {search.filters.priceMax && (
                        <span className="px-3 py-1 bg-dark-200 rounded-full text-sm">
                          Max: Rp {search.filters.priceMax.toLocaleString()}
                        </span>
                      )}
                      {search.filters.bedrooms && (
                        <span className="px-3 py-1 bg-dark-200 rounded-full text-sm">
                          🛏️ {search.filters.bedrooms}+ beds
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => runSearch(search)}
                      className="p-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
                      title="Run search"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => deleteSearch(search.id)}
                      className="p-2 bg-dark-200 hover:bg-dark-300 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    {search.alertEnabled ? (
                      <>
                        <Bell className="h-4 w-4 text-primary" />
                        <span>Alerts: {search.alertFrequency}</span>
                      </>
                    ) : (
                      <>
                        <BellOff className="h-4 w-4" />
                        <span>Alerts disabled</span>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    Saved: {new Date(search.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
