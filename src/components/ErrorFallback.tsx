"use client";

import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full card p-8 text-center">
        <div className="mb-6">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Something went wrong</h1>
          <p className="text-gray-400 mb-6">
            {error.message || "An unexpected error occurred. Please try again."}
          </p>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 p-4 bg-dark-200 rounded-lg text-left">
            <p className="text-sm font-mono text-red-400">
              {error.toString()}
            </p>
          </div>
        )}

        <div className="flex gap-4 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="btn-primary flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="btn-secondary flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

