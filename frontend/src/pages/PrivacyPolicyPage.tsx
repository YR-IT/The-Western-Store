import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { STORE_INFO } from '../data/mockData';
import { PolicyLayout } from '../components/policies/PolicyLayout';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <PolicyLayout
      title="Privacy Policy"
      description={`How ${STORE_INFO.name} collects, uses, and protects your personal information when you shop or contact our Kurukshetra boutique.`}
      canonical="/privacy-policy"
      eyebrow="Privacy & Data"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white rounded-2xl border border-[#EAE4D9] p-6 sm:p-8 shadow-sm space-y-8"
      >
        <div className="border-b border-[#EAE4D9] pb-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#721B29]">Data Protection</span>
          <h2 className="font-serif text-2xl font-bold text-[#242120] mt-1">Privacy Policy</h2>
          <p className="text-xs text-[#736B63] mt-1">
            We value the trust you place in {STORE_INFO.name}. Please read the following carefully.
          </p>
          <p className="text-xs text-[#736B63] mt-2 leading-relaxed">
            Data controller / business: <strong>{STORE_INFO.legalName || STORE_INFO.name}</strong>
            <br />
            Address: {STORE_INFO.address}, {STORE_INFO.city}, {STORE_INFO.state} — {STORE_INFO.pincode},{' '}
            {STORE_INFO.country}
            <br />
            Email:{' '}
            <a href={`mailto:${STORE_INFO.email}`} className="text-[#721B29] underline">
              {STORE_INFO.email}
            </a>{' '}
            · Phone:{' '}
            <a href={`tel:+91${STORE_INFO.phone}`} className="text-[#721B29] underline">
              {STORE_INFO.phoneFormatted}
            </a>
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-[#4A453E] leading-relaxed">
          <p className="text-[#5A534F]">
            While using and/or accessing our website, you acknowledge that you have read, understood, and agree to be
            bound by this privacy policy and other pages of this website.
          </p>
          <p className="text-[11px] italic text-[#8C8276] border-l-2 border-[#E6C280] pl-3 py-1">
            <strong>Note:</strong> Our privacy policy may change at any time. The revised policy is effective when posted
            on this page. Please review it periodically.
          </p>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">
              1. Collection of Personally Identifiable Information
            </h3>
            <p>
              We collect personally identifiable information — name, email address, phone number, shipping and billing
              address — when you make a purchase, create an account, track an order, or contact us. We may use your
              contact information to send order updates and, where permitted, promotional offers (you may opt out).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">
              2. Use of Demographic and Profile Data
            </h3>
            <p>
              We use personal information to fulfil orders, process payments (via our payment gateway partners), provide
              customer support, resolve disputes, troubleshoot problems, improve our products and site, detect fraud,
              and enforce our terms. We identify and use your IP address to help diagnose server problems and administer
              our website.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">3. Cookies</h3>
            <p>
              A &quot;cookie&quot; is a small piece of information stored by a web server on a web browser. Cookies help
              remember information specific to a given user (for example cart or session). {STORE_INFO.name} cookies do
              not themselves contain your name or password. You can decline cookies in your browser, but some site
              features may not work fully.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">4. Sharing of Personal Information</h3>
            <p>
              We may share personal information with service providers who help us operate the store — for example
              payment processors, logistics / courier partners, cloud hosting, and authentication providers — solely to
              fulfil your order or provide the Service. We may disclose information if required by law or in good faith
              to respond to legal process, protect rights and safety, or enforce our Terms / Privacy Policy.
            </p>
            <p>
              If {STORE_INFO.name} (or its assets) merges with or is acquired by another entity, personal information may
              transfer to that entity, which must follow this privacy policy with respect to your information.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">
              5. Grievance Officer (Consumer Protection / DPDP)
            </h3>
            <p>
              In accordance with the Consumer Protection (E-Commerce) Rules, 2020 and applicable data protection
              requirements, customers may contact our designated Grievance Officer for complaints relating to privacy,
              orders, or service:
            </p>
            <div className="p-3 rounded-lg bg-[#FAF8F3] border border-[#EAE4D9] text-xs space-y-1">
              <p>
                <strong>Officer:</strong>{' '}
                {STORE_INFO.grievanceOfficer || `Customer Support — ${STORE_INFO.name}`}
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a
                  href={`mailto:${STORE_INFO.grievanceEmail || STORE_INFO.email}`}
                  className="text-[#721B29] font-semibold underline"
                >
                  {STORE_INFO.grievanceEmail || STORE_INFO.email}
                </a>
              </p>
              <p>
                <strong>Phone:</strong>{' '}
                <a href={`tel:+91${STORE_INFO.phone}`} className="text-[#721B29] font-semibold underline">
                  {STORE_INFO.phoneFormatted}
                </a>
              </p>
              <p>
                <strong>Address:</strong> {STORE_INFO.address}, {STORE_INFO.city}, {STORE_INFO.state} —{' '}
                {STORE_INFO.pincode}
              </p>
              {STORE_INFO.legalName || STORE_INFO.gstin ? (
                <p>
                  <strong>Legal name / GSTIN:</strong> {STORE_INFO.legalName || STORE_INFO.name}
                  {STORE_INFO.gstin ? ` · ${STORE_INFO.gstin}` : ''}
                </p>
              ) : null}
              <p className="text-[#736B63]">
                We aim to acknowledge grievances within 48 hours and resolve them within timelines prescribed under
                applicable law. You may also use our{' '}
                <Link to="/contact-us" className="text-[#721B29] font-semibold underline">
                  Contact Us
                </Link>{' '}
                page.
              </p>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">6. Security Precautions</h3>
            <p>
              Our site uses industry-standard measures to protect against loss, misuse, and alteration of information
              under our control. Payment card data is handled by our payment gateway; we do not store full card numbers
              on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">7. Advertising</h3>
            <p>
              We may use third-party service providers to serve ads or measure marketing. They may collect anonymous
              information about visits using cookies or pixel tags. They do not receive your name, phone, or email from
              us for that purpose unless you separately consent.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">8. Your Rights</h3>
            <p>
              Subject to applicable law, you may request access, correction, or deletion of personal data we hold about
              you by emailing{' '}
              <a href={`mailto:${STORE_INFO.email}`} className="font-semibold text-[#721B29] underline">
                {STORE_INFO.email}
              </a>{' '}
              or using{' '}
              <Link to="/contact-us" className="font-semibold text-[#721B29] underline">
                Contact Us
              </Link>
              . We may need to retain certain records for legal, accounting, or fraud-prevention purposes.
            </p>
          </section>
        </div>
      </motion.div>
    </PolicyLayout>
  );
};
