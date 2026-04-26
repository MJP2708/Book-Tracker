"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "line" | "text" | "card" | "avatar";
}

export function LoadingSkeleton({ className, variant = "line" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--bg3)]",
        variant === "line" && "h-4 w-full",
        variant === "text" && "h-3 w-3/4",
        variant === "card" && "h-36 w-full rounded-xl",
        variant === "avatar" && "h-10 w-10 rounded-full",
        className
      )}
    />
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("premium-card p-5 space-y-3", className)}>
      <LoadingSkeleton variant="line" className="w-2/3" />
      <LoadingSkeleton variant="text" />
      <LoadingSkeleton variant="text" className="w-1/2" />
    </div>
  );
}

export function SkeletonBookCard({ className }: { className?: string }) {
  return (
    <div className={cn("premium-card overflow-hidden", className)}>
      <LoadingSkeleton variant="card" className="rounded-none rounded-t-[13px]" />
      <div className="p-3 space-y-2">
        <LoadingSkeleton variant="line" className="h-3 w-3/4" />
        <LoadingSkeleton variant="text" className="h-2.5 w-1/2" />
      </div>
    </div>
  );
}
