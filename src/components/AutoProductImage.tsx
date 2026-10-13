'use client';

import React, { useState, useEffect } from 'react';
import { formatImageUrl } from '@/lib/image';

interface AutoProductImageProps {
  images?: any[] | null;
  image?: string | null;
  alt: string;
  className?: string;
  intervalMs?: number;
  showIndicators?: boolean;
}

export default function AutoProductImage({
  images,
  image,
  alt,
  className = '',
  intervalMs = 2800,
  showIndicators = true,
}: AutoProductImageProps) {
  // Normalize images array
  const rawList: string[] = [];
  if (Array.isArray(images) && images.length > 0) {
    images.forEach((item) => {
      if (typeof item === 'string' && item.trim()) {
        rawList.push(item);
      } else if (item && typeof item === 'object') {
        const path = item.image_path || item.url || item.src;
        if (path) rawList.push(path);
      }
    });
  }

  // Fallback to single image if array is empty
  if (rawList.length === 0 && image) {
    rawList.push(image);
  }

  // Deduplicate and format URLs
  const validImages = Array.from(new Set(rawList.filter(Boolean))).map((img) =>
    formatImageUrl(img)
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto rotate photos if more than 1 photo exists
  useEffect(() => {
    if (validImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % validImages.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [validImages.length, intervalMs]);

  // If no images at all, display clean fallback
  if (validImages.length === 0) {
    return (
      <img
        src="/assets/images/banner/banner-1.jpg"
        alt={alt}
        className={`w-full h-full object-contain ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Display active image with smooth crossfade */}
      {validImages.map((src, idx) => (
        <img
          key={src + idx}
          src={src}
          alt={`${alt} - View ${idx + 1}`}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out p-3 ${
            idx === currentIndex ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 pointer-events-none'
          } ${className}`}
          loading="lazy"
          onError={(e) => {
            // Fallback gracefully on broken URL
            (e.currentTarget as HTMLImageElement).src = '/assets/images/banner/banner-1.jpg';
          }}
        />
      ))}

      {/* Multiple Photos Indicator & Pagination Bar (Sharp Edge Design) */}
      {validImages.length > 1 && showIndicators && (
        <div className="absolute bottom-2 left-0 right-0 z-20 flex items-center justify-center gap-1 px-2 pointer-events-none">
          {validImages.map((_, dotIdx) => (
            <div
              key={dotIdx}
              className={`h-[2px] transition-all duration-300 ${
                dotIdx === currentIndex
                  ? 'w-5 bg-[#000000] shadow-sm'
                  : 'w-2 bg-[#D4D4D8]/80'
              }`}
              style={{ borderRadius: '0px' }}
            />
          ))}
        </div>
      )}

      {/* Multiple Photos Count Badge (Sharp rectangular badge) */}
      {validImages.length > 1 && (
        <div className="absolute bottom-2 right-2 z-20 pointer-events-none">
          <span
            className="px-1.5 py-0.5 bg-[#000000]/80 text-white font-mono text-[9px] font-bold tracking-wider uppercase border border-[#27272A]"
            style={{ borderRadius: '0px' }}
          >
            {currentIndex + 1}/{validImages.length}
          </span>
        </div>
      )}
    </div>
  );
}

