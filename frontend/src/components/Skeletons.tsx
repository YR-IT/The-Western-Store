import React from 'react';

/**
 * Individual Product Card Skeleton
 */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-[#EAE4D9]/80 overflow-hidden shadow-xs animate-pulse flex flex-col h-full">
      {/* Image Block */}
      <div className="relative aspect-[3/4] bg-[#EAE4D9]/60 w-full overflow-hidden">
        {/* Subtle shimmer gradient accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>

      {/* Product Content Skeleton */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div className="space-y-2">
          {/* Category Tag */}
          <div className="h-3 w-20 bg-[#EAE4D9] rounded-xs" />
          {/* Title */}
          <div className="h-4 w-5/6 bg-[#EAE4D9] rounded-xs" />
          <div className="h-4 w-3/4 bg-[#EAE4D9] rounded-xs" />
        </div>

        <div className="pt-2 border-t border-[#F0EBE1] flex items-center justify-between">
          {/* Price */}
          <div className="h-5 w-24 bg-[#EAE4D9] rounded-xs" />
          {/* Color Dots */}
          <div className="flex gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-[#EAE4D9]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#EAE4D9]" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Full Product Listing Page (PLP) Skeleton
 */
export const PLPSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-6 sm:py-12 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb & Header Skeleton */}
        <div className="mb-6 animate-pulse">
          <div className="h-3 w-32 bg-[#EAE4D9] rounded-xs mb-3" />
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 border-b border-[#EAE4D9] pb-6">
            <div className="space-y-2">
              <div className="h-8 w-64 bg-[#EAE4D9] rounded-xs" />
              <div className="h-4 w-48 bg-[#EAE4D9] rounded-xs" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-28 bg-[#EAE4D9] rounded-xs" />
              <div className="h-9 w-36 bg-[#EAE4D9] rounded-xs" />
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter Skeleton (Desktop) */}
          <div className="hidden lg:block w-64 shrink-0 space-y-6 animate-pulse">
            <div className="h-6 w-32 bg-[#EAE4D9] rounded-xs" />
            <div className="space-y-3 pt-4 border-t border-[#EAE4D9]">
              <div className="h-4 w-24 bg-[#EAE4D9] rounded-xs" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-8 w-12 bg-[#EAE4D9] rounded-xs" />
                ))}
              </div>
            </div>
            <div className="space-y-3 pt-4 border-t border-[#EAE4D9]">
              <div className="h-4 w-28 bg-[#EAE4D9] rounded-xs" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 w-full bg-[#EAE4D9] rounded-xs" />
                ))}
              </div>
            </div>
          </div>

          {/* Product Grid Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Full Product Detail Page (PDP) Skeleton
 */
export const PDPSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-8 sm:py-12 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-pulse">
        {/* Breadcrumb */}
        <div className="h-3 w-48 bg-[#EAE4D9] rounded-xs mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Image Gallery Skeleton (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 sm:w-20 aspect-[3/4] bg-[#EAE4D9] rounded-lg shrink-0" />
              ))}
            </div>
            {/* Main Image Stage */}
            <div className="flex-1 aspect-[3/4] bg-[#EAE4D9] rounded-xl relative overflow-hidden" />
          </div>

          {/* Product Specs & Info Skeleton (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3 pb-6 border-b border-[#EAE4D9]">
              {/* Category Tag */}
              <div className="h-3 w-28 bg-[#EAE4D9] rounded-xs" />
              {/* Title */}
              <div className="h-7 w-5/6 bg-[#EAE4D9] rounded-xs" />
              <div className="h-7 w-2/3 bg-[#EAE4D9] rounded-xs" />
              {/* Price */}
              <div className="h-8 w-36 bg-[#EAE4D9] rounded-xs pt-2" />
            </div>

            {/* Color selector skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-24 bg-[#EAE4D9] rounded-xs" />
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-[#EAE4D9]" />
                ))}
              </div>
            </div>

            {/* Size selector skeleton */}
            <div className="space-y-2">
              <div className="h-4 w-24 bg-[#EAE4D9] rounded-xs" />
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-12 h-10 rounded bg-[#EAE4D9]" />
                ))}
              </div>
            </div>

            {/* Quantity & CTA Skeleton */}
            <div className="space-y-3 pt-2">
              <div className="h-12 w-full bg-[#EAE4D9] rounded-lg" />
              <div className="h-12 w-full bg-[#EAE4D9] rounded-lg" />
            </div>

            {/* Accordion Skeletons */}
            <div className="space-y-4 pt-6 border-t border-[#EAE4D9]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-10 w-full bg-[#EAE4D9] rounded-md" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
