export default function SkeletonLoader({ className = "", count = 1 }: { className?: string; count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`animate-pulse ${className}`}>
          <div className="bg-dark-200 rounded-xl h-full w-full"></div>
        </div>
      ))}
    </>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="bg-dark-100 rounded-2xl overflow-hidden border border-dark-300 animate-pulse">
      <div className="aspect-video bg-dark-200"></div>
      <div className="p-4 space-y-3">
        <div className="h-6 bg-dark-200 rounded w-3/4"></div>
        <div className="h-4 bg-dark-200 rounded w-1/2"></div>
        <div className="flex gap-4">
          <div className="h-4 bg-dark-200 rounded w-16"></div>
          <div className="h-4 bg-dark-200 rounded w-16"></div>
        </div>
        <div className="h-8 bg-dark-200 rounded w-full"></div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="bg-dark-100 rounded-xl p-4 animate-pulse">
          <div className="flex gap-4">
            <div className="h-16 w-16 bg-dark-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-dark-200 rounded w-3/4"></div>
              <div className="h-4 bg-dark-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
