import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Truck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Package,
  Video,
  Ruler,
} from 'lucide-react';
import { STORE_INFO } from '../data/mockData';
import { useStore } from '../context/StoreContext';
import { PolicyLayout } from '../components/policies/PolicyLayout';

export const RefundPolicyPage: React.FC = () => {
  const { setIsSizeChartOpen } = useStore();

  return (
    <PolicyLayout
      title="Refund & Cancellation Policy"
      description="When you can cancel an order, when refunds or replacements apply, and how long refunds take for online payments at The Western Store, Kurukshetra."
      canonical="/refund-policy"
      eyebrow="Refunds & Cancellations"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-8"
      >
        <div className="bg-white rounded-2xl border border-[#EAE4D9] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="border-b border-[#EAE4D9] pb-4">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#721B29]">Official Policy</span>
            <h2 className="font-serif text-2xl font-bold text-[#242120] mt-1">Refund &amp; Cancellation Policy</h2>
            <p className="text-xs sm:text-sm text-[#736B63] mt-2 leading-relaxed">
              This page applies to all online orders placed on{' '}
              <strong>thewesternstore.in</strong> and paid through our website payment gateway. Business:{' '}
              <strong>{STORE_INFO.name}</strong>, {STORE_INFO.address}, {STORE_INFO.city}, {STORE_INFO.state} —{' '}
              {STORE_INFO.pincode}.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#4A453E] leading-relaxed">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE4D9]">
              <Clock className="w-5 h-5 text-[#721B29] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#242120] block font-semibold mb-1">1. Order cancellation</strong>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>
                    You may request cancellation <strong>before the order is dispatched</strong> via phone, email,
                    WhatsApp, or our <Link to="/contact-us" className="font-semibold text-[#721B29] underline">Contact Us</Link>{' '}
                    page with your order number.
                  </li>
                  <li>
                    If payment succeeded and we cancel before dispatch (or cannot fulfil the order), we issue a{' '}
                    <strong>full refund</strong> to the original payment method within{' '}
                    <strong>5–7 business days</strong> after approval.
                  </li>
                  <li>
                    Once handed to the courier / marked shipped, cancellation is usually not possible — see undelivered
                    and defective-item sections below.
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE4D9]">
              <Truck className="w-5 h-5 text-[#721B29] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#242120] block font-semibold mb-1">2. Undelivered or lost shipments</strong>
                <p>
                  If a paid order is marked delivered but you did not receive it, or the shipment is confirmed lost in
                  transit, contact us within <strong>7 days</strong> of the expected / marked delivery date. After
                  courier verification we arrange a <strong>replacement</strong> (subject to stock) or a{' '}
                  <strong>full refund</strong> within <strong>5–7 business days</strong> of confirmation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE4D9]">
              <CheckCircle2 className="w-5 h-5 text-[#721B29] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#242120] block font-semibold mb-1">
                  3. Defective, damaged, or wrong items — refunds &amp; replacements
                </strong>
                <p className="mb-2">
                  Confirmed <strong>defective</strong>, transit-damaged, or <strong>wrong</strong> items (incorrect
                  product / size / colour vs order) are eligible for a <strong>replacement</strong> (subject to stock)
                  or a <strong>full refund</strong> of the item price (and shipping, if charged) to the original payment
                  method.
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Report preferably within <strong>48 hours</strong> of delivery (and no later than{' '}
                    <strong>7 days</strong>).
                  </li>
                  <li>
                    An unedited unboxing video <strong>helps verify claims faster</strong> and is recommended, but not
                    the only accepted proof — clear photos, order details, and courier feedback are also reviewed.
                  </li>
                  <li>
                    Approved refunds are processed within <strong>5–7 business days</strong> to the original payment
                    method (banks may take longer to post the credit).
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE4D9]">
              <Package className="w-5 h-5 text-[#721B29] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#242120] block font-semibold mb-1">
                  4. Change of mind, fit preference &amp; exchanges
                </strong>
                <p>
                  Limited boutique stock means we generally{' '}
                  <strong>do not offer returns or exchanges for change of mind, preference, or fit</strong> once a
                  correctly described, undamaged item is delivered. Use our size guide and contact us before ordering.
                  This does <strong>not</strong> limit rights for defective, damaged, wrong, cancelled, or undelivered
                  orders above.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#FAF8F3] border border-[#EAE4D9]">
              <AlertTriangle className="w-5 h-5 text-[#721B29] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#242120] block font-semibold mb-1">5. How refunds are paid</strong>
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Refunds go only to the <strong>original payment method</strong>.</li>
                  <li>
                    After approval, expect <strong>5–7 business days</strong> for the amount to reflect (gateway / bank
                    delays may apply).
                  </li>
                  <li>We confirm refund initiation on your registered phone / email.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#B8860B]/40 bg-[#FFFDF5] p-6 sm:p-7 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#B8860B]/15 border border-[#B8860B]/30 flex items-center justify-center shrink-0 mt-0.5">
              <Video className="w-5 h-5 text-[#8A5A00]" />
            </div>
            <div className="space-y-3 flex-1">
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#422D0A]">
                How to raise a refund or replacement request
              </h2>
              <p className="text-xs sm:text-sm text-[#5C451D] leading-relaxed">
                Share your <strong>order number</strong>, a short description, and photos or an unboxing video if
                available:
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-[#6E5429]">
                <li>
                  Phone:{' '}
                  <a href={`tel:+91${STORE_INFO.phone}`} className="font-bold text-[#721B29] underline">
                    {STORE_INFO.phoneFormatted}
                  </a>
                </li>
                <li>
                  Email:{' '}
                  <a href={`mailto:${STORE_INFO.email}`} className="font-bold text-[#721B29] underline">
                    {STORE_INFO.email}
                  </a>
                </li>
                <li>
                  WhatsApp:{' '}
                  <a
                    href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent(
                      'Hi The Western Store, I need help with a refund / replacement for my order.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-[#721B29] underline"
                  >
                    {STORE_INFO.phoneFormatted}
                  </a>
                </li>
                <li>
                  <Link to="/contact-us" className="font-bold text-[#721B29] underline">
                    Contact Us form
                  </Link>
                </li>
              </ul>
              <p className="text-[11px] text-[#6E5429] bg-[#FAF3E0] p-2.5 rounded-lg border border-[#ECDDB8]">
                We aim to acknowledge requests within 48 hours on business days and resolve confirmed cases under this
                policy as quickly as possible.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#EAE4D9] p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-start gap-3">
            <Ruler className="w-5 h-5 text-[#721B29] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#242120] block font-semibold mb-1 text-sm">Sizing tip</strong>
              <p className="text-xs sm:text-sm text-[#4A453E] leading-relaxed">
                Check size carefully before ordering. Our team can help with fit before you pay.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#721B29]/5 border border-[#721B29]/20">
            <div className="text-center sm:text-left">
              <p className="text-xs font-bold text-[#242120]">Need help finding your exact size?</p>
              <p className="text-[11px] text-[#736B63]">Ask before you order — we are happy to guide you.</p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsSizeChartOpen(true)}
                className="px-4 py-2 bg-white hover:bg-gray-50 text-[#721B29] border border-[#721B29]/30 rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                View Size Guide
              </button>
              <Link
                to="/contact-us"
                className="px-4 py-2 bg-[#721B29] hover:bg-[#52131D] text-white rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </PolicyLayout>
  );
};
