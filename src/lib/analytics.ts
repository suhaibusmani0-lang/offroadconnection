/**
 * Advanced Meta Pixel (Facebook Ads) & Google Analytics 4 (GA4) Tracking Utility
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

/**
 * Track Page Views
 */
export function trackPageView(url: string) {
  if (typeof window === 'undefined') return;

  // Google Analytics 4
  if (window.gtag && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }

  // Meta Pixel
  if (window.fbq && META_PIXEL_ID) {
    window.fbq('track', 'PageView');
  }
}

/**
 * Track Product View (ViewContent / view_item)
 */
export function trackProductView(product: {
  id?: string | number;
  title: string;
  price: number;
  category?: string;
  brand?: string;
}) {
  if (typeof window === 'undefined') return;

  // GA4
  if (window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'INR',
      value: product.price,
      items: [
        {
          item_id: String(product.id || product.title),
          item_name: product.title,
          price: product.price,
          item_category: product.category || 'Auto Parts',
          item_brand: product.brand || 'DRANparts',
        },
      ],
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_name: product.title,
      content_ids: [String(product.id || product.title)],
      content_type: 'product',
      value: product.price,
      currency: 'INR',
    });
  }
}

/**
 * Track Add To Cart (AddToCart / add_to_cart)
 */
export function trackAddToCart(product: {
  id?: string | number;
  title: string;
  price: number;
  quantity?: number;
  category?: string;
}) {
  if (typeof window === 'undefined') return;
  const qty = product.quantity || 1;

  // GA4
  if (window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'INR',
      value: product.price * qty,
      items: [
        {
          item_id: String(product.id || product.title),
          item_name: product.title,
          price: product.price,
          quantity: qty,
          item_category: product.category || 'Auto Parts',
        },
      ],
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: product.title,
      content_ids: [String(product.id || product.title)],
      content_type: 'product',
      value: product.price * qty,
      currency: 'INR',
    });
  }
}

/**
 * Track Initiate Checkout (InitiateCheckout / begin_checkout)
 */
export function trackInitiateCheckout(items: any[], totalValue: number) {
  if (typeof window === 'undefined') return;

  // GA4
  if (window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'INR',
      value: totalValue,
      items: items.map((item) => ({
        item_id: String(item.product_id || item.id || item.title),
        item_name: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      num_items: items.length,
      value: totalValue,
      currency: 'INR',
      contents: items.map((item) => ({
        id: String(item.product_id || item.id || item.title),
        quantity: item.quantity,
      })),
    });
  }
}

/**
 * Track Purchase / Completed Order (Purchase / purchase)
 */
export function trackPurchase(order: {
  order_number: string;
  total_amount: number;
  items: any[];
  shipping_fee?: number;
}) {
  if (typeof window === 'undefined') return;

  // GA4
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: order.order_number,
      value: order.total_amount,
      currency: 'INR',
      shipping: order.shipping_fee || 0,
      items: order.items.map((item) => ({
        item_id: String(item.product_id || item.title),
        item_name: item.title,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      value: order.total_amount,
      currency: 'INR',
      order_id: order.order_number,
      content_type: 'product',
      contents: order.items.map((item) => ({
        id: String(item.product_id || item.title),
        quantity: item.quantity,
      })),
    });
  }
}
