'use client';

import { useMotorcycles } from '@/hooks/useMotorcycles';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Search, Filter, Bike, Clock, TrendingUp, AlertCircle, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Motorcycle } from '@/types/motorcycle';

export default function RentMotorbikePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<'scooter' | 'motorcycle' | 'car' | 'all'>('all');
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");

  // Fetch motorcycles directly from motorcycles table
  // Explicitly request only available motorcycles for public page
  const { data: motorcycles, isLoading, error, refetch } = useMotorcycles({
    available: true,
    sortBy: 'newest',
  });

  // Debug logs
  useEffect(() => {
    console.log('[RentMotorbikePage] State:', {
      isLoading,
      error: error?.message,
      motorcyclesCount: motorcycles?.length || 0,
      motorcycles: motorcycles,
    });
  }, [motorcycles, isLoading, error]);

  // Filter motorcycles client-side
  const filteredMotorcycles = (motorcycles || []).filter((moto: Motorcycle) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesTitle = moto.title?.toLowerCase().includes(query);
      const matchesDescription = moto.description?.toLowerCase().includes(query);
      const matchesCode = moto.system_code?.toLowerCase().includes(query);
      if (!matchesTitle && !matchesDescription && !matchesCode) return false;
    }

    // Type filter
    if (typeFilter !== 'all' && moto.type !== typeFilter) return false;

    // Location filter
    if (locationFilter !== 'all' && moto.location !== locationFilter) return false;

    // Price filter
    if (priceFilter !== "all") {
      const price = moto.price || 0;
      if (priceFilter === "0-100000" && price > 100000) return false;
      if (priceFilter === "100000-200000" && (price < 100000 || price > 200000)) return false;
      if (priceFilter === "200000+" && price < 200000) return false;
    }

    return true;
  });

  // Get unique locations for filter
  const locations = Array.from(new Set(motorcycles?.map((m: Motorcycle) => m.location).filter(Boolean) || []));

  // Calculate stats (motorcycles from RLS are already filtered as available)
  const stats = {
    available: motorcycles?.length || 0,
    scooters: motorcycles?.filter((m: Motorcycle) => m.type === 'scooter')?.length || 0,
    motorcycles: motorcycles?.filter((m: Motorcycle) => m.type === 'motorcycle')?.length || 0,
    cars: motorcycles?.filter((m: Motorcycle) => m.type === 'car')?.length || 0,
    minPrice: motorcycles && motorcycles.length > 0 
      ? Math.min(...motorcycles.map((m: Motorcycle) => m.price || 0))
      : 0,
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `Rp ${(price / 1000000).toFixed(1)}M`;
    }
    return `Rp ${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bike className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">Rent a Motorbike in Bali</h1>
          </div>
          <p className="text-gray-400 text-lg">Explore Bali on two wheels - Daily & weekly rentals available</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-dark-200 rounded-xl p-6 border border-dark-300">
            <div className="flex items-center gap-3 mb-2">
              <Bike className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold">{stats.available}</span>
            </div>
            <p className="text-gray-400">Available Bikes</p>
          </div>
          <div className="bg-dark-200 rounded-xl p-6 border border-dark-300">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold">24/7</span>
            </div>
            <p className="text-gray-400">Support</p>
          </div>
          <div className="bg-dark-200 rounded-xl p-6 border border-dark-300">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold">{formatPrice(stats.minPrice)}+</span>
            </div>
            <p className="text-gray-400">Per Day</p>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4 mb-4">
            <AlertCircle className="h-6 w-6 text-orange-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="font-semibold text-orange-400 mb-2">Coming Soon</h3>
              <p className="text-gray-300 text-sm mb-4">
                Motorbike rental service coming soon! Full booking system launching soon. 
                We're working on bringing you the best motorbike rental options in Bali. 
                Browse our available bikes below and stay tuned for updates!
              </p>
              <p className="text-gray-400 text-sm mb-4">
                Need to rent a motorbike or get more information? Contact us directly via WhatsApp!
              </p>
              <a
                href="https://wa.me/17423798954?text=Hi! I'm interested in renting a motorbike in Bali. Can you provide more information?"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                Contact Us on WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search motorbikes by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-200 border border-dark-300 rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-white placeholder-gray-500"
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg focus:border-primary focus:outline-none text-white"
            >
              <option value="all">All Types</option>
              <option value="scooter">Scooter</option>
              <option value="motorcycle">Motorcycle</option>
              <option value="car">Car</option>
            </select>

            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg focus:border-primary focus:outline-none text-white"
            >
              <option value="all">All Locations</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>

            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="px-4 py-2 bg-dark-200 border border-dark-300 rounded-lg focus:border-primary focus:outline-none text-white"
            >
              <option value="all">All Prices</option>
              <option value="0-100000">Rp 0 - 100K</option>
              <option value="100000-200000">Rp 100K - 200K</option>
              <option value="200000+">Rp 200K+</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-400">Loading motorbikes...</p>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
            <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-4" />
            <p className="text-red-400 mb-4">{error.message || 'Failed to load motorbikes'}</p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredMotorcycles.length === 0 && (
          <div className="text-center py-20">
            <Bike className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No motorbikes available</h3>
            <p className="text-gray-400 mb-2">
              {motorcycles && motorcycles.length > 0
                ? 'Try adjusting your search or filters'
                : 'No motorcycles found in the database'}
            </p>
            {motorcycles && motorcycles.length > 0 && (
              <p className="text-gray-500 text-sm mb-6">
                Showing {motorcycles.length} total, but none match your current filters
              </p>
            )}
            <button
              onClick={() => {
                setSearchQuery("");
                setTypeFilter('all');
                setPriceFilter('all');
                setLocationFilter('all');
              }}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Motorcycles Grid */}
        {!isLoading && !error && filteredMotorcycles.length > 0 && (
          <>
            <div className="mb-6">
              <p className="text-gray-400">
                Showing <span className="text-white font-semibold">{filteredMotorcycles.length}</span> motorbikes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMotorcycles.map((moto: Motorcycle) => (
                <Link
                  key={moto.id}
                  href={`/motorcycles/${moto.id}`}
                  className="group bg-dark-200 rounded-xl overflow-hidden border border-dark-300 hover:border-primary transition-all hover:shadow-lg hover:shadow-primary/10"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-dark-300 overflow-hidden">
                    {moto.images && moto.images.length > 0 ? (
                      <Image
                        src={moto.images[0]}
                        alt={moto.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Bike className="h-16 w-16 text-gray-600" />
                      </div>
                    )}
                    {moto.featured && (
                      <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                        {moto.title}
                      </h3>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                        {moto.type}
                      </span>
                    </div>

                    {moto.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {moto.description}
                      </p>
                    )}

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-primary">
                            {formatPrice(moto.price)}
                          </p>
                          <p className="text-xs text-gray-500">Per Day</p>
                        </div>
                      {moto.location && (
                        <p className="text-sm text-gray-400">{moto.location}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
