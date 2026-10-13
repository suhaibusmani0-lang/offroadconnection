import siteConfig from '@/config/site';

/**
 * SEO, GEO & AIO Structured Data (JSON-LD) Generators
 */

/**
 * 1. AutoPartsStore & LocalBusiness Schema (Local / GEO SEO)
 */
export function generateAutoPartsStoreSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['AutoPartsStore', 'LocalBusiness', 'AutomotiveBusiness'],
    '@id': `${siteConfig.url}/#store`,
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    alternateName: 'Off Road Connection Parts Noida',
    url: siteConfig.url,
    logo: `${siteConfig.url}/assets/images/mv-logo-13.png`,
    image: `${siteConfig.url}/assets/images/banner/banner-1.jpg`,
    description: siteConfig.description,
    telephone: siteConfig.contact.phone,
    email: siteConfig.contact.email,
    priceRange: '₹₹ - ₹₹₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, UPI, Credit Card, Debit Card, Net Banking, Razorpay',
    openingHours: siteConfig.contact.openingHours,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.geo.address.streetAddress,
      addressLocality: siteConfig.geo.address.addressLocality,
      addressRegion: siteConfig.geo.address.addressRegion,
      postalCode: siteConfig.geo.address.postalCode,
      addressCountry: siteConfig.geo.address.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'India',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Delhi NCR',
      },
      {
        '@type': 'AdministrativeArea',
        name: 'Noida',
      },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Luxury & 4x4 Auto Spare Parts Catalog',
      itemListElement: siteConfig.supportedMakes.map((make, idx) => ({
        '@type': 'OfferCatalog',
        name: `${make} Genuine Spare Parts`,
        position: idx + 1,
      })),
    },
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.facebook,
      siteConfig.social.youtube,
    ],
  };
}

/**
 * 2. WebSite Schema with SearchAction (Sitelinks Search Box)
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      '@id': `${siteConfig.url}/#store`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/shop?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-IN',
  };
}

/**
 * 3. Product Schema (Google Shopping & AI Rich Snippet)
 */
export function generateProductSchema(product: {
  name: string;
  slug: string;
  price: number;
  old_price?: number;
  description?: string;
  images?: string[];
  part_number?: string;
  oem_number?: string;
  brand?: string;
  category_name?: string;
  in_stock?: boolean;
}) {
  const images = (product.images && product.images.length > 0)
    ? product.images
    : [`${siteConfig.url}/assets/images/shop/shop-1.jpg`];

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${siteConfig.url}/product/${product.slug}#product`,
    name: product.name,
    description: product.description || `${product.name} genuine automotive replacement part.`,
    image: images,
    sku: product.part_number || product.slug,
    mpn: product.oem_number || product.part_number || product.slug,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Off Road Connection Parts',
    },
    category: product.category_name || 'Vehicle Parts & Accessories',
    offers: {
      '@type': 'Offer',
      url: `${siteConfig.url}/product/${product.slug}`,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: '2026-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: product.in_stock !== false
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: siteConfig.name,
      },
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 1,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 5,
            unitCode: 'DAY',
          },
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '128',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

/**
 * 4. BreadcrumbList Schema
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

/**
 * 5. FAQPage Schema (for AI Engine Answers / Perplexity / Gemini / Google AI Overviews)
 */
export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

