import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
}

export default function LoadingState({
  message = "Loading...",
  size = "md",
  fullScreen = false
}: LoadingStateProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const spinnerClass = `${sizeClasses[size]} text-primary animate-spin`;

  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <Loader2 className={spinnerClass} />
      {message && (
        <p className="text-gray-400 text-center">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

/**
 * Spinner only component (no message)
 */
export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return <Loader2 className={`${sizeClasses[size]} text-primary animate-spin`} />;
}

/**
 * Card loading skeleton
 */
export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-64 bg-dark-100 rounded-t-2xl" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-dark-100 rounded w-3/4" />
        <div className="h-4 bg-dark-100 rounded w-1/2" />
        <div className="h-4 bg-dark-100 rounded w-5/6" />
      </div>
    </div>
  );
}

/**
 * Property card loading skeleton
 */
export function PropertyCardSkeleton() {
  return (
    <div className="card animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-64 bg-dark-100 rounded-t-2xl" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Price */}
        <div className="h-6 bg-dark-100 rounded w-1/3" />

        {/* Title */}
        <div className="h-5 bg-dark-100 rounded w-3/4" />

        {/* Location */}
        <div className="h-4 bg-dark-100 rounded w-1/2" />

        {/* Features */}
        <div className="flex gap-4 pt-2">
          <div className="h-4 bg-dark-100 rounded w-16" />
          <div className="h-4 bg-dark-100 rounded w-16" />
          <div className="h-4 bg-dark-100 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

/**
 * Grid of property card skeletons
 */
export function PropertyGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * Page loading with header and footer
 */
export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <LoadingState message={message} size="lg" />
    </div>
  );
}
