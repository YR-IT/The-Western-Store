import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../context/StoreContext';
import { ProductCategory } from '../types';
import { STORE_INFO } from '../data/mockData';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  Instagram,
  Phone,
  Home,
  Package,

  MessageCircle,
  LogOut,
  UserCheck,
} from 'lucide-react';

import logoImg from '../assets/images/Logo_Final.jpg';

export const Header: React.FC = () => {
  const {
    view,
    setView,
    selectedCategory,
    navigateToCategory,
    cartCount,
    setIsCartDrawerOpen,
    wishlist,
    setIsSearchOpen,
    categories,
    setAdminActiveTab,
    currentUser,
    openAuthModal,
    logout,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'ethnic' | 'western' | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const accountMenuRef = useRef<HTMLDivElement>(null);
  const dropdownNavRef = useRef<HTMLElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
      if (dropdownNavRef.current && !dropdownNavRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll detection for transparent → solid transition
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCategoryClick = (cat: ProductCategory) => {
    navigateToCategory(cat);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  };



  const handleLogoClick = () => {
    setView('home');
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className="fixed top-[34px] left-0 right-0 z-40 transition-all duration-300 w-full bg-white/95 backdrop-blur-md border-b border-[#EAE4D9] shadow-xs"
    >
      {/* Unified Single-Row Header Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          {/* Left: Mobile menu trigger + Brand Logo & Text */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 lg:flex-1 lg:justify-start">
            {/* Mobile / Tablet Menu Trigger */}
            <button
              id="mobile-menu-btn"
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#242120] hover:text-[#721B29] hover:bg-[#F3EFE6] transition-colors focus:outline-none rounded-lg cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo & Title */}
            <div
              className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group py-1"
              onClick={handleLogoClick}
            >
              <img
                src={logoImg}
                alt="The Western Store Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border border-[#EAE4D9] shadow-xs group-hover:scale-105 transition-transform"
              />
              <div className="shrink-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-lg xs:text-xl sm:text-2xl font-bold tracking-tight text-[#721B29] transition-colors duration-300"
                    style={{ fontFamily: "'Great Vibes', cursive", transform: 'translateY(4px)', display: 'inline-block' }}
                  >
                    The Western Store
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] shrink-0 hidden sm:inline-block" />
                </div>
                <p className="text-[9px] sm:text-[10px] tracking-[0.18em] uppercase text-[#736B63] font-medium hidden xs:block">
                  Kurukshetra • Boutique
                </p>
              </div>
            </div>
          </div>

          {/* Center: Hardcoded 4 Navigation Links (Single-Row Navbar Items) */}
          <nav ref={dropdownNavRef} className="hidden lg:flex items-center space-x-2 xl:space-x-5 justify-center px-2 shrink-0">
            {/* 1. Home Link */}
            <button
              id="nav-home"
              type="button"
              onClick={handleLogoClick}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors rounded-md shrink-0 cursor-pointer ${
                view === 'home' && activeDropdown === null
                  ? 'text-[#721B29] font-bold bg-[#F3EFE6]'
                  : 'text-[#242120] hover:text-[#721B29] hover:bg-[#F3EFE6]/70'
              }`}
            >
              Home
            </button>

            {/* 2. New Arrival Link */}
            <button
              id="nav-new-arrival"
              type="button"
              onClick={() => handleCategoryClick('New Arrivals')}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all rounded-md shrink-0 whitespace-nowrap cursor-pointer ${
                view === 'plp' && (selectedCategory === 'New Arrivals' || selectedCategory === 'New Arrival')
                  ? 'text-[#721B29] font-bold bg-[#F3EFE6]'
                  : 'text-[#242120] hover:text-[#721B29] hover:bg-[#F3EFE6]/70'
              }`}
            >
              New Arrival
            </button>

            {/* 3. All Collections Link */}
            <button
              id="nav-all-collections"
              type="button"
              onClick={() => handleCategoryClick('All')}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all rounded-md shrink-0 whitespace-nowrap cursor-pointer ${
                view === 'plp' && selectedCategory === 'All'
                  ? 'text-[#721B29] font-bold bg-[#F3EFE6]'
                  : 'text-[#242120] hover:text-[#721B29] hover:bg-[#F3EFE6]/70'
              }`}
            >
              All Collections
            </button>

            {/* Contact Us Link */}
            <button
              id="nav-contact"
              type="button"
              onClick={() => { setView('contact'); setActiveDropdown(null); }}
              className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors rounded-md shrink-0 cursor-pointer ${
                view === 'contact'
                  ? 'text-[#721B29] font-bold bg-[#F3EFE6]'
                  : 'text-[#242120] hover:text-[#721B29] hover:bg-[#F3EFE6]/70'
              }`}
            >
              Contact Us
            </button>
          </nav>

          {/* Right: Actions (Search, Wishlist, Account, Cart) */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 lg:flex-1 lg:justify-end">
            {/* Desktop Search Button */}
            <button
              id="header-search-btn"
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D9CEBF] bg-white/90 text-[#4A453E] hover:border-[#721B29] hover:text-[#721B29] text-xs transition-all shadow-2xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-[#721B29]" />
              <span className="font-medium">Search outfits...</span>
            </button>

            {/* Mobile / Tablet Search Button on Right */}
            <button
              id="mobile-search-btn"
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="lg:hidden p-1.5 xs:p-2 sm:p-2.5 text-[#242120] hover:text-[#721B29] hover:bg-[#F3EFE6] transition-colors rounded-full cursor-pointer"
              aria-label="Search items"
            >
              <Search className="w-4 h-4 xs:w-5 xs:h-5" />
            </button>

            {/* Wishlist */}
            <button
              id="header-wishlist-btn"
              type="button"
              onClick={() => setView('wishlist')}
              className="p-1.5 xs:p-2 sm:p-2.5 relative text-[#242120] hover:text-[#721B29] hover:bg-[#F3EFE6] transition-colors rounded-full cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className={`w-4 h-4 xs:w-5 xs:h-5 ${wishlist.length > 0 ? 'text-[#721B29] fill-[#721B29]/15' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 xs:top-1.5 xs:right-1.5 w-3.5 h-3.5 xs:w-4 xs:h-4 bg-[#721B29] text-white text-[9px] xs:text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Menu Dropdown */}
            <div ref={accountMenuRef} className="relative">
              <button
                id="header-account-btn"
                type="button"
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                className="p-1.5 xs:p-2 sm:p-2.5 text-[#242120] hover:text-[#721B29] hover:bg-[#F3EFE6] transition-colors rounded-full flex items-center gap-1.5 cursor-pointer"
                aria-label="Account and store manager"
              >
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full border border-[#721B29] object-cover shrink-0"
                  />
                ) : (
                  <User className="w-4 h-4 xs:w-5 xs:h-5" />
                )}
                {currentUser && (
                  <span className="text-xs font-bold text-[#721B29] hidden xl:inline max-w-[80px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                )}
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#FDFBF7] border border-[#E5DFD3] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Account Identity Header */}
                  <div className="px-4 py-2.5 border-b border-[#EAE4D9] bg-[#FAF8F3]">
                    {currentUser ? (
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <UserCheck className="w-3 h-3" />
                            {currentUser.isAdmin ? 'Admin' : 'Customer'}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-[#242120] truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-[#736B63] truncate">{currentUser.email}</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-serif font-bold text-[#721B29]">The Western Store</p>
                        <p className="text-[11px] text-[#736B63]">Sign in to sync cart & track orders</p>
                        <button
                          type="button"
                          onClick={() => {
                            openAuthModal('customer', 'Sign in to associate your cart and order history.');
                            setAccountMenuOpen(false);
                          }}
                          className="mt-2 w-full py-1.5 px-3 bg-[#721B29] text-white text-xs font-bold rounded-lg hover:bg-[#52131D] flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Sign In / Register</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Navigation Actions */}
                  <button
                    id="header-order-history-btn"
                    type="button"
                    onClick={() => {
                      setView('order-history');
                      setAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#242120] hover:bg-[#F3EFE6] flex items-center justify-between font-medium group cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#721B29]" />
                      <span>My Order History</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#A39B8F]" />
                  </button>

                  <button
                    id="header-track-order-btn"
                    type="button"
                    onClick={() => {
                      setView('track-order');
                      setAccountMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-[#242120] hover:bg-[#F3EFE6] flex items-center justify-between font-medium group cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#721B29]" />
                      <span>Track Order Status</span>
                    </span>
                    <span className="text-[10px] text-[#721B29] font-bold uppercase bg-[#721B29]/10 px-1.5 py-0.5 rounded-xs">
                      Live
                    </span>
                  </button>


                  <a
                    href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-left px-4 py-2 text-xs text-[#242120] hover:bg-[#F3EFE6] flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-700" />
                      <span>WhatsApp Support</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#A39B8F]" />
                  </a>

                  {/* Admin Portal Link - only visible for logged in admins */}
                  {currentUser?.isAdmin && (
                    <>
                      <div className="my-1 border-t border-[#EAE4D9]" />
                      <button
                        id="admin-portal-link"
                        type="button"
                        onClick={() => {
                          setView('admin');
                          setAdminActiveTab('dashboard');
                          setAccountMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-[#721B29] font-semibold hover:bg-[#721B29]/10 flex items-center gap-2 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#721B29]" />
                        <span>Store Admin Panel</span>
                      </button>
                    </>
                  )}

                  {/* Sign Out Button if logged in */}
                  {currentUser && (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-700 font-semibold hover:bg-red-50 flex items-center gap-2 border-t border-[#EAE4D9] mt-1 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Cart Icon */}
            <button
              id="header-cart-btn"
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="p-1.5 xs:p-2 sm:p-2.5 relative text-[#721B29] hover:text-[#52131D] hover:bg-[#721B29]/10 transition-colors rounded-full flex items-center gap-1 cursor-pointer"
              aria-label={`Cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4 xs:w-5 xs:h-5" />
              {cartCount > 0 && (
                <span className="w-4 h-4 xs:w-5 xs:h-5 bg-[#721B29] text-white text-[9px] xs:text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>



      {/* Mobile / Tablet Drawer Navigation rendered via React Portal to document.body */}
      {mobileMenuOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] lg:hidden flex">
            {/* Dark Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Container */}
            <div className="relative w-[88%] max-w-sm bg-[#FDFBF7] h-full shadow-2xl z-10 flex flex-col overflow-y-auto animate-in slide-in-from-left duration-250">
              {/* Drawer Header - EXACTLY MATCHES NAVBAR TITLE AND BRANDING */}
              <div className="p-4 border-b border-[#EAE4D9] flex items-center justify-between bg-[#F8F5EE]">
                <div className="flex items-center gap-2.5 cursor-pointer" onClick={handleLogoClick}>
                  <img
                    src={logoImg}
                    alt="The Western Store Logo"
                    className="w-9 h-9 rounded-full object-cover border border-[#EAE4D9] shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif text-lg font-bold tracking-tight text-[#721B29]">
                        The Western Store
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] shrink-0" />
                    </div>
                    <p className="text-[9px] tracking-[0.16em] uppercase text-[#736B63] font-medium">
                      Kurukshetra • Ethnic & Western Boutique
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-[#4A453E] hover:text-[#721B29] rounded-full hover:bg-white"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Account / Login Prompt Banner inside Drawer */}
              {currentUser && (
                <div className="p-3 bg-[#721B29]/10 border-b border-[#721B29]/15 flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-7 h-7 rounded-full border border-[#721B29] object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#242120] truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-[#721B29] font-medium truncate">{currentUser.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Quick Actions */}
              <div className="p-3 border-b border-[#EAE4D9] bg-[#FAF8F3] space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleLogoClick}
                    className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white border border-[#EAE4D9] text-[#242120] font-medium"
                  >
                    <Home className="w-4 h-4 text-[#721B29]" />
                    <span>Home</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setView('wishlist');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 p-2 rounded-lg bg-white border border-[#EAE4D9] text-[#242120] font-medium"
                  >
                    <Heart className="w-4 h-4 text-[#721B29]" />
                    <span>Wishlist ({wishlist.length})</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setView('track-order');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-[#721B29]/10 border border-[#721B29]/20 text-[#721B29] font-medium text-xs"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#721B29]" />
                    <span>Track Order Status</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-[#721B29] text-white px-2 py-0.5 rounded-xs">
                    Lookup
                  </span>
                </button>
              </div>

              {/* Mobile Categories Navigation */}
              <div className="py-2 flex-1">
                {/* Categories Group */}
                <div className="px-4 py-1.5 text-xs font-bold text-[#721B29] uppercase tracking-wider bg-[#F3EFE6]/60 border-y border-[#EAE4D9]">
                  Explore Categories
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.name)}
                    className="w-full text-left px-6 py-3 text-xs font-bold text-[#242120] hover:bg-[#F3EFE6] hover:text-[#721B29] flex items-center justify-between border-b border-[#F4EFE6]/60 transition-colors"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#B3A99D]" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => handleCategoryClick('All')}
                  className="w-full text-left px-6 py-3 text-xs font-bold text-[#721B29] hover:bg-[#F3EFE6] flex items-center justify-between border-b border-[#F4EFE6]/60 transition-colors"
                >
                  <span>All Collections</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#721B29]" />
                </button>

                <div className="mt-4 px-3 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setView('order-history');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 bg-[#FAF8F3] hover:bg-[#F3EFE6] border border-[#EAE4D9] rounded-xl text-xs font-bold text-[#242120] flex items-center justify-between transition-colors shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#721B29]" />
                      <span>My Order History</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#B3A99D]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setView('track-order');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 bg-[#FAF8F3] hover:bg-[#F3EFE6] border border-[#EAE4D9] rounded-xl text-xs font-bold text-[#242120] flex items-center justify-between transition-colors shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-[#721B29]" />
                      <span>Track Order Status</span>
                    </span>
                    <span className="text-[10px] text-[#721B29] font-bold uppercase bg-[#721B29]/10 px-2 py-0.5 rounded-full">
                      Live
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setView('contact');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 bg-[#FAF8F3] hover:bg-[#F3EFE6] border border-[#EAE4D9] rounded-xl text-xs font-bold text-[#242120] flex items-center justify-between transition-colors shadow-2xs"
                  >
                    <span className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-[#721B29]" />
                      <span>Contact Us</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[#B3A99D]" />
                  </button>
                </div>

                <div className="mt-4 px-4 py-3 bg-[#FAF8F3] mx-3 rounded-xl border border-[#EAE4D9]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#721B29] mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>Kurukshetra Walk-in Store</span>
                  </div>
                  <p className="text-[11px] text-[#736B63] leading-relaxed">
                    Opp. Hotel Pearl Marc, Railway Road, near Ujjivan Bank, Kurukshetra - 136118
                  </p>
                  <div className="mt-3 flex items-center gap-3">
                    <a
                      href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-800 font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                    <span className="text-[#C5A059]">•</span>
                    <a
                      href={STORE_INFO.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#721B29] font-semibold flex items-center gap-1 hover:underline"
                    >
                      <Instagram className="w-3.5 h-3.5" />
                      <span>Instagram</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Mobile Drawer Admin Link - only visible for logged in admins */}
              {currentUser?.isAdmin && (
                <div className="p-4 border-t border-[#EAE4D9] bg-[#F8F5EE]">
                  <button
                    type="button"
                    onClick={() => {
                      setView('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-4 bg-[#721B29] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Store Management (Admin)</span>
                  </button>
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};
