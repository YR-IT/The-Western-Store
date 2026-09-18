import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { HomeSectionConfig, HomeSectionType, HeroSlide, Testimonial, InstagramPost, BudgetTier } from '../../types';
import { ImageKitUploader } from './ImageKitUploader';
import { ImageKitMediaLibraryModal } from './ImageKitMediaLibraryModal';
import { SupabaseVideoLibraryModal } from './SupabaseVideoLibraryModal';
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
  Video,
  Play,
  Folder,
  Film,
} from 'lucide-react';



type ManagerTab =
  | 'overview'
  | 'announcement'
  | 'hero'
  | 'categories'
  | 'budget'
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
    reorderInstagramPosts,
    resetInstagramPosts,
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

  // Hero Slide Preview Mode per slide: 'desktop' | 'mobile'
  const [heroFilterDevice, setHeroFilterDevice] = useState<'all' | 'desktop' | 'mobile'>('all');
  const [heroPreviewMode, setHeroPreviewMode] = useState<Record<string, 'desktop' | 'mobile'>>({});
  const [heroTargetMedia, setHeroTargetMedia] = useState<{ slideId: string | null; field: 'desktopImage' | 'mobileImage' } | null>(null);
  const [isHeroMediaModalOpen, setIsHeroMediaModalOpen] = useState(false);

  // New Slide State
  const [isAddSlideModalOpen, setIsAddSlideModalOpen] = useState(false);
  const [newSlide, setNewSlide] = useState<{
    targetDevice: 'all' | 'desktop' | 'mobile';
    desktopImage: string;
    mobileImage: string;
    image: string;
    title: string;
    tagline: string;
    subtitle: string;
    category: string;
    ctaText: string;
    showTextOverlay: boolean;
  }>({
    targetDevice: 'all',
    desktopImage: '',
    mobileImage: '',
    image: '',
    title: '',
    tagline: '',
    subtitle: '',
    category: 'All',
    ctaText: 'Explore Collection',
    showTextOverlay: false,
  });

  const handleSelectHeroMedia = (urls: string[]) => {
    if (urls.length > 0 && heroTargetMedia) {
      const chosenUrl = urls[0];
      if (heroTargetMedia.slideId) {
        if (heroTargetMedia.field === 'mobileImage') {
          updateHeroSlide(heroTargetMedia.slideId, { mobileImage: chosenUrl });
          showToast('Updated Mobile banner!');
        } else {
          updateHeroSlide(heroTargetMedia.slideId, { desktopImage: chosenUrl, image: chosenUrl });
          showToast('Updated Desktop banner!');
        }
      } else {
        if (heroTargetMedia.field === 'mobileImage') {
          setNewSlide((prev) => ({ ...prev, mobileImage: chosenUrl }));
          showToast('Attached Mobile banner!');
        } else {
          setNewSlide((prev) => ({ ...prev, desktopImage: chosenUrl, image: chosenUrl }));
          showToast('Attached Desktop banner!');
        }
      }
    }
  };

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

  // New Instagram / Video Reel State
  const [isAddIgModalOpen, setIsAddIgModalOpen] = useState(false);
  const [isIgMediaLibraryOpen, setIsIgMediaLibraryOpen] = useState(false);
  const [igTargetItemForMedia, setIgTargetItemForMedia] = useState<string | null>(null);
  const [newIgPost, setNewIgPost] = useState({
    reelUrl: '',
  });

  // Supabase Video Storage Modal State
  const [isSupabaseVideoModalOpen, setIsSupabaseVideoModalOpen] = useState(false);
  const [supabaseVideoTargetId, setSupabaseVideoTargetId] = useState<string | null>(null);

  const handleSelectSupabaseVideo = (url: string) => {
    if (supabaseVideoTargetId) {
      updateInstagramPost(supabaseVideoTargetId, { reelUrl: url });
      showToast('Video attached from Supabase Storage!');
    } else {
      setNewIgPost((prev) => ({ ...prev, reelUrl: url }));
      showToast('Video attached to new reel!');
    }
  };

  const handleSelectIgVideo = (urls: string[]) => {
    if (urls.length > 0) {
      const chosenUrl = urls[0];
      if (igTargetItemForMedia) {
        updateInstagramPost(igTargetItemForMedia, { reelUrl: chosenUrl });
        showToast('Video attached from ImageKit!');
      } else {
        setNewIgPost((prev) => ({ ...prev, reelUrl: chosenUrl }));
        showToast('Video attached to new reel!');
      }
    }
  };

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
    const td = newSlide.targetDevice || 'all';

    // Validate: need at least the right image for the targeted device
    if (td === 'desktop' && !newSlide.desktopImage) {
      showToast('Please upload a Desktop Banner image.');
      return;
    }
    if (td === 'mobile' && !newSlide.mobileImage) {
      showToast('Please upload a Mobile Banner image.');
      return;
    }
    if (td === 'all' && !newSlide.desktopImage && !newSlide.mobileImage) {
      showToast('Please upload at least one banner image.');
      return;
    }

    // Set fallback image correctly per device target
    const primaryImg =
      td === 'mobile'
        ? newSlide.mobileImage
        : newSlide.desktopImage || newSlide.mobileImage;

    addHeroSlide({
      image: primaryImg,
      // For desktop-only, don't fill mobile with desktop image (and vice-versa)
      desktopImage: td === 'mobile' ? '' : (newSlide.desktopImage || primaryImg),
      mobileImage: td === 'desktop' ? '' : (newSlide.mobileImage || primaryImg),
      targetDevice: td,
      title: newSlide.title || '',
      tagline: newSlide.tagline || '',
      subtitle: newSlide.subtitle || '',
      category: newSlide.category || 'All',
      ctaText: newSlide.ctaText || 'Shop Collection',
      showTextOverlay: !!newSlide.showTextOverlay,
    });
    setNewSlide({
      targetDevice: 'all',
      desktopImage: '',
      mobileImage: '',
      image: '',
      title: '',
      tagline: '',
      subtitle: '',
      category: 'All',
      ctaText: 'Explore Collection',
      showTextOverlay: false,
    });
    setIsAddSlideModalOpen(false);
    showToast('Added New Hero Slide!');
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
    if (!newIgPost.reelUrl.trim()) return;
    addInstagramPost({
      reelUrl: newIgPost.reelUrl.trim(),
      title: '',
      caption: '',
      likes: 0,
      comments: 0,
      productTag: '',
    });
    setIsAddIgModalOpen(false);
    setNewIgPost({ reelUrl: '' });
    showToast('Added Video Reel!');
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

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete section "${sec.title}" from homepage?`)) {
                            deleteHomeSection(sec.id);
                            showToast(`Deleted section "${sec.title}"`);
                          }
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Section Block"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#EAE4D9]">
            <div>
              <h2 className="font-serif text-lg font-bold text-[#242120] flex items-center gap-2">
                <span>Hero Carousel Banners</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Dual Desktop & Mobile Banners
                </span>
              </h2>
              <p className="text-xs text-[#736B63]">
                Show different slides or banners on PC/Laptops vs Mobile phones. Upload images and customize destinations.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddSlideModalOpen(true)}
              className="px-4 py-2 bg-[#721B29] hover:bg-[#57141F] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Hero Slide</span>
            </button>
          </div>

          {/* Filter Bar by Target Device */}
          <div className="flex items-center gap-2 bg-[#FAF8F3] p-1.5 rounded-xl border border-[#EAE4D9]">
            <button
              type="button"
              onClick={() => setHeroFilterDevice('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                heroFilterDevice === 'all'
                  ? 'bg-[#721B29] text-white shadow-xs'
                  : 'text-[#736B63] hover:text-[#242120]'
              }`}
            >
              🌐 All Slides ({heroSlides.length})
            </button>
            <button
              type="button"
              onClick={() => setHeroFilterDevice('desktop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                heroFilterDevice === 'desktop'
                  ? 'bg-[#721B29] text-white shadow-xs'
                  : 'text-[#736B63] hover:text-[#242120]'
              }`}
            >
              🖥️ PC / Laptop Slides ({heroSlides.filter(s => (s.targetDevice || 'all') === 'desktop' || (s.targetDevice || 'all') === 'all').length})
            </button>
            <button
              type="button"
              onClick={() => setHeroFilterDevice('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                heroFilterDevice === 'mobile'
                  ? 'bg-[#721B29] text-white shadow-xs'
                  : 'text-[#736B63] hover:text-[#242120]'
              }`}
            >
              📱 Mobile Phone Slides ({heroSlides.filter(s => (s.targetDevice || 'all') === 'mobile' || (s.targetDevice || 'all') === 'all').length})
            </button>
          </div>

          {/* Slide Cards Grid matching Hero Carousel */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {heroSlides
              .map((slide, globalIdx) => ({ slide, globalIdx }))
              .filter(({ slide }) => {
                const target = slide.targetDevice || 'all';
                if (heroFilterDevice === 'desktop') return target === 'desktop' || target === 'all';
                if (heroFilterDevice === 'mobile') return target === 'mobile' || target === 'all';
                return true;
              })
              .map(({ slide, globalIdx }) => {
              const idx = globalIdx;
              const isEditing = editingSlideId === slide.id;
              const targetDevice = slide.targetDevice || 'all';
              const currentMode = targetDevice === 'mobile' ? 'mobile' : (targetDevice === 'desktop' ? 'desktop' : (heroPreviewMode[slide.id] || 'desktop'));
              const activePreviewImg = currentMode === 'mobile' 
                ? (slide.mobileImage || slide.image)
                : (slide.desktopImage || slide.image);

              return (
                <div
                  key={slide.id}
                  className="bg-white rounded-xl border border-[#EAE4D9] shadow-xs overflow-hidden flex flex-col"
                >
                  {/* Preview Mode Switcher Header */}
                  <div className="px-4 py-2 bg-[#FAF8F3] border-b border-[#EAE4D9] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#242120] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#721B29]" />
                        <span>Slide #{idx + 1}</span>
                      </span>

                      {/* Device Target Badge */}
                      {targetDevice === 'desktop' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          🖥️ PC Only
                        </span>
                      )}
                      {targetDevice === 'mobile' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          📱 Mobile Only
                        </span>
                      )}
                      {targetDevice === 'all' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                          🌐 Both Views
                        </span>
                      )}
                    </div>

                    {targetDevice === 'all' && (
                      <div className="flex items-center bg-white rounded-lg border border-[#D9CEBF] p-0.5">
                        <button
                          type="button"
                          onClick={() => setHeroPreviewMode((p) => ({ ...p, [slide.id]: 'desktop' }))}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            currentMode === 'desktop'
                              ? 'bg-[#721B29] text-white shadow-2xs'
                              : 'text-[#736B63] hover:text-[#242120]'
                          }`}
                        >
                          <span>🖥️ PC View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroPreviewMode((p) => ({ ...p, [slide.id]: 'mobile' }))}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            currentMode === 'mobile'
                              ? 'bg-[#721B29] text-white shadow-2xs'
                              : 'text-[#736B63] hover:text-[#242120]'
                          }`}
                        >
                          <span>📱 Mobile View</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Live Hero Banner Preview Card */}
                  <div
                    className={`relative bg-[#1A1415] overflow-hidden flex flex-col justify-end text-white transition-all ${
                      currentMode === 'mobile' ? 'h-72 aspect-[9/14] mx-auto w-48 rounded-lg my-3 border border-white/20 shadow-md' : 'h-60 w-full'
                    }`}
                  >
                    {activePreviewImg ? (
                      <img
                        src={activePreviewImg}
                        alt={slide.title || 'Store Banner'}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-white/40 text-xs">
                          <div className="text-3xl mb-2">{currentMode === 'mobile' ? '📱' : '🖥️'}</div>
                          <div>No {currentMode === 'mobile' ? 'mobile' : 'desktop'} image yet</div>
                          <div className="text-[10px] mt-1">Upload below to preview</div>
                        </div>
                      </div>
                    )}

                    {/* Optional Text Overlay Preview if enabled */}
                    {slide.showTextOverlay && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                        <div className="relative z-10 p-4 space-y-1">
                          {slide.tagline && (
                            <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#E6C280] bg-black/40 px-2 py-0.5 rounded border border-[#E6C280]/30">
                              {slide.tagline}
                            </span>
                          )}
                          {slide.title && (
                            <h3 className="font-serif text-base font-bold text-white line-clamp-1">{slide.title}</h3>
                          )}
                          {slide.subtitle && (
                            <p className="text-[11px] text-white/80 font-light line-clamp-1">{slide.subtitle}</p>
                          )}
                          <div className="pt-1 flex items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-[#721B29] text-white text-[10px] font-bold rounded inline-flex items-center gap-1">
                              <span>{slide.ctaText || 'Shop Now'}</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>
                      </>
                    )}

                    {!slide.showTextOverlay && (
                      <div className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-black/70 backdrop-blur-xs text-[#E6C280] text-[9px] font-bold rounded border border-white/10">
                        Pure Banner (No Text Overlay)
                      </div>
                    )}
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
                          className="px-3 py-1.5 bg-white border border-[#D9CEBF] hover:bg-gray-50 text-xs font-medium text-[#242120] rounded-md flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#721B29]" />
                          <span>{isEditing ? 'Done' : 'Edit Slide'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete slide #${idx + 1}?`)) {
                              deleteHeroSlide(slide.id);
                              showToast('Slide deleted');
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {isEditing && (
                      <div className="space-y-4 pt-2 text-xs">
                        {/* Target Device Selector */}
                        <div className="p-3 bg-white rounded-lg border border-[#EAE4D9] space-y-2">
                          <label className="block font-bold text-[#4A453E] uppercase text-[10px]">
                            🎯 Target Device Visibility
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            <button
                              type="button"
                              onClick={() => updateHeroSlide(slide.id, { targetDevice: 'all' })}
                              className={`py-1.5 px-2 rounded text-[11px] font-bold text-center border transition-all cursor-pointer ${
                                (slide.targetDevice || 'all') === 'all'
                                  ? 'bg-[#721B29] text-white border-[#721B29]'
                                  : 'bg-[#FAF8F3] text-[#4A453E] border-[#D9CEBF] hover:border-[#721B29]'
                              }`}
                            >
                              🌐 All Devices
                            </button>
                            <button
                              type="button"
                              onClick={() => updateHeroSlide(slide.id, { targetDevice: 'desktop' })}
                              className={`py-1.5 px-2 rounded text-[11px] font-bold text-center border transition-all cursor-pointer ${
                                slide.targetDevice === 'desktop'
                                  ? 'bg-[#721B29] text-white border-[#721B29]'
                                  : 'bg-[#FAF8F3] text-[#4A453E] border-[#D9CEBF] hover:border-[#721B29]'
                              }`}
                            >
                              🖥️ PC / Laptop Only
                            </button>
                            <button
                              type="button"
                              onClick={() => updateHeroSlide(slide.id, { targetDevice: 'mobile' })}
                              className={`py-1.5 px-2 rounded text-[11px] font-bold text-center border transition-all cursor-pointer ${
                                slide.targetDevice === 'mobile'
                                  ? 'bg-[#721B29] text-white border-[#721B29]'
                                  : 'bg-[#FAF8F3] text-[#4A453E] border-[#D9CEBF] hover:border-[#721B29]'
                              }`}
                            >
                              📱 Mobile Only
                            </button>
                          </div>
                        </div>

                        {/* 1. Desktop Banner Upload (Shown if 'all' or 'desktop') */}
                        {(slide.targetDevice === 'all' || slide.targetDevice === 'desktop' || !slide.targetDevice) && (
                          <div className="p-3 bg-white rounded-lg border border-[#EAE4D9] space-y-2">
                            <label className="block font-bold text-[#4A453E] uppercase text-[10px]">
                              🖥️ PC / Laptop Banner Image (Widescreen 1920x600) *
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="url"
                                placeholder="https://... (Desktop Banner URL)"
                                value={slide.desktopImage || slide.image}
                                onChange={(e) => updateHeroSlide(slide.id, { desktopImage: e.target.value, image: e.target.value })}
                                className="w-full px-2.5 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded text-xs font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setHeroTargetMedia({ slideId: slide.id, field: 'desktopImage' });
                                  setIsHeroMediaModalOpen(true);
                                }}
                                className="px-2.5 py-1.5 bg-[#FAF8F3] hover:bg-[#F3EFE6] text-[#721B29] border border-[#D9CEBF] text-xs font-bold rounded flex items-center gap-1 shrink-0 cursor-pointer"
                                title="Pick from ImageKit CDN"
                              >
                                <Folder className="w-3.5 h-3.5 text-[#721B29]" />
                                <span>CDN</span>
                              </button>
                            </div>
                            <ImageKitUploader
                              folder="/hero-slides"
                              buttonText="Upload Desktop Banner to ImageKit"
                              onUploadSuccess={(url) => {
                                updateHeroSlide(slide.id, { desktopImage: url, image: url });
                                showToast('Desktop Banner uploaded!');
                              }}
                            />
                          </div>
                        )}

                        {/* 2. Mobile Banner Upload (Shown if 'all' or 'mobile') */}
                        {(slide.targetDevice === 'all' || slide.targetDevice === 'mobile' || !slide.targetDevice) && (
                          <div className="p-3 bg-white rounded-lg border border-[#EAE4D9] space-y-2">
                            <label className="block font-bold text-[#4A453E] uppercase text-[10px]">
                              📱 Mobile Phone Image (Vertical / Normal) *
                            </label>
                            <div className="flex items-center gap-2">
                              <input
                                type="url"
                                placeholder="https://... (Mobile Image URL)"
                                value={slide.mobileImage || ''}
                                onChange={(e) => updateHeroSlide(slide.id, { mobileImage: e.target.value })}
                                className="w-full px-2.5 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded text-xs font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setHeroTargetMedia({ slideId: slide.id, field: 'mobileImage' });
                                  setIsHeroMediaModalOpen(true);
                                }}
                                className="px-2.5 py-1.5 bg-[#FAF8F3] hover:bg-[#F3EFE6] text-[#721B29] border border-[#D9CEBF] text-xs font-bold rounded flex items-center gap-1 shrink-0 cursor-pointer"
                                title="Pick from ImageKit CDN"
                              >
                                <Folder className="w-3.5 h-3.5 text-[#721B29]" />
                                <span>CDN</span>
                              </button>
                            </div>
                            <ImageKitUploader
                              folder="/hero-slides"
                              buttonText="Upload Mobile Image to ImageKit"
                              onUploadSuccess={(url) => {
                                updateHeroSlide(slide.id, { mobileImage: url });
                                showToast('Mobile Image uploaded!');
                              }}
                            />
                          </div>
                        )}

                        {/* 3. Destination Category Link */}
                        <div>
                          <label className="block font-bold text-[#4A453E] uppercase text-[10px] mb-1">
                            Destination Click Target / Category
                          </label>
                          <select
                            value={slide.category}
                            onChange={(e) => updateHeroSlide(slide.id, { category: e.target.value })}
                            className="w-full px-3 py-1.5 bg-white border border-[#D9CEBF] rounded font-medium focus:outline-none focus:border-[#721B29]"
                          >
                            <option value="All">All Collections (Full Catalog)</option>
                            <option value="New Arrivals">New Arrivals</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                            {slide.category &&
                              !['All', 'New Arrivals', ...categories.map((c) => c.name)].includes(slide.category) && (
                                <option value={slide.category}>{slide.category}</option>
                              )}
                          </select>
                        </div>

                        {/* 4. Text Overlay Toggle & Optional Text Fields */}
                        <div className="p-3 bg-white rounded-lg border border-[#EAE4D9] space-y-3">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={!!slide.showTextOverlay}
                              onChange={(e) => updateHeroSlide(slide.id, { showTextOverlay: e.target.checked })}
                              className="w-4 h-4 text-[#721B29] rounded border-[#D9CEBF] focus:ring-[#721B29]"
                            />
                            <span className="font-bold text-[#242120] text-xs">
                              Enable Text Overlay (Headings & Buttons over Banner)
                            </span>
                          </label>

                          {slide.showTextOverlay && (
                            <div className="space-y-2.5 pt-2 border-t border-[#F2ECE0]">
                              <div>
                                <label className="block font-bold text-[#4A453E] uppercase text-[10px] mb-1">
                                  Slide Title
                                </label>
                                <input
                                  type="text"
                                  value={slide.title || ''}
                                  onChange={(e) => updateHeroSlide(slide.id, { title: e.target.value })}
                                  className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded focus:outline-none focus:border-[#721B29]"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block font-bold text-[#4A453E] uppercase text-[10px] mb-1">
                                    Tagline / Badge
                                  </label>
                                  <input
                                    type="text"
                                    value={slide.tagline || ''}
                                    onChange={(e) => updateHeroSlide(slide.id, { tagline: e.target.value })}
                                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded focus:outline-none focus:border-[#721B29]"
                                  />
                                </div>
                                <div>
                                  <label className="block font-bold text-[#4A453E] uppercase text-[10px] mb-1">
                                    CTA Button Text
                                  </label>
                                  <input
                                    type="text"
                                    value={slide.ctaText || ''}
                                    onChange={(e) => updateHeroSlide(slide.id, { ctaText: e.target.value })}
                                    className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded focus:outline-none focus:border-[#721B29]"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block font-bold text-[#4A453E] uppercase text-[10px] mb-1">
                                  Subtitle
                                </label>
                                <input
                                  type="text"
                                  value={slide.subtitle || ''}
                                  onChange={(e) => updateHeroSlide(slide.id, { subtitle: e.target.value })}
                                  className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded focus:outline-none focus:border-[#721B29]"
                                />
                              </div>
                            </div>
                          )}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {budgetTiles.map((tile) => (
              <div
                key={tile.tier}
                className="bg-white rounded-xl border border-[#EAE4D9] shadow-xs overflow-hidden flex flex-col"
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
            {testimonials.map((t) => {
              const isEditing = editingReviewId === t.id;
              return (
                <div key={t.id} className="bg-white rounded-xl border border-[#EAE4D9] p-4 shadow-xs space-y-3 text-xs flex flex-col">
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

      {/* TAB 7: INSTAGRAM & VIDEO REELS */}
      {activeTab === 'instagram' && (() => {
        const igSec = homeSections.find((s) => s.id === 'instagram' || s.type === 'instagram');

        return (
          <div className="space-y-5">
            {/* Section Header & Global Settings */}
            <div className="bg-white p-5 rounded-xl border border-[#EAE4D9] space-y-4 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F4EFE6]">
                <div>
                  <h2 className="font-serif text-lg font-bold text-[#242120]">Autoplay Video Reels & Showcase</h2>
                  <p className="text-xs text-[#736B63]">
                    Upload and manage boutique videos in ImageKit (<span className="font-mono text-[#721B29]">/videos</span> folder). Videos will play seamlessly in autoplay muted format with audio toggle.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {igSec && (
                    <button
                      type="button"
                      onClick={() => {
                        updateHomeSection(igSec.id, { enabled: !igSec.enabled });
                        showToast(igSec.enabled ? 'Video section hidden' : 'Video section visible');
                      }}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
                        igSec.enabled
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                      }`}
                    >
                      {igSec.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                      <span>{igSec.enabled ? 'Section Visible' : 'Section Hidden'}</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSupabaseVideoTargetId(null);
                      setIsSupabaseVideoModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Film className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Supabase Video Storage</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIgTargetItemForMedia(null);
                      setIsIgMediaLibraryOpen(true);
                    }}
                    className="px-3 py-1.5 bg-[#FAF8F3] hover:bg-[#F3EFE6] text-[#721B29] border border-[#D9CEBF] text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Folder className="w-3.5 h-3.5 text-[#721B29]" />
                    <span>Browse ImageKit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddIgModalOpen(true)}
                    className="px-4 py-2 bg-[#721B29] hover:bg-[#57141F] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Video</span>
                  </button>
                </div>
              </div>



              {/* Section Details Editing */}
              {igSec && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-[#4A453E] uppercase mb-1">
                      Section Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. @the_western_store_kkr"
                      value={igSec.tagline || ''}
                      onChange={(e) => updateHomeSection(igSec.id, { tagline: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded text-xs text-[#242120] focus:outline-none focus:border-[#721B29]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#4A453E] uppercase mb-1">
                      Section Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Follow Us On Instagram"
                      value={igSec.title || ''}
                      onChange={(e) => updateHomeSection(igSec.id, { title: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded text-xs font-bold text-[#242120] focus:outline-none focus:border-[#721B29]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#4A453E] uppercase mb-1">
                      Official Handle / Account
                    </label>
                    <input
                      type="text"
                      placeholder="@the_western_store_kkr"
                      value={instagramHandle}
                      onChange={(e) => setInstagramHandle(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded text-xs font-bold text-[#721B29] focus:outline-none focus:border-[#721B29]"
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold text-[#4A453E] uppercase mb-1">
                      Section Subtitle / Description
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Watch real drape trials, bridal styling sessions, and packaging videos live from our Kurukshetra boutique."
                      value={igSec.subtitle || ''}
                      onChange={(e) => updateHomeSection(igSec.id, { subtitle: e.target.value })}
                      className="w-full px-3 py-1.5 bg-[#FAF8F3] border border-[#D9CEBF] rounded text-xs text-[#4A453E] focus:outline-none focus:border-[#721B29]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Video Reels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {instagramPosts.map((post, idx) => {
                const isEditing = editingIgId === post.id;
                const videoSrc = post.reelUrl || post.videoUrl || '';

                return (
                  <div key={post.id} className="bg-white rounded-xl border border-[#EAE4D9] p-4 shadow-xs space-y-3 text-xs flex flex-col justify-between">
                    <div>
                      {/* Video Player Preview */}
                      {videoSrc ? (
                        <div className="relative aspect-[9/14] max-h-48 w-full rounded-lg overflow-hidden bg-black mb-2 flex items-center justify-center group/vid border border-[#EAE4D9]">
                          <video
                            src={videoSrc}
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                            onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                            onMouseLeave={(e) => (e.target as HTMLVideoElement).pause()}
                          />
                          <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-black/70 backdrop-blur-xs text-[9px] font-bold text-white rounded flex items-center gap-1">
                            <Play className="w-2.5 h-2.5 fill-white" />
                            <span>Reel #{idx + 1}</span>
                          </div>
                          <a
                            href={videoSrc}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-black text-white rounded opacity-80 hover:opacity-100"
                            title="Open video in new tab"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      ) : (
                        <div className="aspect-[9/10] max-h-36 w-full rounded-lg bg-[#FAF8F3] border-2 border-dashed border-[#D9CEBF] mb-2 flex flex-col items-center justify-center text-center p-3 text-[#736B63]">
                          <Video className="w-6 h-6 text-[#721B29] mb-1 opacity-70" />
                          <span className="text-[11px] font-semibold text-[#242120]">No Video Attached</span>
                          <span className="text-[10px]">Upload or paste a URL below</span>
                        </div>
                      )}

                      {/* Video URL display */}
                      <div className="py-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-[11px] font-mono text-blue-700 truncate bg-[#FAF8F3] p-1.5 rounded border border-[#EAE4D9] flex-1">
                            {videoSrc || 'No video link set'}
                          </p>
                          {videoSrc && (
                            <a
                              href={videoSrc}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-gray-500 hover:text-[#721B29] hover:bg-[#FAF8F3] rounded"
                              title="Test link in new tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Inline Edit Form */}
                    {isEditing && (
                      <div className="space-y-2.5 pt-3 border-t border-[#EAE4D9] bg-[#FAF8F3] p-3 rounded-lg">
                        <div>
                          <label className="block font-bold uppercase text-[10px] text-[#4A453E] mb-1">
                            Video URL (Supabase / ImageKit / Direct MP4) *
                          </label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={post.reelUrl || ''}
                              onChange={(e) => updateInstagramPost(post.id, { reelUrl: e.target.value })}
                              className="w-full px-2.5 py-1.5 bg-white border border-[#D9CEBF] rounded text-xs"
                              placeholder="https://...supabase.co/.../video.mp4"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setSupabaseVideoTargetId(post.id);
                                setIsSupabaseVideoModalOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 rounded text-[11px] font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                              title="Select from Supabase Storage"
                            >
                              <Film className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Supabase</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIgTargetItemForMedia(post.id);
                                setIsIgMediaLibraryOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-white border border-[#D9CEBF] text-[#721B29] hover:bg-[#F3EFE6] rounded text-[11px] font-bold shrink-0 flex items-center gap-1 cursor-pointer"
                              title="Select from ImageKit"
                            >
                              <Folder className="w-3.5 h-3.5 text-[#721B29]" />
                              <span>ImageKit</span>
                            </button>
                          </div>
                        </div>

                        {/* Replace Video Uploader */}
                        <div>
                          <label className="block font-bold uppercase text-[10px] text-[#4A453E] mb-1">
                            Upload Replacement Video
                          </label>
                          <ImageKitUploader
                            folder="/videos"
                            accept="video/*"
                            buttonText="Upload to /videos"
                            onUploadSuccess={(url) => {
                              updateInstagramPost(post.id, { reelUrl: url });
                              showToast('Video replaced successfully!');
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-[#F4EFE6] flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => reorderInstagramPosts(post.id, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-gray-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-gray-100"
                          title="Move Left / Earlier"
                        >
                          <MoveUp className="w-3.5 h-3.5 -rotate-90" />
                        </button>
                        <button
                          type="button"
                          onClick={() => reorderInstagramPosts(post.id, 'down')}
                          disabled={idx === instagramPosts.length - 1}
                          className="p-1 text-gray-500 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed rounded hover:bg-gray-100"
                          title="Move Right / Later"
                        >
                          <MoveDown className="w-3.5 h-3.5 -rotate-90" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setEditingIgId(isEditing ? null : post.id)}
                          className="px-2.5 py-1 bg-white border border-[#D9CEBF] text-[11px] font-medium text-[#242120] rounded hover:bg-[#FAF8F3] cursor-pointer"
                        >
                          {isEditing ? 'Done Editing' : 'Edit Video'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Delete this Video Reel?')) {
                              deleteInstagramPost(post.id);
                              showToast('Video deleted');
                            }
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          title="Delete Reel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

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
          <div className="bg-white rounded-xl shadow-2xl border border-[#EAE4D9] max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#242120]">Add New Hero Slide Banner</h3>
                <p className="text-xs text-[#736B63]">Upload PC and Mobile banners directly</p>
              </div>
              <button type="button" onClick={() => setIsAddSlideModalOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSlide} className="space-y-4 text-xs">
              {/* Target Device Selector */}
              <div className="p-3 bg-[#FAF8F3] rounded-lg border border-[#EAE4D9] space-y-2">
                <label className="block font-bold uppercase text-[10px] text-[#4A453E]">
                  🎯 Target Device Display *
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setNewSlide({ ...newSlide, targetDevice: 'all' })}
                    className={`py-2 px-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                      newSlide.targetDevice === 'all'
                        ? 'bg-[#721B29] text-white border-[#721B29] shadow-xs'
                        : 'bg-white text-[#4A453E] border-[#D9CEBF] hover:border-[#721B29]'
                    }`}
                  >
                    🌐 All Devices
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSlide({ ...newSlide, targetDevice: 'desktop' })}
                    className={`py-2 px-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                      newSlide.targetDevice === 'desktop'
                        ? 'bg-[#721B29] text-white border-[#721B29] shadow-xs'
                        : 'bg-white text-[#4A453E] border-[#D9CEBF] hover:border-[#721B29]'
                    }`}
                  >
                    🖥️ PC / Laptop Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSlide({ ...newSlide, targetDevice: 'mobile' })}
                    className={`py-2 px-2 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer ${
                      newSlide.targetDevice === 'mobile'
                        ? 'bg-[#721B29] text-white border-[#721B29] shadow-xs'
                        : 'bg-white text-[#4A453E] border-[#D9CEBF] hover:border-[#721B29]'
                    }`}
                  >
                    📱 Mobile Only
                  </button>
                </div>
              </div>

              {/* 1. Desktop Banner (Shown if 'all' or 'desktop') */}
              {(newSlide.targetDevice === 'all' || newSlide.targetDevice === 'desktop') && (
                <div className="p-3 bg-[#FAF8F3] rounded-lg border border-[#EAE4D9] space-y-2">
                  <label className="block font-bold uppercase text-[10px] text-[#4A453E]">
                    🖥️ PC / Laptop Banner Image (Widescreen 1920x600) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://... (Desktop Banner URL)"
                      value={newSlide.desktopImage}
                      onChange={(e) => setNewSlide({ ...newSlide, desktopImage: e.target.value, image: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D9CEBF] rounded text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setHeroTargetMedia({ slideId: null, field: 'desktopImage' });
                        setIsHeroMediaModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 bg-white hover:bg-[#F3EFE6] text-[#721B29] border border-[#D9CEBF] text-xs font-bold rounded flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Folder className="w-3.5 h-3.5 text-[#721B29]" />
                      <span>CDN</span>
                    </button>
                  </div>
                  <ImageKitUploader
                    folder="/hero-slides"
                    buttonText="Upload Desktop Banner to ImageKit"
                    onUploadSuccess={(url) => {
                      setNewSlide((prev) => ({ ...prev, desktopImage: url, image: url }));
                      showToast('Desktop Banner uploaded!');
                    }}
                  />
                </div>
              )}

              {/* 2. Mobile Banner (Shown if 'all' or 'mobile') */}
              {(newSlide.targetDevice === 'all' || newSlide.targetDevice === 'mobile') && (
                <div className="p-3 bg-[#FAF8F3] rounded-lg border border-[#EAE4D9] space-y-2">
                  <label className="block font-bold uppercase text-[10px] text-[#4A453E]">
                    📱 Mobile Phone Image (Vertical / Normal) *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://... (Mobile Banner URL)"
                      value={newSlide.mobileImage}
                      onChange={(e) => setNewSlide({ ...newSlide, mobileImage: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-[#D9CEBF] rounded text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setHeroTargetMedia({ slideId: null, field: 'mobileImage' });
                        setIsHeroMediaModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 bg-white hover:bg-[#F3EFE6] text-[#721B29] border border-[#D9CEBF] text-xs font-bold rounded flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Folder className="w-3.5 h-3.5 text-[#721B29]" />
                      <span>CDN</span>
                    </button>
                  </div>
                  <ImageKitUploader
                    folder="/hero-slides"
                    buttonText="Upload Mobile Banner to ImageKit"
                    onUploadSuccess={(url) => {
                      setNewSlide((prev) => ({ ...prev, mobileImage: url }));
                      showToast('Mobile Banner uploaded!');
                    }}
                  />
                </div>
              )}

              {/* 3. Category Target */}
              <div>
                <label className="block font-bold uppercase text-[10px] text-[#4A453E] mb-1">
                  Destination Target Category Link
                </label>
                <select
                  value={newSlide.category}
                  onChange={(e) => setNewSlide({ ...newSlide, category: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded font-medium focus:outline-none focus:border-[#721B29]"
                >
                  <option value="All">All Collections (Full Catalog)</option>
                  <option value="New Arrivals">New Arrivals</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 4. Text Overlay Toggle */}
              <div className="p-3 bg-[#FAF8F3] rounded-lg border border-[#EAE4D9] space-y-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newSlide.showTextOverlay}
                    onChange={(e) => setNewSlide({ ...newSlide, showTextOverlay: e.target.checked })}
                    className="w-4 h-4 text-[#721B29] rounded border-[#D9CEBF] focus:ring-[#721B29]"
                  />
                  <span className="font-bold text-[#242120] text-xs">
                    Enable Text Overlay (Headings & Buttons over Banner)
                  </span>
                </label>

                {newSlide.showTextOverlay && (
                  <div className="space-y-2 pt-2 border-t border-[#EAE4D9]">
                    <div>
                      <label className="block font-bold uppercase text-[10px] mb-1">Slide Title</label>
                      <input
                        type="text"
                        value={newSlide.title}
                        onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border rounded"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-bold uppercase text-[10px] mb-1">Tagline / Badge</label>
                        <input
                          type="text"
                          value={newSlide.tagline}
                          onChange={(e) => setNewSlide({ ...newSlide, tagline: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border rounded"
                        />
                      </div>
                      <div>
                        <label className="block font-bold uppercase text-[10px] mb-1">CTA Button Text</label>
                        <input
                          type="text"
                          value={newSlide.ctaText}
                          onChange={(e) => setNewSlide({ ...newSlide, ctaText: e.target.value })}
                          className="w-full px-3 py-1.5 bg-white border rounded"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold uppercase text-[10px] mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={newSlide.subtitle}
                        onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white border rounded"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddSlideModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#721B29] hover:bg-[#57141F] text-white font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Save Hero Slide
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
      {/* MODAL: ADD VIDEO REEL */}
      {isAddIgModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-[#EAE4D9] max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EAE4D9] pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#242120]">Add New Video Reel</h3>
                <p className="text-xs text-[#736B63]">Upload to ImageKit (/videos) or pick from media repository</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddIgModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Upload & Storage Selection Options */}
            <div className="space-y-3 bg-[#FAF8F3] p-3.5 rounded-xl border border-[#EAE4D9]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#242120]">Choose Video Source:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setSupabaseVideoTargetId(null);
                      setIsSupabaseVideoModalOpen(true);
                    }}
                    className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-md flex items-center gap-1 cursor-pointer"
                  >
                    <Film className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Supabase Storage</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIgTargetItemForMedia(null);
                      setIsIgMediaLibraryOpen(true);
                    }}
                    className="px-2.5 py-1.5 bg-white hover:bg-[#F3EFE6] text-[#721B29] border border-[#D9CEBF] text-xs font-bold rounded-md flex items-center gap-1 cursor-pointer"
                  >
                    <Folder className="w-3.5 h-3.5 text-[#721B29]" />
                    <span>ImageKit</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Video Preview in Modal */}
            {newIgPost.reelUrl && (
              <div className="relative aspect-[9/10] max-h-48 w-full rounded-xl overflow-hidden bg-black flex items-center justify-center border border-[#EAE4D9]">
                <video
                  src={newIgPost.reelUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/75 text-white text-[9px] font-bold rounded flex items-center gap-1">
                  <Play className="w-2.5 h-2.5 fill-white" />
                  <span>Autoplay Preview</span>
                </div>
              </div>
            )}

            <form onSubmit={handleCreateIgPost} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold uppercase text-[11px] text-[#4A453E] mb-1">
                  Video URL (ImageKit / MP4 / WebM) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://ik.imagekit.io/.../video.mp4"
                  value={newIgPost.reelUrl}
                  onChange={(e) => setNewIgPost({ ...newIgPost, reelUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-[#D9CEBF] rounded-lg focus:outline-none focus:border-[#721B29]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#EAE4D9]">
                <button
                  type="button"
                  onClick={() => setIsAddIgModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#721B29] hover:bg-[#57141F] text-white font-bold rounded-lg shadow-sm cursor-pointer"
                >
                  Save Video Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ImageKit Media Library Modal for Hero Slide Image Selection */}
      <ImageKitMediaLibraryModal
        isOpen={isHeroMediaModalOpen}
        onClose={() => setIsHeroMediaModalOpen(false)}
        currentProductFolder="/hero-slides"
        mediaType="image"
        multiple={false}
        onSelectImages={handleSelectHeroMedia}
      />

      {/* Supabase Video Library Modal */}
      <SupabaseVideoLibraryModal
        isOpen={isSupabaseVideoModalOpen}
        onClose={() => setIsSupabaseVideoModalOpen(false)}
        currentVideoUrl={supabaseVideoTargetId ? instagramPosts.find(p => p.id === supabaseVideoTargetId)?.reelUrl : newIgPost.reelUrl}
        onSelectVideo={handleSelectSupabaseVideo}
      />

      {/* ImageKit Media Library Modal for Video Selection */}
      <ImageKitMediaLibraryModal
        isOpen={isIgMediaLibraryOpen}
        onClose={() => setIsIgMediaLibraryOpen(false)}
        currentProductFolder="/videos"
        mediaType="video"
        multiple={false}
        onSelectImages={handleSelectIgVideo}
      />
    </div>
  );
};
