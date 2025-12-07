"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import EmptyState from "@/components/EmptyState";
import { useProperties } from "@/hooks/useProperties";
import { areas } from "@/data/mockData";
import { getAreaImage } from "@/data/areaImages";
import { SearchFilters } from "@/types";
import { motion } from "framer-motion";
import { TrendingUp, Shield, Clock, Award } from "lucide-react";
import { getMessages, isAITranslated } from "@/i18n/messages";
import { getLocale, Locale } from "@/i18n/config";

interface HomePageProps {
  params: { locale: string };
}

export default function HomePage({ params }: HomePageProps) {
  const router = useRouter();
  const locale = getLocale(params.locale);
  const messages = getMessages(locale);
  const isOriginalLanguage = !isAITranslated(locale);
  
  const { properties, loading: propertiesLoading } = useProperties();
  const { properties: featuredPropertiesList, loading: featuredLoading } = useProperties({ featured: true });
  const featuredProperties = featuredPropertiesList;

  const handleSearch = (filters: SearchFilters) => {
    // Build query string from filters
    const params = new URLSearchParams();
    
    if (filters.query) params.append("query", filters.query);
    if (filters.listingType) params.append("listingType", filters.listingType);
    if (filters.propertyType && filters.propertyType.length > 0) {
      params.append("type", filters.propertyType[0]);
    }
    if (filters.location) params.append("area", filters.location);
    if (filters.priceMin) params.append("priceMin", filters.priceMin.toString());
    if (filters.priceMax) params.append("priceMax", filters.priceMax.toString());
    if (filters.bedrooms) params.append("bedrooms", filters.bedrooms.toString());
    if (filters.bathrooms) params.append("bathrooms", filters.bathrooms.toString());
    
    // Redirect to properties page with search filters and locale
    router.push(`/${locale}/properties?${params.toString()}`);
  };

  // Split hero title by newline for proper rendering
  const heroTitleLines = messages.hero.title.split('\n');
  const heroSubtitleLines = messages.hero.subtitle.split('\n');

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 z-0">
          {/* Base gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black via-dark-100 to-black" />
          
          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 animate-pulse" />
          
          {/* Geometric pattern */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              linear-gradient(30deg, transparent 40%, rgba(0, 255, 102, 0.1) 50%, transparent 60%),
              linear-gradient(-30deg, transparent 40%, rgba(0, 255, 102, 0.05) 50%, transparent 60%)
            `,
            backgroundSize: '100px 100px',
          }} />
          
          {/* Hero Background Image */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="https://images.unsplash.com/photo-1540541011368-8fc88765bbab?w=1920&q=80"
              alt="Bali Villa"
              fill
              priority
              className="object-cover opacity-50"
              sizes="100vw"
              unoptimized
            />
          </div>
          
          {/* Floating orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          
          {/* Final gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black" />
        </div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-4 text-white whitespace-pre-line"
          >
            {heroTitleLines.map((line, index) => {
              // Check if line contains "Bali" or "بالي" (Arabic) or "באלי" (Hebrew) or "巴厘岛" (Chinese)
              const baliVariants = ['Bali', 'بالي', 'באלי', '巴厘岛'];
              let hasBali = false;
              let baliText = '';
              
              for (const variant of baliVariants) {
                if (line.includes(variant)) {
                  hasBali = true;
                  baliText = variant;
                  break;
                }
              }
              
              return (
                <span key={index}>
                  {hasBali ? (
                    <>
                      {line.split(baliText)[0]}
                      <span className="text-primary">{baliText}</span>
                      {line.split(baliText)[1]}
                    </>
                  ) : (
                    line
                  )}
                  {index < heroTitleLines.length - 1 && <br />}
                </span>
              );
            })}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto whitespace-pre-line"
          >
            {messages.hero.subtitle}
          </motion.p>

          {/* AI Translation Notice - Only show for non-original languages */}
          {!isOriginalLanguage && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-sm text-gray-500 italic mb-4"
            >
              {messages.hero.aiTranslatedNotice}
            </motion.p>
          )}
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-4xl mx-auto"
          >
            <SearchBar onSearch={handleSearch} />
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
            <p className="text-gray-400">Hand-picked luxury properties in prime locations</p>
          </div>
          <Link href={`/${locale}/featured`} className="btn-primary hidden md:block">
            View All Featured
          </Link>
        </div>
        
        {featuredLoading ? (
          <div className="text-center py-20">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading properties...</p>
          </div>
        ) : featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="home"
            title="No Featured Properties Yet"
            description="Our team is curating the best properties in Bali. Check back soon to discover premium listings."
            actionLabel="Browse All Properties"
            actionHref={`/${locale}/properties`}
          />
        )}
      </section>

      {/* Why Choose Us */}
      <section className="bg-dark-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Estate Bali</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We're committed to making your property journey in Bali seamless and successful
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-400 text-sm">
                Competitive prices and transparent dealings with no hidden fees
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Verified</h3>
              <p className="text-gray-400 text-sm">
                All listings are verified and transactions are secure
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">24/7 Support</h3>
              <p className="text-gray-400 text-sm">
                Our team is always ready to help you find your perfect property
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Premium Service</h3>
              <p className="text-gray-400 text-sm">
                Professional agents and premium property listings
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Properties */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Recent Properties</h2>
            <p className="text-gray-400">Latest additions to our collection</p>
          </div>
          <Link href={`/${locale}/properties`} className="btn-primary hidden md:block">
            View All Properties
          </Link>
        </div>
        
        {propertiesLoading ? (
          <div className="text-center py-20">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading properties...</p>
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon="search"
            title="No Properties Found"
            description="We couldn't find any properties matching your criteria. Try adjusting your search filters or browse all properties."
            actionLabel="Browse All Properties"
            actionHref={`/${locale}/properties`}
          />
        )}
      </section>

      {/* Popular Areas */}
      <section className="bg-dark-100 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Popular Areas</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Discover the most sought-after locations in Bali
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {areas.slice(0, 10).map((area) => {
              // Get area-specific image
              const areaImage = getAreaImage(area);
              // Deterministic property count based on area name hash
              const areaHash = area.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
              const propertyCount = (areaHash % 50) + 20;
              
              return (
                <Link key={area} href={`/${locale}/area/${area.toLowerCase()}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative h-32 rounded-xl overflow-hidden group cursor-pointer"
                  >
                    <Image
                      src={areaImage}
                      alt={area}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-semibold">{area}</h3>
                      <p className="text-xs text-gray-300">
                        {propertyCount} properties
                      </p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="gradient-primary rounded-3xl p-12 text-center">
          <h2 className="text-4xl font-bold text-black mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-black/80 mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who found their perfect property in Bali with Estate Bali
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/properties`} className="btn-secondary">
              Browse Properties
            </Link>
            <Link href={`/${locale}/create`} className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-900 transition-colors">
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

