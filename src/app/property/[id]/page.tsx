"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PropertyErrorBoundary } from "@/components/ErrorBoundary";
import { useProperty } from "@/hooks/useProperties";
import { MapPin, Bed, Bath, Square, Calendar, Phone, Mail, MessageCircle, Heart, Share2, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

// Dynamically import MapComponent to avoid SSR issues with Leaflet
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-dark-100 rounded-2xl flex items-center justify-center">
      <p className="text-gray-400">Loading map...</p>
    </div>
  ),
});

export default function PropertyDetailPage() {
  const params = useParams();
  const { property, loading, error } = useProperty(params.id as string);
  const [liked, setLiked] = useState(false);

  // Increment view count when property is loaded
  useEffect(() => {
    if (property?.id) {
      // Increment view count
      fetch(`/api/properties/${property.id}/increment-view`, {
        method: 'POST',
      }).catch((err) => {
        // Silently fail - view counting is not critical
        if (process.env.NODE_ENV === 'development') {
          console.error('Failed to increment view count:', err);
        }
      });
    }
  }, [property?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-20 text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading property...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Property Not Found</h1>
          <p className="text-gray-400 mb-8">{error || "The property you're looking for doesn't exist."}</p>
          <Link href="/" className="btn-primary">
            Go Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price >= 1000000000) {
      return `Rp ${(price / 1000000000).toFixed(1)}B`;
    } else if (price >= 1000000) {
      return `Rp ${(price / 1000000).toFixed(0)}M`;
    }
    return `Rp ${price.toLocaleString()}`;
  };

  const featuresList = property.features 
    ? Object.entries(property.features)
        .filter(([_, value]) => value === true)
        .map(([key, _]) => key)
    : [];

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <PropertyErrorBoundary>
        <main className="pt-16">
        {/* Image Gallery */}
        <section className="relative h-[60vh] md:h-[70vh]">
          <div className="relative w-full h-full">
            <Image
              src={property.images && property.images.length > 0 ? property.images[0] : "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800"}
              alt={property.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          {/* Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className="p-3 glass rounded-full hover:bg-white/20 transition-colors"
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : "text-white"}`} />
            </button>
            <button className="p-3 glass rounded-full hover:bg-white/20 transition-colors">
              <Share2 className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute bottom-4 left-4 flex gap-2">
            <span className="badge bg-primary text-black">
              {property.listingType === "sale" ? "FOR SALE" : "FOR RENT"}
            </span>
            {property.verified && (
              <span className="badge glass text-white flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />
                Verified
              </span>
            )}
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Title & Price */}
              <div className="mb-6">
                <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-gray-400 mb-4">
                  <MapPin className="h-5 w-5" />
                  <span>{property.location.address}, {property.location.area}, {property.location.city}</span>
                </div>
                <p className="text-3xl font-bold text-primary mb-2">
                  {formatPrice(property.price)}
                  {property.listingType === "rent" && <span className="text-lg text-gray-400">/mo</span>}
                </p>
                {property.shortTermBooking && (
                  <p className="text-lg text-gray-400">
                    Short-term: {formatPrice(property.shortTermBooking.pricePerNight)}/night
                  </p>
                )}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 p-6 bg-dark-100 rounded-2xl">
                {property.details.bedrooms && (
                  <div className="flex items-center gap-2">
                    <Bed className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-400">Bedrooms</p>
                      <p className="font-semibold">{property.details.bedrooms}</p>
                    </div>
                  </div>
                )}
                {property.details.bathrooms && (
                  <div className="flex items-center gap-2">
                    <Bath className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-400">Bathrooms</p>
                      <p className="font-semibold">{property.details.bathrooms}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Square className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-gray-400">Area</p>
                    <p className="font-semibold">{property.details.area} m²</p>
                  </div>
                </div>
                {property.details.yearBuilt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-gray-400">Year Built</p>
                      <p className="font-semibold">{property.details.yearBuilt}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-300 leading-relaxed">{property.description}</p>
              </div>

              {/* Features */}
              {featuresList.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Features</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {featuresList.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 p-3 bg-dark-100 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        <span className="text-sm capitalize">{feature.replace(/([A-Z])/g, ' $1').trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Map */}
              {property.location.coordinates && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Location</h2>
                  <div className="h-96 rounded-2xl overflow-hidden">
                    <MapComponent
                      properties={[property]}
                      center={property.location.coordinates}
                      zoom={15}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Contact */}
            <div className="lg:col-span-1">
              <div className="sticky top-20">
                <div className="bg-dark-100 rounded-2xl p-6 mb-6">
                  <h3 className="text-xl font-bold mb-4">Contact Agent</h3>
                  <div className="mb-4">
                    <p className="font-semibold">{property.contact.name}</p>
                    {property.source === "agent" && (
                      <p className="text-sm text-gray-400">Verified Agent</p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <a
                      href={`tel:${property.contact.phone}`}
                      className="btn-primary w-full flex items-center justify-center gap-2"
                    >
                      <Phone className="h-4 w-4" />
                      Call Now
                    </a>
                    <a
                      href={`mailto:${property.contact.email}`}
                      className="btn-secondary w-full flex items-center justify-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </a>
                    <a
                      href="https://wa.me/306989273327"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition-colors w-full flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="bg-dark-100 rounded-2xl p-6">
                  <h3 className="text-xl font-bold mb-4">Property Stats</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Views</span>
                      <span className="font-semibold">{property.views}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Favorites</span>
                      <span className="font-semibold">{property.favorites}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Listed</span>
                      <span className="font-semibold">
                        {Math.floor((Date.now() - new Date(property.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </PropertyErrorBoundary>

      <Footer />
    </div>
  );
}

