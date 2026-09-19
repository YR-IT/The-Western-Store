import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Instagram, Clock, Send, CheckCircle, MessageCircle, Mail } from 'lucide-react';
import { STORE_INFO } from '../data/mockData';

export const ContactPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Send via WhatsApp as primary channel
    const msg = encodeURIComponent(
      `Hi The Western Store! 👋\n\n*Name:* ${form.name}\n*Phone:* ${form.phone}\n*Subject:* ${form.subject}\n\n${form.message}`
    );
    window.open(`https://wa.me/${STORE_INFO.whatsappNumber}?text=${msg}`, '_blank');
    setTimeout(() => {
      setSending(false);
      setSubmitted(true);
    }, 800);
  };

  const locations = STORE_INFO.storeLocations || [];

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Banner */}
      <div className="relative bg-[#1C1717] overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #721B29 0px, #721B29 1px, transparent 1px, transparent 12px)',
          }}
        />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-8 py-20 sm:py-28 text-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-[11px] font-bold uppercase tracking-widest text-[#E6C280] bg-[#E6C280]/15 px-4 py-1.5 rounded-full border border-[#E6C280]/30 mb-5"
          >
            Reach Out
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-[#B5ABA0] max-w-xl mx-auto font-light leading-relaxed"
          >
            We'd love to hear from you — whether it's a question about an outfit, a bulk order, or just saying hi.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-14 sm:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.15 }}
        >
          <h2 className="font-serif text-2xl font-bold text-[#242120] mb-1">Send us a message</h2>
          <p className="text-xs text-[#736B63] mb-7">
            Fill the form below and we'll send it directly to our WhatsApp for the fastest reply.
          </p>

          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center justify-center gap-4 py-16 text-center border-2 border-dashed border-[#721B29]/30 rounded-2xl bg-[#721B29]/5"
            >
              <CheckCircle className="w-12 h-12 text-[#721B29]" strokeWidth={1.5} />
              <div>
                <p className="font-bold text-[#242120] text-lg">Message sent!</p>
                <p className="text-xs text-[#736B63] mt-1">
                  Your message was opened in WhatsApp. We'll reply shortly. 🙏
                </p>
              </div>
              <button
                type="button"
                onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', subject: '', message: '' }); }}
                className="text-xs font-semibold text-[#721B29] hover:underline mt-2"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#4A453E] mb-1.5" htmlFor="contact-name">
                    Your Name <span className="text-[#721B29]">*</span>
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D9CEBF] bg-white text-sm text-[#242120] placeholder:text-[#B5ABA0] focus:outline-none focus:border-[#721B29] focus:ring-2 focus:ring-[#721B29]/10 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#4A453E] mb-1.5" htmlFor="contact-phone">
                    Phone / WhatsApp <span className="text-[#721B29]">*</span>
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D9CEBF] bg-white text-sm text-[#242120] placeholder:text-[#B5ABA0] focus:outline-none focus:border-[#721B29] focus:ring-2 focus:ring-[#721B29]/10 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A453E] mb-1.5" htmlFor="contact-email">
                  Email (optional)
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9CEBF] bg-white text-sm text-[#242120] placeholder:text-[#B5ABA0] focus:outline-none focus:border-[#721B29] focus:ring-2 focus:ring-[#721B29]/10 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A453E] mb-1.5" htmlFor="contact-subject">
                  Subject <span className="text-[#721B29]">*</span>
                </label>
                <select
                  id="contact-subject"
                  name="subject"
                  required
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9CEBF] bg-white text-sm text-[#242120] focus:outline-none focus:border-[#721B29] focus:ring-2 focus:ring-[#721B29]/10 transition"
                >
                  <option value="">Select a subject…</option>
                  <option>Product Enquiry</option>
                  <option>Bulk / Wholesale Order</option>
                  <option>Order Status / Tracking</option>
                  <option>Return / Exchange</option>
                  <option>Custom Stitching</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4A453E] mb-1.5" htmlFor="contact-message">
                  Message <span className="text-[#721B29]">*</span>
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us how we can help you…"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9CEBF] bg-white text-sm text-[#242120] placeholder:text-[#B5ABA0] focus:outline-none focus:border-[#721B29] focus:ring-2 focus:ring-[#721B29]/10 transition resize-none"
                />
              </div>

              <button
                id="contact-submit-btn"
                type="submit"
                disabled={sending}
                className="w-full py-3 px-6 bg-[#721B29] hover:bg-[#52131D] disabled:opacity-60 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                {sending ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Sending…
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send via WhatsApp
                  </>
                )}
              </button>
              <p className="text-[11px] text-[#A3998C] text-center">
                Clicking "Send" will open WhatsApp with your message pre-filled.
              </p>
            </form>
          )}
        </motion.div>

        {/* Right: Info Cards */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.25 }}
          className="space-y-6"
        >
          {/* Quick Contact */}
          <div className="rounded-2xl border border-[#EAE4D9] bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#242120] mb-3">Quick Contact</h3>

            <a
              href={`https://wa.me/${STORE_INFO.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition group"
            >
              <span className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4 text-white fill-white" />
              </span>
              <div>
                <p className="text-xs font-bold text-emerald-800">WhatsApp</p>
                <p className="text-xs text-emerald-600">{STORE_INFO.whatsappNumber}</p>
              </div>
            </a>

            <a
              href={STORE_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 border border-pink-100 hover:bg-pink-100 transition group"
            >
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center shrink-0">
                <Instagram className="w-4 h-4 text-white" />
              </span>
              <div>
                <p className="text-xs font-bold text-pink-800">Instagram</p>
                <p className="text-xs text-pink-600">{STORE_INFO.instagram}</p>
              </div>
            </a>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF8F3] border border-[#EAE4D9]">
              <span className="w-9 h-9 rounded-full bg-[#721B29]/10 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-[#721B29]" />
              </span>
              <div>
                <p className="text-xs font-bold text-[#242120]">Store Hours</p>
                <p className="text-xs text-[#736B63]">Mon – Sun · 10:00 AM – 8:30 PM</p>
              </div>
            </div>
          </div>

          {/* Store Locations */}
          <div className="rounded-2xl border border-[#EAE4D9] bg-white p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#242120] mb-4">Our Locations</h3>
            <div className="space-y-4">
              {locations.map((loc) => (
                <a
                  key={loc.id}
                  href={loc.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <span className="w-8 h-8 rounded-full bg-[#721B29]/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#721B29]/20 transition">
                    <MapPin className="w-4 h-4 text-[#721B29]" />
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#242120] group-hover:text-[#721B29] transition">{loc.name}</p>
                    <p className="text-[11px] text-[#736B63] leading-relaxed mt-0.5">{loc.address}</p>
                    <span className="text-[10px] font-semibold text-[#721B29] underline underline-offset-2">
                      View on Map →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="rounded-2xl border border-[#E6C280]/40 bg-[#FFFDF5] p-5">
            <div className="flex items-start gap-2.5">
              <Mail className="w-4 h-4 text-[#B8860B] mt-0.5 shrink-0" />
              <p className="text-xs text-[#5A4E3C] leading-relaxed">
                <span className="font-bold text-[#B8860B]">Fastest replies via WhatsApp.</span> We typically respond within 1-2 hours during store hours. For urgent queries, please call or message us directly on WhatsApp.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
