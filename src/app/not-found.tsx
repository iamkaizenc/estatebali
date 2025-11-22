"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Home, Search, ArrowLeft, MapPin } from "lucide-react";

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="container mx-auto px-4 pt-32 pb-20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {mounted ? (
            <>
              {/* 404 Number with animation */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="mb-8"
              >
                <h1 className="text-[120px] md:text-[180px] font-bold leading-none">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-green-400 to-primary bg-[length:200%_auto] animate-gradient">
                    404
                  </span>
                </h1>
              </motion.div>

              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.3, type: "spring", bounce: 0.4 }}
                className="mb-8 flex justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                  <MapPin className="w-10 h-10 text-primary" />
                </div>
              </motion.div>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                  Property Not Found
                </h2>
                <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Looks like this property has been sold, or the page you're looking for doesn't exist.
                  Let's help you find your dream property in Bali!
                </p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
              >
                <Link
                  href="/"
                  className="group flex items-center gap-2 px-8 py-4 bg-primary text-black font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
                >
                  <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Go Home
                </Link>

                <Link
                  href="/properties"
                  className="group flex items-center gap-2 px-8 py-4 bg-dark-100 text-white font-semibold rounded-xl border border-dark-300 hover:border-primary transition-all duration-300 hover:scale-105"
                >
                  <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Browse Properties
                </Link>
              </motion.div>

              {/* Back Link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mb-16"
              >
                <button
                  onClick={() => window.history.back()}
                  className="group inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors duration-300"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Go back to previous page
                </button>
              </motion.div>

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
                className="pt-8 border-t border-dark-300"
              >
                <p className="text-sm text-gray-500 mb-4 font-medium">Popular pages</p>
                <div className="flex flex-wrap gap-6 justify-center">
                  <Link
                    href="/properties?type=villa"
                    className="text-sm text-gray-400 hover:text-primary transition-colors duration-300"
                  >
                    Villas
                  </Link>
                  <Link
                    href="/properties?type=apartment"
                    className="text-sm text-gray-400 hover:text-primary transition-colors duration-300"
                  >
                    Apartments
                  </Link>
                  <Link
                    href="/properties?type=land"
                    className="text-sm text-gray-400 hover:text-primary transition-colors duration-300"
                  >
                    Land
                  </Link>
                  <Link
                    href="/investment"
                    className="text-sm text-gray-400 hover:text-primary transition-colors duration-300"
                  >
                    Investment
                  </Link>
                  <Link
                    href="/about"
                    className="text-sm text-gray-400 hover:text-primary transition-colors duration-300"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/contact"
                    className="text-sm text-gray-400 hover:text-primary transition-colors duration-300"
                  >
                    Contact
                  </Link>
                </div>
              </motion.div>
            </>
          ) : (
            // Fallback for SSR
            <div>
              <h1 className="text-[120px] md:text-[180px] font-bold leading-none mb-8">
                <span className="text-primary">404</span>
              </h1>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Property Not Found
              </h2>
              <p className="text-lg md:text-xl text-gray-400 mb-8">
                The page you're looking for doesn't exist.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

