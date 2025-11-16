"use client";

import { useEffect } from "react";
import { Home, RefreshCw } from "lucide-react";
import { logger } from "@/lib/logger";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error using logger utility (only logs in development)
    logger.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Home className="h-10 w-10 text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-400 mb-8">
          We encountered an error while loading this page. This could be a temporary issue.
        </p>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          
          <a
            href="/"
            className="btn-secondary"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

