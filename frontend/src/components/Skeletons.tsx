import React from 'react';

/**
 * Individual Product Card Skeleton - 1:1 matching dimensions and layout of ProductCard.tsx
 */
export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-[#EAE4D9]/80 overflow-hidden shadow-xs animate-pulse flex flex-col h-full">
      {/* Image Stage Skeleton with exact 3/4 aspect ratio and badge placeholders */}
      <div className="relative w-full aspect-[3/4] bg-[#F4EFE6] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
        {/* Discount / New Badge placeholder */}
        <div className="absolute top-2.5 left-2.5 w-12 h-5 bg-[#EAE4D9] rounded-xs" />
        {/* Wishlist Heart Button placeholder */}
        <div className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/80 border border-[#EAE4D9]" />
      </div>

      {/* Info Section Skeleton matching p-3 sm:p-4 */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2.5 bg-white">
        <div>
          {/* Category Tag + Rating Placeholder */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <div className="h-3 w-16 bg-[#EAE4D9] rounded-xs" />
            <div className="h-3 w-8 bg-[#EAE4D9] rounded-xs" />
          </div>
          {/* Title Placeholder - 2 lines */}
          <div className="space-y-1.5 mt-1">
            <div className="h-3.5 sm:h-4 w-full bg-[#EAE4D9] rounded-xs" />
            <div className="h-3.5 sm:h-4 w-3/4 bg-[#EAE4D9] rounded-xs" />
          </div>
        </div>

        {/* Bottom Price & Swatches Row */}
        <div className="pt-2 border-t border-[#F0EBE1] flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <div className="h-5 w-16 bg-[#EAE4D9] rounded-xs" />
            <div className="h-3.5 w-10 bg-[#EAE4D9] rounded-xs" />
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAE4D9]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAE4D9]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#EAE4D9]" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Full Product Listing Page (PLP) Skeleton - 1:1 matching dimensions and layout of ProductListingPage.tsx
 */
export const PLPSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-6 sm:py-12 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full animate-pulse">
        {/* Breadcrumb & Header Skeleton */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs mb-2">
            <div className="h-3.5 w-12 bg-[#EAE4D9] rounded-xs" />
            <span className="text-[#8C8276]">/</span>
            <div className="h-3.5 w-24 bg-[#EAE4D9] rounded-xs" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 sm:gap-4 border-b border-[#EAE4D9] pb-4 sm:pb-6">
            <div>
              <div className="h-8 sm:h-9 w-60 sm:w-80 bg-[#EAE4D9] rounded-xs" />
              <div className="h-4 w-48 sm:w-72 bg-[#EAE4D9] rounded-xs mt-2" />
            </div>
            <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-auto mt-2 sm:mt-0">
              <div className="h-9 w-28 bg-[#EAE4D9] rounded-xs" />
              <div className="h-9 w-36 bg-[#EAE4D9] rounded-xs" />
            </div>
          </div>
        </div>

        {/* Main Grid + Sidebar - exact grid cols 1 lg:grid-cols-4 gap-8 */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar Skeleton matching bg-white p-6 rounded-xl border border-[#EAE4D9] */}
          <aside className="hidden lg:block space-y-8 bg-white p-6 rounded-xl border border-[#EAE4D9]">
            {/* Category Filter Section */}
            <div>
              <div className="h-4 w-28 bg-[#EAE4D9] rounded-xs mb-3 pb-2 border-b border-[#F4EFE6]" />
              <div className="space-y-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-7 w-full bg-[#EAE4D9]/70 rounded-sm" />
                ))}
              </div>
            </div>

            {/* Price Filter Section */}
            <div>
              <div className="h-4 w-24 bg-[#EAE4D9] rounded-xs mb-3 pb-2 border-b border-[#F4EFE6]" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 w-full bg-[#EAE4D9]/70 rounded-sm" />
                ))}
              </div>
            </div>

            {/* Color Filter Section */}
            <div>
              <div className="h-4 w-20 bg-[#EAE4D9] rounded-xs mb-3 pb-2 border-b border-[#F4EFE6]" />
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="h-8 rounded-sm bg-[#EAE4D9]/70" />
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid Skeleton matching lg:col-span-3 and grid-cols-2 sm:grid-cols-2 md:grid-cols-3 */}
          <main className="lg:col-span-3">
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

/**
 * Full Product Detail Page (PDP) Skeleton - 1:1 matching dimensions and layout of ProductDetailPage.tsx
 */
export const PDPSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7] py-6 sm:py-12 w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 text-xs mb-6 sm:mb-8">
          <div className="h-3.5 w-12 bg-[#EAE4D9] rounded-xs" />
          <span className="text-[#8C8276]">/</span>
          <div className="h-3.5 w-20 bg-[#EAE4D9] rounded-xs" />
          <span className="text-[#8C8276]">/</span>
          <div className="h-3.5 w-36 bg-[#EAE4D9] rounded-xs" />
        </div>

        {/* Product Showcase: Gallery Left + Details Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pb-12 sm:pb-16 border-b border-[#EAE4D9] w-full">
          {/* Gallery Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails list */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto sm:w-20 sm:max-h-[560px]">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-16 sm:w-20 aspect-[3/4] rounded-md bg-[#EAE4D9] border-2 border-transparent shrink-0" />
              ))}
            </div>

            {/* Main Stage Image */}
            <div className="flex-1 aspect-[3/4] bg-[#EAE4D9] rounded-xl border border-[#EAE4D9] relative overflow-hidden" />
          </div>

          {/* Details Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Header section */}
            <div className="border-b border-[#EAE4D9] pb-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3.5 w-24 bg-[#EAE4D9] rounded-xs" />
                <div className="h-8 w-8 rounded-full bg-[#EAE4D9]" />
              </div>
              <div className="h-8 sm:h-9 w-11/12 bg-[#EAE4D9] rounded-xs" />
              <div className="h-8 sm:h-9 w-3/4 bg-[#EAE4D9] rounded-xs" />
              
              {/* Rating placeholder */}
              <div className="h-4 w-32 bg-[#EAE4D9] rounded-xs mt-2" />

              {/* Price block */}
              <div className="pt-2 flex items-baseline gap-3">
                <div className="h-8 w-28 bg-[#EAE4D9] rounded-xs" />
                <div className="h-5 w-20 bg-[#EAE4D9] rounded-xs" />
                <div className="h-5 w-14 bg-[#EAE4D9] rounded-xs" />
              </div>

              {/* Dispatch notice box */}
              <div className="h-12 w-full bg-[#F7F4EE] border border-[#EAE4D9] rounded-lg mt-4" />
            </div>

            {/* Color Selector Section */}
            <div className="py-5 border-b border-[#EAE4D9] space-y-3">
              <div className="h-4 w-28 bg-[#EAE4D9] rounded-xs" />
              <div className="flex items-center gap-2.5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-[#EAE4D9]" />
                ))}
              </div>
            </div>

            {/* Size Selector Section */}
            <div className="py-5 border-b border-[#EAE4D9] space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 bg-[#EAE4D9] rounded-xs" />
                <div className="h-4 w-16 bg-[#EAE4D9] rounded-xs" />
              </div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-12 h-10 rounded-sm bg-[#EAE4D9]" />
                ))}
              </div>
            </div>

            {/* Quantity & CTA Buttons Section */}
            <div className="py-6 space-y-3">
              <div className="flex gap-3">
                <div className="w-28 h-12 bg-[#EAE4D9] rounded-sm" />
                <div className="flex-1 h-12 bg-[#EAE4D9] rounded-sm" />
              </div>
              <div className="h-12 w-full bg-[#EAE4D9] rounded-sm" />
            </div>

            {/* Delivery Pincode Checker */}
            <div className="h-20 w-full bg-[#FAF7F0] border border-[#EAE4D9] rounded-xl mb-6" />

            {/* Accordions */}
            <div className="border-t border-[#EAE4D9] divide-y divide-[#EAE4D9]">
              {[1, 2, 3].map((i) => (
                <div key={i} className="py-4 flex justify-between items-center">
                  <div className="h-4 w-36 bg-[#EAE4D9] rounded-xs" />
                  <div className="h-4 w-4 bg-[#EAE4D9] rounded-xs" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
