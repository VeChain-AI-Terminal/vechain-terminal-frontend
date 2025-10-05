"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface AvatarFallbackProps {
  src?: string;
  alt: string;
  fallbackText?: string;
  className?: string;
  width?: number;
  height?: number;
}

export function AvatarFallback({
  src,
  alt,
  fallbackText,
  className,
  width = 24,
  height = 24,
}: AvatarFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // If no src or image errored, show fallback
  if (!src || imageError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-muted text-muted-foreground",
          className
        )}
        style={{ width, height }}
      >
        {fallbackText ? (
          <span className="text-xs font-medium">
            {fallbackText.slice(0, 2).toUpperCase()}
          </span>
        ) : (
          <span className="text-xs">👤</span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full bg-muted animate-pulse"
          style={{ width, height }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "rounded-full transition-opacity",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}