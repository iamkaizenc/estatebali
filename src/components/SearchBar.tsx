"use client";

import { useState } from "react";
import { Search, MapPin, Filter } from "lucide-react";
import { motion } from "framer-motion";

import { SearchFilters } from "@/types";

interface SearchBarProps {
  onSearch?: (filters: SearchFilters) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [activeTab, setActiveTab] = useState<"all" | "sale" | "rent">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterState, setFilterState] = useState({
    propertyType: "",
    bedrooms: "",
    priceMin: "",
    priceMax: "",
  });

  const handleSearch = () => {
    if (onSearch) {
      const filters: SearchFilters = {
        query: searchQuery || undefined,
        listingType: activeTab === "all" ? undefined : activeTab,
        propertyType: filterState.propertyType ? [filterState.propertyType as any] : undefined,
        bedrooms: filterState.bedrooms ? parseInt(filterState.bedrooms) : undefined,
        priceMin: filterState.priceMin ? parseInt(filterState.priceMin) : undefined,
        priceMax: filterState.priceMax ? parseInt(filterState.priceMax) : undefined,
        location: searchQuery || undefined,
      };
      onSearch(filters);
    }
  };

  return (
    <div className="w-full">
      {/* Tab Buttons */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            activeTab === "all"
              ? "bg-primary text-black"
              : "bg-dark-200 text-gray-400 hover:bg-dark-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setActiveTab("sale")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            activeTab === "sale"
              ? "bg-primary text-black"
              : "bg-dark-200 text-gray-400 hover:bg-dark-300"
          }`}
        >
          For Sale
        </button>
        <button
          onClick={() => setActiveTab("rent")}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            activeTab === "rent"
              ? "bg-primary text-black"
              : "bg-dark-200 text-gray-400 hover:bg-dark-300"
          }`}
        >
          For Rent
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <label htmlFor="search-query" className="sr-only">
            Search location or property
          </label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            id="search-query"
            name="search-query"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search location or property..."
            className="w-full pl-12 pr-24 py-3 bg-dark-200 rounded-xl border border-dark-300 focus:border-primary focus:outline-none transition-colors"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Search
          </button>
        </div>
        
        <button
          onClick={() => window.location.href = "/map"}
          className="p-3 bg-dark-200 rounded-xl hover:bg-dark-300 transition-colors"
          title="Map Search"
        >
          <MapPin className="h-5 w-5" />
        </button>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-3 bg-dark-200 rounded-xl hover:bg-dark-300 transition-colors"
          title="Filters"
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>

      {/* Quick Filters (Hidden by default) */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-dark-200 rounded-xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="filter-property-type" className="sr-only">
                Property Type
              </label>
              <select 
                id="filter-property-type"
                name="filter-property-type"
                className="input"
                value={filterState.propertyType}
                onChange={(e) => setFilterState({ ...filterState, propertyType: e.target.value })}
              >
                <option value="">Property Type</option>
                <option value="villa">Villa</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="land">Land</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="filter-bedrooms" className="sr-only">
                Bedrooms
              </label>
              <select 
                id="filter-bedrooms"
                name="filter-bedrooms"
                className="input"
                value={filterState.bedrooms}
                onChange={(e) => setFilterState({ ...filterState, bedrooms: e.target.value })}
              >
                <option value="">Bedrooms</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="filter-price-min" className="sr-only">
                Minimum Price
              </label>
              <select 
                id="filter-price-min"
                name="filter-price-min"
                className="input"
                value={filterState.priceMin}
                onChange={(e) => setFilterState({ ...filterState, priceMin: e.target.value })}
              >
                <option value="">Min Price</option>
                <option value="1000000000">1B+</option>
                <option value="5000000000">5B+</option>
                <option value="10000000000">10B+</option>
                <option value="20000000000">20B+</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="filter-price-max" className="sr-only">
                Maximum Price
              </label>
              <select 
                id="filter-price-max"
                name="filter-price-max"
                className="input"
                value={filterState.priceMax}
                onChange={(e) => setFilterState({ ...filterState, priceMax: e.target.value })}
              >
                <option value="">Max Price</option>
                <option value="5000000000">5B</option>
                <option value="10000000000">10B</option>
                <option value="20000000000">20B</option>
                <option value="50000000000">50B</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => {
                setFilterState({ propertyType: "", bedrooms: "", priceMin: "", priceMax: "" });
                setSearchQuery("");
                if (onSearch) {
                  onSearch({});
                }
              }}
              className="px-4 py-2 bg-dark-300 hover:bg-dark-400 rounded-lg transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleSearch}
              className="btn-primary"
            >
              Apply Filters
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
