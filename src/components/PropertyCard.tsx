"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, Bed, Bath, Square, Clock } from "lucide-react";
import { Property } from "@/types";
import { motion } from "framer-motion";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [liked, setLiked] = useState(false);

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `Rp ${(price / 1000000000).toFixed(1)}B`;
    } else if (price >= 1000000) {
      return `Rp ${(price / 1000000).toFixed(0)}M`;
    }
    return `Rp ${price.toLocaleString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="card group cursor-pointer relative"
    >
      <Link href={`/property/${property.id}`}>
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          <Image
            src={property.images[0]}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="badge bg-primary text-black">
              {property.listingType === "sale" ? "FOR SALE" : "FOR RENT"}
            </span>
            {property.shortTermBooking?.available && (
              <span className="badge glass text-white">
                SHORT-TERM
              </span>
            )}
            {property.source === "agent" && (
              <span className="badge bg-blue-500 text-white">
                AGENT
              </span>
            )}
          </div>

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setLiked(!liked);
            }}
            className="absolute top-4 right-4 p-2 glass rounded-full hover:bg-white/20 transition-colors"
          >
            <Heart 
              className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : "text-white"}`} 
            />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-4 px-2 py-1 glass rounded-lg text-xs">
            {property.images.length} photos
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="mb-2">
            <p className="text-2xl font-bold text-primary">
              {formatPrice(property.price)}
              {property.listingType === "rent" && (
                <span className="text-sm text-gray-400">/mo</span>
              )}
            </p>
            {property.shortTermBooking && (
              <p className="text-sm text-gray-400">
                {formatPrice(property.shortTermBooking.pricePerNight)}/night
              </p>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-400 mb-3">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{property.location.area}, {property.location.city}</span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-4 text-gray-400">
            {property.details.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span className="text-sm">{property.details.bedrooms} BD</span>
              </div>
            )}
            {property.details.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span className="text-sm">{property.details.bathrooms} BA</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span className="text-sm">{property.details.area} m²</span>
            </div>
            {property.details.floors && (
              <div className="flex items-center gap-1 text-xs">
                Floor {property.details.floors}
              </div>
            )}
          </div>

          {/* Footer */}
          {property.verified && (
            <div className="mt-3 pt-3 border-t border-dark-300 flex items-center justify-between">
              <span className="text-xs text-green-500">✓ Verified</span>
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {Math.floor((Date.now() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
              </span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
