'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';
import VehicleSelector from '@/components/VehicleSelector';
import { LUXURY_MAKES, LUXURY_PART_CATEGORIES } from '@/constants/vehicles';
import { formatImageUrl } from '@/lib/image';
import { useCart } from '@/context/CartContext';
import { trackAddToCart } from '@/lib/analytics';
import AutoProductImage from '@/components/AutoProductImage';

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 16, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  // Extract query filters
  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const make = searchParams.get('make') || '';
  const model = searchParams.get('model') || '';
  const year = searchParams.get('year') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (search) params.set('search', search);
    if (make) params.set('make', make);
    if (model) params.set('model', model);
    if (year) params.set('year', year);
    if (category) params.set('category', category);
    if (sort) params.set('sort', sort);
    params.set('limit', '16');

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
          setPagination(data.pagination || { page, limit: 16, total: data.products.length, totalPages: 1 });
        }
      })
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => setLoading(false));
  }, [page, search, make, model, year, category, sort]);

  const updateFilters = (newFilters: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    // Reset to page 1 on filter change if not changing page
    if (!('page' in newFilters)) {
      params.set('page', '1');
    }
    router.push(`/shop?${params.toString()}`);
  };

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

  const hasActiveFilters = !!(make || model || year || category || search);

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

      {/* Page Header / Breadcrumb Strip */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E4E4E7', padding: '24px 0 20px' }}>
        <div className="auto-container">
          <div className="luxury-breadcrumb">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">Precision Auto Parts Catalog</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  color: '#000000',
                  margin: 0,
                  fontFamily: "'Raleway', sans-serif",
                  letterSpacing: '-1px',
                }}
              >
                {make ? `${make} Spare Parts` : category ? `${category.replace(/-/g, ' ')} Components` : 'Luxury Automotive Parts Catalog'}
              </h1>
              <p style={{ fontSize: '13px', color: '#71717A', margin: '4px 0 0', fontFamily: "'Lato', sans-serif" }}>
                Browse 2,524 genuine OEM & high-precision components with verified chassis fitment.
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={() => router.push('/shop')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#000000',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* Active Filter Pills Strip */}
          {hasActiveFilters && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
              <span style={{ fontSize: '12px', color: '#71717A', fontWeight: 600 }}>Active Filters:</span>
              {make && (
                <span
                  style={{
                    background: '#000000',
                    border: '1px solid #000000',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  Make: {make}
                  <i
                    className="fas fa-times"
                    style={{ cursor: 'pointer', fontSize: '10px' }}
                    onClick={() => updateFilters({ make: null, model: null })}
                  ></i>
                </span>
              )}
              {model && (
                <span
                  style={{
                    background: '#000000',
                    border: '1px solid #000000',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  Model: {model}
                  <i
                    className="fas fa-times"
                    style={{ cursor: 'pointer', fontSize: '10px' }}
                    onClick={() => updateFilters({ model: null })}
                  ></i>
                </span>
              )}
              {year && (
                <span
                  style={{
                    background: '#000000',
                    border: '1px solid #000000',
                    color: '#FFFFFF',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  Year: {year}
                  <i
                    className="fas fa-times"
                    style={{ cursor: 'pointer', fontSize: '10px' }}
                    onClick={() => updateFilters({ year: null })}
                  ></i>
                </span>
              )}
              {category && (
                <span
                  style={{
                    background: '#F4F4F5',
                    border: '1px solid #E4E4E7',
                    color: '#000000',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  Category: {category}
                  <i
                    className="fas fa-times"
                    style={{ cursor: 'pointer', fontSize: '10px' }}
                    onClick={() => updateFilters({ category: null })}
                  ></i>
                </span>
              )}
              {search && (
                <span
                  style={{
                    background: '#F4F4F5',
                    border: '1px solid #E4E4E7',
                    color: '#000000',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  Search: &ldquo;{search}&rdquo;
                  <i
                    className="fas fa-times"
                    style={{ cursor: 'pointer', fontSize: '10px' }}
                    onClick={() => updateFilters({ search: null })}
                  ></i>
                </span>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Main Catalog Section */}
      <section style={{ padding: '40px 0 80px', background: '#FAFAFA' }}>
        <div className="auto-container">
          <div className="row clearfix">
            {/* Left Filter Sidebar */}
            <div className="col-lg-3 col-md-12" style={{ marginBottom: '30px' }}>
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  border: '1px solid #E4E4E7',
                  padding: '22px',
                  boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #F4F4F5' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#000000', margin: 0, fontFamily: "'Raleway', sans-serif", letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Filter Inventory
                  </h3>
                  <i className="fas fa-sliders-h" style={{ color: '#000000' }}></i>
                </div>

                {/* Make Filter List */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#71717A', marginBottom: '10px', letterSpacing: '0.8px', fontFamily: "'Raleway', sans-serif" }}>
                    Luxury Vehicle Makes
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto' }}>
                    {LUXURY_MAKES.map((m) => {
                      const isSelected = make.toLowerCase() === m.name.toLowerCase();
                      return (
                        <div
                          key={m.id}
                          onClick={() => updateFilters({ make: isSelected ? null : m.name, model: null })}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            background: isSelected ? '#000000' : '#F4F4F5',
                            border: isSelected ? '1px solid #000000' : '1px solid transparent',
                            color: isSelected ? '#FFFFFF' : '#18181B',
                            fontSize: '12px',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s',
                            fontFamily: "'Raleway', sans-serif",
                          }}
                        >
                          <span>{m.name}</span>
                          {isSelected && <i className="fas fa-check" style={{ fontSize: '10px' }}></i>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Part Categories List */}
                <div>
                  <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#71717A', marginBottom: '10px', letterSpacing: '0.8px', fontFamily: "'Raleway', sans-serif" }}>
                    Component Type
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {LUXURY_PART_CATEGORIES.map((cat) => {
                      const isSelected = category.toLowerCase() === cat.slug.toLowerCase();
                      return (
                        <div
                          key={cat.id}
                          onClick={() => updateFilters({ category: isSelected ? null : cat.slug })}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '6px',
                            background: isSelected ? '#000000' : '#F4F4F5',
                            border: isSelected ? '1px solid #000000' : '1px solid transparent',
                            color: isSelected ? '#FFFFFF' : '#18181B',
                            fontSize: '12px',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s',
                            fontFamily: "'Raleway', sans-serif",
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className={cat.icon} style={{ fontSize: '11px', color: isSelected ? '#FFFFFF' : '#71717A' }}></i>
                            <span>{cat.name}</span>
                          </div>
                          {isSelected && <i className="fas fa-check" style={{ fontSize: '10px' }}></i>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Product Grid */}
            <div className="col-lg-9 col-md-12">
              {/* Top Controls: Count & Sort */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#FFFFFF',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: '1px solid #E4E4E7',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>
                    Showing {products.length} of {pagination.total.toLocaleString()} Precision Parts
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '12px', color: '#71717A', fontWeight: 600, margin: 0, fontFamily: "'Raleway', sans-serif" }}>
                    Sort By:
                  </label>
                  <select
                    value={sort}
                    onChange={(e) => updateFilters({ sort: e.target.value })}
                    style={{
                      padding: '7px 12px',
                      borderRadius: '6px',
                      border: '1.5px solid #E4E4E7',
                      background: '#FFFFFF',
                      fontSize: '12px',
                      color: '#000000',
                      outline: 'none',
                      cursor: 'pointer',
                      fontFamily: "'Lato', sans-serif",
                    }}
                  >
                    <option value="newest">Latest Arrivals</option>
                    <option value="featured">Featured First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
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
                  <p style={{ color: '#71717A', fontSize: '14px', fontFamily: "'Lato', sans-serif" }}>Loading matching parts...</p>
                </div>
              ) : products.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '80px 20px',
                    background: '#FFFFFF',
                    borderRadius: '10px',
                    border: '1px solid #E4E4E7',
                  }}
                >
                  <i className="fas fa-search" style={{ fontSize: '36px', color: '#D4D4D8', marginBottom: '14px' }}></i>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#000000', marginBottom: '8px', fontFamily: "'Raleway', sans-serif" }}>
                    No Matching Parts Found
                  </h3>
                  <p style={{ color: '#71717A', fontSize: '13px', maxWidth: '400px', margin: '0 auto 20px', fontFamily: "'Lato', sans-serif" }}>
                    Try clearing vehicle filters or contact our technical parts desk for off-catalog sourcing.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => router.push('/shop')}
                      className="btn-luxury-outline"
                      style={{ fontFamily: "'Raleway', sans-serif" }}
                    >
                      Reset All Filters
                    </button>
                    <a
                      href="https://wa.me/918860718878"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-luxury-primary"
                      style={{ textDecoration: 'none', fontFamily: "'Raleway', sans-serif" }}
                    >
                      <i className="fab fa-whatsapp"></i>
                      <span>Ask On WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                    gap: '20px',
                  }}
                >
                  {products.map((p) => {
                    return (
                      <div key={p.id || p.slug} className="luxury-card" style={{ display: 'flex', flexDirection: 'column', borderRadius: '0px' }}>
                        {/* Auto-Rotating Image Box (Changes photo automatically if more than 1 photo exists) */}
                        <div className="product-card-img-box" style={{ borderRadius: '0px' }}>
                          <Link href={`/product/${p.slug}`} style={{ width: '100%', height: '100%', display: 'block' }}>
                            <AutoProductImage
                              images={p.images}
                              image={p.image}
                              alt={p.name}
                            />
                          </Link>
                          <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 20 }}>
                            <span className="badge-oem" style={{ borderRadius: '0px' }}>✓ OEM Genuine</span>
                          </div>
                        </div>

                        {/* Content Box */}
                        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                              <span style={{ fontSize: '11px', color: '#71717A', textTransform: 'uppercase', fontWeight: 600, fontFamily: "'Lato', sans-serif" }}>
                                {p.category_name || 'Vehicle Part'}
                              </span>
                              {(p.part_number || p.sku) && (
                                <span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: 700, color: '#000000', background: '#F4F4F5', padding: '2px 6px', borderRadius: '0px', border: '1px solid #E4E4E7' }}>
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
                                marginBottom: '10px',
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
                              <span style={{ fontSize: '17px', fontWeight: 900, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>
                                ₹{Number(p.price).toLocaleString('en-IN')}
                              </span>
                              {p.old_price && p.old_price > p.price && (
                                <span className="old-price">
                                  ₹{Number(p.old_price).toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>

                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => handleAddToCart(p)}
                                style={{
                                  flex: 1,
                                  padding: '9px 12px',
                                  background: '#000000',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  borderRadius: '0px',
                                  fontSize: '11px',
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
                                <span>ADD</span>
                              </button>
                              <Link
                                href={`/product/${p.slug}`}
                                style={{
                                  padding: '9px 12px',
                                  background: '#F4F4F5',
                                  border: '1px solid #E4E4E7',
                                  color: '#000000',
                                  borderRadius: '0px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  textDecoration: 'none',
                                  fontSize: '12px',
                                }}
                                title="View Specifications"
                              >
                                <i className="fas fa-eye"></i>
                              </Link>
                              <a
                                href={`https://wa.me/918860718878?text=Hello,%20inquiring%20about%20${encodeURIComponent(p.name)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  padding: '9px 10px',
                                  background: '#F4F4F5',
                                  border: '1px solid #E4E4E7',
                                  color: '#000000',
                                  borderRadius: '0px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  textDecoration: 'none',
                                  fontSize: '13px',
                                }}
                                title="WhatsApp Specialist"
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

              {/* Luxury Pagination */}
              {pagination.totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '45px',
                  }}
                >
                  {page > 1 && (
                    <button
                      type="button"
                      onClick={() => updateFilters({ page: String(page - 1) })}
                      className="btn-luxury-outline"
                      style={{ padding: '8px 16px', fontSize: '12px', fontFamily: "'Raleway', sans-serif" }}
                    >
                      ← Previous
                    </button>
                  )}
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#71717A', padding: '0 10px', fontFamily: "'Raleway', sans-serif" }}>
                    Page {page} of {pagination.totalPages}
                  </span>
                  {page < pagination.totalPages && (
                    <button
                      type="button"
                      onClick={() => updateFilters({ page: String(page + 1) })}
                      className="btn-luxury-outline"
                      style={{ padding: '8px 16px', fontSize: '12px', fontFamily: "'Raleway', sans-serif" }}
                    >
                      Next →
                    </button>
                  )}
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

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#000000', fontFamily: "'Raleway', sans-serif" }}>Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
