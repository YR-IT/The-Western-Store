import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Home } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 bg-[#FAF8F3]">
      <SEOHead
        title="404 - Page Not Found"
        description="The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
        noIndex={true}
      />

      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-[#EAE4D9]">
        <div className="w-16 h-16 bg-[#FDF5F0] text-[#721B29] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#B8860B]">
            Error 404
          </span>
          <h1 className="font-serif text-3xl font-bold text-[#242120]">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-[#736B63] leading-relaxed">
            The style or boutique page you are looking for might have moved, or is no longer available.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#721B29] text-white text-xs font-semibold hover:bg-[#852031] transition-colors shadow-xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>

          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-white border border-[#D9CEBF] text-[#242120] text-xs font-semibold hover:bg-[#FAF8F3] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Explore Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
