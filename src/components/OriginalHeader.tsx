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
      <header className="main-header header-custom" style={{ background: '#FFFFFF', borderBottom: '1px solid #E4E4E7' }}>
        {/* Top Info Strip - Pitch Black & Crisp Grey */}
        <div
          style={{
            background: '#000000',
            color: '#A1A1AA',
            fontSize: '12px',
            padding: '8px 0',
            borderBottom: '1px solid #27272A',
          }}
          className="desktop-only"
        >
          <div className="auto-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <span>
                <i className="fas fa-certificate" style={{ color: '#FFFFFF', marginRight: '6px' }}></i>
                100% Genuine Luxury & 4x4 OEM Automotive Components
              </span>
              <span>
                <i className="fas fa-truck-moving" style={{ color: '#FFFFFF', marginRight: '6px' }}></i>
                Express Air Logistics Across 19,000+ Indian Pincodes
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {garageVehicle ? (
                <Link
                  href="/shop"
                  style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <i className="fas fa-car" style={{ color: '#A1A1AA' }}></i>
                  <span>Active Fitment: {garageVehicle.slice(0, 24)}</span>
                </Link>
              ) : (
                <Link href="/shop" style={{ color: '#D4D4D8', textDecoration: 'none' }}>
                  <i className="fas fa-sliders-h" style={{ color: '#FFFFFF', marginRight: '6px' }}></i>
                  Vehicle Fitment Finder
                </Link>
              )}
              <a href="https://wa.me/918860718878" target="_blank" rel="noopener noreferrer" style={{ color: '#FFFFFF', textDecoration: 'none', fontWeight: 600 }}>
                <i className="fab fa-whatsapp" style={{ color: '#FFFFFF', marginRight: '6px' }}></i>
                Parts Specialist: +91 88607 18878
              </a>
            </div>
          </div>
        </div>

        {/* Mobile Header Bar */}
        <div className="mobile-header-bar" style={{ background: '#FFFFFF', padding: '12px 15px', borderBottom: '1px solid #E4E4E7' }}>
          <div className="auto-container">
            <div className="mobile-header-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="mobile-left-btns" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div
                  className="mobile-nav-toggler"
                  onClick={() => setIsMobileMenuOpen(true)}
                  style={{ cursor: 'pointer', fontSize: '20px', color: '#000000' }}
                >
                  <i className="fas fa-bars"></i>
                </div>
                <div
                  className="mobile-search-btn"
                  onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                  style={{ cursor: 'pointer', fontSize: '18px', color: '#000000' }}
                >
                  <i className="fas fa-search"></i>
                </div>
              </div>
              <div className="mobile-logo">
                <Link href="/">
                  <img src="/assets/images/mv-logo-13.png" alt="Off Road Connection Parts" style={{ maxHeight: '46px' }} />
                </Link>
              </div>
              <div className="mobile-right-btns" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  onClick={customer ? () => logout() : openLoginModal}
                  className="mobile-icon"
                  style={{ cursor: 'pointer', color: '#000000', fontSize: '18px' }}
                  title={customer ? `Logged in: +91 ${customer.phone}` : 'Login with Mobile Number'}
                >
                  <i className={customer ? 'fas fa-user-check' : 'far fa-user'}></i>
                </div>
                <Link href="/cart" className="mobile-icon cart-icon" style={{ position: 'relative', color: '#000000', fontSize: '18px' }}>
                  <i className="fas fa-shopping-bag"></i>
                  <span className="cart-badge">{cartCount}</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Search Area */}
          {isMobileSearchOpen && (
            <div className="mobile-search-area" style={{ display: 'block', marginTop: '12px' }}>
              <form onSubmit={handleSearchSubmit} className="search-form" style={{ display: 'flex', border: '1.5px solid #000000', borderRadius: '8px', overflow: 'hidden' }}>
                <input
                  type="text"
                  placeholder="Search by part number, OEM code or vehicle..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ flex: 1, padding: '10px 14px', border: 'none', outline: 'none' }}
                />
                <button type="submit" style={{ background: '#000000', color: '#FFFFFF', border: 'none', padding: '0 16px' }}>
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Desktop Main Header Bar */}
        <div className="header-top-new desktop-only" style={{ background: '#FFFFFF', padding: '16px 0' }}>
          <div className="auto-container">
            <div className="top-inner-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '30px' }}>
              <div className="logo-box">
                <Link href="/">
                  <img src="/assets/images/mv-logo-13.png" alt="Off Road Connection Parts" style={{ maxHeight: '64px', objectFit: 'contain' }} />
                </Link>
              </div>

              {/* Monochrome Luxury Search Bar */}
              <div className="search-container" style={{ flex: 1, maxWidth: '640px' }}>
                <form
                  onSubmit={handleSearchSubmit}
                  style={{
                    display: 'flex',
                    background: '#FAFAFA',
                    borderRadius: '8px',
                    border: '1.5px solid #E4E4E7',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#000000')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#E4E4E7')}
                >
                  <input
                    type="text"
                    placeholder="Search by Part Name, Number, OEM Code (e.g. 8KD941005B, BMW Brake Pad)..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      padding: '13px 20px',
                      fontSize: '14px',
                      outline: 'none',
                      color: '#000000',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#000000',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '0 24px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 700,
                      fontSize: '12px',
                      letterSpacing: '1px',
                      fontFamily: "'Raleway', sans-serif",
                    }}
                  >
                    <i className="fas fa-search"></i>
                    <span>SEARCH</span>
                  </button>
                </form>
              </div>

              {/* Action Icons */}
              <div className="header-icons-area" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <Link
                  href="/admin"
                  className="icon-item admin"
                  style={{ textDecoration: 'none', color: '#000000', display: 'flex', alignItems: 'center', gap: '10px' }}
                  title="Admin CRM & Inventory Suite"
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: '#F4F4F5',
                      border: '1px solid #E4E4E7',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000000',
                      fontSize: '15px',
                    }}
                  >
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <div className="text" style={{ fontSize: '13px', lineHeight: '1.2' }}>
                    <span style={{ color: '#71717A', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Portal</span>
                    <strong style={{ color: '#000000', fontFamily: "'Raleway', sans-serif" }}>Admin</strong>
                  </div>
                </Link>

                {/* Customer Account / Mobile Login */}
                <div
                  onClick={customer ? () => logout() : openLoginModal}
                  className="icon-item user"
                  style={{
                    textDecoration: 'none',
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                  }}
                  title={customer ? `Logged in: +91 ${customer.phone}. Click to Logout` : 'Customer Login with Mobile OTP'}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: customer ? '#000000' : '#F4F4F5',
                      border: '1px solid #E4E4E7',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: customer ? '#FFFFFF' : '#000000',
                      fontSize: '15px',
                    }}
                  >
                    <i className={customer ? 'fas fa-user-check' : 'far fa-user'}></i>
                  </div>
                  <div className="text" style={{ fontSize: '13px', lineHeight: '1.2' }}>
                    <span style={{ color: '#71717A', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>
                      {customer ? 'Welcome' : 'Sign In'}
                    </span>
                    <strong style={{ color: '#000000', fontFamily: "'Raleway', sans-serif" }}>
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
                    color: '#000000',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div
                    className="cart-icon-wrapper"
                    style={{
                      width: '40px',
                      height: '40px',
                      background: '#F4F4F5',
                      border: '1px solid #E4E4E7',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000000',
                      fontSize: '15px',
                    }}
                  >
                    <i className="fas fa-shopping-bag"></i>
                    <span className="cart-badge">{cartCount}</span>
                  </div>
                  <div className="text" style={{ fontSize: '13px', lineHeight: '1.2' }}>
                    <span style={{ color: '#71717A', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Bag</span>
                    <strong style={{ color: '#000000', fontFamily: "'Raleway', sans-serif" }}>Cart ({cartCount})</strong>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Lower Nav Bar */}
        <div className="header-lower-new desktop-only" style={{ background: '#FFFFFF', borderTop: '1px solid #F4F4F5' }}>
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
                    background: '#000000',
                    color: '#FFFFFF',
                    padding: '12px 22px',
                    borderRadius: '8px 8px 0 0',
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '0.8px',
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  <i className="fas fa-bars"></i>
                  <span>EXPLORE CATEGORIES</span>
                  <i className="fas fa-chevron-down" style={{ fontSize: '10px' }}></i>
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
                      border: '1px solid #E4E4E7',
                      borderRadius: '0 0 8px 8px',
                      boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
                      zIndex: 9999,
                      listStyle: 'none',
                      padding: '8px 0',
                      margin: 0,
                    }}
                  >
                    {categories.slice(0, 12).map((cat) => (
                      <li key={cat.id || cat.slug} style={{ borderBottom: '1px solid #F4F4F5' }}>
                        <Link
                          href={`/shop?category=${cat.slug || cat.id}`}
                          style={{
                            display: 'block',
                            padding: '10px 20px',
                            color: '#18181B',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                            transition: 'all 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#F4F4F5';
                            e.currentTarget.style.color = '#000000';
                            e.currentTarget.style.paddingLeft = '24px';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#18181B';
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
                          color: '#000000',
                          fontWeight: 700,
                          fontSize: '12px',
                          textDecoration: 'none',
                          fontFamily: "'Raleway', sans-serif",
                          letterSpacing: '0.5px',
                        }}
                      >
                        VIEW ALL CATEGORIES →
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
                    <Link href="/" style={{ color: '#000000', textDecoration: 'none', fontWeight: 700, fontSize: '14px', fontFamily: "'Raleway', sans-serif" }}>
                      Home
                    </Link>
                  </li>

                  {/* Luxury Makes Menu */}
                  <li
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setIsMakeMenuOpen(true)}
                    onMouseLeave={() => setIsMakeMenuOpen(false)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: '#18181B', fontWeight: 600, fontSize: '14px' }}>
                      <span>Luxury Brands</span>
                      <i className="fas fa-chevron-down" style={{ fontSize: '10px', color: '#71717A' }}></i>
                    </div>
                    {isMakeMenuOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          width: '320px',
                          background: '#FFFFFF',
                          border: '1px solid #E4E4E7',
                          borderRadius: '8px',
                          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.08)',
                          zIndex: 9999,
                          padding: '10px',
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
                              color: '#18181B',
                              textDecoration: 'none',
                              fontSize: '12px',
                              fontWeight: 600,
                              background: '#F4F4F5',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = '#000000';
                              e.currentTarget.style.color = '#FFFFFF';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = '#F4F4F5';
                              e.currentTarget.style.color = '#18181B';
                            }}
                          >
                            {m.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </li>

                  <li>
                    <Link href="/shop" style={{ color: '#18181B', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                      All Spares
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" style={{ color: '#18181B', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" style={{ color: '#18181B', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
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
                    background: '#F4F4F5',
                    border: '1px solid #E4E4E7',
                    borderRadius: '8px',
                    color: '#000000',
                    fontSize: '11px',
                    fontWeight: 700,
                    letterSpacing: '0.6px',
                    textDecoration: 'none',
                    fontFamily: "'Raleway', sans-serif",
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#000000';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F4F4F5';
                    e.currentTarget.style.color = '#000000';
                    e.currentTarget.style.borderColor = '#E4E4E7';
                  }}
                >
                  <i className="fas fa-filter"></i>
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
              background: 'rgba(0, 0, 0, 0.65)',
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
                  style={{ background: 'transparent', border: 'none', fontSize: '20px', color: '#71717A', cursor: 'pointer' }}
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
                    background: '#000000',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '12px',
                    letterSpacing: '0.5px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  <i className="fas fa-car" style={{ marginRight: '6px' }}></i> Vehicle Fitment Selector
                </Link>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ borderBottom: '1px solid #F4F4F5', padding: '12px 0' }}>
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#000000', textDecoration: 'none', fontWeight: 600 }}>
                    Home
                  </Link>
                </li>
                <li style={{ borderBottom: '1px solid #F4F4F5', padding: '12px 0' }}>
                  <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#000000', textDecoration: 'none', fontWeight: 600 }}>
                    All Parts Catalog
                  </Link>
                </li>
                <li style={{ borderBottom: '1px solid #F4F4F5', padding: '12px 0' }}>
                  <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#000000', textDecoration: 'none', fontWeight: 600 }}>
                    About Us
                  </Link>
                </li>
                <li style={{ borderBottom: '1px solid #F4F4F5', padding: '12px 0' }}>
                  <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} style={{ color: '#000000', textDecoration: 'none', fontWeight: 600 }}>
                    Contact & Noida HQ
                  </Link>
                </li>
                <li style={{ padding: '12px 0' }}>
                  <Link
                    href="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ color: '#000000', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', fontFamily: "'Raleway', sans-serif" }}
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
