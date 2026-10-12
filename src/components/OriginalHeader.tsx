'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

export default function OriginalHeader() {
  const router = useRouter();
  const { cartCount } = useCart();
  const { customer, openLoginModal, logout } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isCatMenuOpen, setIsCatMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .catch((e) => console.error(e));
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <>
      <header className="main-header header-custom">
        {/* Mobile Header Bar */}
        <div className="mobile-header-bar">
          <div className="auto-container">
            <div className="mobile-header-inner">
              <div className="mobile-left-btns">
                <div
                  className="mobile-nav-toggler"
                  onClick={() => setIsMobileMenuOpen(true)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fas fa-bars"></i>
                </div>
                <div
                  className="mobile-search-btn"
                  onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                  style={{ cursor: 'pointer' }}
                >
                  <i className="fas fa-search"></i>
                </div>
              </div>
              <div className="mobile-logo">
                <Link href="/">
                  <img src="/assets/images/mv-logo-13.png" alt="Off Road Connection Parts" />
                </Link>
              </div>
              <div className="mobile-right-btns" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div
                  onClick={customer ? () => logout() : openLoginModal}
                  className="mobile-icon"
                  style={{ cursor: 'pointer', color: customer ? '#FF6B00' : '#111', fontSize: '18px' }}
                  title={customer ? `Logged in: +91 ${customer.phone} (Click to Logout)` : 'Login with Mobile Number'}
                >
                  <i className={customer ? 'fas fa-user-check' : 'fas fa-user'}></i>
                </div>
                <Link href="/cart" className="mobile-icon cart-icon">
                  <i className="fas fa-shopping-bag"></i>
                  <span id="cart-count-mobile" className="cart-badge badge">
                    {cartCount}
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Mobile Search Area */}
          {isMobileSearchOpen && (
            <div className="mobile-search-area" style={{ display: 'block' }}>
              <form onSubmit={handleSearchSubmit} className="search-form">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit">
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Header Top Row (Desktop) */}
        <div className="header-top-new desktop-only">
          <div className="auto-container">
            <div className="top-inner-box">
              <div className="logo-box">
                <Link href="/">
                  <img src="/assets/images/mv-logo-13.png" alt="Off Road Connection Parts" />
                </Link>
              </div>

              <div className="search-container">
                <form onSubmit={handleSearchSubmit} className="search-form">
                  <input
                    type="text"
                    placeholder="Search the store"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button type="submit">
                    <i className="fas fa-search"></i>
                  </button>
                </form>
              </div>

              <div className="header-icons-area" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <a
                  href="http://localhost:8000/admin/login.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-item admin"
                  style={{ textDecoration: 'none', color: '#111', display: 'flex', alignItems: 'center', gap: '8px' }}
                  title="Admin & CRM Portal"
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      background: '#f4f4f4',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#FF6B00',
                      fontSize: '16px',
                    }}
                  >
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div className="text" style={{ fontSize: '13px', lineHeight: '1.2' }}>
                    <span style={{ color: '#888', display: 'block', fontSize: '11px' }}>Portal</span>
                    <strong>Admin</strong>
                  </div>
                </a>

                {/* Customer Account / Mobile Login */}
                <div
                  onClick={customer ? () => logout() : openLoginModal}
                  className="icon-item user"
                  style={{
                    textDecoration: 'none',
                    color: '#111',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                  }}
                  title={customer ? `Logged in: +91 ${customer.phone}. Click to Logout` : 'Customer Login with Mobile OTP'}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      background: customer ? '#FFF3EB' : '#f4f4f4',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: customer ? '#FF6B00' : '#555',
                      fontSize: '16px',
                    }}
                  >
                    <i className={customer ? 'fas fa-user-check' : 'fas fa-user'}></i>
                  </div>
                  <div className="text" style={{ fontSize: '13px', lineHeight: '1.2' }}>
                    <span style={{ color: '#888', display: 'block', fontSize: '11px' }}>
                      {customer ? 'Hello,' : 'Sign In'}
                    </span>
                    <strong>{customer ? (customer.name ? customer.name.split(' ')[0] : customer.phone.slice(-4)) : 'Account'}</strong>
                  </div>
                </div>

                <Link href="/cart" className="icon-item cart">
                  <div className="cart-icon-wrapper">
                    <i className="fas fa-shopping-cart"></i>
                    <span id="cart-count-desktop" className="cart-badge badge">
                      {cartCount}
                    </span>
                  </div>
                  <div className="text">
                    <strong>Cart</strong>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Header Bottom Row (Nav) (Desktop) */}
        <div className="header-lower-new desktop-only">
          <div className="auto-container">
            <div className="nav-outer-box">
              {/* Category Dropdown Wrapper */}
              <div
                className="category-nav-dropdown"
                onMouseEnter={() => setIsCatMenuOpen(true)}
                onMouseLeave={() => setIsCatMenuOpen(false)}
              >
                <div className="cat-btn" style={{ cursor: 'pointer' }}>
                  <i className="fas fa-bars"></i>
                  <span>Category</span>
                  <i className="fas fa-chevron-down"></i>
                </div>
                {isCatMenuOpen && (
                  <ul className="cat-menu" style={{ display: 'block' }}>
                    {categories.slice(0, 15).map((cat) => (
                      <li key={cat.id}>
                        <Link href={`/shop?category=${cat.slug || cat.id}`}>
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Main Horizontal Nav */}
              <nav className="horizontal-nav">
                <ul className="nav-links">
                  {categories.slice(0, 8).map((cat) => (
                    <li key={cat.id}>
                      <Link href={`/shop?category=${cat.slug || cat.id}`}>
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link href="/shop">All Parts</Link>
                  </li>
                  <li>
                    <Link href="/contact">Contact</Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'mobile-menu-visible' : ''}`}>
        <div className="menu-backdrop" onClick={() => setIsMobileMenuOpen(false)}></div>
        <div className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
          <i className="fas fa-times"></i>
        </div>
        <nav className="menu-box">
          <div className="nav-logo">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
              <img src="/assets/images/mv-logo-13.png" alt="Off Road Connection Parts" />
            </Link>
          </div>
          <div
            className="mobile-menu-title"
            style={{
              padding: '0 25px 15px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '18px',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            Shop By Category
          </div>
          <div className="menu-outer">
            <ul className="navigation clearfix">
              <li>
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              </li>
              <li>
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop Catalog</Link>
              </li>
              {categories.slice(0, 10).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/shop?category=${cat.slug || cat.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
              </li>
              <li style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <a
                  href="http://localhost:8000/admin/login.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#FF6B00', fontWeight: 700 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <i className="fas fa-user-shield me-2"></i> Admin Portal
                </a>
              </li>
            </ul>
          </div>
          <div className="contact-info">
            <h4>Contact Info</h4>
            <ul>
              <li>Plot 2, Opp Asgarpur park, kharsa Number 307 Asgarpur jaagir sector 128 Noida 201301</li>
              <li><a href="tel:8860718878">8860718878</a></li>
              <li><a href="mailto:info@offroadconnectionparts.com">info@offroadconnectionparts.com</a></li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}

