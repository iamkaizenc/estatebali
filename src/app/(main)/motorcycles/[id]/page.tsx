'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, Calendar, Fuel, Gauge, Shield, 
  ChevronLeft, Phone, MessageCircle, Eye,
  Star, CheckCircle
} from 'lucide-react';
import { Motorcycle } from '@/types/motorcycle';

export default function MotorcycleDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchMotorcycle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/motorcycles/${id}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch motorcycle');
        }

        setMotorcycle(result.data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load motorcycle');
        console.error('Error fetching motorcycle:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMotorcycle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-20">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading motorcycle details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !motorcycle) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 pt-24 pb-20">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <p className="text-red-400 mb-4">{error || 'Motorcycle not found'}</p>
              <Link
                href="/rent-motorbike"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                Back to Motorcycles
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `Rp ${price.toLocaleString('id-ID')}`;
  };

  const whatsappMessage = `Hi! I'm interested in renting ${motorcycle.title} (${motorcycle.system_code}). Can you provide more information?`;
  const whatsappUrl = motorcycle.contact_whatsapp
    ? `https://wa.me/${motorcycle.contact_whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`
    : 'https://wa.me/17423798954?text=' + encodeURIComponent(whatsappMessage);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-20">
        {/* Back Button */}
        <Link
          href="/rent-motorbike"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Motorcycles
        </Link>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-dark-200 border border-dark-300">
              {motorcycle.images && motorcycle.images.length > 0 ? (
                <Image
                  src={motorcycle.images[selectedImage]}
                  alt={motorcycle.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail Gallery */}
            {motorcycle.images && motorcycle.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {motorcycle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-dark-300 hover:border-gray-500'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${motorcycle.title} ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm font-medium">
                      {motorcycle.system_code}
                    </span>
                    {motorcycle.featured && (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm font-medium flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400" />
                        Featured
                      </span>
                    )}
                    {motorcycle.available && (
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Available
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl font-bold mb-2">{motorcycle.title}</h1>
                  <div className="flex items-center gap-2 text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{motorcycle.location}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-dark-200 rounded-xl p-6 border border-dark-300">
              <div className="text-sm text-gray-400 mb-1">Price</div>
              <div className="text-3xl font-bold text-primary mb-4">
                {formatPrice(motorcycle.price)}/day
              </div>
              
              {(motorcycle.weekly_price || motorcycle.monthly_price) && (
                <div className="space-y-2 pt-4 border-t border-dark-300">
                  {motorcycle.weekly_price && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Weekly</span>
                      <span className="font-medium">{formatPrice(motorcycle.weekly_price)}</span>
                    </div>
                  )}
                  {motorcycle.monthly_price && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Monthly</span>
                      <span className="font-medium">{formatPrice(motorcycle.monthly_price)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Contact Buttons */}
            <div className="flex gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors font-medium"
              >
                <MessageCircle className="h-5 w-5" />
                Contact via WhatsApp
              </a>
              {motorcycle.contact_whatsapp && (
                <a
                  href={`tel:${motorcycle.contact_whatsapp}`}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-dark-200 border border-dark-300 rounded-xl hover:bg-dark-300 transition-colors"
                >
                  <Phone className="h-5 w-5" />
                </a>
              )}
            </div>

            {/* Specifications */}
            <div className="bg-dark-200 rounded-xl p-6 border border-dark-300">
              <h2 className="text-xl font-bold mb-4">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                {motorcycle.type && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Type</div>
                    <div className="font-medium capitalize">{motorcycle.type}</div>
                  </div>
                )}
                {motorcycle.brand && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Brand</div>
                    <div className="font-medium">{motorcycle.brand}</div>
                  </div>
                )}
                {motorcycle.model && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Model</div>
                    <div className="font-medium">{motorcycle.model}</div>
                  </div>
                )}
                {motorcycle.year && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Year</div>
                    <div className="font-medium">{motorcycle.year}</div>
                  </div>
                )}
                {motorcycle.cc && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                      <Gauge className="h-3 w-3" />
                      Engine
                    </div>
                    <div className="font-medium">{motorcycle.cc}cc</div>
                  </div>
                )}
                {motorcycle.transmission && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Transmission</div>
                    <div className="font-medium capitalize">{motorcycle.transmission}</div>
                  </div>
                )}
                {motorcycle.fuel_type && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                      <Fuel className="h-3 w-3" />
                      Fuel
                    </div>
                    <div className="font-medium capitalize">{motorcycle.fuel_type}</div>
                  </div>
                )}
                {motorcycle.min_rental_days && (
                  <div>
                    <div className="text-sm text-gray-400 mb-1 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Min Rental
                    </div>
                    <div className="font-medium">{motorcycle.min_rental_days} day{motorcycle.min_rental_days > 1 ? 's' : ''}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {motorcycle.features && motorcycle.features.length > 0 && (
              <div className="bg-dark-200 rounded-xl p-6 border border-dark-300">
                <h2 className="text-xl font-bold mb-4">Features</h2>
                <div className="flex flex-wrap gap-2">
                  {motorcycle.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/20 text-primary rounded-lg text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Included Items */}
            <div className="bg-dark-200 rounded-xl p-6 border border-dark-300">
              <h2 className="text-xl font-bold mb-4">What's Included</h2>
              <div className="space-y-2">
                {motorcycle.insurance_included && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-400" />
                    <span>Insurance Included</span>
                  </div>
                )}
                {motorcycle.helmet_included && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span>Helmet Included</span>
                  </div>
                )}
                {motorcycle.deposit_required && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Deposit Required:</span>
                    <span className="font-medium">{formatPrice(motorcycle.deposit_required)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {motorcycle.description && (
              <div className="bg-dark-200 rounded-xl p-6 border border-dark-300">
                <h2 className="text-xl font-bold mb-4">Description</h2>
                <p className="text-gray-300 whitespace-pre-line">{motorcycle.description}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
