"use client";

import { Loader2 } from "lucide-react";

interface SkeletonLoaderProps {
  type: "card" | "post" | "list" | "profile";
  count?: number;
}

export function SkeletonLoader({ type, count = 1 }: SkeletonLoaderProps) {
  const skeletons = Array.from({ length: count });

  if (type === "card") {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skeletons.map((_, i) => (
          <div key={i} className="card-bookish">
            <div className="animate-shimmer h-40 rounded-lg mb-4" />
            <div className="animate-shimmer h-6 rounded w-3/4 mb-2" />
            <div className="animate-shimmer h-4 rounded w-1/2 mb-4" />
            <div className="flex gap-2">
              <div className="animate-shimmer h-10 rounded flex-1" />
              <div className="animate-shimmer h-10 rounded flex-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "post") {
    return (
      <div className="space-y-4">
        {skeletons.map((_, i) => (
          <div key={i} className="card-bookish">
            <div className="flex gap-3 mb-4">
              <div className="animate-shimmer w-10 h-10 rounded-full" />
              <div className="flex-1">
                <div className="animate-shimmer h-4 rounded w-1/3 mb-2" />
                <div className="animate-shimmer h-3 rounded w-1/4" />
              </div>
            </div>
            <div className="animate-shimmer h-24 rounded mb-4" />
            <div className="flex gap-2">
              <div className="animate-shimmer h-8 rounded flex-1" />
              <div className="animate-shimmer h-8 rounded flex-1" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
    </div>
  );
}
