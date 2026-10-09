import React from 'react';
import { Helmet } from 'react-helmet-async';
import { STORE_INFO } from '../../data/mockData';

interface SEOHeadProps {
  title: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, any> | Record<string, any>[];
  noIndex?: boolean;
}

const SITE_URL = 'https://www.thewesternstore.in';
const DEFAULT_OG_IMAGE = 'https://www.thewesternstore.in/og-image.jpg';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = 'Shop handpicked ethnic wear, festive co-ords, suits, and daily ensembles from The Western Store Kurukshetra. Premium fabrics, tailored fits & Pan-India delivery.',
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  jsonLd,
  noIndex = false,
}) => {
  const fullTitle = title.includes('The Western Store') ? title : `${title} | The Western Store`;
  const canonicalUrl = canonical
    ? (canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`)
    : (typeof window !== 'undefined' ? window.location.href : SITE_URL);

  const defaultOrgSchema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: STORE_INFO.name,
    legalName: STORE_INFO.legalName || 'The Western Store',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    telephone: `+91${STORE_INFO.phone}`,
    email: STORE_INFO.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: STORE_INFO.address,
      addressLocality: STORE_INFO.city,
      addressRegion: STORE_INFO.state,
      postalCode: STORE_INFO.pincode,
      addressCountry: 'IN',
    },
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking',
  };

  const schemaToInject = jsonLd ? (Array.isArray(jsonLd) ? [defaultOrgSchema, ...jsonLd] : [defaultOrgSchema, jsonLd]) : defaultOrgSchema;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="The Western Store" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schemaToInject)}
      </script>
    </Helmet>
  );
};
