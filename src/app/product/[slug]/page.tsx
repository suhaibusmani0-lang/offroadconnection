'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';
import { useCart } from '@/context/CartContext';
import { formatImageUrl } from '@/lib/image';
import PincodeEstimator from '@/components/PincodeEstimator';
import { trackProductView, trackAddToCart } from '@/lib/analytics';
import { generateProductSchema } from '@/lib/seo';
import siteConfig from '@/config/site';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { addToCart } = useCart();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'desc' | 'spec'>('desc');
  const [qty, setQty] = useState(1);
  const [toastMsg, setToastMsg] = useState('');
  const [fitmentInput, setFitmentInput] = useState('');
  const [fitmentChecked, setFitmentChecked] = useState(false);

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
      setToastMsg(`Added ${qty} item(s) to your bag!`);
      setTimeout(() => setToastMsg(''), 2500);
    }
  };

  const handleBuyNow = () => {
    if (data?.product) {
      addToCart(data.product, qty);
      router.push('/checkout');
    }
  };

  if (loading) {
    return (
      <>
        <OriginalHeader />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA' }}>
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: '45px',
                height: '45px',
                border: '3px solid #E4E4E7',
                borderTopColor: '#000000',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 15px',
              }}
            ></div>
            <p style={{ color: '#71717A', fontSize: '13px', fontWeight: 600, fontFamily: "'Lato', sans-serif" }}>Loading precision specifications...</p>
          </div>
        </div>
        <OriginalFooter />
      </>
    );
  }

  if (!data?.product) {
    return (
      <>
        <OriginalHeader />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAFAFA', padding: '60px 20px' }}>
          <div className="luxury-card" style={{ padding: '40px', maxWidth: '450px', textAlign: 'center' }}>
            <i className="fas fa-exclamation-circle" style={{ fontSize: '36px', color: '#000000', marginBottom: '16px' }}></i>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#000000', marginBottom: '10px', fontFamily: "'Raleway', sans-serif" }}>Part Not Found</h2>
            <p style={{ color: '#71717A', fontSize: '14px', marginBottom: '20px', fontFamily: "'Lato', sans-serif" }}>
              The requested auto spare part is currently unavailable or has been relocated.
            </p>
            <Link href="/shop" className="btn-luxury-primary" style={{ textDecoration: 'none', fontFamily: "'Raleway', sans-serif" }}>
              Browse Parts Catalog
            </Link>
          </div>
        </div>
        <OriginalFooter />
      </>
    );
  }

  const { product, images = [], related = [] } = data;
  const primaryImg = formatImageUrl(activeImage || product.image);
  const productSchema = generateProductSchema({
    name: product.name || product.title,
    slug: product.slug,
    price: Number(product.price || 0),
    old_price: Number(product.old_price || 0),
    description: product.description || product.short_description,
    images: images.map((i: any) => formatImageUrl(i.image_path || i)),
    part_number: product.part_number || product.sku,
    oem_number: product.oem_number,
    brand: product.brand,
    category_name: product.category_name,
    in_stock: product.in_stock,
  });

  return (
    <>
      <OriginalHeader />

      {/* SEO & AIO Product Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Toast Notification */}
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
            fontFamily: "'Lato', sans-serif",
          }}
        >
          {toastMsg}
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid #E4E4E7', padding: '14px 0' }}>
        <div className="auto-container">
          <div className="luxury-breadcrumb" style={{ padding: 0 }}>
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <Link href="/shop">Catalog</Link>
            <span className="separator">/</span>
            {product.category_name && (
              <>
                <Link href={`/shop?category=${product.category_slug || product.category_name}`}>{product.category_name}</Link>
                <span className="separator">/</span>
              </>
            )}
            <span className="current" style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {product.name}
            </span>
          </div>
        </div>
      </div>

      {/* Product Details Core Section */}
      <section style={{ padding: '50px 0 80px', background: '#FAFAFA' }}>
        <div className="auto-container">
          <div className="row clearfix">
            {/* Left: Gallery & Images */}
            <div className="col-lg-6 col-md-12" style={{ marginBottom: '40px' }}>
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E4E4E7',
                  padding: '28px',
                  boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
                }}
              >
                {/* Main Active Image Display */}
                <div
                  style={{
                    width: '100%',
                    height: '420px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={primaryImg}
                    alt={product.name}
                    style={{
                      maxWidth: '92%',
                      maxHeight: '92%',
                      objectFit: 'contain',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                  <div style={{ position: 'absolute', top: 0, left: 0 }}>
                    <span className="badge-oem">✓ Genuine OEM</span>
                  </div>
                </div>

                {/* Thumbnails Row */}
                {images.length > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      marginTop: '20px',
                      overflowX: 'auto',
                      paddingBottom: '6px',
                    }}
                  >
                    {images.map((imgItem: any, index: number) => {
                      const thumb = formatImageUrl(imgItem.image_path || imgItem);
                      const isSelected = thumb === primaryImg;
                      return (
                        <div
                          key={index}
                          onClick={() => setActiveImage(thumb)}
                          style={{
                            width: '70px',
                            height: '70px',
                            borderRadius: '6px',
                            border: isSelected ? '2px solid #000000' : '1px solid #E4E4E7',
                            padding: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#FFFFFF',
                            flexShrink: 0,
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={thumb} alt={`Thumbnail ${index + 1}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Badges strip below gallery */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    marginTop: '20px',
                    paddingTop: '16px',
                    borderTop: '1px solid #F4F4F5',
                    fontSize: '12px',
                    color: '#71717A',
                    textAlign: 'center',
                  }}
                >
                  <div>
                    <i className="fas fa-certificate" style={{ color: '#000000', display: 'block', fontSize: '15px', marginBottom: '4px' }}></i>
                    <span>100% Genuine OEM</span>
                  </div>
                  <div>
                    <i className="fas fa-shield-alt" style={{ color: '#000000', display: 'block', fontSize: '15px', marginBottom: '4px' }}></i>
                    <span>Warranty Backed</span>
                  </div>
                  <div>
                    <i className="fas fa-plane-departure" style={{ color: '#000000', display: 'block', fontSize: '15px', marginBottom: '4px' }}></i>
                    <span>Express Air Dispatch</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Product Details & Purchase Column */}
            <div className="col-lg-6 col-md-12">
              <div style={{ paddingLeft: '10px' }}>
                {/* Brand & Category Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span className="badge-luxury">
                    <i className="fas fa-car-side"></i>
                    <span>{product.brand || 'Luxury Auto Parts'}</span>
                  </span>
                  <span className="badge-oem">✓ Guaranteed Fitment</span>
                  <span className="badge-instock">In Stock - Ships Today</span>
                </div>

                <h1
                  style={{
                    fontSize: '28px',
                    fontWeight: 900,
                    color: '#000000',
                    lineHeight: '1.3',
                    marginBottom: '14px',
                    fontFamily: "'Raleway', sans-serif",
                    letterSpacing: '-0.8px',
                  }}
                >
                  {product.name}
                </h1>

                {/* SKU / OEM Strip */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '8px',
                    fontSize: '12px',
                    color: '#52525B',
                    marginBottom: '20px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #E4E4E7',
                  }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F4F4F5', padding: '6px 12px', borderRadius: '6px', border: '1px solid #E4E4E7' }}>
                    <strong style={{ color: '#000000', fontFamily: "'Raleway', sans-serif" }}>Part Number:</strong>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#000000', letterSpacing: '0.5px' }}>{product.part_number || product.sku || 'N/A'}</span>
                  </div>
                  {(product.oem_numbers && product.oem_numbers.length > 0) ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F4F4F5', padding: '6px 12px', borderRadius: '6px', border: '1px solid #E4E4E7' }}>
                      <strong style={{ color: '#000000', fontFamily: "'Raleway', sans-serif" }}>Interchange / OEM:</strong>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#000000' }}>
                        {Array.isArray(product.oem_numbers) ? product.oem_numbers.join(', ') : product.oem_numbers}
                      </span>
                    </div>
                  ) : product.oem_number ? (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F4F4F5', padding: '6px 12px', borderRadius: '6px', border: '1px solid #E4E4E7' }}>
                      <strong style={{ color: '#000000', fontFamily: "'Raleway', sans-serif" }}>OEM Ref:</strong>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#000000' }}>{product.oem_number}</span>
                    </div>
                  ) : null}
                  {product.placement && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#F4F4F5', padding: '6px 12px', borderRadius: '6px', border: '1px solid #E4E4E7' }}>
                      <strong style={{ color: '#000000', fontFamily: "'Raleway', sans-serif" }}>Placement:</strong>
                      <span style={{ fontWeight: 600, color: '#000000' }}>{product.placement}</span>
                    </div>
                  )}
                </div>

                {/* Price Display */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
                  <span style={{ fontSize: '32px', fontWeight: 900, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </span>
                  {product.old_price && product.old_price > product.price && (
                    <>
                      <span className="old-price" style={{ fontSize: '18px' }}>
                        ₹{Number(product.old_price).toLocaleString('en-IN')}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#000000',
                          background: '#F4F4F5',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          border: '1px solid #E4E4E7',
                          fontFamily: "'Raleway', sans-serif",
                        }}
                      >
                        SAVE ₹{(product.old_price - product.price).toLocaleString('en-IN')}
                      </span>
                    </>
                  )}
                </div>

                {/* Short Description */}
                {product.short_description && (
                  <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#52525B', marginBottom: '24px', fontFamily: "'Lato', sans-serif" }}>
                    {product.short_description}
                  </p>
                )}

                {/* Vehicle Fitment Quick Checker */}
                <div
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E4E4E7',
                    borderRadius: '10px',
                    padding: '16px 20px',
                    marginBottom: '26px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <i className="fas fa-check-double" style={{ color: '#000000' }}></i>
                    <strong style={{ fontSize: '12px', color: '#000000', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: "'Raleway', sans-serif" }}>
                      Vehicle Fitment & VIN Verification
                    </strong>
                  </div>
                  <p style={{ fontSize: '12px', color: '#71717A', margin: '0 0 10px', fontFamily: "'Lato', sans-serif" }}>
                    Enter your vehicle model or chassis number to verify match with our technical database:
                  </p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="e.g. BMW 520d 2018 or Audi A4 B8"
                      value={fitmentInput}
                      onChange={(e) => {
                        setFitmentInput(e.target.value);
                        setFitmentChecked(false);
                      }}
                      style={{
                        flex: 1,
                        padding: '9px 14px',
                        borderRadius: '6px',
                        border: '1.5px solid #E4E4E7',
                        fontSize: '13px',
                        outline: 'none',
                        fontFamily: "'Lato', sans-serif",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFitmentChecked(true)}
                      style={{
                        padding: '9px 18px',
                        background: '#000000',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        fontFamily: "'Raleway', sans-serif",
                      }}
                    >
                      Verify Fit
                    </button>
                  </div>
                  {fitmentChecked && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#000000', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Lato', sans-serif" }}>
                      <i className="fas fa-check-circle"></i>
                      <span>Compatible! Our team will double-check your chassis code before dispatch.</span>
                    </div>
                  )}
                </div>

                {/* Purchase Actions (Quantity + Buttons) */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                  {/* Quantity selector */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      border: '1.5px solid #E4E4E7',
                      borderRadius: '6px',
                      background: '#FFFFFF',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      style={{
                        padding: '10px 14px',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        color: '#000000',
                      }}
                    >
                      -
                    </button>
                    <span style={{ padding: '0 12px', fontWeight: 800, fontSize: '14px', color: '#000000', minWidth: '32px', textAlign: 'center' }}>
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(qty + 1)}
                      style={{
                        padding: '10px 14px',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        color: '#000000',
                      }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAdd}
                    className="btn-luxury-primary"
                    style={{ flex: 1, minWidth: '160px', padding: '14px 20px', fontSize: '13px', fontFamily: "'Raleway', sans-serif", letterSpacing: '0.8px' }}
                  >
                    <i className="fas fa-shopping-bag"></i>
                    <span>ADD TO BAG</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="btn-luxury-gold"
                    style={{ flex: 1, minWidth: '160px', padding: '14px 20px', fontSize: '13px', fontFamily: "'Raleway', sans-serif", letterSpacing: '0.8px' }}
                  >
                    <i className="fas fa-bolt"></i>
                    <span>BUY NOW</span>
                  </button>
                </div>

                {/* WhatsApp Quick Order */}
                <div style={{ marginBottom: '24px' }}>
                  <a
                    href={`https://wa.me/918860718878?text=Hello,%20I%20am%20interested%20in%20purchasing:%20${encodeURIComponent(product.name)}%20(Price:%20₹${product.price})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '100%',
                      padding: '12px 18px',
                      borderRadius: '8px',
                      border: '1.5px solid #E4E4E7',
                      background: '#FFFFFF',
                      color: '#000000',
                      fontWeight: 700,
                      fontSize: '12px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontFamily: "'Raleway', sans-serif",
                      letterSpacing: '0.5px',
                      transition: 'all 0.15s',
                    }}
                  >
                    <i className="fab fa-whatsapp" style={{ fontSize: '16px' }}></i>
                    <span>ORDER / INQUIRE VIA WHATSAPP (+91 88607 18878)</span>
                  </a>
                </div>

                {/* Pincode Estimator Component */}
                <div style={{ marginBottom: '24px' }}>
                  <PincodeEstimator />
                </div>
              </div>
            </div>
          </div>

          {/* Technical Specifications & Description Tabs */}
          <div style={{ marginTop: '50px' }}>
            <div className="luxury-card" style={{ padding: '32px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E4E4E7' }}>
              <div style={{ display: 'flex', gap: '24px', borderBottom: '1.5px solid #F4F4F5', marginBottom: '24px' }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('desc')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'desc' ? '2.5px solid #000000' : '2.5px solid transparent',
                    padding: '12px 6px',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: activeTab === 'desc' ? '#000000' : '#71717A',
                    cursor: 'pointer',
                    fontFamily: "'Raleway', sans-serif",
                    letterSpacing: '0.5px',
                    transition: 'all 0.15s',
                  }}
                >
                  Detailed Description
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('spec')}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === 'spec' ? '2.5px solid #000000' : '2.5px solid transparent',
                    padding: '12px 6px',
                    fontSize: '14px',
                    fontWeight: 800,
                    color: activeTab === 'spec' ? '#000000' : '#71717A',
                    cursor: 'pointer',
                    fontFamily: "'Raleway', sans-serif",
                    letterSpacing: '0.5px',
                    transition: 'all 0.15s',
                  }}
                >
                  Technical Specifications
                </button>
              </div>

              {activeTab === 'desc' ? (
                <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#52525B', whiteSpace: 'pre-line', fontFamily: "'Lato', sans-serif" }}>
                  <div dangerouslySetInnerHTML={{ __html: product.description || product.short_description || product.name }} />
                </div>
              ) : (
                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: "'Lato', sans-serif" }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #F4F4F5' }}>
                        <td style={{ padding: '12px 0', fontWeight: 700, color: '#000000', width: '35%', fontFamily: "'Raleway', sans-serif" }}>Part / SKU Number</td>
                        <td style={{ padding: '12px 0', color: '#000000', fontFamily: 'monospace', fontWeight: 800 }}>{product.part_number || product.sku || 'N/A'}</td>
                      </tr>
                      {product.oem_numbers && product.oem_numbers.length > 0 ? (
                        <tr style={{ borderBottom: '1px solid #F4F4F5' }}>
                          <td style={{ padding: '12px 0', fontWeight: 700, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>OEM Cross Reference / Interchange</td>
                          <td style={{ padding: '12px 0', color: '#000000', fontFamily: 'monospace', fontWeight: 700 }}>
                            {Array.isArray(product.oem_numbers) ? product.oem_numbers.join(', ') : product.oem_numbers}
                          </td>
                        </tr>
                      ) : product.oem_number ? (
                        <tr style={{ borderBottom: '1px solid #F4F4F5' }}>
                          <td style={{ padding: '12px 0', fontWeight: 700, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>OEM Cross Reference</td>
                          <td style={{ padding: '12px 0', color: '#000000', fontFamily: 'monospace', fontWeight: 700 }}>{product.oem_number}</td>
                        </tr>
                      ) : null}
                      {product.make && (
                        <tr style={{ borderBottom: '1px solid #F4F4F5' }}>
                          <td style={{ padding: '12px 0', fontWeight: 700, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>Vehicle Make Compatibility</td>
                          <td style={{ padding: '12px 0', color: '#27272A' }}>{product.make}</td>
                        </tr>
                      )}
                      {product.year_compatibility && (
                        <tr style={{ borderBottom: '1px solid #F4F4F5' }}>
                          <td style={{ padding: '12px 0', fontWeight: 700, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>Compatible Model Years</td>
                          <td style={{ padding: '12px 0', color: '#27272A' }}>{product.year_compatibility}</td>
                        </tr>
                      )}
                      {product.placement && (
                        <tr style={{ borderBottom: '1px solid #F4F4F5' }}>
                          <td style={{ padding: '12px 0', fontWeight: 700, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>Vehicle Placement / Position</td>
                          <td style={{ padding: '12px 0', color: '#27272A' }}>{product.placement}</td>
                        </tr>
                      )}
                      {product.specifications && typeof product.specifications === 'object' && Object.entries(product.specifications).map(([key, val]) => (
                        <tr key={key} style={{ borderBottom: '1px solid #F4F4F5' }}>
                          <td style={{ padding: '12px 0', fontWeight: 700, color: '#000000', textTransform: 'capitalize', fontFamily: "'Raleway', sans-serif" }}>{key.replace(/_/g, ' ')}</td>
                          <td style={{ padding: '12px 0', color: '#52525B' }}>{String(val)}</td>
                        </tr>
                      ))}
                      <tr style={{ borderBottom: '1px solid #F4F4F5' }}>
                        <td style={{ padding: '12px 0', fontWeight: 700, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>Manufacturer / Brand</td>
                        <td style={{ padding: '12px 0', color: '#27272A' }}>{product.brand || 'Off Road Connection Parts'}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #F4F4F5' }}>
                        <td style={{ padding: '12px 0', fontWeight: 700, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>Condition & Testing</td>
                        <td style={{ padding: '12px 0', color: '#000000', fontWeight: 700 }}>100% Bench & Dynamometer Tested Genuine OEM</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #F4F4F5' }}>
                        <td style={{ padding: '12px 0', fontWeight: 700, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>Country of Origin / Dispatch</td>
                        <td style={{ padding: '12px 0', color: '#27272A' }}>Direct Air Express from Central Logistics Facility (Noida)</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '12px 0', fontWeight: 700, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>Warranty Protection</td>
                        <td style={{ padding: '12px 0', color: '#27272A' }}>6-Month Comprehensive Replacement Guarantee</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <OriginalFooter />
    </>
  );
}
