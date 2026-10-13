'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { LUXURY_MAKES } from '@/constants/vehicles';

export default function OriginalHeader() {
  const router = useRouter();
  const { cartCount } = useCart();
  const { customer, openLoginModal, logout } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isCatMenuOpen, setIsCatMenuOpen] = useState(false);
  const [isMakeMenuOpen, setIsMakeMenuOpen] = useState(false);
  const [garageVehicle, setGarageVehicle] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch((e) => console.error(e));

    // Check garage
    try {
      const g = localStorage.getItem('offroad_my_garage');
      if (g) {
        const p = JSON.parse(g);
        if (p.make) setGarageVehicle(`${p.year ? p.year + ' ' : ''}${p.make} ${p.model || ''}`);
      }
    } catch (e) {}
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <>
      <header className="main-header header-custom" style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0' }}>
        {/* Top Info Strip */}
        <div
          style={{
            background: '#0F172A',
            color: '#94A3B8',
            fontSize: '12px',
            padding: '7px 0',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
          className="desktop-only"
        >
          <div className="auto-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span>
                <i className="fas fa-certificate" style={{ color: '#C5A059', marginRight: '6px' }}></i>
                100% Genuine Luxury & 4x4 Automotive Spares
              </span>
              <span>
                <i className="fas fa-truck-moving" style={{ color: '#C5A059', marginRight: '6px' }}></i>
                Express Shipping Across 19,000+ Indian Pincodes
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {garageVehicle ? (
                <Link
                  href="/shop"
                  style={{ color: '#C5A059', textDecoration: 'none', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className="fas fa-car"></i>
                  <span>Garage: {garageVehicle.slice(0, 24)}</span>
                </Link>
              ) : (
                <Link href="/shop" style={{ color: '#E2E8F0', textDecoration: 'none' }}>
                  <i className="fas fa-sliders-h" style={{ color: '#C5A059', marginRight: '6px' }}></i>
                  Vehicle Fitment Finder
                </Link>
              )}
              <a href="https://wa.me/918860718878" target="_blank" rel="noopener noreferrer" style={{ color: '#E2E8F0', textDecoration: 'none' }}>
                <i className="fab fa-whatsapp" style={{ color: '#25D366', marginRight: '6px' }}></i>
                WhatsApp Parts Desk: +91 88607 18878
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Header Bar */}
        <div className="mobile-header-bar" style={{ background: '#FFFFFF', padding: '12px 15px', borderBottom: '1px solid #E2E8F0' }}>
          <div className="auto-container">
            <div className="mobile-header-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="mobile-left-btns" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div
                  className="mobile-nav-toggler"
                  onClick={() => setIsMobileMenuOpen(true)}
                  style={{ cursor: 'pointer', fontSize: '20px', color: '#0F172A' }}
                >
                  <i className="fas fa-bars"></i>
                </div>
                <div
                  className="mobile-search-btn"
                  onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                  style={{ cursor: 'pointer', fontSize: '18px', color: '#0F172A' }}
                >
                  <i className="fas fa-search"></i>
                </div>
              </div>
              <div className="mobile-logo">
                <Link href="/">
                  <img src="/assets/images/mv-logo-13.png" alt="Off Road Connection Parts" style={{ maxHeight: '48px' }} />
                </Link>
              </div>
              <div className="mobile-right-btns" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  onClick={customer ? () => logout() : openLoginModal}
                  className="mobile-icon"
                  style={{ cursor: 'pointer', color: customer ? '#C5A059' : '#0F172A', fontSize: '18px' }}
                  title={customer ? `Logged in: +91 ${customer.phone}` : 'Login with Mobile Number'}
                >
                  <i className={customer ? 'fas fa-user-check' : 'far fa-user'}></i>
                </div>
                <Link href="/cart" className="mobile-icon cart-icon" style={{ position: 'relative', color: '#0F172A', fontSize: '18px' }}>
                  <i className="fas fa-shopping-bag"></i>
                  <span className="cart-badge">{cartCount}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Search Area */}
          {isMobileSearchOpen && (
            <div className="mobile-search-area" style={{ display: 'block', marginTop: '12px' }}>
              <form onSubmit={handleSearchSubmit} className="search-form" style={{ display: 'flex', border: '1.5px solid #C5A059', borderRadius: '10px', overflow: 'hidden' }}>
                <input
                  type="text"
                  placeholder="Search by part name, OEM or vehicle..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ flex: 1, padding: '10px 14px', border: 'none', outline: 'none' }}
                />
                <button type="submit" style={{ background: '#0F172A', color: '#fff', border: 'none', padding: '0 16px' }}>
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Desktop Main Header Bar */}
        <div className="header-top-new desktop-only" style={{ background: '#FFFFFF', padding: '18px 0' }}>
          <div className="auto-container">
            <div className="top-inner-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '30px' }}>
              <div className="logo-box">
                <Link href="/">
                  <img src="/assets/images/mv-logo-13.png" alt="Off Road Connection Parts" style={{ maxHeight: '68px', objectFit: 'contain' }} />
                </Link>
              </div>

              {/* Luxury Search Bar */}
              <div className="search-container" style={{ flex: 1, maxWidth: '650px' }}>
                <form
                  onSubmit={handleSearchSubmit}
                  style={{
                    display: 'flex',
                    background: '#FAFBFC',
                    borderRadius: '12px',
                    border: '1.5px solid #E2E8F0',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#C5A059')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E2E8F0')}
                >
                  <input
                    type="text"
                    placeholder="Search by Part Name, Number, OEM Code (e.g. BMW Headlight, Audi Brake Pad)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      padding: '13px 20px',
                      fontSize: '14px',
                      outline: 'none',
                      color: '#0F172A',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0 24px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 600,
                      fontSize: '13px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    <i className="fas fa-search"></i>
                    <span>SEARCH</span>
                  </button>
                </form>
              </div>

              {/* Action Icons */}
              <div className="header-icons-area" style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
                <Link
                  href="/admin"
                  className="icon-item admin"
                  style={{ textDecoration: 'none', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}
                  title="Admin CRM & Inventory Suite"
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C5A059',
                      fontSize: '16px',
                    }}
                  >
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div className="text" style={{ fontSize: '13px', lineHeight: '1.2' }}>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Portal</span>
                    <strong style={{ color: '#0F172A' }}>Admin</strong>
                  </div>
                </Link>

                {/* Customer Account / Mobile Login */}
                <div
                  onClick={customer ? () => logout() : openLoginModal}
                  className="icon-item user"
                  style={{
                    textDecoration: 'none',
                    color: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                  }}
                  title={customer ? `Logged in: +91 ${customer.phone}. Click to Logout` : 'Customer Login with Mobile OTP'}
                >
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      background: customer ? '#FBF7EE' : '#F8FAFC',
                      border: customer ? '1.5px solid #C5A059' : '1px solid #E2E8F0',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: customer ? '#C5A059' : '#64748B',
                      fontSize: '16px',
                    }}
                  >
                    <i className={customer ? 'fas fa-user-check' : 'far fa-user'}></i>
                  </div>
                  <div className="text" style={{ fontSize: '13px', lineHeight: '1.2' }}>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>
                      {customer ? 'Welcome' : 'Sign In'}
                    </span>
                    <strong style={{ color: '#0F172A' }}>
                      {customer ? (customer.name ? customer.name.split(' ')[0] : customer.phone.slice(-4)) : 'Account'}
                    </strong>
                  </div>
                </div>

                {/* Shopping Bag / Cart */}
                <Link
                  href="/cart"
                  className="icon-item cart"
                  style={{
                    textDecoration: 'none',
                    color: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    className="cart-icon-wrapper"
                    style={{
                      width: '42px',
                      height: '42px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#0F172A',
                      fontSize: '16px',
                    }}
                  >
                    <i className="fas fa-shopping-bag"></i>
                    <span className="cart-badge">{cartCount}</span>
                  </div>
                  <div className="text" style={{ fontSize: '13px', lineHeight: '1.2' }}>
                    <span style={{ color: '#94A3B8', display: 'block', fontSize: '11px', textTransform: 'uppercase' }}>Bag</span>
                    <strong style={{ color: '#0F172A' }}>Cart ({cartCount})</strong>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Lower Nav Bar */}
        <div className="header-lower-new desktop-only" style={{ background: '#FFFFFF', borderTop: '1px solid #F1F5F9' }}>
          <div className="auto-container">
            <div className="nav-outer-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Category Dropdown */}
              <div
                className="category-nav-dropdown"
                onMouseEnter={() => setIsCatMenuOpen(true)}
                onMouseLeave={() => setIsCatMenuOpen(false)}
                style={{ position: 'relative' }}
              >
                <div
                  className="cat-btn"
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                    color: '#FFFFFF',
                    padding: '12px 22px',
                    borderRadius: '8px 8px 0 0',
                    fontWeight: 700,
                    fontSize: '13px',
                    letterSpacing: '0.5px',
                  }}
                >
                  <i className="fas fa-bars" style={{ color: '#C5A059' }}></i>
                  <span>EXPLORE CATEGORIES</span>
                  <i className="fas fa-chevron-down" style={{ fontSize: '11px' }}></i>
                </div>
                {isCatMenuOpen && (
                  <ul
                    className="cat-menu"
                    style={{
                      display: 'block',
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '280px',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '0 0 10px 10px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                      zIndex: 9999,
                      listStyle: 'none',
                      padding: '10px 0',
                      margin: 0,
                    }}
                  >
                    {categories.slice(0, 12).map((cat) => (
                      <li key={cat.id || cat.slug} style={{ borderBottom: '1px solid #F8FAFC' }}>
                        <Link
                          href={`/shop?category=${cat.slug || cat.id}`}
                          style={{
                            display: 'block',
                            padding: '10px 20px',
                            color: '#334155',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                            transition: 'all 0.2s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#FBF7EE';
                            e.currentTarget.style.color = '#C5A059';
                            e.currentTarget.style.paddingLeft = '24px';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#334155';
                            e.currentTarget.style.paddingLeft = '20px';
                          }}
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link
                        href="/shop"
                        style={{
                          display: 'block',
                          padding: '10px 20px',
                          color: '#C5A059',
                          fontWeight: 700,
                          fontSize: '13px',
                          textDecoration: 'none',
                        }}
                      >
                        View All Categories →
                      </Link>
                    </li>
                  </ul>
                )}
              </div>

              {/* Horizontal Nav Links */}
              <nav className="horizontal-nav" style={{ flex: 1, marginLeft: '30px' }}>
                <ul
                  className="nav-links"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    listStyle: 'none',
                    margin: 0,
                    padding: 0,
                  }}
                >
                  <li>
                    <Link href="/" style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
                      Home
                    </Link>
                  </li>

                  {/* Luxury Makes Menu */}
                  <li
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setIsMakeMenuOpen(true)}
                    onMouseLeave={() => setIsMakeMenuOpen(false)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#0F172A', fontWeight: 600, fontSize: '14px' }}>
                      <span>Luxury Brands</span>
                      <i className="fas fa-chevron-down" style={{ fontSize: '10px', color: '#94A3B8' }}></i>
                    </div>
                    {isMakeMenuOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          width: '320px',
                          background: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          borderRadius: '10px',
                          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                          zIndex: 9999,
                          padding: '12px',
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '6px',
                        }}
                      >
                        {LUXURY_MAKES.slice(0, 10).map((m) => (
                          <Link
                            key={m.id}
                            href={`/shop?make=${encodeURIComponent(m.name)}`}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '6px',
                              color: '#334155',
                              textDecoration: 'none',
                              fontSize: '12px',
                              fontWeight: 600,
                              background: '#F8FAFC',
                              transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#FBF7EE';
                              e.currentTarget.style.color = '#C5A059';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#F8FAFC';
                              e.currentTarget.style.color = '#334155';
                            }}
                          >
                            {m.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>

                  <li>
                    <Link href="/shop" style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                      All Spares
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                      Contact & Support
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Fast Vehicle Fitment Quick Action */}
              <div>
                <Link
                  href="/shop"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: '#FBF7EE',
                    border: '1px solid rgba(197, 160, 89, 0.4)',
                    borderRadius: '8px',
                    color: '#854D0E',
                    fontSize: '12px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  <i className="fas fa-filter" style={{ color: '#C5A059' }}></i>
                  <span>FILTER BY MAKE & MODEL</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            className="mobile-menu-overlay"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(15, 23, 42, 0.6)',
              zIndex: 999999,
            }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div
              className="mobile-menu-content"
              style={{
                width: '300px',
                height: '100%',
                background: '#FFFFFF',
                padding: '24px',
                overflowY: 'auto',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <img src="/assets/images/mv-logo-13.png" alt="Logo" style={{ maxHeight: '42px' }} />
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ background: 'transparent', border: 'none', fontSize: '20px', color: '#64748B', cursor: 'pointer' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '12px',
                    background: '#FBF7EE',
                    borderRadius: '8px',
                    color: '#854D0E',
                    fontWeight: 700,
                    fontSize: '13px',
                    textAlign: 'center',
                    textDecoration: 'none',
                  }}
                >
                  <i className="fas fa-car" style={{ marginRight: '6px' }}></i> Vehicle Fitment Selector
                </Link>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ borderBottom: '1px solid #F1F5F9', padding: '12px 0' }}>
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600 }}>
                    Home
                  </Link>
                </li>
                <li style={{ borderBottom: '1px solid #F1F5F9', padding: '12px 0' }}>
                  <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600 }}>
                    All Parts Catalog
                  </Link>
                </li>
                <li style={{ borderBottom: '1px solid #F1F5F9', padding: '12px 0' }}>
                  <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600 }}>
                    About Us
                  </Link>
                </li>
                <li style={{ borderBottom: '1px solid #F1F5F9', padding: '12px 0' }}>
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#0F172A', textDecoration: 'none', fontWeight: 600 }}>
                    Contact & Noida HQ
                  </Link>
                </li>
                <li style={{ padding: '12px 0' }}>
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ color: '#C5A059', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <i className="fas fa-user-shield"></i>
                    <span>Admin CRM Portal</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
