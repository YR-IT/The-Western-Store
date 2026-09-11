import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_TESTIMONIALS } from '../data/mockData';
import { Testimonial } from '../types';
import { useStore } from '../context/StoreContext';
import {
  Star,
  CheckCircle2,
  Quote,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  MessageSquarePlus,
  Play,
  Pause,
  ExternalLink,
  Sparkles,
  X,
  Send,
  Heart,
} from 'lucide-react';

const FILTER_TAGS = ['All', 'Wedding Drape', 'Ethnic Elegance', 'Western Wear', 'Campus Style', 'Boutique Finish', 'Budget Edit'];

export const Testimonials: React.FC = () => {
  const { navigateToProduct } = useStore();
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem('tws_customer_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_TESTIMONIALS;
      }
    }
    return INITIAL_TESTIMONIALS;
  });

  const [activeTag, setActiveTag] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});
  const [isWriteModalOpen, setIsWriteModalOpen] = useState<boolean>(false);
  const [reviewSubmittedToast, setReviewSubmittedToast] = useState<boolean>(false);

  // New Review Form State
  const [newReview, setNewReview] = useState({
    name: '',
    location: '',
    rating: 5,
    outfitPurchased: '',
    comment: '',
    tag: 'Boutique Finish',
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const carouselContainerRef = useRef<HTMLDivElement | null>(null);

  // Filtered reviews based on tag
  const filteredReviews = activeTag === 'All'
    ? testimonials
    : testimonials.filter((t) => t.tag === activeTag);

  // Cards to display based on responsive viewport
  // We compute total pages or slides
  const totalSlides = filteredReviews.length;

  // Auto-play interval
  useEffect(() => {
    if (isAutoPlaying && totalSlides > 1) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }, 5500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, totalSlides, currentIndex]);

  // Reset index when filter changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeTag]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const handleHelpfulClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;

    const created: Testimonial = {
      id: `t-user-${Date.now()}`,
      name: newReview.name.trim(),
      location: newReview.location.trim() || 'Kurukshetra, Haryana',
      rating: newReview.rating,
      comment: newReview.comment.trim(),
      date: 'Just now',
      outfitPurchased: newReview.outfitPurchased.trim() || 'Custom Boutique Outfit',
      verified: true,
      helpfulCount: 1,
      tag: newReview.tag,
    };

    const updated = [created, ...testimonials];
    setTestimonials(updated);
    try {
      localStorage.setItem('tws_customer_reviews', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setIsWriteModalOpen(false);
    setNewReview({
      name: '',
      location: '',
      rating: 5,
      outfitPurchased: '',
      comment: '',
      tag: 'Boutique Finish',
    });
    setCurrentIndex(0);
    setReviewSubmittedToast(true);
    setTimeout(() => setReviewSubmittedToast(false), 4000);
  };

  return (
    <motion.section
      id="testimonials-section"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="py-14 sm:py-20 bg-[#FDFBF7] border-t border-[#EAE4D9] w-full max-w-full overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-[#B8860B] text-xs font-semibold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified Patron Reviews</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#242120] tracking-tight">
              Words From Our Patrons
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-[#736B63] font-light max-w-xl">
              Authentic styling experiences from women who wear The Western Store for family weddings, college days, and festive gatherings.
            </p>
          </div>

          {/* Aggregate Rating & Write Review CTA */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#F7F3E8] border border-[#E5DAC6] px-3 py-1.5 rounded-full">
              <div className="flex text-[#B8860B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#B8860B]" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#242120]">4.9 / 5.0</span>
              <span className="text-[11px] text-[#736B63] hidden sm:inline">(380+ reviews)</span>
            </div>

            <button
              id="write-review-btn"
              type="button"
              onClick={() => setIsWriteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#721B29] text-white text-xs font-semibold rounded-full hover:bg-[#852031] transition-colors shadow-xs"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Share Review</span>
            </button>
          </div>
        </div>

        {/* Filter Tags Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {FILTER_TAGS.map((tag) => {
            const isSelected = activeTag === tag;
            return (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#721B29] text-white border-[#721B29] shadow-xs'
                    : 'bg-white text-[#5C554E] border-[#E8E1D5] hover:border-[#721B29]/40'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Carousel Container */}
        <div
          ref={carouselContainerRef}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative select-none"
        >
          {/* Main Slide Grid / Track */}
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {filteredReviews.map((review, idx) => {
                const isVoted = helpfulVotes[review.id];
                const displayHelpful = (review.helpfulCount || 0) + (isVoted ? 1 : 0);

                return (
                  <div
                    key={review.id || idx}
                    className="w-full shrink-0 px-1 sm:px-2"
                  >
                    <div className="bg-white rounded-2xl p-5 sm:p-8 border border-[#EAE4D9] shadow-xs hover:shadow-md transition-all relative flex flex-col md:flex-row gap-6 items-stretch justify-between">
                      {/* Left: Review Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          {/* Top Row: Stars + Tag + Date */}
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-1.5">
                              <div className="flex items-center text-[#B8860B]">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-[#B8860B]" />
                                ))}
                              </div>
                              <span className="text-xs font-bold text-[#242120]">
                                {review.rating}.0
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              {review.tag && (
                                <span className="px-2.5 py-0.5 rounded-full bg-[#FAF5EC] text-[#B8860B] border border-[#EADBBD] text-[10px] font-semibold uppercase tracking-wider">
                                  {review.tag}
                                </span>
                              )}
                              <span className="text-[11px] text-[#8C8276]">{review.date}</span>
                            </div>
                          </div>

                          {/* Review Quote Body */}
                          <div className="relative mb-4">
                            <Quote className="w-8 h-8 text-[#F2ECE1] absolute -top-3 -left-2 -z-0 opacity-80" />
                            <p className="relative z-10 font-serif text-base sm:text-lg text-[#242120] font-normal leading-relaxed italic">
                              "{review.comment}"
                            </p>
                          </div>
                        </div>

                        {/* Author Profile & Helpful Count */}
                        <div className="pt-4 border-t border-[#F4EFE6] flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {review.avatar ? (
                              <img
                                src={review.avatar}
                                alt={review.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-full object-cover border border-[#EAE4D9]"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-[#721B29]/10 text-[#721B29] font-serif font-bold text-sm flex items-center justify-center border border-[#721B29]/20">
                                {review.name.charAt(0)}
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-serif text-sm sm:text-base font-bold text-[#242120]">
                                  {review.name}
                                </h4>
                                {review.verified && (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Verified Buyer</span>
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#8C8276]">{review.location}</p>
                            </div>
                          </div>

                          {/* Helpful button */}
                          <button
                            type="button"
                            onClick={(e) => handleHelpfulClick(review.id, e)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs transition-colors border ${
                              isVoted
                                ? 'bg-rose-50 text-[#721B29] border-rose-200 font-semibold'
                                : 'bg-[#FAF8F3] text-[#736B63] border-[#EAE4D9] hover:bg-white'
                            }`}
                          >
                            <ThumbsUp className={`w-3.5 h-3.5 ${isVoted ? 'fill-[#721B29]' : ''}`} />
                            <span>Helpful ({displayHelpful})</span>
                          </button>
                        </div>
                      </div>

                      {/* Right: Product Showcase Card */}
                      {review.outfitPurchased && (
                        <div className="w-full md:w-64 bg-[#FBF9F4] rounded-xl p-3.5 border border-[#E8DFC9] flex flex-col justify-between gap-3 shrink-0">
                          <div className="flex flex-col w-full">
                            {review.productImage ? (
                              <img
                                src={review.productImage}
                                alt={review.outfitPurchased}
                                referrerPolicy="no-referrer"
                                className="w-full aspect-[3/4] object-cover object-top rounded-lg border border-[#EAE4D9] shadow-xs"
                              />
                            ) : (
                              <div className="w-full aspect-[3/4] bg-[#EFE9DF] rounded-lg flex items-center justify-center text-[#8C8276] text-xs">
                                <Heart className="w-6 h-6 text-[#C7BCAB]" />
                              </div>
                            )}

                            <div className="mt-2.5 min-w-0">
                              <h5 className="font-serif text-xs font-bold text-[#242120] line-clamp-2 leading-snug">
                                {review.outfitPurchased}
                              </h5>
                            </div>
                          </div>

                          {review.productId && (
                            <button
                              type="button"
                              onClick={() => review.productId && navigateToProduct(review.productId)}
                              className="w-full py-2 px-2.5 bg-white text-[#721B29] border border-[#721B29]/30 hover:bg-[#721B29] hover:text-white transition-colors text-[11px] font-semibold rounded-md flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                            >
                              <span>View Ensemble</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls Overlay */}
          {totalSlides > 1 && (
            <div className="flex items-center justify-between mt-6">
              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5">
                {filteredReviews.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === i
                        ? 'w-6 bg-[#721B29]'
                        : 'w-2 bg-[#D9CEBF] hover:bg-[#B8860B]'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              {/* Arrow Buttons + Play/Pause */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAutoPlaying((prev) => !prev)}
                  className="p-2 rounded-full border border-[#D9CEBF] bg-white text-[#5C554E] hover:text-[#721B29] transition-colors"
                  aria-label={isAutoPlaying ? 'Pause carousel' : 'Play carousel'}
                  title={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
                >
                  {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={handlePrev}
                  className="p-2 rounded-full border border-[#D9CEBF] bg-white text-[#5C554E] hover:text-[#721B29] hover:border-[#721B29] transition-colors"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="p-2 rounded-full border border-[#D9CEBF] bg-white text-[#5C554E] hover:text-[#721B29] hover:border-[#721B29] transition-colors"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Kurukshetra Boutique Trust Promise */}
        <div className="mt-10 pt-6 border-t border-[#EAE4D9] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#EAE4D9]">
            <span className="font-serif font-bold text-sm text-[#242120] block">100% Fit Guarantee</span>
            <p className="text-[11px] text-[#736B63] mt-0.5">Free size assistance directly on WhatsApp before dispatch</p>
          </div>
          <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#EAE4D9]">
            <span className="font-serif font-bold text-sm text-[#242120] block">Video Dispatch Proof</span>
            <p className="text-[11px] text-[#736B63] mt-0.5">Real HD video of your packed parcel sent prior to shipping</p>
          </div>
          <div className="p-3 bg-[#FAF8F3] rounded-xl border border-[#EAE4D9]">
            <span className="font-serif font-bold text-sm text-[#242120] block">Authentic Kurukshetra Store</span>
            <p className="text-[11px] text-[#736B63] mt-0.5">Walk in anytime or shop online with pan-India express courier</p>
          </div>
        </div>
      </div>

      {/* Write a Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#FDFBF7] rounded-2xl shadow-2xl border border-[#EAE4D9] overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#EAE4D9] flex items-center justify-between bg-[#F8F5EE]">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#242120]">
                  Share Your Boutique Experience
                </h3>
                <p className="text-xs text-[#736B63]">
                  Your review helps women across Haryana find their dream outfit
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsWriteModalOpen(false)}
                className="p-1.5 text-[#5C554E] hover:text-[#721B29] rounded-full hover:bg-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleReviewSubmit} className="p-5 overflow-y-auto space-y-4">
              {/* Star Rating Select */}
              <div>
                <label className="block text-xs font-semibold text-[#242120] uppercase tracking-wider mb-1.5">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= newReview.rating
                            ? 'text-[#B8860B] fill-[#B8860B]'
                            : 'text-[#D9CEBF]'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-[#721B29] ml-2">
                    {newReview.rating} Star{newReview.rating > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              {/* Name & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#242120] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Megha Singhal"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-lg text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#242120] mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sector 13, Kurukshetra"
                    value={newReview.location}
                    onChange={(e) => setNewReview({ ...newReview, location: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-lg text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                  />
                </div>
              </div>

              {/* Category Tag */}
              <div>
                <label className="block text-xs font-semibold text-[#242120] mb-1">
                  Style Tag
                </label>
                <select
                  value={newReview.tag}
                  onChange={(e) => setNewReview({ ...newReview, tag: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-lg text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                >
                    <option value="Wedding Drape">Wedding Drape</option>
                    <option value="Ethnic Elegance">Ethnic Elegance</option>
                    <option value="Western Wear">Western Wear</option>
                    <option value="Campus Style">Campus Style</option>
                    <option value="Boutique Finish">Boutique Finish</option>
                    <option value="Budget Edit">Budget Edit</option>
                  </select>
                </div>

              {/* Review Comment */}
              <div>
                <label className="block text-xs font-semibold text-[#242120] mb-1">
                  Your Review / Story *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share details about the fabric quality, stitching, comfort, and how many compliments you received..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-lg text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                />
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className="px-4 py-2 border border-[#D9CEBF] text-[#5C554E] hover:bg-white text-xs font-medium rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#721B29] text-white text-xs font-semibold rounded-lg hover:bg-[#852031] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Submitted Toast */}
      {reviewSubmittedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1717] text-white px-4 py-3 rounded-lg shadow-xl border border-[#3E3435] flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Thank you! Your review has been added to our live carousel.</span>
        </div>
      )}
    </motion.section>
  );
};

