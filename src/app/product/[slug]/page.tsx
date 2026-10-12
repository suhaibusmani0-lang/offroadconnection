'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';
import { useCart } from '@/context/CartContext';
import { formatImageUrl } from '@/lib/image';
import PincodeEstimator from '@/components/PincodeEstimator';
import { trackProductView, trackAddToCart } from '@/lib/analytics';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { addToCart } = useCart();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'desc' | 'spec'>('desc');
  const [qty, setQty] = useState(1);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    if (slug) {
      setLoading(true);
      fetch(`/api/products/${slug}`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.product) {
            setData(resData);
            const mainImg = resData.images?.[0]?.image_path || resData.product.image || '';
            setActiveImage(mainImg);
            trackProductView({
              id: resData.product.id || resData.product.slug,
              title: resData.product.name || resData.product.title,
              price: Number(resData.product.price || 0),
              category: resData.product.category_name,
              brand: resData.product.brand,
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const handleAdd = () => {
    if (data?.product) {
      addToCart(data.product, qty);
      trackAddToCart({
        id: data.product.id || data.product.slug,
        title: data.product.name || data.product.title,
        price: Number(data.product.price || 0),
        quantity: qty,
        category: data.product.category_name,
      });
      setToastMsg(`Added ${qty} item(s) to cart!`);
      setTimeout(() => setToastMsg(''), 2500);
    }
  };

  if (loading) {
    return (
      <>
        <OriginalHeader />
        <div className="py-5 text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '36px', color: '#FF6B00' }}></i>
        </div>
        <OriginalFooter />
      </>
    );
  }

  if (!data?.product) {
    return (
      <>
        <OriginalHeader />
        <div className="py-5 text-center" style={{ minHeight: '50vh' }}>
          <h3>Product not found</h3>
          <Link href="/shop" className="theme-btn mt_20" style={{ background: '#FF6B00', color: '#fff', padding: '10px 25px', display: 'inline-block' }}>
            Back to Shop
          </Link>
        </div>
        <OriginalFooter />
      </>
    );
  }

  const { product, images = [], related = [] } = data;

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

      {/* page-title */}
      <section className="page-title">
        <div className="auto-container">
          <div className="content-box">
            <h1>{product.name}</h1>
            <ul className="bread-crumb clearfix">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/shop">Shop</Link></li>
              <li>{product.name}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* product-details */}
      <section className="product-details p_relative pt_80 pb_80">
        <div className="auto-container">
          <div className="row clearfix">
            {/* Left: Image Gallery */}
            <div className="col-lg-6 col-md-12 col-sm-12 image-column">
              <div className="bxslider">
                <div
                  className="slider-content"
                  style={{
                    border: '1px solid #e5e5e5',
                    borderRadius: '10px',
                    padding: '20px',
                    background: '#fcfcfc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '420px',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={formatImageUrl(activeImage)}
                    alt={product.name}
                    style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as any).src = '/assets/images/resource/Wheel-1.png';
                    }}
                  />
                </div>

                {images.length > 1 && (
                  <div className="d-flex gap-2 mt-3" style={{ overflowX: 'auto', paddingBottom: '10px' }}>
                    {images.map((img: any, idx: number) => (
                      <div
                        key={idx}
                        onClick={() => setActiveImage(img.image_path)}
                        style={{
                          width: '70px',
                          height: '70px',
                          border: activeImage === img.image_path ? '2px solid #FF6B00' : '1px solid #ddd',
                          borderRadius: '6px',
                          padding: '5px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#fff',
                        }}
                      >
                        <img
                          src={formatImageUrl(img.image_path)}
                          alt=""
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Info Column */}
            <div className="col-lg-6 col-md-12 col-sm-12 content-column">
              <div className="content-box" style={{ paddingLeft: '20px' }}>
                <span style={{ fontSize: '13px', color: '#FF6B00', fontWeight: 700, textTransform: 'uppercase' }}>
                  {product.category_name || 'Genuine Auto Part'}
                </span>
                <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#111', margin: '10px 0 15px' }}>
                  {product.name}
                </h2>

                <div className="product-meta d-flex gap-4 mb-3" style={{ fontSize: '14px', color: '#666' }}>
                  <div>
                    SKU: <strong style={{ color: '#111' }}>{product.sku || `PART-${product.id}`}</strong>
                  </div>
                  <div>
                    Availability:{' '}
                    <strong style={{ color: Number(product.stock) > 0 ? '#10b981' : '#f59e0b' }}>
                      {Number(product.stock) > 0 ? 'In Stock' : 'Call to Order'}
                    </strong>
                  </div>
                </div>

                <div className="price-box mb_25">
                  <span style={{ fontSize: '32px', fontWeight: 900, color: '#FF6B00' }}>
                    {Number(product.price) > 0 ? `₹${Number(product.price).toLocaleString('en-IN')}` : 'Inquire for Price'}
                  </span>
                </div>

                {product.short_description && (
                  <div
                    className="short-description mb_25"
                    style={{ padding: '15px', background: '#f9f9f9', borderLeft: '3px solid #FF6B00', borderRadius: '4px' }}
                  >
                    <p style={{ margin: 0, fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
                      {product.short_description}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="action-buttons d-flex align-items-center gap-3 mb_30">
                  <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      style={{ padding: '12px 16px', background: '#f5f5f5', border: 'none', cursor: 'pointer' }}
                    >
                      -
                    </button>
                    <span style={{ padding: '12px 20px', fontWeight: 700 }}>{qty}</span>
                    <button
                      onClick={() => setQty((q) => q + 1)}
                      style={{ padding: '12px 16px', background: '#f5f5f5', border: 'none', cursor: 'pointer' }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAdd}
                    className="theme-btn"
                    style={{
                      background: '#111',
                      color: '#fff',
                      padding: '16px 35px',
                      borderRadius: '5px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <i className="fas fa-shopping-cart" style={{ marginRight: '8px' }}></i> Add to Cart
                  </button>

                  <a
                    href={`https://wa.me/918860718878?text=${encodeURIComponent('Hi, I want to inquire about: ' + product.name + ' (SKU: ' + (product.sku || product.id) + ')')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="theme-btn"
                    style={{
                      background: '#25D366',
                      color: '#fff',
                      padding: '16px 25px',
                      borderRadius: '5px',
                      fontWeight: 700,
                      border: 'none',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <i className="fab fa-whatsapp" style={{ fontSize: '1.2rem' }}></i> WhatsApp Quote
                  </a>
                </div>

                {/* Trust Signals */}
                <div className="trust-signals d-flex gap-4 pt-3" style={{ borderTop: '1px solid #eee' }}>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    <i className="fas fa-shipping-fast" style={{ color: '#FF6B00', marginRight: '5px' }}></i> Fast Pan-India Shipping
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    <i className="fas fa-shield-alt" style={{ color: '#FF6B00', marginRight: '5px' }}></i> 100% Genuine Quality
                  </div>
                </div>

                {/* Indian Pincode Delivery Estimator */}
                <div style={{ marginTop: '20px' }}>
                  <PincodeEstimator />
                </div>
              </div>
            </div>
          </div>

          {/* Description & Spec Tabs */}
          <div className="row clearfix mt_60">
            <div className="col-12">
              <div style={{ background: '#fff', border: '1px solid #e5e5e5', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', borderBottom: '2px solid #f0f0f0', background: '#fafafa' }}>
                  <button
                    onClick={() => setActiveTab('desc')}
                    style={{
                      padding: '18px 32px',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: activeTab === 'desc' ? '#111' : '#888',
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === 'desc' ? '3px solid #FF6B00' : '3px solid transparent',
                      cursor: 'pointer',
                    }}
                  >
                    Product Description
                  </button>
                  <button
                    onClick={() => setActiveTab('spec')}
                    style={{
                      padding: '18px 32px',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: activeTab === 'spec' ? '#111' : '#888',
                      background: 'none',
                      border: 'none',
                      borderBottom: activeTab === 'spec' ? '3px solid #FF6B00' : '3px solid transparent',
                      cursor: 'pointer',
                    }}
                  >
                    Specifications & Fitment
                  </button>
                </div>

                <div style={{ padding: '30px' }}>
                  {activeTab === 'desc' ? (
                    <div
                      style={{ fontSize: '14px', lineHeight: '1.8', color: '#444' }}
                      dangerouslySetInnerHTML={{
                        __html: product.description ? product.description.replace(/\n/g, '<br/>') : 'Detailed product description coming soon.',
                      }}
                    />
                  ) : (
                    <div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <tbody>
                          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '12px', fontWeight: 700, width: '200px', color: '#333' }}>Part Name</td>
                            <td style={{ padding: '12px', color: '#666' }}>{product.name}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '12px', fontWeight: 700, color: '#333' }}>Part SKU / Code</td>
                            <td style={{ padding: '12px', color: '#666' }}>{product.sku || 'N/A'}</td>
                          </tr>
                          <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <td style={{ padding: '12px', fontWeight: 700, color: '#333' }}>Category</td>
                            <td style={{ padding: '12px', color: '#666' }}>{product.category_name || 'General Auto Spares'}</td>
                          </tr>
                          <tr>
                            <td style={{ padding: '12px', fontWeight: 700, color: '#333' }}>Fitment Verification</td>
                            <td style={{ padding: '12px', color: '#10b981', fontWeight: 600 }}>
                              <i className="fas fa-check-circle" style={{ marginRight: '5px' }}></i> Direct OEM Match Guaranteed
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div className="row clearfix mt_80">
              <div className="col-12 mb_30">
                <h3 style={{ fontWeight: 800, color: '#111' }}>Related Products</h3>
              </div>
              {related.map((rel: any) => (
                <div key={rel.id} className="col-lg-3 col-md-6 col-sm-12 shop-block mb-4">
                  <div className="shop-block-one">
                    <div className="inner-box" style={{ border: '1px solid #e5e5e5', padding: '15px', borderRadius: '8px', background: '#fff' }}>
                      <div className="image-box" style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Link href={`/product/${rel.slug || rel.id}`}>
                          <img
                            src={formatImageUrl(rel.image_path)}
                            alt={rel.name}
                            style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }}
                          />
                        </Link>
                      </div>
                      <div className="lower-content pt_10">
                        <h4 style={{ fontSize: '14px', fontWeight: 700, height: '40px', overflow: 'hidden' }}>
                          <Link href={`/product/${rel.slug || rel.id}`} style={{ color: '#111', textDecoration: 'none' }}>
                            {rel.name}
                          </Link>
                        </h4>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#111', marginTop: '8px' }}>
                          {Number(rel.price) > 0 ? `₹${Number(rel.price).toLocaleString('en-IN')}` : 'Inquire Price'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <OriginalFooter />
    </>
  );
}

