'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';
import VehicleSelector from '@/components/VehicleSelector';
import InteractiveCar360Explorer from '@/components/InteractiveCar360Explorer';
import { useCart } from '@/context/CartContext';
import { formatImageUrl } from '@/lib/image';
import { LUXURY_MAKES, LUXURY_PART_CATEGORIES } from '@/constants/vehicles';
import siteConfig from '@/config/site';

export default function HomePage() {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/products?limit=8&featured=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setFeaturedProducts(data.products);
        } else {
          // Fallback to top products if none specifically flagged featured
          fetch('/api/products?limit=8')
            .then((r) => r.json())
            .then((d) => {
              if (d.products) setFeaturedProducts(d.products);
            });
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    setToastMsg(`Added "${product.name.slice(0, 30)}..." to your shopping bag!`);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const faqs = [
    {
      q: 'How do I ensure a spare part fits my exact car model and year?',
      a: 'You can use our 4-Step Vehicle Selector (Make, Model, Year, Category) right on this page. Furthermore, upon placing your order, our technical specialists will verify your vehicle Chassis / VIN number before dispatch to guarantee 100% precise fitment.',
    },
    {
      q: 'Are these parts genuine OEM or high-grade aftermarket?',
      a: 'We stock 100% genuine OEM parts and certified high-grade performance components manufactured to strict European and Japanese vehicle standards.',
    },
    {
      q: 'How long does delivery take across India?',
      a: 'We dispatch via premium air express couriers (BlueDart, Delhivery, DTDC). Metro deliveries arrive within 2-3 business days, while other locations typically take 3-5 business days across all 19,000+ Indian pincodes.',
    },
    {
      q: 'What is your warranty and return policy?',
      a: 'All our products carry manufacturer-backed warranty coverage. We also offer a 7-day return/replacement window if the product arrives damaged or fails fitment verification.',
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
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            border: '1.5px solid #C5A059',
            color: '#FFFFFF',
            padding: '14px 24px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '14px',
            zIndex: 99999,
            boxShadow: '0 20px 40px rgba(15, 23, 42, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <i className="fas fa-check-circle" style={{ color: '#C5A059', fontSize: '18px' }}></i>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ULTRA LUXURY HERO SECTION */}
      <section
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
          padding: '60px 0 80px',
          borderBottom: '1px solid #E2E8F0',
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
                    background: '#FBF7EE',
                    border: '1px solid rgba(197, 160, 89, 0.4)',
                    color: '#854D0E',
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 700,
                    marginBottom: '20px',
                    letterSpacing: '0.5px',
                  }}
                >
                  <i className="fas fa-shield-alt" style={{ color: '#C5A059' }}></i>
                  <span>INDIA’S PREMIER LUXURY AUTO SPARES SPECIALIST</span>
                </div>
                <h1
                  style={{
                    fontSize: '44px',
                    fontWeight: 900,
                    color: '#0F172A',
                    lineHeight: '1.2',
                    fontFamily: "'Outfit', sans-serif",
                    letterSpacing: '-1px',
                    marginBottom: '18px',
                  }}
                >
                  Precision Engineering For Your <span style={{ color: '#C5A059' }}>Luxury Vehicle</span>
                </h1>
                <p
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.7',
                    color: '#64748B',
                    marginBottom: '28px',
                  }}
                >
                  Source 100% genuine OEM spare parts, lighting modules, air suspension, braking systems, and cooling components for Audi, BMW, Mercedes-Benz, Porsche, Range Rover & 4x4 vehicles.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  <Link
                    href="/shop"
                    className="btn-luxury-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    <span>EXPLORE ALL PARTS</span>
                    <i className="fas fa-arrow-right" style={{ fontSize: '12px' }}></i>
                  </Link>
                  <a
                    href="https://wa.me/918860718878"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-luxury-outline"
                    style={{ textDecoration: 'none' }}
                  >
                    <i className="fab fa-whatsapp" style={{ color: '#25D366', fontSize: '16px' }}></i>
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
      <section style={{ padding: '40px 0', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        <div className="auto-container">
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#C5A059' }}>
              DIRECT COMPATIBILITY FOR ALL PREMIUM MAKES
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {LUXURY_MAKES.slice(0, 11).map((m) => (
              <Link
                key={m.id}
                href={`/shop?make=${encodeURIComponent(m.name)}`}
                style={{
                  padding: '10px 20px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  color: '#0F172A',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#FBF7EE';
                  e.currentTarget.style.borderColor = '#C5A059';
                  e.currentTarget.style.color = '#C5A059';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.color = '#0F172A';
                }}
              >
                <i className="fas fa-car" style={{ fontSize: '12px', color: '#94A3B8' }}></i>
                <span>{m.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 360 DEGREE INTERACTIVE LUXURY CAR COMPONENT INSPECTOR */}
      <InteractiveCar360Explorer />

      {/* LUXURY PART CATEGORIES SECTION */}
      <section style={{ padding: '70px 0', background: '#FAFBFC' }}>
        <div className="auto-container">
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <span style={{ color: '#C5A059', fontWeight: 800, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              PRECISION COMPONENTS
            </span>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#0F172A',
                fontFamily: "'Outfit', sans-serif",
                marginTop: '8px',
              }}
            >
              Shop By Part Category
            </h2>
            <div style={{ width: '60px', height: '3px', background: '#C5A059', margin: '14px auto 0', borderRadius: '2px' }}></div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '24px',
            }}
          >
            {LUXURY_PART_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="luxury-card"
                style={{
                  padding: '28px 24px',
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                <div>
                  <div
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: '#FBF7EE',
                      border: '1px solid rgba(197, 160, 89, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C5A059',
                      fontSize: '20px',
                      marginBottom: '18px',
                    }}
                  >
                    <i className={cat.icon}></i>
                  </div>
                  <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                    {cat.name}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
                    {cat.description}
                  </p>
                </div>
                <div style={{ marginTop: '20px', color: '#C5A059', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Explore Catalog</span>
                  <i className="fas fa-arrow-right" style={{ fontSize: '11px' }}></i>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED LUXURY PRODUCTS */}
      <section style={{ padding: '70px 0', background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div className="auto-container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <span style={{ color: '#C5A059', fontWeight: 800, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                DIRECT OEM DISPATCH
              </span>
              <h2
                style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  color: '#0F172A',
                  fontFamily: "'Outfit', sans-serif",
                  marginTop: '8px',
                  margin: 0,
                }}
              >
                Featured Auto Spare Parts
              </h2>
            </div>
            <Link
              href="/shop"
              style={{
                color: '#C5A059',
                fontWeight: 700,
                fontSize: '14px',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>View All 2,500+ Spares</span>
              <i className="fas fa-chevron-right" style={{ fontSize: '12px' }}></i>
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <div
                style={{
                  width: '45px',
                  height: '45px',
                  border: '3px solid #F1F5F9',
                  borderTopColor: '#C5A059',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  margin: '0 auto 15px',
                }}
              ></div>
              <p style={{ color: '#94A3B8', fontSize: '14px' }}>Loading luxury inventory...</p>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '24px',
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
                      <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                        <span className="badge-oem">✓ OEM Genuine</span>
                      </div>
                    </div>

                    {/* Content Box */}
                    <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>
                            {p.category_name || 'Vehicle Part'}
                          </span>
                          {(p.part_number || p.sku) && (
                            <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, color: '#C5A059', background: '#FBF7EE', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(197, 160, 89, 0.2)' }}>
                              {p.part_number || p.sku}
                            </span>
                          )}
                        </div>
                        <h4
                          style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            lineHeight: '1.4',
                            height: '42px',
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            marginBottom: '12px',
                          }}
                        >
                          <Link href={`/product/${p.slug}`} style={{ color: '#0F172A', textDecoration: 'none' }}>
                            {p.name}
                          </Link>
                        </h4>
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '16px' }}>
                          <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
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
                              background: '#0F172A',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.background = '#C5A059')}
                            onMouseLeave={(e) => (e.currentTarget.style.background = '#0F172A')}
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
                              background: '#F0FDF4',
                              border: '1px solid #86EFAC',
                              color: '#15803D',
                              borderRadius: '8px',
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
      <section style={{ padding: '70px 0', background: '#FAFBFC', borderTop: '1px solid #E2E8F0' }}>
        <div className="auto-container">
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <span style={{ color: '#C5A059', fontWeight: 800, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              OUR COMMITMENT TO EXCELLENCE
            </span>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#0F172A',
                fontFamily: "'Outfit', sans-serif",
                marginTop: '8px',
              }}
            >
              Why Discerning Drivers Choose Off Road Connection
            </h2>
            <div style={{ width: '60px', height: '3px', background: '#C5A059', margin: '14px auto 0', borderRadius: '2px' }}></div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            <div className="luxury-card" style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#FBF7EE',
                  border: '1.5px solid #C5A059',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: '#C5A059',
                  fontSize: '22px',
                }}
              >
                <i className="fas fa-fingerprint"></i>
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
                100% VIN Fitment Guarantee
              </h4>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
                Every single order undergoes rigorous chassis and VIN verification by our master technicians before being dispatched.
              </p>
            </div>

            <div className="luxury-card" style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#FBF7EE',
                  border: '1.5px solid #C5A059',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: '#C5A059',
                  fontSize: '22px',
                }}
              >
                <i className="fas fa-plane-departure"></i>
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
                Air Express Nationwide
              </h4>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
                Immediate dispatch via premier courier networks covering over 19,000 pincodes across India in 2 to 5 business days.
              </p>
            </div>

            <div className="luxury-card" style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#FBF7EE',
                  border: '1.5px solid #C5A059',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: '#C5A059',
                  fontSize: '22px',
                }}
              >
                <i className="fas fa-shield-check"></i>
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
                Manufacturer Warranty
              </h4>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
                Rest easy with certified OEM warranties against manufacturing defects and dedicated technical claim support.
              </p>
            </div>

            <div className="luxury-card" style={{ padding: '32px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#FBF7EE',
                  border: '1.5px solid #C5A059',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: '#C5A059',
                  fontSize: '22px',
                }}
              >
                <i className="fas fa-headset"></i>
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
                Dedicated WhatsApp Desk
              </h4>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>
                Connect directly with automotive spare specialists for live fitment guidance, video demonstrations, and instant quotes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AIO & SEO FAQ SECTION */}
      <section style={{ padding: '70px 0', background: '#FFFFFF', borderTop: '1px solid #E2E8F0' }}>
        <div className="auto-container" style={{ maxWidth: '850px' }}>
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <span style={{ color: '#C5A059', fontWeight: 800, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#0F172A',
                fontFamily: "'Outfit', sans-serif",
                marginTop: '8px',
              }}
            >
              Expert Answers for Luxury Vehicle Owners
            </h2>
            <div style={{ width: '60px', height: '3px', background: '#C5A059', margin: '14px auto 0', borderRadius: '2px' }}></div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#FFFFFF',
                    border: isOpen ? '1.5px solid #C5A059' : '1px solid #E2E8F0',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      background: isOpen ? '#FBF7EE' : '#FFFFFF',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#0F172A',
                    }}
                  >
                    <span>{faq.q}</span>
                    <i
                      className={`fas ${isOpen ? 'fa-minus' : 'fa-plus'}`}
                      style={{ color: '#C5A059', fontSize: '13px' }}
                    ></i>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '16px 24px 22px', fontSize: '14px', lineHeight: '1.7', color: '#64748B' }}>
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
