"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { useProperties } from "@/hooks/useProperties";
import { Bike, Clock, Shield, TrendingUp, Search, Filter, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function RentMotorbikePage() {
  // Fetch all rent properties, then filter for motorcycles client-side
  const { properties: allRentProperties, loading, error } = useProperties({ 
    listingType: "rent",
    propertyType: ['motorcycle'] as any // Filter by category
  });
  
  // Additional client-side filtering for motorcycles
  // Database uses 'motorcycle' but we also check for 'motorbike' and 'scooter' variations
  const motorbikes = (allRentProperties || []).filter((p: any) => {
    const category = (p as any).category || p.type;
    return category === 'motorcycle' || category === 'motorbike' || category === 'scooter';
  });
  
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  // Filter motorbikes client-side
  const filteredMotorbikes = motorbikes.filter(bike => {
    const matchesSearch = !searchQuery || 
      bike.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bike.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPrice = priceFilter === "all" || 
      (priceFilter === "low" && bike.price < 75000) ||
      (priceFilter === "mid" && bike.price >= 75000 && bike.price < 150000) ||
      (priceFilter === "high" && bike.price >= 150000);
    
    return matchesSearch && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Bike className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Rent a Motorbike in Bali</h1>
              <p className="text-gray-400">Explore Bali on two wheels - Daily & weekly rentals available</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 bg-gradient-to-br from-dark-100 to-dark-200 border border-dark-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <Bike className="h-6 w-6 text-primary" />
              <div>
                <div className="text-2xl font-bold text-white">{filteredMotorbikes.length}</div>
                <div className="text-sm text-gray-400">Available Bikes</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card p-6 bg-gradient-to-br from-dark-100 to-dark-200 border border-dark-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <Clock className="h-6 w-6 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-400">Support</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="card p-6 bg-gradient-to-br from-dark-100 to-dark-200 border border-dark-300"
          >
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-6 w-6 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-white">IDR 50K+</div>
                <div className="text-sm text-gray-400">Per Day</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Coming Soon Notice */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="card p-6 mb-8 bg-orange-500/10 border-2 border-orange-500/30"
        >
          <div className="flex items-start gap-4">
            <div className="p-2 bg-orange-500/20 rounded-lg flex-shrink-0">
              <Shield className="h-6 w-6 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-400 mb-2">🚧 Coming Soon</h3>
              <p className="text-gray-300 mb-2">
                Motorbike rental service coming soon! Full booking system launching soon.
              </p>
              <p className="text-sm text-gray-400">
                We're working on bringing you the best motorbike rental options in Bali. 
                Browse our available bikes below and stay tuned for updates!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search motorbikes by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white placeholder-gray-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="pl-12 pr-10 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white appearance-none"
            >
              <option value="all" className="bg-dark-200">All Prices</option>
              <option value="low" className="bg-dark-200">Under IDR 75K</option>
              <option value="mid" className="bg-dark-200">IDR 75K - 150K</option>
              <option value="high" className="bg-dark-200">Above IDR 150K</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Motorbikes List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading motorbikes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{error}</p>
          </div>
        ) : filteredMotorbikes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMotorbikes.map((bike, index) => (
              <motion.div
                key={bike.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <PropertyCard property={bike} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <Bike className="h-16 w-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold mb-2">No motorbikes available</h3>
            <p className="text-gray-400">
              {searchQuery || priceFilter !== "all"
                ? "Try adjusting your search or filters"
                : "No motorbikes available at the moment. Check back soon!"}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

