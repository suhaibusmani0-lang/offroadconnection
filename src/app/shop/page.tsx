'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';
import VehicleSelector from '@/components/VehicleSelector';
import { useCart } from '@/context/CartContext';
import { formatImageUrl } from '@/lib/image';
import { LUXURY_MAKES, LUXURY_PART_CATEGORIES } from '@/constants/vehicles';

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const make = searchParams.get('make') || '';
  const model = searchParams.get('model') || '';
  const year = searchParams.get('year') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 16, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (make) params.set('make', make);
    if (model) params.set('model', model);
    if (year) params.set('year', year);
    if (sort) params.set('sort', sort);
    params.set('page', String(page));
    params.set('limit', '16');

    fetch(`/api/products?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products) {
          setProducts(data.products);
          setPagination(data.pagination);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, [search, category, make, model, year, sort, page]);

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === null || v === '') {
        params.delete(k);
      } else {
        params.set(k, v);
      }
    });
    params.set('page', '1');
    router.push(`/shop?${params.toString()}`);
  };

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    setToastMsg(`Added "${product.name.slice(0, 30)}..." to your shopping bag!`);
    setTimeout(() => setToastMsg(''), 2500);
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

      {/* Ultra Luxury Header Banner */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '35px 0' }}>
        <div className="auto-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
            <div>
              <div className="luxury-breadcrumb" style={{ padding: '0 0 8px 0' }}>
                <Link href="/">Home</Link>
                <span className="separator">/</span>
                <span className="current">Luxury Spares Catalog</span>
                {make && (
                  <>
                    <span className="separator">/</span>
                    <span className="current">{make}</span>
                  </>
                )}
              </div>
              <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#0F172A', margin: 0, fontFamily: "'Outfit', sans-serif" }}>
                {make ? `${make} Spare Parts` : 'Luxury Automotive Spare Parts'}
              </h1>
            </div>

            {/* Quick Vehicle Toggle */}
            <button
              type="button"
              onClick={() => setShowVehicleSelector(!showVehicleSelector)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                background: showVehicleSelector ? '#0F172A' : '#FBF7EE',
                border: '1px solid #C5A059',
                color: showVehicleSelector ? '#FFFFFF' : '#854D0E',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <i className="fas fa-car-alt" style={{ color: '#C5A059' }}></i>
              <span>{showVehicleSelector ? 'Hide Vehicle Selector' : 'Change / Select Vehicle'}</span>
            </button>
          </div>

          {/* Expandable Top Vehicle Selector */}
          {showVehicleSelector && (
            <div style={{ marginTop: '24px' }}>
              <VehicleSelector variant="hero" />
            </div>
          )}

          {/* Active Filter Pills Bar */}
          {hasActiveFilters && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid #F1F5F9',
              }}
            >
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
                Active Filters:
              </span>
              {make && (
                <span
                  style={{
                    background: '#FBF7EE',
                    border: '1px solid #C5A059',
                    color: '#854D0E',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
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
                    background: '#FBF7EE',
                    border: '1px solid #C5A059',
                    color: '#854D0E',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
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
                    background: '#FBF7EE',
                    border: '1px solid #C5A059',
                    color: '#854D0E',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
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
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    color: '#1D4ED8',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
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
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    color: '#334155',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  &quot;{search}&quot;
                  <i
                    className="fas fa-times"
                    style={{ cursor: 'pointer', fontSize: '10px' }}
                    onClick={() => updateFilters({ search: null })}
                  ></i>
                </span>
              )}
              <button
                type="button"
                onClick={() => router.push('/shop')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#EF4444',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Main Catalog Section */}
      <section style={{ padding: '50px 0 80px', background: '#FAFBFC' }}>
        <div className="auto-container">
          <div className="row clearfix">
            {/* Left Filter Sidebar */}
            <div className="col-lg-3 col-md-12" style={{ marginBottom: '30px' }}>
              <div
                style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '24px',
                  boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #F1F5F9' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    Filter Inventory
                  </h3>
                  <i className="fas fa-sliders-h" style={{ color: '#C5A059' }}></i>
                </div>

                {/* Make Filter List */}
                <div style={{ marginBottom: '26px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '12px', letterSpacing: '0.5px' }}>
                    Luxury Vehicle Makes
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                    {LUXURY_MAKES.map((m) => {
                      const isSelected = make.toLowerCase() === m.name.toLowerCase();
                      return (
                        <div
                          key={m.id}
                          onClick={() => updateFilters({ make: isSelected ? null : m.name, model: null })}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: isSelected ? '#FBF7EE' : '#F8FAFC',
                            border: isSelected ? '1px solid #C5A059' : '1px solid transparent',
                            color: isSelected ? '#C5A059' : '#334155',
                            fontSize: '13px',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s',
                          }}
                        >
                          <span>{m.name}</span>
                          {isSelected && <i className="fas fa-check" style={{ fontSize: '11px' }}></i>}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Part Categories List */}
                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', marginBottom: '12px', letterSpacing: '0.5px' }}>
                    Component Type
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {LUXURY_PART_CATEGORIES.map((cat) => {
                      const isSelected = category.toLowerCase() === cat.slug.toLowerCase();
                      return (
                        <div
                          key={cat.id}
                          onClick={() => updateFilters({ category: isSelected ? null : cat.slug })}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            background: isSelected ? '#FBF7EE' : '#F8FAFC',
                            border: isSelected ? '1px solid #C5A059' : '1px solid transparent',
                            color: isSelected ? '#C5A059' : '#334155',
                            fontSize: '13px',
                            fontWeight: isSelected ? 700 : 500,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.15s',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <i className={cat.icon} style={{ fontSize: '12px', color: '#C5A059' }}></i>
                            <span>{cat.name}</span>
                          </div>
                          {isSelected && <i className="fas fa-check" style={{ fontSize: '11px' }}></i>}
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
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  marginBottom: '24px',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                    Showing {products.length} of {pagination.total.toLocaleString()} Precision Parts
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label style={{ fontSize: '13px', color: '#64748B', fontWeight: 600, margin: 0 }}>
                    Sort By:
                  </label>
                  <select
                    value={sort}
                    onChange={(e) => updateFilters({ sort: e.target.value })}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      background: '#FFFFFF',
                      fontSize: '13px',
                      color: '#0F172A',
                      outline: 'none',
                      cursor: 'pointer',
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
                      width: '45px',
                      height: '45px',
                      border: '3px solid #F1F5F9',
                      borderTopColor: '#C5A059',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      margin: '0 auto 15px',
                    }}
                  ></div>
                  <p style={{ color: '#94A3B8', fontSize: '14px' }}>Loading compatible parts...</p>
                </div>
              ) : products.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '80px 20px',
                    background: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <i className="fas fa-search" style={{ fontSize: '40px', color: '#CBD5E1', marginBottom: '16px' }}></i>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                    No Matching Parts Found
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px' }}>
                    Try clearing vehicle filters or contact our technical parts desk for off-catalog sourcing.
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => router.push('/shop')}
                      className="btn-luxury-outline"
                    >
                      Reset All Filters
                    </button>
                    <a
                      href="https://wa.me/918860718878"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-luxury-primary"
                      style={{ textDecoration: 'none' }}
                    >
                      <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i>
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
                        <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                              {p.category_name || 'Vehicle Part'}
                            </span>
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
                              }}
                            >
                              <Link href={`/product/${p.slug}`} style={{ color: '#0F172A', textDecoration: 'none' }}>
                                {p.name}
                              </Link>
                            </h4>
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                              <span style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
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
                                  background: '#0F172A',
                                  color: '#FFFFFF',
                                  border: 'none',
                                  borderRadius: '8px',
                                  fontSize: '11px',
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
                                <span>ADD</span>
                              </button>
                              <Link
                                href={`/product/${p.slug}`}
                                style={{
                                  padding: '9px 12px',
                                  background: '#F8FAFC',
                                  border: '1px solid #E2E8F0',
                                  color: '#0F172A',
                                  borderRadius: '8px',
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
                                  background: '#F0FDF4',
                                  border: '1px solid #86EFAC',
                                  color: '#15803D',
                                  borderRadius: '8px',
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
                      style={{ padding: '8px 16px', fontSize: '13px' }}
                    >
                      ← Previous
                    </button>
                  )}
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#64748B', padding: '0 10px' }}>
                    Page {page} of {pagination.totalPages}
                  </span>
                  {page < pagination.totalPages && (
                    <button
                      type="button"
                      onClick={() => updateFilters({ page: String(page + 1) })}
                      className="btn-luxury-outline"
                      style={{ padding: '8px 16px', fontSize: '13px' }}
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
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#C5A059' }}>Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
