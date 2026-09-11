import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { HomeSectionConfig, HomeSectionType, HeroSlide, Testimonial, InstagramPost, BudgetTier } from '../../types';
import {
  Plus,
  Trash2,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  RotateCcw,
  Sparkles,
  Check,
  Edit2,
  X,
  Link,
  Sliders,
  Globe,
  ShieldCheck,
  MessageSquare,
  Star,
  Instagram,
  Tag,
  ShoppingBag,
  ArrowRight,
  Megaphone,
  Layers,
  LayoutGrid,
  ExternalLink,
  Save,
  MessageCircle,
} from 'lucide-react';



type ManagerTab =
  | 'overview'
  | 'announcement'
  | 'hero'
  | 'categories'
  | 'budget'
  | 'trust'
  | 'testimonials'
  | 'instagram'
  | 'custom-banners';

export const HomepageSectionsManager: React.FC = () => {
  const {
    homeSections,
    updateHomeSection,
    addHomeSection,
    deleteHomeSection,
    reorderHomeSections,
    resetHomeSections,
    heroSlides,
    updateHeroSlide,
    addHeroSlide,
    deleteHeroSlide,
    resetHeroSlides,
    announcementText,
    setAnnouncementText,
    budgetTiles,
    updateBudgetTile,
    resetBudgetTiles,
    trustFeatures,
    updateTrustFeature,
    resetTrustFeatures,
    testimonials,
    updateTestimonial,
    addTestimonial,
    deleteTestimonial,
    resetTestimonials,
    instagramPosts,
    updateInstagramPost,
    addInstagramPost,
    deleteInstagramPost,
    instagramHandle,
    setInstagramHandle,
    categories,
    products,
  } = useStore();

  const [activeTab, setActiveTab] = useState<ManagerTab>('overview');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editingIgId, setEditingIgId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Slide State
  const [isAddSlideModalOpen, setIsAddSlideModalOpen] = useState(false);
  const [newSlide, setNewSlide] = useState<{
    title: string;
    tagline: string;
    subtitle: string;
    image: string;
    category: string;
    ctaText: string;
  }>({
    title: 'The Festive Grace 2026',
    tagline: 'Autumn Royal Edit',
    subtitle: 'Pre-draped sarees, regal lehengas & embroidered ethnic suits.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1800&q=85',
    category: 'Ethnic Wear',
    ctaText: 'Explore Ethnic Collection',
  });

  // New Testimonial State
  const [isAddReviewModalOpen, setIsAddReviewModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: '',
    location: 'Kurukshetra',
    rating: 5,
    outfitPurchased: 'Pre-Stitched Georgette Saree',
    comment: '',
    tag: 'Wedding Drape',
    verified: true,
  });

  // New Instagram Post State
  const [isAddIgModalOpen, setIsAddIgModalOpen] = useState(false);
  const [newIgPost, setNewIgPost] = useState({
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    caption: 'Sunday styling with our latest collection! Tap to order 🌸',
    likes: 850,
    comments: 42,
    productTag: 'Western Fusion Edit',
  });

  // New Custom Banner Section State
  const [isAddBannerModalOpen, setIsAddBannerModalOpen] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: 'Festival Flash Sale',
    tagline: 'Limited Time Edit',
    subtitle: 'Flat 20% off on all heavy bridal lehengas and pre-stitched sarees',
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
    buttonText: 'Shop Sale Now',
    buttonLink: 'plp',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const sortedSections = [...homeSections].sort((a, b) => a.order - b.order);

  const handleCreateSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlide.title.trim() || !newSlide.image.trim()) return;
    addHeroSlide({
      title: newSlide.title.trim(),
      tagline: newSlide.tagline.trim(),
      subtitle: newSlide.subtitle.trim(),
      image: newSlide.image.trim(),
      category: newSlide.category,
      ctaText: newSlide.ctaText.trim(),
    });
    setIsAddSlideModalOpen(false);
    showToast('Added new Hero Carousel slide!');
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.comment.trim()) return;
    addTestimonial({
      name: newReview.name.trim(),
      location: newReview.location.trim() || 'Kurukshetra',
      rating: newReview.rating,
      comment: newReview.comment.trim(),
      outfitPurchased: newReview.outfitPurchased.trim(),
      tag: newReview.tag,
      verified: true,
    });
    setIsAddReviewModalOpen(false);
    showToast('Added customer review!');
  };

  const handleCreateIgPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIgPost.image.trim()) return;
    addInstagramPost({
      image: newIgPost.image.trim(),
      caption: newIgPost.caption.trim(),
      likes: Number(newIgPost.likes) || 120,
      comments: Number(newIgPost.comments) || 8,
      productTag: newIgPost.productTag.trim(),
    });
    setIsAddIgModalOpen(false);
    showToast('Added Instagram grid post!');
  };

  const handleCreateCustomBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBanner.title.trim()) return;
    addHomeSection({
      title: newBanner.title.trim(),
      tagline: newBanner.tagline.trim(),
      subtitle: newBanner.subtitle.trim(),
      type: 'custom-banner',
      enabled: true,
      images: newBanner.imageUrl ? [newBanner.imageUrl.trim()] : [],
      buttonText: newBanner.buttonText.trim(),
      buttonLink: newBanner.buttonLink,
    });
    setIsAddBannerModalOpen(false);
    showToast(`Added custom banner "${newBanner.title}" to homepage!`);
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1C1717] text-white px-4 py-3 rounded-lg shadow-xl border border-[#3E3435] flex items-center gap-2.5 text-xs animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Strip */}
      <div className="bg-white p-6 rounded-xl border border-[#EAE4D9] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#721B29] font-bold uppercase tracking-wider mb-1">
            <Sliders className="w-4 h-4" />
            <span>Visual Storefront Editor</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#242120]">
            Homepage Content & Layout Manager
          </h1>
          <p className="text-xs text-[#736B63] mt-1">
            Directly edit titles, hero sliders, banners, budget cards, customer reviews, trust badges, and section order matching the live homepage.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddBannerModalOpen(true)}
            className="px-4 py-2 bg-[#721B29] hover:bg-[#57141F] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Banner</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all homepage sections, hero slides, budget tiles, and guarantees to default settings?')) {
                resetHomeSections();
                resetHeroSlides();
                resetBudgetTiles();
                resetTrustFeatures();
                resetTestimonials();
                showToast('Reset homepage components to defaults!');
              }
            }}
            className="px-3.5 py-2 bg-white border border-[#D9CEBF] hover:bg-[#FAF8F3] text-[#242120] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#736B63]" />
            <span>Reset All Defaults</span>
          </button>
        </div>
      </div>

      {/* Component Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-xl border border-[#EAE4D9] shadow-2xs scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-[#721B29] text-white shadow-xs'
              : 'text-[#4A453E] hover:bg-[#FAF8F3]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Section Order & Visibility ({homeSections.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('announcement')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'announcement'
              ? 'bg-[#721B29] text-white shadow-xs'
              : 'text-[#4A453E] hover:bg-[#FAF8F3]'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>Announcement Bar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'hero'
              ? 'bg-[#721B29] text-white shadow-xs'
              : 'text-[#4A453E] hover:bg-[#FAF8F3]'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Hero Slides ({heroSlides.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('budget')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'budget'
              ? 'bg-[#721B29] text-white shadow-xs'
              : 'text-[#4A453E] hover:bg-[#FAF8F3]'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Budget Edit Cards ({budgetTiles.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trust')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'trust'
              ? 'bg-[#721B29] text-white shadow-xs'
              : 'text-[#4A453E] hover:bg-[#FAF8F3]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Store Guarantees ({trustFeatures.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('testimonials')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'testimonials'
              ? 'bg-[#721B29] text-white shadow-xs'
              : 'text-[#4A453E] hover:bg-[#FAF8F3]'
          }`}
        >
          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          <span>Testimonials ({testimonials.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('instagram')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'instagram'
              ? 'bg-[#721B29] text-white shadow-xs'
              : 'text-[#4A453E] hover:bg-[#FAF8F3]'
          }`}
        >
          <Instagram className="w-4 h-4" />
          <span>Instagram Feed ({instagramPosts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('custom-banners')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            activeTab === 'custom-banners'
              ? 'bg-[#721B29] text-white shadow-xs'
              : 'text-[#4A453E] hover:bg-[#FAF8F3]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Promo Banners</span>
        </button>
      </div>

      {/* TAB 1: SECTION ORDER & VISIBILITY OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-[#FAF8F3] p-4 rounded-xl border border-[#EAE4D9] flex items-center justify-between text-xs">
            <span className="text-[#4A453E] font-medium">
              💡 Reorder homepage sections or hide/show specific blocks in real time. Click <strong>Edit Section</strong> to customize section headings and hero photo arrays.
            </span>
            <button
              type="button"
              onClick={() => setIsAddBannerModalOpen(true)}
              className="px-3 py-1.5 bg-[#721B29] text-white text-xs font-bold rounded-md flex items-center gap-1 shrink-0 ml-4"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Banner Block</span>
            </button>
          </div>

          <div className="space-y-3">
            {sortedSections.map((sec, index) => {
              const isEditing = editingSectionId === sec.id;
              return (
                <div
                  key={sec.id}
                  className={`bg-white rounded-xl border transition-all shadow-xs overflow-hidden ${
                    sec.enabled ? 'border-[#EAE4D9]' : 'border-gray-200 opacity-60 bg-gray-50'
                  }`}
                >
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF8F3]/60 border-b border-[#EAE4D9]">
                    <div className="flex items-center gap-3">
                      {/* Order Controls */}
                      <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-[#EAE4D9]">
                        <span className="text-xs font-bold text-[#721B29] w-6 text-center">#{index + 1}</span>
                        <div className="flex flex-col">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => reorderHomeSections(sec.id, 'up')}
                            className="p-0.5 hover:text-[#721B29] disabled:opacity-30 cursor-pointer"
                            title="Move Section Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={index === sortedSections.length - 1}
                            onClick={() => reorderHomeSections(sec.id, 'down')}
                            className="p-0.5 hover:text-[#721B29] disabled:opacity-30 cursor-pointer"
                            title="Move Section Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-bold text-base text-[#242120]">{sec.title}</h3>
                          <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-[#EAE4D9] text-[#4A453E] rounded-full">
                            {sec.type}
                          </span>
                        </div>
                        {sec.tagline && <p className="text-xs text-[#721B29] font-medium mt-0.5">{sec.tagline}</p>}
                        {sec.subtitle && <p className="text-xs text-[#736B63] mt-0.5 line-clamp-1">{sec.subtitle}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          updateHomeSection(sec.id, { enabled: !sec.enabled });
                          showToast(!sec.enabled ? `Enabled "${sec.title}"` : `Hidden "${sec.title}"`);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                          sec.enabled
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {sec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        <span>{sec.enabled ? 'Live on Home' : 'Hidden'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setEditingSectionId(isEditing ? null : sec.id)}
                        className="px-3 py-1.5 bg-white border border-[#D9CEBF] hover:bg-[#FAF8F3] text-xs font-medium text-[#242120] rounded-lg flex items-center gap-1"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#721B29]" />
                        <span>{isEditing ? 'Done' : 'Edit Text'}</span>
                      </button>

                      {sec.id.startsWith('sec_') && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete section "${sec.title}"?`)) {
                              deleteHomeSection(sec.id);
                              showToast('Section removed');
                            }
                          }}
                          className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Custom Section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="p-4 sm:p-5 bg-[#FAF8F3] border-b border-[#EAE4D9] space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-[#4A453E] uppercase mb-1">
                            Section Title
                          </label>
                          <input
                            type="text"
                            value={sec.title}
                            onChange={(e) => updateHomeSection(sec.id, { title: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-[#4A453E] uppercase mb-1">
                            Tagline / Eyebrow Text
                          </label>
                          <input
                            type="text"
                            value={sec.tagline || ''}
                            onChange={(e) => updateHomeSection(sec.id, { tagline: e.target.value })}
                            className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-[#4A453E] uppercase mb-1">
                          Subtitle / Description
                        </label>
                        <input
                          type="text"
                          value={sec.subtitle || ''}
                          onChange={(e) => updateHomeSection(sec.id, { subtitle: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                        />
                      </div>

                      {(sec.type === 'custom-banner' || sec.buttonText) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <label className="block font-bold text-[#4A453E] uppercase mb-1">
                              CTA Button Text
                            </label>
                            <input
                              type="text"
                              value={sec.buttonText || ''}
                              onChange={(e) => updateHomeSection(sec.id, { buttonText: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-[#4A453E] uppercase mb-1">
                              Button Destination
                            </label>
                            <select
                              value={sec.buttonLink || 'plp'}
                              onChange={(e) => updateHomeSection(sec.id, { buttonLink: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-lg font-medium focus:outline-none focus:border-[#721B29]"
                            >
                              <option value="plp">Collections Page (PLP)</option>
                              <option value="whatsapp">Direct WhatsApp Chat</option>
                            </select>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ANNOUNCEMENT BAR */}
      {activeTab === 'announcement' && (
        <div className="bg-white p-6 rounded-xl border border-[#EAE4D9] shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#721B29]">
            <Megaphone className="w-5 h-5" />
            <h2>Top Announcement Bar Text</h2>
          </div>
          <p className="text-xs text-[#736B63]">
            This ticker message scrolls continuously across the top of all pages in the store.
          </p>

          <div className="space-y-2 max-w-2xl">
            <label className="block text-xs font-bold text-[#4A453E] uppercase">
              Announcement Message
            </label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded-lg text-xs font-medium focus:outline-none focus:border-[#721B29]"
              placeholder="e.g. Worldwide Shipping | 📲 9729515288 | DM us on Instagram to Order"
            />
          </div>

          <div className="p-4 bg-[#721B29] text-white rounded-lg text-xs flex items-center gap-3">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-white/20 px-2 py-0.5 rounded">
              Live Preview
            </span>
            <span className="truncate">{announcementText}</span>
          </div>
        </div>
      )}

      {/* TAB 3: HERO CAROUSEL SLIDES */}
      {activeTab === 'hero' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#EAE4D9]">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#242120]">Hero Carousel Banners</h2>
              <p className="text-xs text-[#736B63]">
                Manage main homepage slider images, titles, taglines, and call-to-action buttons.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddSlideModalOpen(true)}
              className="px-4 py-2 bg-[#721B29] hover:bg-[#57141F] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Hero Slide</span>
            </button>
          </div>

          {/* Slide Cards Grid matching Hero Carousel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {heroSlides.map((slide, idx) => {
              const isEditing = editingSlideId === slide.id;
              return (
                <div
                  key={slide.id}
                  className="bg-white rounded-xl border border-[#EAE4D9] shadow-xs overflow-hidden flex flex-col justify-between"
                >
                  {/* Live Hero Banner Preview Card */}
                  <div className="relative h-60 bg-[#241B1A] overflow-hidden p-6 flex flex-col justify-end text-white">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    <div className="relative z-10 space-y-1">
                      <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#E6C280] bg-black/40 px-2.5 py-0.5 rounded border border-[#E6C280]/30">
                        {slide.tagline}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-white line-clamp-1">{slide.title}</h3>
                      <p className="text-xs text-white/80 font-light line-clamp-1">{slide.subtitle}</p>

                      <div className="pt-2 flex items-center gap-2">
                        <span className="px-3 py-1 bg-[#721B29] text-white text-[11px] font-bold rounded-xs inline-flex items-center gap-1">
                          <span>{slide.ctaText}</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                        <span className="text-[10px] text-gray-300 font-medium">({slide.category})</span>
                      </div>
                    </div>

                    <span className="absolute top-3 left-3 z-10 px-2.5 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold rounded">
                      Slide #{idx + 1}
                    </span>
                  </div>

                  {/* Actions & Editable Form */}
                  <div className="p-4 bg-[#FAF8F3] border-t border-[#EAE4D9] space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#242120] uppercase tracking-wider">
                        Slide Settings
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingSlideId(isEditing ? null : slide.id)}
                          className="px-3 py-1.5 bg-white border border-[#D9CEBF] hover:bg-gray-50 text-xs font-medium text-[#242120] rounded-md flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#721B29]" />
                          <span>{isEditing ? 'Done' : 'Edit Slide'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete slide "${slide.title}"?`)) {
                              deleteHeroSlide(slide.id);
                              showToast('Slide deleted');
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="space-y-3 pt-2 text-xs">
                        <div>
                          <label className="block font-bold text-[#4A453E] uppercase mb-1">
                            Slide Title
                          </label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => updateHeroSlide(slide.id, { title: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-md focus:outline-none focus:border-[#721B29]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-[#4A453E] uppercase mb-1">
                              Tagline / Badge
                            </label>
                            <input
                              type="text"
                              value={slide.tagline}
                              onChange={(e) => updateHeroSlide(slide.id, { tagline: e.target.value })}
                              className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-md focus:outline-none focus:border-[#721B29]"
                            />
                          </div>
                          <div>
                            <label className="block font-bold text-[#4A453E] uppercase mb-1">
                              CTA Button Text
                            </label>
                            <input
                              type="text"
                              value={slide.ctaText}
                              onChange={(e) => updateHeroSlide(slide.id, { ctaText: e.target.value })}
                              className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-md focus:outline-none focus:border-[#721B29]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-[#4A453E] uppercase mb-1">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            value={slide.subtitle}
                            onChange={(e) => updateHeroSlide(slide.id, { subtitle: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-md focus:outline-none focus:border-[#721B29]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#4A453E] uppercase mb-1">
                            Hero Image URL
                          </label>
                          <input
                            type="url"
                            value={slide.image}
                            onChange={(e) => updateHeroSlide(slide.id, { image: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-md focus:outline-none focus:border-[#721B29]"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#4A453E] uppercase mb-1">
                            Target Category Link
                          </label>
                          <select
                            value={slide.category}
                            onChange={(e) => updateHeroSlide(slide.id, { category: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded-md font-medium focus:outline-none focus:border-[#721B29]"
                          >
                            <option value="Ethnic Wear">Ethnic Wear</option>
                            <option value="Western Wear">Western Wear</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: SHOP BY BUDGET EDIT CARDS */}
      {activeTab === 'budget' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[#EAE4D9] flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#242120]">Shop By Budget Cards</h2>
              <p className="text-xs text-[#736B63]">
                Customize budget prices (Under ₹999, Under ₹1499), card cover photos, titles, and subheadings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                resetBudgetTiles();
                showToast('Reset budget tiles to defaults');
              }}
              className="px-3.5 py-2 bg-white border border-[#D9CEBF] text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#736B63]" />
              <span>Reset Budget Cards</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {budgetTiles.map((tile) => (
              <div
                key={tile.tier}
                className="bg-white rounded-xl border border-[#EAE4D9] shadow-xs overflow-hidden flex flex-col justify-between"
              >
                {/* Live Card Preview */}
                <div className="relative h-64 bg-[#1A1415] overflow-hidden p-4 flex flex-col justify-end text-white">
                  <img
                    src={tile.image}
                    alt={tile.priceLabel}
                    className="absolute inset-0 w-full h-full object-cover opacity-65"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2 py-0.5 bg-white/90 text-[#721B29] text-[10px] font-bold uppercase rounded">
                      {tile.badge}
                    </span>
                  </div>

                  <div className="relative z-10 space-y-1">
                    <span className="font-serif text-2xl font-bold text-[#FDFBF7] block">
                      {tile.priceLabel}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider text-[#E6C280] font-semibold block">
                      {tile.title}
                    </span>
                    <p className="text-[11px] text-white/80 font-light line-clamp-2">{tile.subtitle}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="p-4 bg-[#FAF8F3] border-t border-[#EAE4D9] space-y-2.5 text-xs">
                  <div>
                    <label className="block font-bold text-[#4A453E] uppercase text-[10px]">
                      Price Heading Label
                    </label>
                    <input
                      type="text"
                      value={tile.priceLabel}
                      onChange={(e) => updateBudgetTile(tile.tier, { priceLabel: e.target.value })}
                      className="w-full px-2.5 py-1 bg-white border border-[#D9CEBF] rounded text-xs font-semibold focus:outline-none focus:border-[#721B29]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4A453E] uppercase text-[10px]">
                      Title / Style Name
                    </label>
                    <input
                      type="text"
                      value={tile.title}
                      onChange={(e) => updateBudgetTile(tile.tier, { title: e.target.value })}
                      className="w-full px-2.5 py-1 bg-white border border-[#D9CEBF] rounded text-xs focus:outline-none focus:border-[#721B29]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4A453E] uppercase text-[10px]">
                      Subtitle / Styles Preview
                    </label>
                    <input
                      type="text"
                      value={tile.subtitle}
                      onChange={(e) => updateBudgetTile(tile.tier, { subtitle: e.target.value })}
                      className="w-full px-2.5 py-1 bg-white border border-[#D9CEBF] rounded text-xs focus:outline-none focus:border-[#721B29]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4A453E] uppercase text-[10px]">
                      Badge Label
                    </label>
                    <input
                      type="text"
                      value={tile.badge}
                      onChange={(e) => updateBudgetTile(tile.tier, { badge: e.target.value })}
                      className="w-full px-2.5 py-1 bg-white border border-[#D9CEBF] rounded text-xs focus:outline-none focus:border-[#721B29]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#4A453E] uppercase text-[10px]">
                      Cover Image URL
                    </label>
                    <input
                      type="url"
                      value={tile.image}
                      onChange={(e) => updateBudgetTile(tile.tier, { image: e.target.value })}
                      className="w-full px-2.5 py-1 bg-white border border-[#D9CEBF] rounded text-xs focus:outline-none focus:border-[#721B29]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: STORE GUARANTEES & TRUST STRIP */}
      {activeTab === 'trust' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[#EAE4D9] flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#242120]">Store Guarantees & Trust Features</h2>
              <p className="text-xs text-[#736B63]">
                Edit the 3 trust pillars (Shipping, Quality Inspection, WhatsApp Support) rendered on the homepage.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                resetTrustFeatures();
                showToast('Reset trust features');
              }}
              className="px-3.5 py-2 bg-white border border-[#D9CEBF] text-xs font-semibold rounded-lg flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#736B63]" />
              <span>Reset Guarantees</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustFeatures.map((tf) => (
              <div key={tf.id} className="bg-white rounded-xl border border-[#EAE4D9] p-5 shadow-xs space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#721B29]/10 text-[#721B29] flex items-center justify-center font-bold">
                    {tf.iconType === 'globe' && <Globe className="w-5 h-5" />}
                    {tf.iconType === 'shield' && <ShieldCheck className="w-5 h-5" />}
                    {tf.iconType === 'whatsapp' && <MessageSquare className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#242120]">{tf.title}</h3>
                    <span className="text-[10px] text-[#736B63] font-mono">ID: {tf.id}</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#4A453E] uppercase text-[10px] mb-1">
                    Feature Title
                  </label>
                  <input
                    type="text"
                    value={tf.title}
                    onChange={(e) => updateTrustFeature(tf.id, { title: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded text-xs font-semibold focus:outline-none focus:border-[#721B29]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4A453E] uppercase text-[10px] mb-1">
                    Feature Description
                  </label>
                  <textarea
                    rows={3}
                    value={tf.description}
                    onChange={(e) => updateTrustFeature(tf.id, { description: e.target.value })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded text-xs focus:outline-none focus:border-[#721B29]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4A453E] uppercase text-[10px] mb-1">
                    Icon Type
                  </label>
                  <select
                    value={tf.iconType}
                    onChange={(e) => updateTrustFeature(tf.id, { iconType: e.target.value as any })}
                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded text-xs font-medium focus:outline-none focus:border-[#721B29]"
                  >
                    <option value="globe">Globe (Shipping)</option>
                    <option value="shield">Shield (Quality Assured)</option>
                    <option value="whatsapp">WhatsApp (Live Chat Support)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CUSTOMER TESTIMONIALS */}
      {activeTab === 'testimonials' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#EAE4D9]">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#242120]">Customer Reviews & Testimonials</h2>
              <p className="text-xs text-[#736B63]">
                Add, edit, or remove customer reviews displayed in the homepage carousel.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddReviewModalOpen(true)}
              className="px-4 py-2 bg-[#721B29] hover:bg-[#57141F] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Customer Review</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t) => {
              const isEditing = editingReviewId === t.id;
              return (
                <div key={t.id} className="bg-white rounded-xl border border-[#EAE4D9] p-4 shadow-xs space-y-3 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex text-amber-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-[#FAF8F3] text-[#721B29] rounded border border-[#EAE4D9]">
                        {t.tag || 'Boutique Review'}
                      </span>
                    </div>

                    <p className="text-xs text-[#242120] font-serif italic mb-3">"{t.comment}"</p>

                    <div className="flex items-center justify-between text-[11px] text-[#736B63] pt-2 border-t border-[#F3EFE6]">
                      <span className="font-bold text-[#242120]">{t.name} ({t.location})</span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#F3EFE6] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setEditingReviewId(isEditing ? null : t.id)}
                      className="px-2.5 py-1 bg-white border border-[#D9CEBF] text-[11px] font-medium text-[#242120] rounded hover:bg-[#FAF8F3]"
                    >
                      {isEditing ? 'Done' : 'Edit Review'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete review from "${t.name}"?`)) {
                          deleteTestimonial(t.id);
                          showToast('Review deleted');
                        }
                      }}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {isEditing && (
                    <div className="space-y-2 pt-2 border-t border-[#EAE4D9]">
                      <div>
                        <label className="block font-bold uppercase text-[10px]">Customer Name</label>
                        <input
                          type="text"
                          value={t.name}
                          onChange={(e) => updateTestimonial(t.id, { name: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-bold uppercase text-[10px]">Location</label>
                        <input
                          type="text"
                          value={t.location}
                          onChange={(e) => updateTestimonial(t.id, { location: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-bold uppercase text-[10px]">Review Comment</label>
                        <textarea
                          rows={2}
                          value={t.comment}
                          onChange={(e) => updateTestimonial(t.id, { comment: e.target.value })}
                          className="w-full px-2 py-1 border rounded text-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 7: INSTAGRAM FEED */}
      {activeTab === 'instagram' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[#EAE4D9] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-bold text-[#242120]">Instagram Style Grid</h2>
                <p className="text-xs text-[#736B63]">
                  Update Instagram handle, photos, captions, and liked counts.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddIgModalOpen(true)}
                className="px-4 py-2 bg-[#721B29] hover:bg-[#57141F] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add IG Grid Photo</span>
              </button>
            </div>

            <div className="flex items-center gap-2 max-w-md pt-1">
              <span className="text-xs font-bold text-[#4A453E]">Instagram Handle:</span>
              <input
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded text-xs font-bold text-[#721B29]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {instagramPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg border border-[#EAE4D9] overflow-hidden flex flex-col justify-between">
                <div className="relative aspect-square bg-[#1A1415]">
                  <img src={post.image} alt={post.caption} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Delete Instagram post?')) {
                        deleteInstagramPost(post.id);
                        showToast('Post deleted');
                      }
                    }}
                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-80 hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="p-2 space-y-1 text-[11px]">
                  <p className="line-clamp-2 text-gray-700 text-[10px]">{post.caption}</p>
                  <div className="flex items-center justify-between text-[10px] text-[#721B29] font-bold pt-1 border-t">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: CUSTOM BANNERS */}
      {activeTab === 'custom-banners' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#EAE4D9]">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#242120]">Custom Promotional Banners</h2>
              <p className="text-xs text-[#736B63]">
                Create custom full-width promotion banners for sale events, festive edits, or special announcements.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddBannerModalOpen(true)}
              className="px-4 py-2 bg-[#721B29] hover:bg-[#57141F] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Banner Block</span>
            </button>
          </div>

          <div className="space-y-4">
            {homeSections
              .filter((s) => s.type === 'custom-banner' || s.id.startsWith('sec_'))
              .map((sec) => (
                <div key={sec.id} className="bg-[#241C1D] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-white/10">
                  {sec.images?.[0] && (
                    <img src={sec.images[0]} alt={sec.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
                  )}
                  <div className="relative z-10 max-w-xl space-y-2">
                    {sec.tagline && (
                      <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#E6C280] bg-[#E6C280]/20 px-3 py-1 rounded-full border border-[#E6C280]/30">
                        {sec.tagline}
                      </span>
                    )}
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">{sec.title}</h3>
                    {sec.subtitle && <p className="text-xs text-gray-200">{sec.subtitle}</p>}
                    {sec.buttonText && (
                      <button
                        type="button"
                        className="mt-3 px-5 py-2 bg-[#721B29] text-white text-xs font-bold rounded-md"
                      >
                        {sec.buttonText}
                      </button>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete banner "${sec.title}"?`)) {
                          deleteHomeSection(sec.id);
                          showToast('Banner deleted');
                        }
                      }}
                      className="p-2 bg-rose-600/90 hover:bg-rose-700 text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD HERO SLIDE */}
      {isAddSlideModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#EAE4D9] max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-[#242120]">Add New Hero Slide</h3>
              <button type="button" onClick={() => setIsAddSlideModalOpen(false)} className="p-1 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSlide} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-[11px] mb-1">Slide Title *</label>
                <input
                  type="text"
                  required
                  value={newSlide.title}
                  onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-[11px] mb-1">Tagline / Badge</label>
                <input
                  type="text"
                  value={newSlide.tagline}
                  onChange={(e) => setNewSlide({ ...newSlide, tagline: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-[11px] mb-1">Subtitle</label>
                <input
                  type="text"
                  value={newSlide.subtitle}
                  onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold uppercase text-[11px] mb-1">Hero Photo URL *</label>
                <input
                  type="url"
                  required
                  value={newSlide.image}
                  onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-[11px] mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={newSlide.ctaText}
                    onChange={(e) => setNewSlide({ ...newSlide, ctaText: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-[11px] mb-1">Category Target</label>
                  <select
                    value={newSlide.category}
                    onChange={(e) => setNewSlide({ ...newSlide, category: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="Ethnic Wear">Ethnic Wear</option>
                    <option value="Western Wear">Western Wear</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddSlideModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#721B29] text-white font-bold rounded-lg shadow-sm"
                >
                  Save Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD CUSTOM BANNER SECTION */}
      {isAddBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#EAE4D9] max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EAE4D9] pb-3">
              <h3 className="font-serif font-bold text-lg text-[#242120]">Add Custom Banner Block</h3>
              <button
                type="button"
                onClick={() => setIsAddBannerModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomBanner} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-[11px] text-[#4A453E] mb-1">
                  Banner Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kurukshetra Festive Clearance"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[11px] text-[#4A453E] mb-1">
                  Tagline / Eyebrow
                </label>
                <input
                  type="text"
                  placeholder="e.g. Limited Festive Edit"
                  value={newBanner.tagline}
                  onChange={(e) => setNewBanner({ ...newBanner, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[11px] text-[#4A453E] mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  placeholder="e.g. Flat discounts on pre-stitched sarees & fusion sets"
                  value={newBanner.subtitle}
                  onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-[11px] text-[#4A453E] mb-1">
                  Banner Background Photo URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newBanner.imageUrl}
                  onChange={(e) => setNewBanner({ ...newBanner, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-[11px] text-[#4A453E] mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={newBanner.buttonText}
                    onChange={(e) => setNewBanner({ ...newBanner, buttonText: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-[11px] text-[#4A453E] mb-1">
                    Button Action
                  </label>
                  <select
                    value={newBanner.buttonLink}
                    onChange={(e) => setNewBanner({ ...newBanner, buttonLink: e.target.value })}
                    className="w-full px-3 py-2 border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                  >
                    <option value="plp">Collections Page (PLP)</option>
                    <option value="whatsapp">WhatsApp Order Chat</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#EAE4D9]">
                <button
                  type="button"
                  onClick={() => setIsAddBannerModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#721B29] hover:bg-[#57141F] text-white font-bold rounded-lg shadow-sm"
                >
                  Add Banner Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
