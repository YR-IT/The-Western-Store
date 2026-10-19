import React from 'react';
import { Helmet } from 'react-helmet-async';
import { STORE_INFO } from '../../data/mockData';

interface SEOHeadProps {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  jsonLd?: Record<string, any> | Record<string, any>[];
  noIndex?: boolean;
}

const SITE_URL = 'https://www.thewesternstore.in';
const DEFAULT_OG_IMAGE = 'https://www.thewesternstore.in/logo.png';
const DEFAULT_KEYWORDS =
  'The Western Store Kurukshetra, women boutique Kurukshetra, ethnic wear, suits, festive co-ords, designer boutique Haryana, women fashion Kurukshetra';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description = 'Shop handpicked ethnic suits, festive co-ords & designer wear at The Western Store Kurukshetra. Premium fabrics, custom fits & Pan-India delivery.',
  keywords = DEFAULT_KEYWORDS,
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

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'The Western Store',
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/shop?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const defaultOrgSchema = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    name: STORE_INFO.name,
    legalName: STORE_INFO.legalName || 'The Western Store',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/logo.png`,
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
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '29.9695',
      longitude: '76.8783',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '10:30',
        closes: '21:00',
      },
    ],
    sameAs: [
      STORE_INFO.instagramUrl,
      'https://maps.google.com/?q=The+Western+Store+Kurukshetra',
    ].filter(Boolean),
    priceRange: '₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking',
  };

  const schemasToInject = [websiteSchema, defaultOrgSchema];
  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      schemasToInject.push(...jsonLd);
    } else {
      schemasToInject.push(jsonLd);
    }
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
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
        {JSON.stringify(schemasToInject)}
      </script>
    </Helmet>
  );
};
