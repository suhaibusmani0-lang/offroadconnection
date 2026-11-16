'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';
import VehicleSelector from '@/components/VehicleSelector';
import InteractiveCar360Explorer from '@/components/InteractiveCar360Explorer';
import BrandMarquee from '@/components/BrandMarquee';
import { LUXURY_MAKES, LUXURY_PART_CATEGORIES } from '@/constants/vehicles';
import { useCart } from '@/context/CartContext';
import { trackAddToCart } from '@/lib/analytics';
import AutoProductImage from '@/components/AutoProductImage';
import {
  ShieldCheck,
  Plane,
  Award,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Plus,
  Minus,
  Star,
  Zap,
  ShoppingBag,
} from 'lucide-react';

const WhatsAppIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ display: 'inline-block' }}>
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.004.577 1.764.846 2.806.847h.005c3.182 0 5.768-2.587 5.768-5.766.001-3.18-2.584-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.824 0-3.535-.49-5.012-1.344l-5.988 1.569 1.6-5.836c-.958-1.536-1.5-3.351-1.5-5.275 0-5.514 4.486-10 10-10 5.514 0 10 4.486 10 10z" />
  </svg>
);

export default function HomePage() {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    fetch('/api/products?limit=8&featured=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setFeaturedProducts(data.products);
        } else {
          fetch('/api/products?limit=8')
            .then((res) => res.json())
            .then((fallbackData) => {
              if (fallbackData.products) setFeaturedProducts(fallbackData.products);
            });
        }
      })
      .catch((err) => console.error('Error fetching featured parts:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    trackAddToCart({
      id: product.id || product.slug,
      title: product.name || product.title,
      price: Number(product.price || 0),
      quantity: 1,
      category: product.category_name,
    });
    setToastMsg(`Added "${(product.name || product.title).slice(0, 32)}..." to your bag!`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const faqs = [
    {
      q: 'How do I ensure the part will fit my specific luxury car chassis?',
      a: 'We strictly verify fitment using your vehicle chassis number (VIN). Before dispatch, our specialized technical team checks OEM electronic parts catalogues (ETKA, EPC, AIR) for Audi, BMW, Mercedes-Benz, Porsche, and Range Rover to guarantee a 100% exact fit.',
    },
    {
      q: 'Are these parts genuine OEM or certified high-grade components?',
      a: 'We stock 100% genuine OEM components from Tier-1 European suppliers (Bosch, Brembo, Bilstein, ZF, Lemförder, Valeo, Hella, Continental) manufactured to strict factory standards with warranty.',
    },
    {
      q: 'How long does delivery take across India?',
      a: 'We dispatch via premium air express couriers (BlueDart Apex, Delhivery Express). Metro deliveries arrive within 48 to 72 hours, while all other locations take 3 to 5 business days across 19,000+ Indian pincodes.',
    },
    {
      q: 'What is your warranty and replacement guarantee policy?',
      a: 'Every single component is backed by our 6-month replacement guarantee against manufacturing defects. If an item arrives damaged or fails fitment, our technical desk replaces it immediately.',
    },
  ];

  return (
    <>
      <OriginalHeader />

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div
          className="fixed bottom-8 right-8 z-[99999] px-6 py-4 rounded-xl bg-gradient-to-r from-zinc-950 to-black text-white border border-[#E5B869]/40 shadow-2xl flex items-center gap-3 animate-bounce"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          <div className="w-6 h-6 rounded-full bg-[#E5B869] text-black flex items-center justify-center font-bold text-xs">
            ✓
          </div>
          <span className="text-xs font-bold tracking-wide">{toastMsg}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. ULTRA-LUXURY FLAGSHIP HERO SECTION (Obsidian, Carbon & Gold Aesthetic) */}
      {/* ========================================================================= */}
      <section className="relative bg-[#08090C] text-white pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden border-b border-white/10">
        {/* Ambient Radial Backlight Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-[#E5B869]/10 via-[#1A1812]/5 to-transparent blur-3xl pointer-events-none" />

        {/* Precision Automotive Grid Lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #FFFFFF 1px, transparent 1px),
              linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Headline & Value Proposition */}
            <div className="lg:col-span-6 space-y-6">
              {/* Prestigious Pill Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-white/10 to-white/5 border border-white/15 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#E5B869] shadow-[0_0_10px_#E5B869]" />
                <span
                  className="text-[10px] font-black uppercase tracking-widest text-[#E5B869]"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  DIRECT OEM IMPORTERS • GERMAN & EXOTIC SPARES
                </span>
              </div>

              {/* Main Headline */}
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                Engineered For <br />
                <span className="gold-gradient-text">The Exceptional.</span>
              </h1>

              {/* Subheading */}
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                Direct source for genuine OEM and high-performance components: adaptive air suspension, laser matrix lighting, ceramic brakes, and cooling systems for{' '}
                <strong className="text-white font-bold">Porsche, BMW, Mercedes-Benz, Audi, Range Rover & 4x4</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/shop"
                  className="btn-luxury-gold"
                  style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: '0.8px', fontSize: '13px' }}
                >
                  <span>EXPLORE 2,500+ SPARES</span>
                  <ArrowRight className="w-4 h-4 ml-1 stroke-[2.5]" />
                </Link>

                <a
                  href="https://wa.me/918860718878?text=Hello%20DRANparts%20VIP%20Desk,%20I%20am%20looking%20for%20a%20luxury%20car%20spare%20part."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-wider border border-white/15 transition-all flex items-center gap-2.5 backdrop-blur-md cursor-pointer"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <WhatsAppIcon size={16} className="text-emerald-400" />
                  <span>VIP CONCIERGE DESK</span>
                </a>
              </div>

              {/* Live Automotive Trust Telemetry */}
              <div className="pt-6 border-t border-white/10 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    ₹18.5 Cr+
                  </div>
                  <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                    Spares Fulfilled
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-[#E5B869]" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    100% VIN
                  </div>
                  <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                    Fitment Match
                  </div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-black text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    19,000+
                  </div>
                  <div className="text-[11px] text-zinc-400 uppercase tracking-wider font-semibold">
                    Indian Pincodes
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Vehicle & VIN Selector Cockpit */}
            <div className="lg:col-span-6">
              <VehicleSelector variant="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DYNAMIC BRAND LOGOS MARQUEE TICKER                                    */}
      {/* ========================================================================= */}
      <BrandMarquee />

      {/* ========================================================================= */}
      {/* 3. 360 DEGREE INTERACTIVE CAD COMPONENT EXPLORER                          */}
      {/* ========================================================================= */}
      <div id="car-explorer">
        <InteractiveCar360Explorer />
      </div>

      {/* ========================================================================= */}
      {/* 4. LUXURY PART SUBSYSTEM CATEGORIES                                      */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#0B0D14] text-white border-y border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span
              className="text-[#E5B869] font-black text-xs uppercase tracking-widest block mb-2"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              OEM CATALOGUE BY SUBSYSTEM
            </span>
            <h2
              className="text-3xl sm:text-4xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              Precision Engineering Modules
            </h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#E5B869] to-transparent mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {LUXURY_PART_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group p-6 rounded-2xl bg-[#111522] border border-white/10 hover:border-[#E5B869]/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl text-[#E5B869] group-hover:bg-[#E5B869] group-hover:text-black transition-all mb-5">
                    <i className={cat.icon}></i>
                  </div>
                  <h3
                    className="text-lg font-bold text-white group-hover:text-[#E5B869] transition-colors mb-2"
                    style={{ fontFamily: "'Raleway', sans-serif" }}
                  >
                    {cat.name}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs font-bold text-[#E5B869]">
                  <span style={{ fontFamily: "'Raleway', sans-serif" }}>EXPLORE CATALOG</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. FEATURED LUXURY SHOWROOM SPARES                                       */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white text-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span
                className="text-[#C59D4F] font-black text-xs uppercase tracking-widest block mb-2"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                READY FOR EXPRESS DISPATCH
              </span>
              <h2
                className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                Featured Auto Spare Parts
              </h2>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black hover:text-[#C59D4F] transition-colors"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              <span>VIEW FULL 2,524+ INVENTORY</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-zinc-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
              <p className="text-xs text-zinc-500 font-semibold tracking-wider">Loading verified inventory...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => {
                const discount =
                  p.old_price && p.old_price > p.price
                    ? Math.round(((p.old_price - p.price) / p.old_price) * 100)
                    : 0;

                return (
                  <div
                    key={p.id || p.slug}
                    className="luxury-card group flex flex-col justify-between"
                  >
                    {/* Auto-Rotating Image Container */}
                    <div className="product-card-img-box relative">
                      <Link href={`/product/${p.slug}`} className="w-full h-full block">
                        <AutoProductImage images={p.images} image={p.image} alt={p.name || p.title} />
                      </Link>

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                        <span className="badge-luxury">
                          <Sparkles className="w-3 h-3 text-[#E5B869]" />
                          <span>OEM Certified</span>
                        </span>
                        {discount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider">
                            SAVE {discount}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-zinc-500 uppercase font-bold mb-1.5">
                          <span>{p.category_name || 'Vehicle Part'}</span>
                          {(p.part_number || p.sku) && (
                            <span className="font-mono text-[10px] text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded">
                              {p.part_number || p.sku}
                            </span>
                          )}
                        </div>

                        <h3
                          className="text-sm font-bold text-zinc-900 group-hover:text-[#C59D4F] transition-colors line-clamp-2 h-10 mb-3"
                          style={{ fontFamily: "'Raleway', sans-serif" }}
                        >
                          <Link href={`/product/${p.slug}`}>{p.name || p.title}</Link>
                        </h3>
                      </div>

                      <div>
                        {/* Price Display */}
                        <div className="flex items-baseline gap-2 mb-4">
                          <span
                            className="text-xl font-black text-black"
                            style={{ fontFamily: "'Raleway', sans-serif" }}
                          >
                            ₹{Number(p.price).toLocaleString('en-IN')}
                          </span>
                          {p.old_price && p.old_price > p.price && (
                            <span className="old-price">
                              ₹{Number(p.old_price).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        {/* Dual Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleAddToCart(p)}
                            className="flex-1 py-2.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-extrabold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
                            style={{ fontFamily: "'Raleway', sans-serif" }}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>ADD TO BAG</span>
                          </button>

                          <a
                            href={`https://wa.me/918860718878?text=Hello%20DRANparts,%20I%20am%20inquiring%20about%20${encodeURIComponent(
                              p.name || p.title
                            )}%20(OEM%20Part:%20${p.part_number || p.sku})`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-600 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                            title="Instant WhatsApp Order & Fitment Check"
                          >
                            <WhatsAppIcon size={18} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. WHY CHOOSE US - THE DRANPARTS 4-PILLAR PROTOCOL                        */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#08090C] text-white border-t border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span
              className="text-[#E5B869] font-black text-xs uppercase tracking-widest block mb-2"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              QUALITY PROTOCOL & ASSURANCE
            </span>
            <h2
              className="text-3xl sm:text-4xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              The DRANparts Engineering Standard
            </h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#E5B869] to-transparent mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-7 rounded-2xl bg-[#111522] border border-white/10 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#E5B869]/10 text-[#E5B869] flex items-center justify-center text-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                100% VIN Fitment Guarantee
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Every order undergoes chassis VIN verification through factory catalogues before packing, guaranteeing zero installation discrepancies.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#111522] border border-white/10 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#E5B869]/10 text-[#E5B869] flex items-center justify-center text-xl">
                <Plane className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                Air Express Logistics
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Direct dispatch via premium aviation freight (BlueDart Apex) delivering to 19,000+ Indian pincodes in 48 to 72 hours.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#111522] border border-white/10 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#E5B869]/10 text-[#E5B869] flex items-center justify-center text-xl">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                6-Month Replacement Warranty
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Full factory-backed replacement guarantee against manufacturing defects, supported by our in-house automotive engineers.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#111522] border border-white/10 shadow-xl space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl">
                <WhatsAppIcon size={24} />
              </div>
              <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                VIP WhatsApp Video Desk
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                Request pre-dispatch unboxing videos, OEM label authentication, and direct wiring advice on WhatsApp before delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. CLIENT TESTIMONIALS & VERIFIED WORKSHOPS                              */}
      {/* ========================================================================= */}
      <section className="py-20 bg-white text-[#0F172A] border-t border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span
              className="text-[#C59D4F] font-black text-xs uppercase tracking-widest block mb-2"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              VERIFIED PATRONS & WORKSHOPS
            </span>
            <h2
              className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              Trusted By India’s Performance Drivers
            </h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#C59D4F] to-transparent mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed italic">
                “Ordered front adaptive air suspension struts for my BMW 530d G30. Verified the part number with chassis VIN in 10 minutes over WhatsApp. Delivered to Delhi in 36 hours. 100% genuine OEM quality.”
              </p>
              <div className="pt-2 border-t border-zinc-200 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-xs text-black" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Vikram Malhotra
                  </div>
                  <div className="text-[10px] text-zinc-500">BMW 530d M Sport Owner, New Delhi</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  ✓ Verified Order
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed italic">
                “Finding authentic matrix LED headlights for Audi Q7 4M was a nightmare with dealership lead times of 3 weeks. DRANparts had ready inventory and shipped same-day via BlueDart. Fitted flawlessly.”
              </p>
              <div className="pt-2 border-t border-zinc-200 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-xs text-black" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Adv. Rajesh Singhania
                  </div>
                  <div className="text-[10px] text-zinc-500">Audi Q7 45 TDI Patron, Mumbai</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  ✓ Verified Order
                </span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-4">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed italic">
                “As a multi-brand luxury garage in Bangalore, our biggest priority is fitment accuracy. DRANparts technical desk always cross-checks chassis codes before dispatch. Their pricing and warranty are unmatched.”
              </p>
              <div className="pt-2 border-t border-zinc-200 flex items-center justify-between">
                <div>
                  <div className="font-extrabold text-xs text-black" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    Apex Auto Garage
                  </div>
                  <div className="text-[10px] text-zinc-500">Certified European Workshop, Bangalore</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  ✓ Enterprise Partner
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FREQUENTLY ASKED QUESTIONS (FAQ)                                      */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#0B0D14] text-white border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span
              className="text-[#E5B869] font-black text-xs uppercase tracking-widest block mb-2"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              TECHNICAL & LOGISTICS ADVISORY
            </span>
            <h2
              className="text-3xl sm:text-4xl font-black text-white tracking-tight"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              Frequently Asked Questions
            </h2>
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-[#E5B869] to-transparent mx-auto mt-4" />
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen ? 'bg-[#121622] border-[#E5B869]/50 shadow-xl' : 'bg-[#0E111A] border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span
                      className="text-sm sm:text-base font-bold text-white tracking-wide"
                      style={{ fontFamily: "'Raleway', sans-serif" }}
                    >
                      {faq.q}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-[#E5B869]">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-zinc-400 leading-relaxed font-normal border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <OriginalFooter />
    </>
  );
}
