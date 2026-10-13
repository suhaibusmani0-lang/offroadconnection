'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';
import VehicleSelector from '@/components/VehicleSelector';
import InteractiveCar360Explorer from '@/components/InteractiveCar360Explorer';
import { LUXURY_MAKES, LUXURY_PART_CATEGORIES } from '@/constants/vehicles';
import { formatImageUrl } from '@/lib/image';
import { useCart } from '@/context/CartContext';
import { trackAddToCart } from '@/lib/analytics';

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
    setToastMsg(`Added "${product.name.slice(0, 30)}..." to your bag!`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const faqs = [
    {
      q: 'How do I ensure the part will fit my specific luxury car chassis?',
      a: 'We strongly verify fitment using your vehicle chassis number (VIN). Before dispatch, our specialized technical team checks OEM catalogues for Audi, BMW, Mercedes-Benz, Porsche, and Range Rover to guarantee a 100% fit.',
    },
    {
      q: 'Are these parts genuine OEM or certified high-grade components?',
      a: 'We stock 100% genuine OEM components and precision-certified replacement assemblies manufactured to strict European vehicle standards with manufacturer warranty.',
    },
    {
      q: 'How long does delivery take across India?',
      a: 'We dispatch via premium air express couriers (BlueDart, Delhivery, DTDC). Metro deliveries arrive within 2-3 business days, while all other locations take 3-5 business days across 19,000+ Indian pincodes.',
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
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            background: '#000000',
            border: '1px solid #27272A',
            color: '#FFFFFF',
            padding: '14px 24px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '13px',
            zIndex: 99999,
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontFamily: "'Lato', sans-serif",
          }}
        >
          <i className="fas fa-check-circle" style={{ color: '#FFFFFF', fontSize: '16px' }}></i>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* MONOCHROME LUXURY HERO SECTION */}
      <section
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)',
          padding: '60px 0 80px',
          borderBottom: '1px solid #E4E4E7',
          position: 'relative',
        }}
      >
        <div className="auto-container">
          <div className="row clearfix align-items-center">
            {/* Left Headline & Intro */}
            <div className="col-lg-6 col-md-12 content-column" style={{ marginBottom: '30px' }}>
              <div style={{ paddingRight: '20px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#F4F4F5',
                    border: '1px solid #E4E4E7',
                    color: '#000000',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    marginBottom: '20px',
                    letterSpacing: '0.8px',
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  <i className="fas fa-shield-alt"></i>
                  <span>INDIA’S PREMIER LUXURY AUTO SPARES SPECIALIST</span>
                </div>
                <h1
                  style={{
                    fontSize: '44px',
                    fontWeight: 900,
                    color: '#000000',
                    lineHeight: '1.2',
                    fontFamily: "'Raleway', sans-serif",
                    letterSpacing: '-1.5px',
                    marginBottom: '18px',
                  }}
                >
                  Precision Engineering For Your <span style={{ color: '#52525B' }}>Luxury Vehicle</span>
                </h1>
                <p
                  style={{
                    fontSize: '15px',
                    lineHeight: '1.7',
                    color: '#52525B',
                    marginBottom: '28px',
                    fontFamily: "'Lato', sans-serif",
                  }}
                >
                  Source 100% genuine OEM spare parts, lighting modules, adaptive air suspension, braking systems, and cooling components for Audi, BMW, Mercedes-Benz, Porsche, Range Rover & 4x4 vehicles.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <Link
                    href="/shop"
                    className="btn-luxury-primary"
                    style={{ textDecoration: 'none', fontFamily: "'Raleway', sans-serif", letterSpacing: '0.5px' }}
                  >
                    <span>EXPLORE ALL PARTS</span>
                    <i className="fas fa-arrow-right" style={{ fontSize: '11px' }}></i>
                  </Link>
                  <a
                    href="https://wa.me/918860718878"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-luxury-outline"
                    style={{ textDecoration: 'none', fontFamily: "'Raleway', sans-serif", letterSpacing: '0.5px' }}
                  >
                    <i className="fab fa-whatsapp" style={{ fontSize: '15px' }}></i>
                    <span>WHATSAPP SPECIALIST</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Vehicle Selector Finder */}
            <div className="col-lg-6 col-md-12">
              <VehicleSelector variant="hero" />
            </div>
          </div>
        </div>
      </section>

      {/* LUXURY BRANDS SHOWCASE */}
      <section style={{ padding: '36px 0', background: '#FFFFFF', borderBottom: '1px solid #E4E4E7' }}>
        <div className="auto-container">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#71717A', fontFamily: "'Raleway', sans-serif" }}>
              DIRECT COMPATIBILITY FOR ALL PREMIUM MAKES
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            {LUXURY_MAKES.slice(0, 11).map((m) => (
              <Link
                key={m.id}
                href={`/shop?make=${encodeURIComponent(m.name)}`}
                style={{
                  padding: '9px 18px',
                  background: '#F4F4F5',
                  border: '1px solid #E4E4E7',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  color: '#18181B',
                  fontSize: '12px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'Raleway', sans-serif",
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#000000';
                  e.currentTarget.style.borderColor = '#000000';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F4F4F5';
                  e.currentTarget.style.borderColor = '#E4E4E7';
                  e.currentTarget.style.color = '#18181B';
                }}
              >
                <i className="fas fa-car" style={{ fontSize: '11px', opacity: 0.6 }}></i>
                <span>{m.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 360 DEGREE INTERACTIVE LUXURY CAR COMPONENT INSPECTOR */}
      <InteractiveCar360Explorer />

      {/* LUXURY PART CATEGORIES SECTION */}
      <section style={{ padding: '70px 0', background: '#FAFAFA' }}>
        <div className="auto-container">
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <span style={{ color: '#71717A', fontWeight: 800, fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: "'Raleway', sans-serif" }}>
              PRECISION COMPONENTS
            </span>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#000000',
                fontFamily: "'Raleway', sans-serif",
                marginTop: '8px',
                letterSpacing: '-1px',
              }}
            >
              Shop By Part Category
            </h2>
            <div style={{ width: '40px', height: '2px', background: '#000000', margin: '14px auto 0' }}></div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            {LUXURY_PART_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="luxury-card"
                style={{
                  padding: '24px 20px',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  background: '#FFFFFF',
                  border: '1px solid #E4E4E7',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      background: '#F4F4F5',
                      border: '1px solid #E4E4E7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000000',
                      fontSize: '18px',
                      marginBottom: '16px',
                    }}
                  >
                    <i className={cat.icon}></i>
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#000000', marginBottom: '6px', fontFamily: "'Raleway', sans-serif" }}>
                    {cat.name}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#71717A', lineHeight: '1.6', margin: 0, fontFamily: "'Lato', sans-serif" }}>
                    {cat.description}
                  </p>
                </div>
                <div style={{ marginTop: '18px', color: '#000000', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Raleway', sans-serif" }}>
                  <span>EXPLORE CATALOG</span>
                  <i className="fas fa-arrow-right" style={{ fontSize: '10px' }}></i>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED LUXURY PRODUCTS */}
      <section style={{ padding: '70px 0', background: '#FFFFFF', borderTop: '1px solid #E4E4E7' }}>
        <div className="auto-container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <span style={{ color: '#71717A', fontWeight: 800, fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: "'Raleway', sans-serif" }}>
                DIRECT OEM DISPATCH
              </span>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: '#000000',
                  fontFamily: "'Raleway', sans-serif",
                  marginTop: '8px',
                  letterSpacing: '-1px',
                  margin: 0,
                }}
              >
                Featured Auto Spare Parts
              </h2>
            </div>
            <Link
              href="/shop"
              style={{
                color: '#000000',
                fontWeight: 700,
                fontSize: '13px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              <span>VIEW ALL 2,500+ SPARES</span>
              <i className="fas fa-chevron-right" style={{ fontSize: '11px' }}></i>
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  border: '3px solid #F4F4F5',
                  borderTopColor: '#000000',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 15px',
                }}
              ></div>
              <p style={{ color: '#71717A', fontSize: '14px', fontFamily: "'Lato', sans-serif" }}>Loading inventory...</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '20px',
              }}
            >
              {featuredProducts.map((p) => {
                const img = formatImageUrl(p.image || (p.images && p.images[0]));
                return (
                  <div key={p.id || p.slug} className="luxury-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    {/* Image Box */}
                    <div className="product-card-img-box">
                      <Link href={`/product/${p.slug}`} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={img} alt={p.name} />
                      </Link>
                      <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                        <span className="badge-oem">✓ OEM Genuine</span>
                      </div>
                    </div>

                    {/* Content Box */}
                    <div style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', color: '#71717A', textTransform: 'uppercase', fontWeight: 600, fontFamily: "'Lato', sans-serif" }}>
                            {p.category_name || 'Vehicle Part'}
                          </span>
                          {(p.part_number || p.sku) && (
                            <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, color: '#000000', background: '#F4F4F5', padding: '2px 6px', borderRadius: '4px', border: '1px solid #E4E4E7' }}>
                              {p.part_number || p.sku}
                            </span>
                          )}
                        </div>
                        <h4
                          style={{
                            fontSize: '14px',
                            fontWeight: 700,
                            lineHeight: '1.4',
                            height: '40px',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            marginBottom: '12px',
                            fontFamily: "'Raleway', sans-serif",
                          }}
                        >
                          <Link href={`/product/${p.slug}`} style={{ color: '#000000', textDecoration: 'none' }}>
                            {p.name}
                          </Link>
                        </h4>
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                          <span style={{ fontSize: '18px', fontWeight: 900, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>
                            ₹{Number(p.price).toLocaleString('en-IN')}
                          </span>
                          {p.old_price && p.old_price > p.price && (
                            <span className="old-price">
                              ₹{Number(p.old_price).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleAddToCart(p)}
                            style={{
                              flex: 1,
                              padding: '10px 14px',
                              background: '#000000',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              fontFamily: "'Raleway', sans-serif",
                              letterSpacing: '0.5px',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#27272A')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#000000')}
                          >
                            <i className="fas fa-shopping-bag"></i>
                            <span>ADD TO BAG</span>
                          </button>
                          <a
                            href={`https://wa.me/918860718878?text=Hello,%20I%20am%20inquiring%20about%20${encodeURIComponent(p.name)}%20(SKU:%20${p.sku || p.part_number})`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              padding: '10px 12px',
                              background: '#F4F4F5',
                              border: '1px solid #E4E4E7',
                              color: '#000000',
                              borderRadius: '6px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none',
                              fontSize: '14px',
                            }}
                            title="Instant WhatsApp Inquiry"
                          >
                            <i className="fab fa-whatsapp"></i>
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

      {/* WHY CHOOSE US - LUXURY ASSURANCE GRID */}
      <section style={{ padding: '70px 0', background: '#FAFAFA', borderTop: '1px solid #E4E4E7' }}>
        <div className="auto-container">
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <span style={{ color: '#71717A', fontWeight: 800, fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: "'Raleway', sans-serif" }}>
              OUR COMMITMENT TO PRECISION
            </span>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#000000',
                fontFamily: "'Raleway', sans-serif",
                marginTop: '8px',
                letterSpacing: '-1px',
              }}
            >
              Why Discerning Drivers Choose Off Road Connection
            </h2>
            <div style={{ width: '40px', height: '2px', background: '#000000', margin: '14px auto 0' }}></div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
            }}
          >
            <div className="luxury-card" style={{ padding: '28px 22px', textAlign: 'center' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#F4F4F5',
                  border: '1.5px solid #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                  color: '#000000',
                  fontSize: '20px',
                }}
              >
                <i className="fas fa-fingerprint"></i>
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#000000', marginBottom: '8px', fontFamily: "'Raleway', sans-serif" }}>
                100% VIN Fitment Guarantee
              </h4>
              <p style={{ fontSize: '13px', color: '#52525B', lineHeight: '1.6', margin: 0, fontFamily: "'Lato', sans-serif" }}>
                Every single order undergoes rigorous chassis and VIN verification by our master technicians before being dispatched.
              </p>
            </div>

            <div className="luxury-card" style={{ padding: '28px 22px', textAlign: 'center' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#F4F4F5',
                  border: '1.5px solid #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                  color: '#000000',
                  fontSize: '20px',
                }}
              >
                <i className="fas fa-plane-departure"></i>
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#000000', marginBottom: '8px', fontFamily: "'Raleway', sans-serif" }}>
                Air Express Nationwide
              </h4>
              <p style={{ fontSize: '13px', color: '#52525B', lineHeight: '1.6', margin: 0, fontFamily: "'Lato', sans-serif" }}>
                Immediate dispatch via premier courier networks covering over 19,000 pincodes across India in 2 to 5 business days.
              </p>
            </div>

            <div className="luxury-card" style={{ padding: '28px 22px', textAlign: 'center' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#F4F4F5',
                  border: '1.5px solid #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                  color: '#000000',
                  fontSize: '20px',
                }}
              >
                <i className="fas fa-shield-alt"></i>
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#000000', marginBottom: '8px', fontFamily: "'Raleway', sans-serif" }}>
                Manufacturer Warranty
              </h4>
              <p style={{ fontSize: '13px', color: '#52525B', lineHeight: '1.6', margin: 0, fontFamily: "'Lato', sans-serif" }}>
                Rest easy with certified OEM warranties against manufacturing defects and dedicated technical claim support.
              </p>
            </div>

            <div className="luxury-card" style={{ padding: '28px 22px', textAlign: 'center' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: '#F4F4F5',
                  border: '1.5px solid #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                  color: '#000000',
                  fontSize: '20px',
                }}
              >
                <i className="fas fa-headset"></i>
              </div>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#000000', marginBottom: '8px', fontFamily: "'Raleway', sans-serif" }}>
                Dedicated WhatsApp Desk
              </h4>
              <p style={{ fontSize: '13px', color: '#52525B', lineHeight: '1.6', margin: 0, fontFamily: "'Lato', sans-serif" }}>
                Connect directly with automotive spare specialists for live fitment guidance, video demonstrations, and instant quotes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AIO & SEO FAQ SECTION */}
      <section style={{ padding: '70px 0', background: '#FFFFFF', borderTop: '1px solid #E4E4E7' }}>
        <div className="auto-container" style={{ maxWidth: '820px' }}>
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <span style={{ color: '#71717A', fontWeight: 800, fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: "'Raleway', sans-serif" }}>
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#000000',
                fontFamily: "'Raleway', sans-serif",
                marginTop: '8px',
                letterSpacing: '-1px',
              }}
            >
              Expert Answers for Luxury Vehicle Owners
            </h2>
            <div style={{ width: '40px', height: '2px', background: '#000000', margin: '14px auto 0' }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    border: isOpen ? '1.5px solid #000000' : '1px solid #E4E4E7',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '16px 20px',
                      background: isOpen ? '#F4F4F5' : '#FFFFFF',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#000000',
                      fontFamily: "'Raleway', sans-serif",
                    }}
                  >
                    <span>{faq.q}</span>
                    <i
                      className={`fas ${isOpen ? 'fa-minus' : 'fa-plus'}`}
                      style={{ color: '#000000', fontSize: '12px' }}
                    ></i>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '14px 20px 18px', fontSize: '14px', lineHeight: '1.7', color: '#52525B', fontFamily: "'Lato', sans-serif" }}>
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
