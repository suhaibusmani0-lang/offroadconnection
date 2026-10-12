'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';
import { useCart } from '@/context/CartContext';
import { formatImageUrl } from '@/lib/image';

export default function HomePage() {
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    // Fetch products
    fetch('/api/products?limit=8')
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setFeaturedProducts(data.products);
      })
      .finally(() => setLoading(false));

    // Fetch categories
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories.slice(0, 8));
      });
  }, []);

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    setToastMsg(`Added "${product.name.slice(0, 30)}..." to cart!`);
    setTimeout(() => setToastMsg(''), 2500);
  };

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
            background: '#FF6B00',
            color: '#fff',
            padding: '14px 24px',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '14px',
            zIndex: 99999,
            boxShadow: '0 10px 25px rgba(255, 107, 0, 0.4)',
          }}
        >
          <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
          {toastMsg}
        </div>
      )}

      {/* banner-section */}
      <section className="banner-section p_relative">
        <div
          className="slide-item"
          style={{
            backgroundImage: 'url(/assets/images/banner/banner-1.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '120px 0 100px',
            position: 'relative',
          }}
        >
          <div className="auto-container">
            <div className="row clearfix align-items-center">
              <div className="col-lg-7 col-md-12 col-sm-12 content-column">
                <div className="content-box">
                  <span
                    style={{
                      color: '#FF6B00',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      fontSize: '14px',
                      display: 'block',
                      marginBottom: '10px',
                    }}
                  >
                    Direct OEM & Performance Parts
                  </span>
                  <h1
                    style={{
                      fontSize: '48px',
                      fontWeight: 900,
                      color: '#fff',
                      lineHeight: '1.2',
                      marginBottom: '20px',
                    }}
                  >
                    Off-Road & Luxury Auto Spares
                  </h1>
                  <p style={{ color: '#ccc', fontSize: '16px', marginBottom: '30px', maxWidth: '500px' }}>
                    Trusted dealer of genuine replacement headlights, body panels, coolers, and accessories for Audi, BMW, Jeep, Toyota, and more.
                  </p>
                  <div className="btn-box">
                    <Link
                      href="/shop"
                      className="theme-btn"
                      style={{
                        background: '#FF6B00',
                        color: '#fff',
                        padding: '16px 36px',
                        fontWeight: 700,
                        borderRadius: '5px',
                        textDecoration: 'none',
                        display: 'inline-block',
                      }}
                    >
                      Shop All Products <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 col-md-12 col-sm-12 image-column">
                <div className="image-box text-center">
                  <img
                    src="/assets/images/banner/banner-img-3.png"
                    alt="Off Road Parts"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* banner-section end */}

      {/* highlights-section */}
      <section className="highlights-section p_relative pt_60 pb_40" style={{ background: '#111', borderBottom: '1px solid #222' }}>
        <div className="auto-container">
          <div className="row clearfix">
            <div className="col-lg-3 col-md-6 col-sm-12 single-column">
              <div className="single-item d-flex align-items-center gap-3 p-3">
                <div className="icon-box" style={{ fontSize: '32px', color: '#FF6B00' }}>
                  <i className="flaticon-delivery"></i>
                </div>
                <div>
                  <h5 style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: '15px' }}>Fast Pan-India Shipping</h5>
                  <p style={{ color: '#888', margin: 0, fontSize: '13px' }}>Safe & secure delivery</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 single-column">
              <div className="single-item d-flex align-items-center gap-3 p-3">
                <div className="icon-box" style={{ fontSize: '32px', color: '#FF6B00' }}>
                  <i className="flaticon-shield"></i>
                </div>
                <div>
                  <h5 style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: '15px' }}>100% Genuine Parts</h5>
                  <p style={{ color: '#888', margin: 0, fontSize: '13px' }}>Verified OEM quality</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 single-column">
              <div className="single-item d-flex align-items-center gap-3 p-3">
                <div className="icon-box" style={{ fontSize: '32px', color: '#FF6B00' }}>
                  <i className="flaticon-support"></i>
                </div>
                <div>
                  <h5 style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: '15px' }}>Parts Specialist Support</h5>
                  <p style={{ color: '#888', margin: 0, fontSize: '13px' }}>Fitment assistance</p>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 single-column">
              <div className="single-item d-flex align-items-center gap-3 p-3">
                <div className="icon-box" style={{ fontSize: '32px', color: '#FF6B00' }}>
                  <i className="flaticon-credit-card"></i>
                </div>
                <div>
                  <h5 style={{ color: '#fff', margin: 0, fontWeight: 700, fontSize: '15px' }}>Best Price Guarantee</h5>
                  <p style={{ color: '#888', margin: 0, fontSize: '13px' }}>Competitive wholesale rates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* highlights-section end */}

      {/* category-section */}
      <section className="category-section p_relative pt_80 pb_60">
        <div className="auto-container">
          <div className="sec-title mb_40" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <span className="sub-title" style={{ color: '#FF6B00', fontWeight: 700 }}>Popular Collections</span>
              <h2 style={{ fontWeight: 800, color: '#111' }}>Shop by Category</h2>
            </div>
            <Link href="/shop" style={{ color: '#FF6B00', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
              View All Categories <i className="fas fa-angle-right"></i>
            </Link>
          </div>
          <div className="row clearfix">
            {categories.map((cat) => (
              <div key={cat.id} className="col-lg-3 col-md-4 col-sm-6 category-block mb-4">
                <div
                  className="category-block-one"
                  style={{
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    background: '#fff',
                    transition: '0.3s',
                  }}
                >
                  <Link href={`/shop?category=${cat.slug || cat.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ fontSize: '32px', color: '#FF6B00', marginBottom: '10px' }}>
                      <i className="fas fa-cogs"></i>
                    </div>
                    <h5 style={{ color: '#111', fontWeight: 700, fontSize: '16px', marginBottom: '5px' }}>
                      {cat.name}
                    </h5>
                    <span style={{ fontSize: '12px', color: '#888' }}>
                      {cat.product_count} Parts In Stock
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* category-section end */}

      {/* shop-page-section (Featured Products) */}
      <section className="shop-page-section p_relative pt_40 pb_80" style={{ background: '#f9f9f9' }}>
        <div className="auto-container">
          <div className="sec-title mb_40" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <span className="sub-title" style={{ color: '#FF6B00', fontWeight: 700 }}>Top Deals</span>
              <h2 style={{ fontWeight: 800, color: '#111' }}>Featured Auto Spares</h2>
            </div>
            <Link href="/shop" style={{ color: '#FF6B00', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
              Browse 15,000+ Parts <i className="fas fa-angle-right"></i>
            </Link>
          </div>

          <div className="row clearfix">
            {loading ? (
              <div className="col-12 text-center py-5">
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '32px', color: '#FF6B00' }}></i>
                <p style={{ marginTop: '10px', color: '#888' }}>Loading products...</p>
              </div>
            ) : (
              featuredProducts.map((prod) => (
                <div key={prod.id} className="col-lg-3 col-md-6 col-sm-12 shop-block mb-4">
                  <div className="shop-block-one">
                    <div
                      className="inner-box"
                      style={{
                        border: '1px solid #e5e5e5',
                        padding: '15px',
                        borderRadius: '8px',
                        background: '#fff',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div
                          className="image-box"
                          style={{
                            width: '100%',
                            height: '240px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f9f9f9',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            marginBottom: '15px',
                          }}
                        >
                          <Link href={`/product/${prod.slug || prod.id}`}>
                            <img
                              src={formatImageUrl(prod.image_path || prod.image)}
                              alt={prod.name}
                              loading="lazy"
                              style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                              onError={(e) => {
                                (e.target as any).src = '/assets/images/resource/Wheel-1.png';
                              }}
                            />
                          </Link>
                        </div>
                        <div className="lower-content">
                          <span style={{ fontSize: '11px', color: '#FF6B00', fontWeight: 700, textTransform: 'uppercase' }}>
                            {prod.category_name || 'Genuine Part'}
                          </span>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '8px 0', height: '44px', overflow: 'hidden' }}>
                            <Link href={`/product/${prod.slug || prod.id}`} style={{ color: '#111', textDecoration: 'none' }}>
                              {prod.name}
                            </Link>
                          </h4>
                          <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
                            SKU: {prod.sku || `PART-${prod.id}`}
                          </div>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <span style={{ fontSize: '18px', fontWeight: 800, color: '#111' }}>
                            {Number(prod.price) > 0 ? `₹${Number(prod.price).toLocaleString('en-IN')}` : 'Inquire Price'}
                          </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                          <button
                            onClick={() => handleAddToCart(prod)}
                            className="theme-btn"
                            style={{
                              background: '#111',
                              color: '#fff',
                              border: 'none',
                              padding: '10px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              fontSize: '13px',
                              cursor: 'pointer',
                            }}
                          >
                            <i className="fas fa-shopping-cart" style={{ marginRight: '6px' }}></i> Add
                          </button>
                          <a
                            href={`https://wa.me/918860718878?text=${encodeURIComponent('Hi, I want to inquire about: ' + prod.name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              background: '#25D366',
                              color: '#fff',
                              padding: '10px 14px',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none',
                            }}
                            title="Inquire on WhatsApp"
                          >
                            <i className="fab fa-whatsapp" style={{ fontSize: '16px' }}></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <OriginalFooter />
    </>
  );
}

