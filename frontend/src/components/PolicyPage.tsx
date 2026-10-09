import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/mockData';
import {
  ShieldAlert,
  Video,
  Truck,
  FileText,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Globe,
  Package,
  HelpCircle,
  MessageCircle,
  Ruler,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export type PolicyTab = 'returns' | 'shipping' | 'terms' | 'privacy';

interface PolicyPageProps {
  initialTab?: PolicyTab;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ initialTab = 'returns' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsSizeChartOpen } = useStore();

  // Determine active tab from URL pathname or initialTab prop
  const getActiveTab = (): PolicyTab => {
    const path = location.pathname.toLowerCase();
    if (path.includes('shipping')) return 'shipping';
    if (path.includes('terms')) return 'terms';
    if (path.includes('privacy')) return 'privacy';
    if (path.includes('refund') || path.includes('return') || path.includes('exchange')) return 'returns';
    return initialTab as PolicyTab;
  };

  const activeTab = getActiveTab();

  const handleTabChange = (tab: PolicyTab) => {
    switch (tab) {
      case 'returns':
        navigate('/policies/refund-policy');
        break;
      case 'shipping':
        navigate('/policies/shipping-policy');
        break;
      case 'terms':
        navigate('/policies/terms-and-conditions');
        break;
      case 'privacy':
        navigate('/policies/privacy-policy');
        break;
    }
  };

  const tabs: { id: PolicyTab; label: string; shortLabel: string; icon: React.ReactNode }[] = [
    {
      id: 'returns',
      label: 'No Exchange & Return',
      shortLabel: 'Exchange & Return',
      icon: <ShieldAlert className="w-4 h-4" />,
    },
    {
      id: 'shipping',
      label: 'Shipping & Delivery',
      shortLabel: 'Shipping',
      icon: <Truck className="w-4 h-4" />,
    },
    {
      id: 'terms',
      label: 'Terms & Conditions',
      shortLabel: 'Terms',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'privacy',
      label: 'Privacy Policy',
      shortLabel: 'Privacy',
      icon: <Lock className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFBF7] pb-16">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-b from-[#F6F0E6] via-[#EFE5D5] to-[#FDFBF7] border-b border-[#E3D6C5] overflow-hidden pt-12 sm:pt-16 pb-6 sm:pb-8">
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 0%, rgba(230,194,128,0.4) 0%, transparent 65%)',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[#721B29] bg-[#721B29]/10 px-4 py-1.5 rounded-full border border-[#721B29]/20 mb-3.5 shadow-xs"
          >
            <span>The Western Store</span>
            <span className="w-1 h-1 rounded-full bg-[#721B29]" />
            <span>Customer Policies</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="font-serif text-3xl sm:text-5xl font-bold text-[#241C1D] tracking-tight mb-3"
          >
            {activeTab === 'returns' && 'Return & Exchange Policy'}
            {activeTab === 'shipping' && 'Shipping & Delivery Policy'}
            {activeTab === 'terms' && 'Terms & Conditions'}
            {activeTab === 'privacy' && 'Privacy Policy'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="text-xs sm:text-sm text-[#6B5E50] max-w-xl mx-auto font-light leading-relaxed"
          >
            Clear, transparent guidelines for a seamless shopping experience with The Western Store, Kurukshetra.
          </motion.p>
        </div>

        {/* Tab Bar Navigation (Floating Frosted Luxury Pills) */}
        <div className="max-w-4xl mx-auto px-4 flex justify-center">
          <div className="inline-flex items-center gap-1 sm:gap-2 p-1.5 bg-white/90 backdrop-blur-md rounded-2xl border border-[#DED0BE] shadow-md shadow-[#721B29]/5 overflow-x-auto max-w-full scrollbar-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#721B29] text-white shadow-md font-bold'
                      : 'text-[#5C5144] hover:text-[#241C1D] hover:bg-[#F4EDE2] font-medium'
                  }`}
                >
                  <span className={isActive ? 'text-[#E6C280]' : 'text-[#8A7C6B]'}>{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        {/* TAB 1: NO EXCHANGE & RETURN */}
        {activeTab === 'returns' && (
          <motion.div
            key="tab-returns"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-8"
          >
            {/* Top Priority Highlight: Defect Claims Exception */}
            <div className="rounded-2xl border-2 border-[#B8860B]/40 bg-[#FFFDF5] p-6 sm:p-7 shadow-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#B8860B]/15 border border-[#B8860B]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Video className="w-5 h-5 text-[#8A5A00]" />
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="font-serif text-lg sm:text-xl font-bold text-[#422D0A]">
                      Defect Claims & Transit Issues
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#8A5A00] bg-[#B8860B]/15 px-2.5 py-0.5 rounded-full border border-[#B8860B]/30">
                      Mandatory Video Proof
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5C451D] leading-relaxed">
                    If you receive a defective item, a <strong>valid unboxing video is mandatory</strong> to raise a claim. The video must clearly show the package being opened for the first time, without cuts, pauses, or edits.
                  </p>

                  <div className="bg-white/80 rounded-xl p-4 border border-[#E8DCC4] space-y-2 text-xs text-[#5C451D]">
                    <div className="flex items-center gap-2 font-semibold text-[#422D0A]">
                      <CheckCircle2 className="w-4 h-4 text-[#8A5A00] shrink-0" />
                      <span>How to submit a defect claim:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-[12px] text-[#6E5429]">
                      <li>Record the video continuously from the outer courier seal opening.</li>
                      <li>Raise your claim within <strong>24 to 48 hours</strong> of delivery.</li>
                      <li>
                        Share the unedited video and your Order Number directly on WhatsApp at{' '}
                        <a
                          href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Hi%20The%20Western%20Store%2C%20I%20would%20like%20to%20raise%20a%20defect%20claim%20with%20my%20unboxing%20video.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-[#721B29] underline hover:text-[#52131D]"
                        >
                          +91 {STORE_INFO.phone}
                        </a>
                        .
                      </li>
                    </ul>
                  </div>

                  <p className="text-[11px] font-semibold text-[#8A5A00] bg-[#FAF3E0] p-2.5 rounded-lg border border-[#ECDDB8]">
                    ⚠️ Returns for defects will NOT be accepted without a proper, uncut unboxing video.
                  </p>
                </div>
              </div>
            </div>

            {/* Core Return & Exchange Policy */}
            <div className="bg-white rounded-2xl border border-[#EAE4D9] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-[#EAE4D9] pb-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#721B29]">
                  Standard Policy
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#242120] mt-1">
                  Return & Exchange Policy
                </h2>
              </div>

              {/* Policy clauses */}
              <div className="space-y-4 text-xs sm:text-sm text-[#4A453E] leading-relaxed">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE4D9]">
                  <AlertTriangle className="w-5 h-5 text-[#721B29] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#242120] block font-semibold mb-1">
                      All orders are final:
                    </strong>
                    <span>
                      Once placed and confirmed, orders cannot be cancelled, returned, or exchanged. No refunds and no exchanges will be issued.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE4D9]">
                  <Package className="w-5 h-5 text-[#721B29] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#242120] block font-semibold mb-1">
                      Rigorous Pre-Dispatch Quality Checks:
                    </strong>
                    <span>
                      Every item is thoroughly inspected for fabric defects, stitching, and finishing, and carefully packaged by our dedicated quality assurance team before dispatch. We ensure there are zero defects in our articles when they leave our store.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE4D9]">
                  <Ruler className="w-5 h-5 text-[#721B29] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#242120] block font-semibold mb-1">
                      Accurate Sizing Recommendation:
                    </strong>
                    <span>
                      Please check your suit size carefully before placing your order. Refer to our size guide and size tutorial video for accurate measurements to ensure a perfect fit.
                    </span>
                  </div>
                </div>
              </div>

              {/* Sizing CTA Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#721B29]/5 border border-[#721B29]/20">
                <div className="text-center sm:text-left">
                  <p className="text-xs font-bold text-[#242120]">Need help finding your exact size?</p>
                  <p className="text-[11px] text-[#736B63]">
                    Our stylists assist with bust, waist, and length measurements.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsSizeChartOpen(true)}
                    className="px-4 py-2 bg-white hover:bg-gray-50 text-[#721B29] border border-[#721B29]/30 rounded-lg text-xs font-bold transition-all shadow-xs"
                  >
                    View Size Guide
                  </button>
                  <a
                    href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Hi%20The%20Western%20Store%2C%20I%20need%20help%20with%20sizing%20measurements.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#721B29] hover:bg-[#52131D] text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                  >
                    Ask on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: SHIPPING & DELIVERY */}
        {activeTab === 'shipping' && (
          <motion.div
            key="tab-shipping"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-8"
          >
            {/* 1. Domestic Delivery Timelines */}
            <div className="bg-white rounded-2xl border border-[#EAE4D9] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-[#EAE4D9] pb-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#721B29]">
                  Domestic Orders (India)
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#242120] mt-1">
                  1) Estimated Delivery Time (India)
                </h2>
              </div>

              {/* Timeline Cards */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE4D9] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#721B29] bg-[#721B29]/10 px-2 py-0.5 rounded-sm inline-block mb-2">
                      Priority Region
                    </span>
                    <h3 className="text-sm font-bold text-[#242120]">Delhi / NCR</h3>
                  </div>
                  <p className="text-lg font-serif font-bold text-[#721B29] mt-3">
                    5 to 7 days <span className="text-xs font-sans font-normal text-[#736B63]">(approx.)</span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE4D9] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#B8860B] bg-[#B8860B]/10 px-2 py-0.5 rounded-sm inline-block mb-2">
                      Pan India
                    </span>
                    <h3 className="text-sm font-bold text-[#242120]">Rest of India</h3>
                  </div>
                  <p className="text-lg font-serif font-bold text-[#721B29] mt-3">
                    8 to 10 days <span className="text-xs font-sans font-normal text-[#736B63]">(approx.)</span>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE4D9] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5A534F] bg-[#5A534F]/10 px-2 py-0.5 rounded-sm inline-block mb-2">
                      Outlying Zones
                    </span>
                    <h3 className="text-sm font-bold text-[#242120]">Village / Remote Areas</h3>
                  </div>
                  <p className="text-lg font-serif font-bold text-[#721B29] mt-3">
                    12 to 15 days <span className="text-xs font-sans font-normal text-[#736B63]">(approx.)</span>
                  </p>
                </div>
              </div>

              {/* Delivery info notes */}
              <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#4A453E]">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FDFBF7] border border-[#EAE4D9]">
                  <Truck className="w-4 h-4 text-[#721B29] shrink-0 mt-0.5" />
                  <p className="text-xs leading-relaxed">
                    <strong>Shipping Charges:</strong> Shipping charges are calculated at checkout based on your exact delivery pincode and package weight.
                  </p>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFFDF5] border border-[#E6C280]/40">
                  <ShieldAlert className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#5A4E3C] leading-relaxed">
                    <strong>Prepaid Orders Only:</strong> No COD (Cash on Delivery) is available. All orders must be prepaid via UPI, QR, Google Pay, PhonePe, Cards, or Net Banking before dispatch.
                  </p>
                </div>
              </div>
            </div>

            {/* 2. International Shipping */}
            <div className="bg-white rounded-2xl border border-[#EAE4D9] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="border-b border-[#EAE4D9] pb-4">
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#721B29]">
                  Worldwide Dispatch
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#242120] mt-1">
                  2) International Shipping
                </h2>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#4A453E]">
                <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE4D9] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#242120]">
                    <Globe className="w-4 h-4 text-[#721B29]" />
                    <span>Global Delivery Timelines</span>
                  </div>
                  <p className="text-sm font-semibold text-[#721B29]">
                    10 to 15 days (approx.)
                  </p>
                  <p className="text-[11px] text-[#736B63] leading-relaxed font-light">
                    Standard international courier transit duration depending on country customs clearance.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE4D9] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#242120]">
                    <Package className="w-4 h-4 text-[#721B29]" />
                    <span>Global Courier Partners</span>
                  </div>
                  <p className="text-sm font-semibold text-[#242120]">
                    FedEx / UPS / DHL Express
                  </p>
                  <p className="text-[11px] text-[#736B63] leading-relaxed font-light">
                    Door-to-door tracked delivery with leading premium express logistics networks.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFDF5] border border-[#E6C280]/40 space-y-2 text-xs text-[#5A4E3C]">
                <p className="font-semibold text-[#422D0A]">Important Customs & Duties Notice:</p>
                <p className="leading-relaxed">
                  Shipping charges are applicable for all international orders. Customs duties, import taxes, or clearance fees (if levied by your destination country) are determined by your local customs authority and must be paid by the recipient/customer.
                </p>
              </div>

              {/* Action button */}
              <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
                <p className="text-xs text-[#736B63]">
                  Already have an order? Track its dispatch and delivery progress live.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/track-order')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#721B29] hover:bg-[#52131D] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track Order Status</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: TERMS & CONDITIONS */}
        {activeTab === 'terms' && (
          <motion.div
            key="tab-terms"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-2xl border border-[#EAE4D9] p-6 sm:p-8 shadow-sm space-y-8"
          >
            <div className="border-b border-[#EAE4D9] pb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#721B29]">
                Legal Agreement
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#242120] mt-1">
                Terms &amp; Conditions
              </h2>
              <p className="text-xs text-[#736B63] mt-1">
                Last updated: {new Date().getFullYear()} &middot; The Western Store, Kurukshetra, Haryana.
              </p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-[#4A453E] leading-relaxed">
              <p>
                This website is operated by <strong>The Western Store</strong>. Throughout the site, the terms "we", "us" and "our" refer to The Western Store. The Western Store offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
              </p>
              <p>
                By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.
              </p>
              <p>
                Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services.
              </p>
              <p>
                Any new features or tools which are added to the current store shall also be subject to the Terms of Service. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and/or changes to our website. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
              </p>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 1 – Online Store Terms
                </h3>
                <p>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you have given us your consent to allow any of your minor dependents to use this site.</p>
                <p>You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).</p>
                <p>You must not transmit any worms or viruses or any code of a destructive nature.</p>
                <p>A breach or violation of any of the Terms will result in an immediate termination of your Services.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 2 – General Conditions
                </h3>
                <p>We reserve the right to refuse service to anyone for any reason at any time.</p>
                <p>You understand that your content (not including credit card information) may be transferred unencrypted and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical requirements of connecting networks or devices. Credit card information is always encrypted during transfer over networks.</p>
                <p>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without express written permission by us.</p>
                <p>The headings used in this agreement are included for convenience only and will not limit or otherwise affect these Terms.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 3 – Accuracy, Completeness and Timeliness of Information
                </h3>
                <p>We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon as the sole basis for making decisions without consulting primary, more accurate, or more timely sources of information. Any reliance on the material on this site is at your own risk.</p>
                <p>We reserve the right to modify the contents of this site at any time, but we have no obligation to update any information on our site. You agree that it is your responsibility to monitor changes to our site.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 4 – Modifications to the Service and Prices
                </h3>
                <p>Prices for our products are subject to change without notice.</p>
                <p>We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>
                <p>We shall not be liable to you or to any third-party for any modification, price change, suspension or discontinuance of the Service.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 5 – Products or Services
                </h3>
                <p>Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.</p>
                <p>We have made every effort to display as accurately as possible the colours and images of our products that appear at the store. We cannot guarantee that your computer monitor's display of any color will be accurate.</p>
                <p>We reserve the right to limit the sales of our products or Services to any person, geographic region or jurisdiction. All descriptions of products or product pricing are subject to change at any time without notice, at the sole discretion of us. We reserve the right to discontinue any product at any time. Any offer for any product or service made on this site is void where prohibited.</p>
                <p>We do not warrant that the quality of any products, services, information, or other material purchased or obtained by you will meet your expectations, or that any errors in the Service will be corrected.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 6 – Accuracy of Billing and Account Information
                </h3>
                <p>We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order. In the event that we make a change to or cancel an order, we may attempt to notify you by contacting the e-mail and/or billing address/phone number provided at the time the order was made.</p>
                <p>You agree to provide current, complete and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information so that we can complete your transactions and contact you as needed.</p>
                <p>For more detail, please review our Returns Policy.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 7 – Optional Tools
                </h3>
                <p>We may provide you with access to third-party tools over which we neither monitor nor have any control nor input.</p>
                <p>You acknowledge and agree that we provide access to such tools "as is" and "as available" without any warranties, representations or conditions of any kind and without any endorsement. We shall have no liability whatsoever arising from or relating to your use of optional third-party tools.</p>
                <p>Any use by you of optional tools offered through the site is entirely at your own risk and discretion and you should ensure that you are familiar with and approve of the terms on which tools are provided by the relevant third-party provider(s).</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 8 – Third-Party Links
                </h3>
                <p>Certain content, products and services available via our Service may include materials from third-parties.</p>
                <p>Third-party links on this site may direct you to third-party websites that are not affiliated with us. We are not responsible for examining or evaluating the content or accuracy and we do not warrant and will not have any liability or responsibility for any third-party materials or websites, or for any other materials, products, or services of third-parties.</p>
                <p>We are not liable for any harm or damages related to the purchase or use of goods, services, resources, content, or any other transactions made in connection with any third-party websites. Complaints, claims, concerns, or questions regarding third-party products should be directed to the third-party.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 9 – User Comments, Feedback and Other Submissions
                </h3>
                <p>If, at our request, you send certain specific submissions or without a request from us you send creative ideas, suggestions, proposals, plans, or other materials (collectively, "comments"), you agree that we may, at any time, without restriction, edit, copy, publish, distribute, translate and otherwise use in any medium any comments that you forward to us. We are under no obligation (1) to maintain any comments in confidence; (2) to pay compensation for any comments; or (3) to respond to any comments.</p>
                <p>We may, but have no obligation to, monitor, edit or remove content that we determine in our sole discretion are unlawful, offensive, threatening, libelous, defamatory, pornographic, obscene or otherwise objectionable or violates any party's intellectual property or these Terms of Service.</p>
                <p>You agree that your comments will not violate any right of any third-party, including copyright, trademark, privacy, personality or other personal or proprietary right. You are solely responsible for any comments you make and their accuracy. We take no responsibility and assume no liability for any comments posted by you or any third-party.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 10 – Personal Information
                </h3>
                <p>Your submission of personal information through the store is governed by our Privacy Policy.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 11 – Errors, Inaccuracies and Omissions
                </h3>
                <p>Occasionally there may be information on our site or in the Service that contains typographical errors, inaccuracies or omissions that may relate to product descriptions, pricing, promotions, offers, product shipping charges, transit times and availability. We reserve the right to correct any errors, inaccuracies or omissions, and to change or update information or cancel orders if any information in the Service or on any related website is inaccurate at any time without prior notice.</p>
                <p>We undertake no obligation to update, amend or clarify information in the Service or on any related website, including without limitation, pricing information, except as required by law.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 12 – Prohibited Uses
                </h3>
                <p>In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content:</p>
                <ul className="list-none space-y-1 pl-2 text-[#5A534F]">
                  <li><strong>(a)</strong> for any unlawful purpose;</li>
                  <li><strong>(b)</strong> to solicit others to perform or participate in any unlawful acts;</li>
                  <li><strong>(c)</strong> to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances;</li>
                  <li><strong>(d)</strong> to infringe upon or violate our intellectual property rights or the intellectual property rights of others;</li>
                  <li><strong>(e)</strong> to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability;</li>
                  <li><strong>(f)</strong> to submit false or misleading information;</li>
                  <li><strong>(g)</strong> to upload or transmit viruses or any other type of malicious code that will or may be used in any way that will affect the functionality or operation of the Service or of any related website, other websites, or the Internet;</li>
                  <li><strong>(h)</strong> to collect or track the personal information of others;</li>
                  <li><strong>(i)</strong> to spam, phish, pharm, pretext, spider, crawl, or scrape;</li>
                  <li><strong>(j)</strong> for any obscene or immoral purpose; or</li>
                  <li><strong>(k)</strong> to interfere with or circumvent the security features of the Service or any related website, other websites, or the Internet.</li>
                </ul>
                <p>We reserve the right to terminate your use of the Service or any related website for violating any of the prohibited uses.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 13 – Disclaimer of Warranties; Limitation of Liability
                </h3>
                <p>We do not guarantee, represent or warrant that your use of our service will be uninterrupted, timely, secure or error-free.</p>
                <p>We do not warrant that the results that may be obtained from the use of the service will be accurate or reliable.</p>
                <p>You expressly agree that your use of, or inability to use, the service is at your sole risk. The service and all products and services delivered to you through the service are (except as expressly stated by us) provided "as is" and "as available" for your use, without any representation, warranties or conditions of any kind, either express or implied, including all implied warranties or conditions of merchantability, merchantable quality, fitness for a particular purpose, durability, title, and non-infringement.</p>
                <p>In no case shall The Western Store, our directors, officers, employees, affiliates, agents, contractors, interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct, indirect, incidental, punitive, special, or consequential damages of any kind, including, without limitation lost profits, lost revenue, lost savings, loss of data, replacement costs, or any similar damages, whether based in contract, tort (including negligence), strict liability or otherwise, arising from your use of any of the service or any products procured using the service.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 14 – Indemnification
                </h3>
                <p>You agree to indemnify, defend and hold harmless The Western Store and our parent, subsidiaries, affiliates, partners, officers, directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and employees, harmless from any claim or demand, including reasonable attorneys' fees, made by any third-party due to or arising out of your breach of these Terms of Service or the documents they incorporate by reference, or your violation of any law or the rights of a third-party.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 15 – Severability
                </h3>
                <p>In the event that any provision of these Terms of Service is determined to be unlawful, void or unenforceable, such provision shall nonetheless be enforceable to the fullest extent permitted by applicable law, and the unenforceable portion shall be deemed to be severed from these Terms of Service, such determination shall not affect the validity and enforceability of any other remaining provisions.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 16 – Termination
                </h3>
                <p>The obligations and liabilities of the parties incurred prior to the termination date shall survive the termination of this agreement for all purposes.</p>
                <p>These Terms of Service are effective unless and until terminated by either you or us. You may terminate these Terms of Service at any time by notifying The Western Store that you no longer wish to use our Services, or when you cease using our site.</p>
                <p>If in our sole judgment you fail, or we suspect that you have failed, to comply with any term or provision of these Terms of Service, The Western Store may terminate this agreement at any time without notice and you will remain liable for all amounts due up to and including the date of termination.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 17 – Entire Agreement
                </h3>
                <p>The failure of The Western Store to exercise or enforce any right or provision of these Terms of Service shall not constitute a waiver of such right or provision.</p>
                <p>These Terms of Service and any policies or operating rules posted by The Western Store on this site or in respect to the Service constitute the entire agreement and understanding between you and The Western Store and govern your use of the Service, superseding any prior or contemporaneous agreements, communications and proposals, whether oral or written, between you and The Western Store.</p>
                <p>Any ambiguities in the interpretation of these Terms of Service shall not be construed against The Western Store.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 18 – Governing Law
                </h3>
                <p>These Terms of Service and any separate agreements whereby The Western Store provides you Services shall be governed by and construed in accordance with the laws of India and the jurisdiction of Delhi.</p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  Section 19 – Changes to Terms of Service
                </h3>
                <p>You can review the most current version of the Terms of Service at any time on this page.</p>
                <p>The Western Store reserves the right, at its sole discretion, to update, change or replace any part of these Terms of Service by posting updates and changes to its website. It is your responsibility to check the website periodically for changes. Your continued use of or access to the website or the Service following the posting of any changes to these Terms of Service constitutes acceptance of those changes.</p>
              </section>
            </div>
          </motion.div>
        )}

        {/* TAB 4: PRIVACY POLICY */}
        {activeTab === 'privacy' && (
          <motion.div
            key="tab-privacy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white rounded-2xl border border-[#EAE4D9] p-6 sm:p-8 shadow-sm space-y-8"
          >
            <div className="border-b border-[#EAE4D9] pb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#721B29]">
                Data Protection
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#242120] mt-1">
                Privacy Policy
              </h2>
              <p className="text-xs text-[#736B63] mt-1">
                We value the trust you hold in The Western Store. Please read the following carefully.
              </p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-[#4A453E] leading-relaxed">
              <p className="text-[#5A534F]">
                While using and/or accessing our website, you acknowledge that you have read, understood, and agree to be bound by all the terms mentioned in this privacy policy and other pages of this website.
              </p>
              <p className="text-[11px] italic text-[#8C8276] border-l-2 border-[#E6C280] pl-3 py-1">
                <strong>Note:</strong> Our privacy policy is subject to change at any time, with or without notice. The revised privacy policy is effective immediately upon being posted on the website. Please review this privacy policy periodically to stay informed of any changes.
              </p>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  1. Collection of Personally Identifiable Information
                </h3>
                <p>
                  We collect personally identifiable information — name, email address, phone number, shipping and billing address — from you when you make a purchase with The Western Store. We use your contact information to send you promotional and/or time-based offers.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  2. Use of Demographic and Profile Data
                </h3>
                <p>
                  We use personal information to provide the services you request. To the extent we use your personal information for marketing, we will provide you the ability to opt out of such uses. Your information is also used to resolve disputes; troubleshoot problems; help promote a safe service; measure consumer interest in our products and services; inform you about online offers, products, services, and updates; customize your experience; detect and protect against error, fraud, and other criminal activity; enforce our terms and conditions; and as otherwise described to you at the time of collection.
                </p>
                <p>
                  In our efforts to continuously improve our product and service offerings, we collect and analyze demographic and profile data about our users' activity on our website. We identify and use your IP address to help diagnose server problems and administer our website. Your IP address is also used to help identify you and gather broad demographic information.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  3. Cookies
                </h3>
                <p>
                  A "cookie" is a small piece of information stored by a web server on a web browser so it can later be read back from that browser. Cookies are useful for enabling the browser to remember information specific to a given user. The Western Store places both permanent and temporary cookies on your computer's hard drive. The Western Store cookies do not contain any of your personally identifiable information.
                </p>
                <p>
                  Whether you want your web browser to accept cookies is up to you. If you haven't changed your computer's settings, your browser most likely already accepts cookies. If you choose to decline cookies, you may not be able to fully experience all features of the website. You can also delete your browser cookies or disable them entirely, but this may significantly impact your experience with our website and may make parts of it nonfunctional or inaccessible. We recommend leaving them turned on.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  4. Sharing of Personal Information
                </h3>
                <p>
                  We may share personal information with other corporate entities and affiliates to: help detect and prevent identity theft, fraud, and other potentially illegal acts; correlate related or multiple accounts to prevent abuse of our services; and/or facilitate joint or co-branded services that you request where such services are provided by more than one corporate entity. Those entities and affiliates may not market to you as a result of such sharing unless you explicitly opt in.
                </p>
                <p>
                  We may disclose personal information if required to do so by law, or in the good-faith belief that such disclosure is reasonably necessary to respond to subpoenas, court orders, or other legal processes. We may also disclose personal information to law enforcement, third-party rights owners, or others in the good-faith belief that such disclosure is reasonably necessary to: enforce our Terms and/or Privacy Policy; respond to claims that an advertisement, posting, or other content violates the rights of a third party; or protect the rights, property, or personal safety of our users or the general public.
                </p>
                <p>
                  The Western Store will share some or all of your personal information with another business entity should we (or our assets) plan to merge with, or be acquired by, that business entity. Should such a transaction occur, the other business entity (or the new combined entity) will be required to follow this privacy policy with respect to your personal information.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  5. Security Precautions
                </h3>
                <p>
                  Our site has stringent security measures in place to protect against the loss, misuse, and alteration of information under our control. Whenever you change or access your account information, we offer the use of a secure server. Once your information is in our possession, we adhere to strict security guidelines to protect it against unauthorized access.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="font-serif text-base font-bold text-[#242120]">
                  6. Advertising
                </h3>
                <p>
                  We use third-party service providers to serve ads on our behalf across the internet and sometimes on this site. They may collect anonymous information about your visits to our website and your interaction with our products and services. They may also use information about your visits to other websites to target advertisements for goods and services.
                </p>
                <p>
                  This anonymous information is collected through the use of a pixel tag, an industry-standard technology used by most major websites. No personally identifiable information is collected or used in this process — these providers do not know the name, phone number, email address, or any other personally identifying information about the user.
                </p>
              </section>
            </div>
          </motion.div>
        )}

        {/* Footer Support Callout */}
        <div className="mt-10 rounded-2xl border border-[#EAE4D9] bg-white p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-10 h-10 rounded-full bg-[#721B29]/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-[#721B29]" />
            </div>
            <div>
              <p className="font-serif text-sm font-bold text-[#242120]">
                Have questions about our policies?
              </p>
              <p className="text-xs text-[#736B63] font-light">
                Our Kurukshetra store support team is available Mon – Sun (10 AM – 8:30 PM).
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate('/contact')}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-white border border-[#D9CEBF] text-[#242120] hover:bg-[#FAF8F3] text-xs font-semibold rounded-xl transition"
            >
              Contact Us
            </button>
            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=Hi%20The%20Western%20Store%2C%20I%20have%20a%20question%20about%20your%20store%20policies.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
