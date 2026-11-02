import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { STORE_INFO } from '../data/mockData';
import { PolicyLayout } from '../components/policies/PolicyLayout';

export const TermsAndConditionsPage: React.FC = () => {
  return (
    <PolicyLayout
      title="Terms & Conditions"
      description={`Legal terms for using ${STORE_INFO.name}'s website and purchasing women's ethnic & western wear online from our Kurukshetra boutique.`}
      canonical="/terms-and-conditions"
      eyebrow="Terms of Service"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="bg-white rounded-2xl border border-[#EAE4D9] p-6 sm:p-8 shadow-sm space-y-8"
      >
        <div className="border-b border-[#EAE4D9] pb-4">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#721B29]">Legal Agreement</span>
          <h2 className="font-serif text-2xl font-bold text-[#242120] mt-1">Terms &amp; Conditions</h2>
          <p className="text-xs text-[#736B63] mt-1">
            Last updated: {new Date().getFullYear()} · {STORE_INFO.name}, {STORE_INFO.city}, {STORE_INFO.state}.
          </p>
          <p className="text-xs text-[#736B63] mt-2 leading-relaxed">
            Trading / brand name: <strong>{STORE_INFO.name}</strong>
            {STORE_INFO.legalName ? (
              <>
                {' '}
                · Legal entity: <strong>{STORE_INFO.legalName}</strong>
              </>
            ) : null}
            . Address: {STORE_INFO.address}, {STORE_INFO.city}, {STORE_INFO.state} — {STORE_INFO.pincode},{' '}
            {STORE_INFO.country}. Contact:{' '}
            <a href={`mailto:${STORE_INFO.email}`} className="text-[#721B29] underline">
              {STORE_INFO.email}
            </a>
            ,{' '}
            <a href={`tel:+91${STORE_INFO.phone}`} className="text-[#721B29] underline">
              {STORE_INFO.phoneFormatted}
            </a>
            .
          </p>
        </div>

        <div className="space-y-6 text-xs sm:text-sm text-[#4A453E] leading-relaxed">
          <p>
            This website is operated by <strong>{STORE_INFO.name}</strong>, a women&apos;s ethnic and western wear
            boutique based in Kurukshetra, Haryana, India. Throughout the site, &quot;we&quot;, &quot;us&quot; and
            &quot;our&quot; refer to {STORE_INFO.name}. We offer this website, including all information, tools and
            services available from this site to you, the user, conditioned upon your acceptance of all terms,
            conditions, policies and notices stated here.
          </p>
          <p>
            By visiting our site and/or purchasing something from us, you engage in our &quot;Service&quot; and agree
            to be bound by the following terms and conditions (&quot;Terms of Service&quot;, &quot;Terms&quot;),
            including those additional terms and conditions and policies referenced herein. These Terms apply to all
            users of the site.
          </p>
          <p>
            Please read these Terms carefully before accessing or using our website. By accessing or using any part of
            the site, you agree to be bound by these Terms. If you do not agree, you may not access the website or use
            any services.
          </p>
          <p>
            Any new features or tools added to the store shall also be subject to these Terms. We may update these Terms
            by posting changes on this page. Continued use after changes constitutes acceptance.
          </p>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">Section 1 – Online Store Terms</h3>
            <p>
              By agreeing to these Terms, you represent that you are at least the age of majority in your state or
              province of residence, or that you have given us consent to allow any of your minor dependents to use this
              site.
            </p>
            <p>
              You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the
              Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
            </p>
            <p>You must not transmit any worms or viruses or any code of a destructive nature.</p>
            <p>A breach or violation of any of the Terms will result in an immediate termination of your Services.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">Section 2 – General Conditions</h3>
            <p>We reserve the right to refuse service to anyone for any reason at any time.</p>
            <p>
              You understand that your content (not including credit card information) may be transferred unencrypted
              and involve (a) transmissions over various networks; and (b) changes to conform and adapt to technical
              requirements of connecting networks or devices. Credit card information is always encrypted during
              transfer over networks.
            </p>
            <p>
              You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service without
              express written permission by us.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">
              Section 3 – Accuracy, Completeness and Timeliness of Information
            </h3>
            <p>
              We are not responsible if information made available on this site is not accurate, complete or current.
              The material on this site is provided for general information only. Any reliance on the material on this
              site is at your own risk.
            </p>
            <p>
              We reserve the right to modify the contents of this site at any time. You agree that it is your
              responsibility to monitor changes to our site.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">
              Section 4 – Modifications to the Service and Prices
            </h3>
            <p>Prices for our products are subject to change without notice.</p>
            <p>
              We reserve the right at any time to modify or discontinue the Service (or any part or content thereof)
              without notice at any time.
            </p>
            <p>
              We shall not be liable to you or to any third-party for any modification, price change, suspension or
              discontinuance of the Service.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">Section 5 – Products or Services</h3>
            <p>
              We sell women&apos;s ethnic wear, western wear, suits, co-ords, and related boutique fashion from our
              Kurukshetra store. Certain products may be available exclusively online, may have limited quantities, and
              are subject to cancellation, refund, or replacement only according to our{' '}
              <Link to="/refund-policy" className="font-semibold text-[#721B29] underline">
                Refund &amp; Cancellation Policy
              </Link>
              .
            </p>
            <p>
              We have made every effort to display colours and images accurately. We cannot guarantee that your device
              display of any colour will be accurate.
            </p>
            <p>
              We reserve the right to limit sales to any person, geographic region or jurisdiction, to discontinue any
              product at any time, and to change descriptions or pricing without notice. Any offer is void where
              prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">
              Section 6 – Accuracy of Billing and Account Information
            </h3>
            <p>
              We reserve the right to refuse any order you place with us. We may limit or cancel quantities purchased
              per person, household or order. If we change or cancel an order, we may notify you using the email and/or
              phone number provided at checkout.
            </p>
            <p>
              You agree to provide current, complete and accurate purchase and account information for all purchases
              made at our store.
            </p>
            <p>
              For refund and cancellation detail, see our{' '}
              <Link to="/refund-policy" className="font-semibold text-[#721B29] underline">
                Refund &amp; Cancellation Policy
              </Link>
              . Shipping is described in our{' '}
              <Link to="/shipping-policy" className="font-semibold text-[#721B29] underline">
                Shipping &amp; Delivery Policy
              </Link>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">Section 7 – Optional Tools</h3>
            <p>
              We may provide access to third-party tools over which we neither monitor nor have any control. We provide
              such tools &quot;as is&quot; and &quot;as available&quot; without warranties or endorsement.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">Section 8 – Third-Party Links</h3>
            <p>
              Certain content, products and services available via our Service may include materials from third parties.
              Third-party links may direct you to websites not affiliated with us. We are not responsible for third-party
              materials, websites, products or services.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">
              Section 9 – User Comments, Feedback and Other Submissions
            </h3>
            <p>
              If you send comments or ideas, you agree that we may edit, copy, publish, distribute, translate and
              otherwise use them without restriction. We have no obligation to keep comments confidential, pay for them,
              or respond.
            </p>
            <p>
              You agree that your comments will not violate any third-party right. You are solely responsible for any
              comments you make.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">Section 10 – Personal Information</h3>
            <p>
              Your submission of personal information through the store is governed by our{' '}
              <Link to="/privacy-policy" className="font-semibold text-[#721B29] underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">
              Section 11 – Errors, Inaccuracies and Omissions
            </h3>
            <p>
              Occasionally there may be typographical errors, inaccuracies or omissions relating to product
              descriptions, pricing, promotions, shipping charges, transit times or availability. We reserve the right
              to correct any errors and to change or cancel orders if information is inaccurate, without prior notice.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">Section 12 – Prohibited Uses</h3>
            <p>In addition to other prohibitions, you are prohibited from using the site or its content:</p>
            <ul className="list-none space-y-1 pl-2 text-[#5A534F]">
              <li>
                <strong>(a)</strong> for any unlawful purpose;
              </li>
              <li>
                <strong>(b)</strong> to solicit others to perform or participate in any unlawful acts;
              </li>
              <li>
                <strong>(c)</strong> to violate any applicable regulations, rules, laws, or ordinances;
              </li>
              <li>
                <strong>(d)</strong> to infringe upon or violate our intellectual property rights or those of others;
              </li>
              <li>
                <strong>(e)</strong> to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or
                discriminate;
              </li>
              <li>
                <strong>(f)</strong> to submit false or misleading information;
              </li>
              <li>
                <strong>(g)</strong> to upload or transmit viruses or malicious code;
              </li>
              <li>
                <strong>(h)</strong> to collect or track the personal information of others;
              </li>
              <li>
                <strong>(i)</strong> to spam, phish, pharm, pretext, spider, crawl, or scrape;
              </li>
              <li>
                <strong>(j)</strong> for any obscene or immoral purpose; or
              </li>
              <li>
                <strong>(k)</strong> to interfere with or circumvent security features of the Service.
              </li>
            </ul>
            <p>We reserve the right to terminate your use of the Service for violating any prohibited uses.</p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">
              Section 13 – Disclaimer of Warranties; Limitation of Liability
            </h3>
            <p>
              We do not guarantee that your use of our service will be uninterrupted, timely, secure or error-free, or
              that results obtained will be accurate or reliable.
            </p>
            <p>
              You expressly agree that your use of, or inability to use, the service is at your sole risk. The service
              and products are (except as expressly stated by us) provided &quot;as is&quot; and &quot;as
              available&quot; without warranties of merchantability, fitness for a particular purpose, or
              non-infringement.
            </p>
            <p>
              In no case shall {STORE_INFO.name}, our directors, officers, employees, affiliates, agents, contractors,
              interns, suppliers, service providers or licensors be liable for any injury, loss, claim, or any direct,
              indirect, incidental, punitive, special, or consequential damages arising from your use of the service or
              products procured using the service, except to the extent that liability cannot be excluded under
              applicable Indian consumer protection law (including refunds for defective or wrong goods as stated in our
              Refund Policy).
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">Section 14 – Indemnification</h3>
            <p>
              You agree to indemnify, defend and hold harmless {STORE_INFO.name} and our affiliates, partners, officers,
              directors, agents, contractors, licensors, service providers, subcontractors, suppliers, interns and
              employees from any claim or demand, including reasonable attorneys&apos; fees, arising out of your breach
              of these Terms or your violation of any law or the rights of a third party.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">Section 15 – Severability</h3>
            <p>
              If any provision of these Terms is determined to be unlawful, void or unenforceable, that provision shall
              nonetheless be enforceable to the fullest extent permitted by law, and the unenforceable portion shall be
              deemed severed. The remaining provisions remain in effect.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">Section 16 – Termination</h3>
            <p>
              Obligations and liabilities incurred prior to termination survive termination. These Terms remain in
              effect until terminated by you or us. We may terminate this agreement if you fail to comply with any term,
              and you remain liable for amounts due up to the date of termination.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">Section 17 – Entire Agreement</h3>
            <p>
              These Terms and any policies posted on this site (including Privacy, Refund &amp; Cancellation, and
              Shipping policies) constitute the entire agreement between you and {STORE_INFO.name} regarding the
              Service.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">Section 18 – Governing Law</h3>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Subject to applicable
              law, courts at Kurukshetra / Haryana shall have jurisdiction, without prejudice to consumer forum rights.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">Section 19 – Changes to Terms of Service</h3>
            <p>You can review the most current version of the Terms at any time on this page.</p>
            <p>
              {STORE_INFO.name} may update these Terms by posting changes to its website. Continued use of the website
              or Service after changes constitutes acceptance of those changes.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-serif text-base font-bold text-[#242120]">Section 20 – Contact</h3>
            <p>
              Questions about the Terms should be sent to{' '}
              <Link to="/contact-us" className="font-semibold text-[#721B29] underline">
                Contact Us
              </Link>{' '}
              or email{' '}
              <a href={`mailto:${STORE_INFO.email}`} className="font-semibold text-[#721B29] underline">
                {STORE_INFO.email}
              </a>
              .
            </p>
          </section>
        </div>
      </motion.div>
    </PolicyLayout>
  );
};
