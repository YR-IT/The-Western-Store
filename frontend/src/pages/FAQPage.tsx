import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/common/SEOHead';
import { STORE_INFO } from '../data/mockData';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: 'How do I place an order?',
    a: (
      <>
        Browse the{' '}
        <Link to="/shop" className="text-[#721B29] font-semibold underline">
          shop
        </Link>
        , add items to your bag, then checkout with Razorpay (UPI, cards, net banking). Guest checkout is supported — no account required.
      </>
    ),
  },
  {
    q: 'Is shipping free?',
    a: 'Yes. Prepaid online orders currently ship free across India from our Kurukshetra boutique. Delivery timelines vary by destination (typically 3–7 business days after dispatch).',
  },
  {
    q: 'How do I track my order?',
    a: (
      <>
        Use{' '}
        <Link to="/track-order" className="text-[#721B29] font-semibold underline">
          Track Order
        </Link>{' '}
        with your order number and the phone number used at checkout. Logged-in customers can also open My Account → Orders.
      </>
    ),
  },
  {
    q: 'What is your return / exchange policy?',
    a: (
      <>
        Most styles are final sale once dispatched. Damaged or incorrect items may be eligible when reported promptly with an unboxing video. Full details:{' '}
        <Link to="/policies/refund-policy" className="text-[#721B29] font-semibold underline">
          Refund Policy
        </Link>
        .
      </>
    ),
  },
  {
    q: 'How do I choose the right size?',
    a: (
      <>
        See our{' '}
        <Link to="/size-guide" className="text-[#721B29] font-semibold underline">
          Size Guide
        </Link>{' '}
        or the Size Chart on each product page. WhatsApp us at +91 {STORE_INFO.phone} with your measurements for a quick stylist check.
      </>
    ),
  },
  {
    q: 'Do you accept Cash on Delivery (COD)?',
    a: 'No. Orders are prepaid online via Razorpay for secure, faster dispatch. WhatsApp remains available for styling help and order support.',
  },
  {
    q: 'Can I visit the physical boutique?',
    a: `Yes — ${STORE_INFO.address}, ${STORE_INFO.city}, ${STORE_INFO.state} ${STORE_INFO.pincode}. Hours: ${STORE_INFO.operatingHours}.`,
  },
];

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState(0);

  return (
    <div className="bg-[#FAF8F3] min-h-[70vh] py-10 sm:py-14">
      <SEOHead
        title="FAQ"
        description="Frequently asked questions about ordering, shipping, sizing, and returns at The Western Store Kurukshetra."
        canonical="/faq"
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#721B29]/10 text-[#721B29] text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Help Centre
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#242120]">Frequently Asked Questions</h1>
          <p className="text-sm text-[#736B63] mt-2">
            Quick answers for shopping with The Western Store.
          </p>
        </div>

        <div className="space-y-2">
          {FAQS.map((item, idx) => {
            const open = openIdx === idx;
            return (
              <div key={item.q} className="bg-white border border-[#EAE4D9] rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? -1 : idx)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left cursor-pointer"
                >
                  <span className="text-sm font-bold text-[#242120]">{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#721B29] shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </button>
                {open && (
                  <div className="px-4 pb-4 text-xs text-[#736B63] leading-relaxed border-t border-[#F0EBE3] pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-white border border-[#EAE4D9] rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-[#736B63]">Still need help? Message our boutique team on WhatsApp.</p>
          <a
            href={`https://wa.me/${STORE_INFO.whatsappNumber}?text=${encodeURIComponent('Hi! I have a question about an order / product.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-lg"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Concierge
          </a>
        </div>
      </div>
    </div>
  );
};
