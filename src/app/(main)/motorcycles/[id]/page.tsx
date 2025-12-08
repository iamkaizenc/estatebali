'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Motorcycle } from '@/types/motorcycle';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Bike, MapPin, Calendar, Fuel, Settings, Shield, Phone, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function MotorcycleDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarMotorcycles, setSimilarMotorcycles] = useState<Motorcycle[]>([]);

  useEffect(() => {
    if (id) {
      fetchMotorcycle();
    }
  }, [id]);

  const fetchMotorcycle = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch motorcycle using API route instead of direct Supabase client
      const response = await fetch(`/api/motorcycles/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch motorcycle: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch motorcycle');
      }
      
      const data = result.data;
      setMotorcycle(data as Motorcycle);

      // Fetch similar motorcycles (same type, different id) using API route
      if (data && data.type) {
        try {
          const similarResponse = await fetch(`/api/motorcycles?type=${data.type}&available=true`);
          if (similarResponse.ok) {
            const similarResult = await similarResponse.json();
            if (similarResult.success) {
              // Filter out current motorcycle and limit to 4
              const similar = (similarResult.data || [])
                .filter((m: Motorcycle) => m.id !== id)
                .slice(0, 4);
              setSimilarMotorcycles(similar);
            }
          }
        } catch (err) {
          console.error('Error fetching similar motorcycles:', err);
          // Don't set error state for similar motorcycles - it's not critical
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load motorcycle');
      console.error('Error fetching motorcycle:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `Rp ${(price / 1000000).toFixed(1)}M`;
    }
    return `Rp ${price.toLocaleString()}`;
  };

  const nextImage = () => {
    if (motorcycle?.images && motorcycle.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % motorcycle.images.length);
    }
  };

  const prevImage = () => {
    if (motorcycle?.images && motorcycle.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + motorcycle.images.length) % motorcycle.images.length);
    }
  };

  const whatsappLink = motorcycle?.contact_whatsapp
    ? `https://wa.me/${motorcycle.contact_whatsapp.replace(/[^0-9]/g, '')}?text=Hi! I am interested in ${motorcycle.title}`
    : 'https://wa.me/17423798954?text=Hi! I am interested in renting a motorcycle';

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-20">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !motorcycle) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="container mx-auto px-4 pt-24 pb-20">
          <div className="text-center py-20">
            <Bike className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Motorcycle Not Found</h2>
            <p className="text-gray-400 mb-6">{error || 'The motorcycle you are looking for does not exist.'}</p>
            <Link
              href="/rent-motorbike"
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors inline-block"
            >
              Browse All Motorcycles
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* Back Button */}
        <Link
          href="/rent-motorbike"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-primary mb-6 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Motorcycles
        </Link>

        {/* Image Gallery */}
        {motorcycle.images && motorcycle.images.length > 0 && (
          <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden mb-8 bg-dark-200">
            <Image
              src={motorcycle.images[currentImageIndex]}
              alt={motorcycle.title}
              fill
              className="object-cover"
              unoptimized
            />
            {motorcycle.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {motorcycle.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`h-2 rounded-full transition-all ${
                        idx === currentImageIndex ? 'w-8 bg-primary' : 'w-2 bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Price */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">{motorcycle.title}</h1>
                  <div className="flex items-center gap-4 text-gray-400">
                    {motorcycle.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{motorcycle.location}</span>
                      </div>
                    )}
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm">
                      {motorcycle.type}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary">{formatPrice(motorcycle.price)}</p>
                  <p className="text-sm text-gray-400">Per Day</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {motorcycle.description && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {motorcycle.description}
                </p>
              </div>
            )}

            {/* Specifications */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Specifications</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {motorcycle.type && (
                  <div className="bg-dark-200 rounded-lg p-4 border border-dark-300">
                    <Bike className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm text-gray-400">Type</p>
                    <p className="font-semibold capitalize">{motorcycle.type}</p>
                  </div>
                )}
                {motorcycle.brand && (
                  <div className="bg-dark-200 rounded-lg p-4 border border-dark-300">
                    <Bike className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm text-gray-400">Brand</p>
                    <p className="font-semibold">{motorcycle.brand}</p>
                  </div>
                )}
                {motorcycle.model && (
                  <div className="bg-dark-200 rounded-lg p-4 border border-dark-300">
                    <Bike className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm text-gray-400">Model</p>
                    <p className="font-semibold">{motorcycle.model}</p>
                  </div>
                )}
                {motorcycle.cc && (
                  <div className="bg-dark-200 rounded-lg p-4 border border-dark-300">
                    <Settings className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm text-gray-400">Engine</p>
                    <p className="font-semibold">{motorcycle.cc} CC</p>
                  </div>
                )}
                {motorcycle.transmission && (
                  <div className="bg-dark-200 rounded-lg p-4 border border-dark-300">
                    <Settings className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm text-gray-400">Transmission</p>
                    <p className="font-semibold capitalize">{motorcycle.transmission}</p>
                  </div>
                )}
                {motorcycle.fuel_type && (
                  <div className="bg-dark-200 rounded-lg p-4 border border-dark-300">
                    <Fuel className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm text-gray-400">Fuel Type</p>
                    <p className="font-semibold capitalize">{motorcycle.fuel_type}</p>
                  </div>
                )}
                {motorcycle.year && (
                  <div className="bg-dark-200 rounded-lg p-4 border border-dark-300">
                    <Calendar className="h-5 w-5 text-primary mb-2" />
                    <p className="text-sm text-gray-400">Year</p>
                    <p className="font-semibold">{motorcycle.year}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {motorcycle.features && motorcycle.features.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Features</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {motorcycle.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-gray-300">
                      <Shield className="h-4 w-4 text-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Included */}
            <div>
              <h2 className="text-xl font-semibold mb-4">What's Included</h2>
              <div className="space-y-2">
                {motorcycle.insurance_included && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Insurance Included</span>
                  </div>
                )}
                {motorcycle.helmet_included && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Helmet Included</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-dark-200 rounded-xl p-6 border border-dark-300 sticky top-24">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-primary mb-2">{formatPrice(motorcycle.price)}</h3>
                <p className="text-gray-400">Per Day</p>
                {motorcycle.weekly_price && (
                  <p className="text-gray-300 mt-2">
                    Weekly: <span className="font-semibold">{formatPrice(motorcycle.weekly_price)}</span>
                  </p>
                )}
                {motorcycle.monthly_price && (
                  <p className="text-gray-300">
                    Monthly: <span className="font-semibold">{formatPrice(motorcycle.monthly_price)}</span>
                  </p>
                )}
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors mb-4"
              >
                <Phone className="h-5 w-5" />
                Contact via WhatsApp
              </a>

              {motorcycle.deposit_required && (
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-300">
                    <span className="font-semibold">Deposit Required:</span>{' '}
                    {formatPrice(motorcycle.deposit_required)}
                  </p>
                </div>
              )}

              {motorcycle.min_rental_days && (
                <div className="text-sm text-gray-400">
                  <p>Minimum Rental: {motorcycle.min_rental_days} day(s)</p>
                  {motorcycle.max_rental_days && (
                    <p>Maximum Rental: {motorcycle.max_rental_days} day(s)</p>
                  )}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-dark-300">
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <MapPin className="h-4 w-4" />
                  <span>Pickup Location</span>
                </div>
                <p className="text-white">{motorcycle.location || 'Canggu, Bali'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Motorcycles */}
        {similarMotorcycles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar Motorcycles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarMotorcycles.map((moto) => (
                <Link
                  key={moto.id}
                  href={`/motorcycles/${moto.id}`}
                  className="bg-dark-200 rounded-xl overflow-hidden border border-dark-300 hover:border-primary transition-all group"
                >
                  {moto.images && moto.images.length > 0 && (
                    <div className="relative h-48 bg-dark-300">
                      <Image
                        src={moto.images[0]}
                        alt={moto.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-primary transition-colors mb-2">
                      {moto.title}
                    </h3>
                    <p className="text-primary font-bold">{formatPrice(moto.price)}</p>
                    <p className="text-xs text-gray-400">Per Day</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

