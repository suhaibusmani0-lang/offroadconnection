'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';
import { useCart } from '@/context/CartContext';
import { formatImageUrl } from '@/lib/image';

function ShopContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [products, setProducts] = useState<any[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 16, total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
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
      .finally(() => setLoading(false));
  }, [search, category, page]);

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

      {/* page-title */}
      <section className="page-title">
        <div className="auto-container">
          <div className="content-box">
            <h1>Our Shop</h1>
            <ul className="bread-crumb clearfix">
              <li><Link href="/">Home</Link></li>
              <li>Shop</li>
              {search && <li>Search: &quot;{search}&quot;</li>}
            </ul>
          </div>
        </div>
      </section>
      {/* page-title end */}

      {/* shop-page-section */}
      <section className="shop-page-section p_relative pb_100 pt_80">
        <div className="auto-container">
          <div className="item-shorting clearfix mb_40" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="left-column">
              <h6>
                Showing {products.length} of {pagination.total.toLocaleString()} Products
              </h6>
            </div>
          </div>

          <div className="row clearfix">
            {loading ? (
              <div className="col-12 text-center py-5">
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '36px', color: '#FF6B00' }}></i>
                <p style={{ marginTop: '15px', color: '#666' }}>Loading 15,000+ auto parts catalog...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="col-12 text-center py-5">
                <i className="fas fa-box-open" style={{ fontSize: '48px', color: '#ccc', marginBottom: '15px' }}></i>
                <h4>No products found matching your search.</h4>
                <Link
                  href="/shop"
                  className="theme-btn mt_20"
                  style={{
                    background: '#FF6B00',
                    color: '#fff',
                    padding: '12px 30px',
                    borderRadius: '5px',
                    display: 'inline-block',
                    textDecoration: 'none',
                  }}
                >
                  View All Products
                </Link>
              </div>
            ) : (
              products.map((prod) => (
                <div key={prod.id} className="col-lg-3 col-md-6 col-sm-12 shop-block mb-4">
                  <div className="shop-block-one">
                    <div
                      className="inner-box"
                      style={{
                        border: '1px solid #000',
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
                            height: '280px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: '#f9f9f9',
                            borderRadius: '8px',
                            overflow: 'hidden',
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
                        <div className="lower-content pt_15">
                          <span style={{ fontSize: '11px', color: '#FF6B00', fontWeight: 700, textTransform: 'uppercase' }}>
                            {prod.category_name || 'Genuine Auto Part'}
                          </span>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '8px 0', height: '48px', overflow: 'hidden' }}>
                            <Link href={`/product/${prod.slug || prod.id}`} style={{ color: '#111', textDecoration: 'none' }}>
                              {prod.name}
                            </Link>
                          </h4>
                          <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>
                            SKU: {prod.sku || `PART-${prod.id}`}
                          </div>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #eee', paddingTop: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '18px', fontWeight: 800, color: '#111' }}>
                            {Number(prod.price) > 0 ? `₹${Number(prod.price).toLocaleString('en-IN')}` : 'Inquire for Price'}
                          </span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
                          <button
                            onClick={() => handleAddToCart(prod)}
                            className="theme-btn"
                            style={{
                              background: '#222',
                              color: '#fff',
                              border: 'none',
                              padding: '10px 15px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              fontSize: '13px',
                              cursor: 'pointer',
                            }}
                          >
                            <i className="fas fa-shopping-cart" style={{ marginRight: '6px' }}></i> Add
                          </button>
                          <a
                            href={`https://wa.me/918860718878?text=${encodeURIComponent('Hi, I want to inquire about: ' + prod.name + ' (SKU: ' + (prod.sku || prod.id) + ')')}`}
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

          {/* PAGINATION */}
          {pagination.totalPages > 1 && (
            <div className="pagination-wrapper centred pt_30">
              <ul className="pagination clearfix" style={{ display: 'inline-flex', gap: '8px', listStyle: 'none' }}>
                <li>
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.page <= 1}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '5px',
                      background: '#fff',
                      border: '1px solid #ddd',
                      cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer',
                      color: pagination.page <= 1 ? '#ccc' : '#111',
                    }}
                  >
                    <i className="fas fa-angle-left"></i> Prev
                  </button>
                </li>
                <li style={{ padding: '10px 15px', fontWeight: 700, color: '#333' }}>
                  Page {pagination.page} of {pagination.totalPages}
                </li>
                <li>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={pagination.page >= pagination.totalPages}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '5px',
                      background: '#fff',
                      border: '1px solid #ddd',
                      cursor: pagination.page >= pagination.totalPages ? 'not-allowed' : 'pointer',
                      color: pagination.page >= pagination.totalPages ? '#ccc' : '#111',
                    }}
                  >
                    Next <i className="fas fa-angle-right"></i>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>

      <OriginalFooter />
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="text-center py-5">Loading shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}

