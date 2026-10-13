import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import CustomerLoginModal from '@/components/CustomerLoginModal';
import AnalyticsProvider from '@/components/AnalyticsProvider';
import siteConfig from '@/config/site';
import { generateAutoPartsStoreSchema, generateWebSiteSchema } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Off Road Connection Parts | Luxury Auto & 4x4 Spare Parts Specialist',
    template: '%s | Off Road Connection Parts',
  },
  description: siteConfig.description,
  keywords: [
    'luxury car spare parts',
    'audi spare parts india',
    'bmw spare parts online',
    'mercedes benz parts noida',
    'porsche genuine parts',
    'range rover air suspension',
    'land rover defender accessories',
    'volvo oem parts',
    'jaguar replacement parts',
    'toyota fortuner genuine accessories',
    'jeep wrangler parts',
    'car spare parts dealer noida',
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteConfig.url,
    title: 'Off Road Connection Parts | Genuine Luxury Auto Spare Parts Dealer',
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: '/assets/images/banner/banner-1.jpg',
        width: 1200,
        height: 630,
        alt: 'Off Road Connection Parts - Luxury Auto Spares',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Off Road Connection Parts | Luxury Auto Spare Parts Specialist',
    description: siteConfig.description,
    images: ['/assets/images/banner/banner-1.jpg'],
    creator: '@offroadparts',
  },
  icons: {
    icon: '/assets/images/favicon.ico',
    apple: '/assets/images/favicon.ico',
  },
  other: {
    'geo.region': siteConfig.geo.region,
    'geo.placename': siteConfig.geo.placename,
    'geo.position': siteConfig.geo.position,
    ICBM: `${siteConfig.geo.latitude}, ${siteConfig.geo.longitude}`,
    'theme-color': '#FFFFFF',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeSchema = generateAutoPartsStoreSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap"
          rel="stylesheet"
        />

        {/* Original Core & Icon Stylesheets */}
        <link href="/assets/css/font-awesome-all.css" rel="stylesheet" />
        <link href="/assets/css/flaticon.css" rel="stylesheet" />
        <link href="/assets/css/owl.css" rel="stylesheet" />
        <link href="/assets/css/bootstrap.css" rel="stylesheet" />
        <link href="/assets/css/animate.css" rel="stylesheet" />
        <link href="/assets/css/module-css/header.css" rel="stylesheet" />
        <link href="/assets/css/module-css/footer.css" rel="stylesheet" />
        <link href="/assets/css/style.css" rel="stylesheet" />
        <link href="/assets/css/responsive.css" rel="stylesheet" />

        {/* SEO & GEO Structured Data (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(storeSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <div className="boxed_wrapper">
          <AuthProvider>
            <CartProvider>
              <Suspense fallback={null}>
                <AnalyticsProvider />
              </Suspense>
              {children}
              <CustomerLoginModal />
            </CartProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
