import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import CustomerLoginModal from '@/components/CustomerLoginModal';
import AnalyticsProvider from '@/components/AnalyticsProvider';

export const metadata: Metadata = {
  title: 'Off Road Connection Parts - Genuine Auto Spare Parts',
  description: 'Off Road Connection Parts is a trusted car spares parts dealer offering genuine car spare parts at the best prices. Shop online now!',
  keywords: 'car parts, auto spares, offroad parts, genuine parts, car accessories',
  icons: {
    icon: '/assets/images/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"
          rel="stylesheet"
        />

        {/* Original Stylesheets */}
        <link href="/assets/css/font-awesome-all.css" rel="stylesheet" />
        <link href="/assets/css/flaticon.css" rel="stylesheet" />
        <link href="/assets/css/owl.css" rel="stylesheet" />
        <link href="/assets/css/bootstrap.css" rel="stylesheet" />
        <link href="/assets/css/jquery.fancybox.min.css" rel="stylesheet" />
        <link href="/assets/css/animate.css" rel="stylesheet" />
        <link href="/assets/css/nice-select.css" rel="stylesheet" />
        <link href="/assets/css/aos.css" rel="stylesheet" />
        <link href="/assets/css/elpath.css" rel="stylesheet" />
        <link href="/assets/css/color.css" id="jssDefault" rel="stylesheet" />
        <link href="/assets/css/module-css/header.css" rel="stylesheet" />
        <link href="/assets/css/module-css/banner.css" rel="stylesheet" />
        <link href="/assets/css/module-css/brand.css" rel="stylesheet" />
        <link href="/assets/css/module-css/highlights.css" rel="stylesheet" />
        <link href="/assets/css/module-css/shop.css" rel="stylesheet" />
        <link href="/assets/css/module-css/category.css" rel="stylesheet" />
        <link href="/assets/css/module-css/feature.css" rel="stylesheet" />
        <link href="/assets/css/module-css/flash-sales.css" rel="stylesheet" />
        <link href="/assets/css/module-css/cta.css" rel="stylesheet" />
        <link href="/assets/css/module-css/deals.css" rel="stylesheet" />
        <link href="/assets/css/module-css/news.css" rel="stylesheet" />
        <link href="/assets/css/module-css/footer.css" rel="stylesheet" />
        <link href="/assets/css/module-css/page-title.css" rel="stylesheet" />
        <link href="/assets/css/module-css/testimonial.css" rel="stylesheet" />
        <link href="/assets/css/style.css" rel="stylesheet" />
        <link href="/assets/css/responsive.css" rel="stylesheet" />
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
