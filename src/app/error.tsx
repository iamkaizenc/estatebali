"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, RefreshCw, AlertTriangle, ArrowLeft } from "lucide-react";
import { logger } from "@/lib/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Log error using logger utility (only logs in development)
    logger.error("Application error:", error);
  }, [error]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);

    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 500));

    setIsRetrying(false);
    reset();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-1/4 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="text-center max-w-2xl relative z-10">
        {mounted ? (
          <>
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
              className="mb-8 flex justify-center"
            >
              <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center border-2 border-red-500/50 relative">
                <AlertTriangle className="h-12 w-12 text-red-500" />
                {/* Pulsing ring */}
                <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-ping" />
              </div>
            </motion.div>

            {/* Error Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Oops! Something Went Wrong
              </h1>
            </motion.div>

            {/* Error Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <p className="text-lg text-gray-400 mb-4 leading-relaxed">
                We encountered an unexpected error while loading this page.
                This could be a temporary issue.
              </p>

              {process.env.NODE_ENV === "development" && error.message && (
                <div className="mt-4 p-4 bg-dark-100 border border-red-500/20 rounded-lg text-left">
                  <p className="text-sm font-mono text-red-400 break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-gray-500 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}

              {retryCount > 0 && (
                <p className="text-sm text-gray-500 mt-3">
                  Retry attempts: {retryCount}
                </p>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
            >
              <button
                onClick={handleRetry}
                disabled={isRetrying}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-primary text-black font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <RefreshCw className={`h-5 w-5 ${isRetrying ? "animate-spin" : "group-hover:rotate-180"} transition-transform duration-500`} />
                {isRetrying ? "Retrying..." : "Try Again"}
              </button>

              <a
                href="/"
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-dark-100 text-white font-semibold rounded-xl border border-dark-300 hover:border-primary transition-all duration-300 hover:scale-105"
              >
                <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Go Home
              </a>
            </motion.div>

            {/* Back Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12"
            >
              <button
                onClick={() => window.history.back()}
                className="group inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Go back to previous page
              </button>
            </motion.div>

            {/* Help Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="pt-8 border-t border-dark-300"
            >
              <p className="text-sm text-gray-500 mb-4">
                If this problem persists, please contact our support team.
              </p>
              <div className="flex flex-wrap gap-6 justify-center">
                <a
                  href="/contact"
                  className="text-sm text-gray-400 hover:text-primary transition-colors duration-300"
                >
                  Contact Support
                </a>
                <a
                  href="/properties"
                  className="text-sm text-gray-400 hover:text-primary transition-colors duration-300"
                >
                  Browse Properties
                </a>
                <a
                  href="/about"
                  className="text-sm text-gray-400 hover:text-primary transition-colors duration-300"
                >
                  About Us
                </a>
              </div>
            </motion.div>
          </>
        ) : (
          // Fallback for SSR
          <div>
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-400 mb-8">
              We encountered an error while loading this page.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


