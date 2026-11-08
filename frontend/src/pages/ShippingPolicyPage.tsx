import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Truck, ShieldAlert, Globe, Package } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';
import { PolicyLayout } from '../components/policies/PolicyLayout';

export const ShippingPolicyPage: React.FC = () => {
  return (
    <PolicyLayout
      title="Shipping & Delivery Policy"
      description={`Pan-India and international dispatch guidelines from ${STORE_INFO.name}, ${STORE_INFO.city}. Prepaid online orders only.`}
      canonical="/shipping-policy"
      eyebrow="Shipping & Delivery"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-8"
      >
        <div className="bg-white rounded-2xl border border-[#EAE4D9] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[#EAE4D9] pb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#721B29]">
              Domestic Orders (India)
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#242120] mt-1">
              1) Estimated Delivery Time (India)
            </h2>
            <p className="text-xs text-[#736B63] mt-2">
              Orders ship from our boutique at {STORE_INFO.address}, {STORE_INFO.city}, {STORE_INFO.state} —{' '}
              {STORE_INFO.pincode}.
            </p>
          </div>

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

          <div className="space-y-3 pt-2 text-xs sm:text-sm text-[#4A453E]">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FDFBF7] border border-[#EAE4D9]">
              <Truck className="w-4 h-4 text-[#721B29] shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                <strong>Shipping charges:</strong> Prepaid online orders currently ship{' '}
                <strong>free across India</strong> from our Kurukshetra boutique. Delivery timelines vary by destination
                (typically 3–7 business days after dispatch for major cities).
              </p>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FFFDF5] border border-[#E6C280]/40">
              <ShieldAlert className="w-4 h-4 text-[#B8860B] shrink-0 mt-0.5" />
              <p className="text-xs text-[#5A4E3C] leading-relaxed">
                <strong>Prepaid orders only:</strong> Cash on Delivery (COD) is not available. Pay online via UPI, cards,
                net banking, or other methods offered at checkout before dispatch.
              </p>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#FDFBF7] border border-[#EAE4D9]">
              <Package className="w-4 h-4 text-[#721B29] shrink-0 mt-0.5" />
              <p className="text-xs leading-relaxed">
                You will receive tracking details by SMS / WhatsApp / email after dispatch. Sign in and open{' '}
                <Link to="/account/orders" className="font-semibold text-[#721B29] underline">
                  My Orders
                </Link>{' '}
                to view status anytime.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#EAE4D9] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[#EAE4D9] pb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#721B29]">Worldwide Dispatch</span>
            <h2 className="font-serif text-2xl font-bold text-[#242120] mt-1">2) International Shipping</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#4A453E]">
            <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE4D9] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#242120]">
                <Globe className="w-4 h-4 text-[#721B29]" />
                <span>Global delivery timelines</span>
              </div>
              <p className="text-sm font-semibold text-[#721B29]">10 to 15 days (approx.)</p>
              <p className="text-[11px] text-[#736B63] leading-relaxed font-light">
                Depends on destination and customs clearance.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE4D9] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#242120]">
                <Package className="w-4 h-4 text-[#721B29]" />
                <span>Courier partners</span>
              </div>
              <p className="text-sm font-semibold text-[#242120]">FedEx / UPS / DHL Express</p>
              <p className="text-[11px] text-[#736B63] leading-relaxed font-light">
                Door-to-door tracked express logistics where available.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FFFDF5] border border-[#E6C280]/40 space-y-2 text-xs text-[#5A4E3C]">
            <p className="font-semibold text-[#422D0A]">Customs &amp; duties</p>
            <p className="leading-relaxed">
              International shipping charges apply. Customs duties, import taxes, or clearance fees levied by the
              destination country are the customer&apos;s responsibility.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs text-[#736B63]">Already ordered? Sign in to view dispatch and delivery progress.</p>
            <Link
              to="/account/orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#721B29] hover:bg-[#52131D] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Truck className="w-4 h-4" />
              <span>My Orders</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </PolicyLayout>
  );
};
