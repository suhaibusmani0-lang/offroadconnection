'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { LUXURY_MAKES } from '@/constants/vehicles';
import siteConfig from '@/config/site';
import {
  Search,
  ShoppingBag,
  User,
  UserCheck,
  Menu,
  X,
  SlidersHorizontal,
  Car,
  ChevronDown,
  Lock,
  Box,
  Truck,
  Layers,
} from 'lucide-react';

const WhatsAppIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ display: 'inline-block' }}>
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.004.577 1.764.846 2.806.847h.005c3.182 0 5.768-2.587 5.768-5.766.001-3.18-2.584-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.824 0-3.535-.49-5.012-1.344l-5.988 1.569 1.6-5.836c-.958-1.536-1.5-3.351-1.5-5.275 0-5.514 4.486-10 10-10 5.514 0 10 4.486 10 10z" />
  </svg>
);

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

  const trendingSearches = [
    'BMW Headlight',
    'Air Suspension',
    'Brake Pads',
    'Porsche Calipers',
    'Audi Grill',
  ];

  return (
    <>
      <header
        className="main-header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 9999,
          background: '#FFFFFF',
          borderBottom: '1px solid #E4E4E7',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.03)',
          fontFamily: "'Lato', sans-serif",
        }}
      >
        {/* ========================================================================= */}
        {/* TOP VIP ANNOUNCEMENT BAR (Obsidian & White Micro-Text)                   */}
        {/* ========================================================================= */}
        <div
          style={{
            background: '#000000',
            color: '#A1A1AA',
            fontSize: '11px',
            padding: '7px 0',
            borderBottom: '1px solid #27272A',
          }}
          className="desktop-only"
        >
          <div className="auto-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#FFFFFF',
                    boxShadow: '0 0 8px #FFFFFF',
                  }}
                />
                <span style={{ color: '#FFFFFF', fontWeight: 700, letterSpacing: '0.4px', textTransform: 'uppercase' }}>
                  Direct OEM Importer
                </span>
              </div>
              <span style={{ color: '#71717A' }}>|</span>
              <span>100% Certified European Spares (Audi • BMW • Mercedes • Porsche • Range Rover)</span>
              <span style={{ color: '#71717A' }}>|</span>
              <span>Express Air Logistics (19,000+ Indian Pincodes)</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              {garageVehicle ? (
                <Link
                  href="/shop"
                  style={{
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#18181B',
                    padding: '3px 10px',
                    borderRadius: '0px',
                    border: '1px solid #27272A',
                  }}
                >
                  <Car size={13} style={{ color: '#A1A1AA' }} />
                  <span>Fitment: {garageVehicle.slice(0, 22)}</span>
                </Link>
              ) : (
                <Link
                  href="/shop"
                  style={{
                    color: '#D4D4D8',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <SlidersHorizontal size={13} style={{ color: '#FFFFFF' }} />
                  <span>Vehicle Fitment Finder</span>
                </Link>
              )}

              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                  'Hello DRANparts, I need help finding a part for my car.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#FFFFFF',
                  textDecoration: 'none',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <WhatsAppIcon size={14} />
                <span>VIP Desk: +91 88607 18878</span>
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE HEADER BAR                                                         */}
        {/* ========================================================================= */}
        <div
          className="mobile-header-bar"
          style={{
            background: '#FFFFFF',
            padding: '12px 16px',
            borderBottom: '1px solid #E4E4E7',
            display: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                style={{ background: 'none', border: 'none', color: '#000000', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
              >
                <Menu size={20} />
              </button>
              <button
                type="button"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                style={{ background: 'none', border: 'none', color: '#000000', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
              >
                <Search size={18} />
              </button>
            </div>

            <div>
              <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: '#000000',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '14px',
                  fontFamily: "'Raleway', sans-serif",
                  border: '1px solid #000000',
                  borderRadius: '0px'
                }}>
                  DP
                </div>
                <span style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: 900,
                  fontSize: '19px',
                  letterSpacing: '-0.5px',
                  color: '#000000'
                }}>
                  DRAN<span style={{ color: '#71717A', fontWeight: 700 }}>PARTS</span>
                </span>
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <button
                type="button"
                onClick={customer ? () => logout() : openLoginModal}
                style={{ background: 'none', border: 'none', color: '#000000', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                title={customer ? `Signed in: ${customer.phone}` : 'Sign In'}
              >
                {customer ? <UserCheck size={18} /> : <User size={18} />}
              </button>
              <Link href="/cart" style={{ position: 'relative', color: '#000000', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <ShoppingBag size={18} />
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-8px',
                    background: '#000000',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 800,
                    width: '18px',
                    height: '18px',
                    borderRadius: '0px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {cartCount}
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Search Box */}
          {isMobileSearchOpen && (
            <div style={{ marginTop: '12px' }}>
              <form
                onSubmit={handleSearchSubmit}
                style={{
                  display: 'flex',
                  border: '1.5px solid #000000',
                  borderRadius: '0px',
                  overflow: 'hidden',
                  background: '#FFFFFF',
                }}
              >
                <input
                  type="text"
                  placeholder="Search part name, OEM code or vehicle..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ flex: 1, padding: '10px 14px', border: 'none', outline: 'none', fontSize: '13px' }}
                />
                <button type="submit" style={{ background: '#000000', color: '#FFFFFF', border: 'none', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Search size={16} />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP MAIN NAVIGATION BAR (Trending Capsule & High Contrast)             */}
        {/* ========================================================================= */}
        <div className="desktop-only" style={{ background: '#FFFFFF', padding: '14px 0' }}>
          <div className="auto-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '32px' }}>
              {/* Brand Logo & Name */}
              <div style={{ flexShrink: 0 }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    background: '#000000',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '18px',
                    fontFamily: "'Raleway', sans-serif",
                    border: '1.5px solid #000000',
                    borderRadius: '0px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                  }}>
                    DP
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{
                      fontFamily: "'Raleway', sans-serif",
                      fontWeight: 900,
                      fontSize: '24px',
                      letterSpacing: '-0.5px',
                      color: '#000000',
                      lineHeight: '1.05'
                    }}>
                      DRAN<span style={{ color: '#71717A', fontWeight: 800 }}>PARTS</span>
                    </span>
                    <span style={{
                      fontFamily: "'Lato', sans-serif",
                      fontWeight: 700,
                      fontSize: '9px',
                      letterSpacing: '2.5px',
                      color: '#71717A',
                      textTransform: 'uppercase'
                    }}>
                      OEM LUXURY SPARES
                    </span>
                  </div>
                </Link>
              </div>

              {/* Trending Capsule Search Bar with Quick Filter Pills */}
              <div style={{ flex: 1, maxWidth: '680px' }}>
                <form
                  onSubmit={handleSearchSubmit}
                  style={{
                    display: 'flex',
                    background: '#FAFAFA',
                    borderRadius: '0px',
                    border: '1.5px solid #E4E4E7',
                    padding: '3px 4px 3px 18px',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#000000';
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.06)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#E4E4E7';
                    e.currentTarget.style.background = '#FAFAFA';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.02)';
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search 2,524+ parts by Name, OEM Number (e.g. 8KD941005B), or Model..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      flex: 1,
                      border: 'none',
                      background: 'transparent',
                      padding: '10px 8px 10px 0',
                      fontSize: '13px',
                      outline: 'none',
                      color: '#000000',
                      fontFamily: "'Lato', sans-serif",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#000000',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '0px',
                      padding: '10px 22px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: 800,
                      fontSize: '12px',
                      letterSpacing: '0.8px',
                      fontFamily: "'Raleway', sans-serif",
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#27272A')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = '#000000')}
                  >
                    <Search size={13} />
                    <span>SEARCH</span>
                  </button>
                </form>

                {/* Trending Search Chips */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', paddingLeft: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#71717A', fontWeight: 600, fontFamily: "'Raleway', sans-serif" }}>
                    Popular:
                  </span>
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearch(term);
                        router.push(`/shop?search=${encodeURIComponent(term)}`);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontSize: '11px',
                        color: '#52525B',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        textUnderlineOffset: '3px',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#000000')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#52525B')}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Badges: Admin, User Account, Shopping Bag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                {/* Track Order Capsule */}
                <Link
                  href="/shop"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '8px 14px',
                    borderRadius: '0px',
                    background: '#F4F4F5',
                    border: '1px solid #E4E4E7',
                    textDecoration: 'none',
                    color: '#18181B',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#000000';
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.borderColor = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#F4F4F5';
                    e.currentTarget.style.color = '#18181B';
                    e.currentTarget.style.borderColor = '#E4E4E7';
                  }}
                  title="Track Order & Logistics Status"
                >
                  <Truck size={14} />
                  <span style={{ fontSize: '12px', fontWeight: 800, fontFamily: "'Raleway', sans-serif" }}>
                    Track Order
                  </span>
                </Link>

                {/* Customer Account / OTP Login */}
                <div
                  onClick={customer ? () => logout() : openLoginModal}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    borderRadius: '0px',
                    background: customer ? '#000000' : '#F4F4F5',
                    border: '1px solid #E4E4E7',
                    cursor: 'pointer',
                    color: customer ? '#FFFFFF' : '#000000',
                    transition: 'all 0.2s',
                  }}
                  title={customer ? `Logged in: +91 ${customer.phone}. Click to sign out.` : 'Sign In with Mobile OTP'}
                >
                  {customer ? <UserCheck size={14} /> : <User size={14} />}
                  <span style={{ fontSize: '12px', fontWeight: 700, fontFamily: "'Raleway', sans-serif" }}>
                    {customer ? (customer.name ? customer.name.split(' ')[0] : `+91 ${customer.phone.slice(-4)}`) : 'Sign In'}
                  </span>
                </div>

                {/* Shopping Bag Capsule */}
                <Link
                  href="/cart"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 16px',
                    borderRadius: '0px',
                    background: '#000000',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#27272A')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#000000')}
                >
                  <ShoppingBag size={15} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, fontFamily: "'Raleway', sans-serif", letterSpacing: '0.5px' }}>
                      BAG
                    </span>
                    <span
                      style={{
                        background: '#FFFFFF',
                        color: '#000000',
                        fontSize: '11px',
                        fontWeight: 900,
                        padding: '1px 6px',
                        borderRadius: '0px',
                      }}
                    >
                      {cartCount}
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECONDARY NAVIGATION STRIP (Categories & Quick Makes)                      */}
        {/* ========================================================================= */}
        <div
          className="desktop-only"
          style={{
            background: '#FFFFFF',
            borderTop: '1px solid #F4F4F5',
            padding: '4px 0',
          }}
        >
          <div className="auto-container">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Category Dropdown Trigger */}
              <div
                onMouseEnter={() => setIsCatMenuOpen(true)}
                onMouseLeave={() => setIsCatMenuOpen(false)}
                style={{ position: 'relative' }}
              >
                <div
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    background: '#000000',
                    color: '#FFFFFF',
                    padding: '9px 18px',
                    borderRadius: '0px',
                    fontWeight: 800,
                    fontSize: '12px',
                    letterSpacing: '0.6px',
                    fontFamily: "'Raleway', sans-serif",
                    transition: 'all 0.2s',
                  }}
                >
                  <Layers size={13} />
                  <span>BROWSE CATEGORIES</span>
                  <ChevronDown size={11} style={{ marginLeft: '4px' }} />
                </div>

                {isCatMenuOpen && (
                  <ul
                    style={{
                      display: 'block',
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      width: '290px',
                      background: '#FFFFFF',
                      border: '1px solid #E4E4E7',
                      borderRadius: '0px',
                      boxShadow: '0 16px 36px rgba(0, 0, 0, 0.1)',
                      zIndex: 99999,
                      listStyle: 'none',
                      padding: '10px 0',
                      margin: '6px 0 0',
                    }}
                  >
                    {categories.slice(0, 10).map((cat) => (
                      <li key={cat.id || cat.slug} style={{ borderBottom: '1px solid #F4F4F5' }}>
                        <Link
                          href={`/shop?category=${cat.slug || cat.id}`}
                          style={{
                            display: 'block',
                            padding: '9px 20px',
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
                          fontWeight: 800,
                          fontSize: '12px',
                          textDecoration: 'none',
                          fontFamily: "'Raleway', sans-serif",
                          letterSpacing: '0.5px',
                        }}
                      >
                        VIEW FULL 2,500+ CATALOG →
                      </Link>
                    </li>
                  </ul>
                )}
              </div>

              {/* Direct Brand Links & Features */}
              <nav style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
                <Link
                  href="/shop"
                  style={{
                    color: '#000000',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  All Spares
                </Link>

                <div
                  onMouseEnter={() => setIsMakeMenuOpen(true)}
                  onMouseLeave={() => setIsMakeMenuOpen(false)}
                  style={{ position: 'relative' }}
                >
                  <span
                    style={{
                      cursor: 'pointer',
                      color: '#000000',
                      fontWeight: 700,
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontFamily: "'Raleway', sans-serif",
                    }}
                  >
                    <span>Luxury Makes</span>
                    <ChevronDown size={11} />
                  </span>

                  {isMakeMenuOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        width: '320px',
                        background: '#FFFFFF',
                        border: '1px solid #E4E4E7',
                        borderRadius: '0px',
                        boxShadow: '0 16px 36px rgba(0, 0, 0, 0.1)',
                        zIndex: 99999,
                        padding: '16px',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        marginTop: '6px',
                      }}
                    >
                      {siteConfig.supportedMakes.slice(0, 10).map((make) => (
                        <Link
                          key={make}
                          href={`/shop?make=${encodeURIComponent(make)}`}
                          style={{
                            color: '#18181B',
                            textDecoration: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                            padding: '6px 10px',
                            borderRadius: '0px',
                            transition: 'all 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#F4F4F5';
                            e.currentTarget.style.color = '#000000';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#18181B';
                          }}
                        >
                          {make}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link
                  href="/#car-explorer"
                  style={{
                    color: '#000000',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    fontFamily: "'Raleway', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Box size={14} style={{ color: '#000000' }} />
                  <span>360° Car Explorer</span>
                </Link>

                <Link
                  href="/about"
                  style={{
                    color: '#52525B',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '13px',
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  Noida Facility
                </Link>

                <Link
                  href="/contact"
                  style={{
                    color: '#52525B',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '13px',
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  Contact Desk
                </Link>
              </nav>

              {/* Verified Pincode Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    background: '#F4F4F5',
                    border: '1px solid #E4E4E7',
                    borderRadius: '0px',
                    padding: '4px 12px',
                    fontSize: '11px',
                    color: '#000000',
                    fontWeight: 700,
                    fontFamily: "'Raleway', sans-serif",
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Truck size={14} style={{ color: '#000000' }} />
                  <span>Pan-India 2-4 Days Air Delivery</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE DRAWER MENU                                                        */}
      {/* ========================================================================= */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            zIndex: 999999,
            display: 'flex',
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '85%',
              maxWidth: '360px',
              height: '100%',
              background: '#FFFFFF',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '4px 0 25px rgba(0, 0, 0, 0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    background: '#000000',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '14px',
                    fontFamily: "'Raleway', sans-serif",
                    borderRadius: '0px'
                  }}>
                    DP
                  </div>
                  <span style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 900, fontSize: '19px', color: '#000000' }}>
                    DRAN<span style={{ color: '#71717A', fontWeight: 700 }}>PARTS</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#000000', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ color: '#000000', fontSize: '15px', fontWeight: 800, textDecoration: 'none', fontFamily: "'Raleway', sans-serif" }}
                >
                  Home
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ color: '#000000', fontSize: '15px', fontWeight: 800, textDecoration: 'none', fontFamily: "'Raleway', sans-serif" }}
                >
                  Browse All 2,524+ Parts
                </Link>
                <Link
                  href="/#car-explorer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ color: '#000000', fontSize: '15px', fontWeight: 800, textDecoration: 'none', fontFamily: "'Raleway', sans-serif" }}
                >
                  360° Car Explorer
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ color: '#000000', fontSize: '15px', fontWeight: 800, textDecoration: 'none', fontFamily: "'Raleway', sans-serif" }}
                >
                  About Our Facility
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{ color: '#000000', fontSize: '15px', fontWeight: 800, textDecoration: 'none', fontFamily: "'Raleway', sans-serif" }}
                >
                  Contact Desk
                </Link>
              </nav>
            </div>

            <div style={{ borderTop: '1px solid #E4E4E7', paddingTop: '20px' }}>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '0px',
                  background: '#000000',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '13px',
                  fontFamily: "'Raleway', sans-serif",
                  textDecoration: 'none',
                }}
              >
                <WhatsAppIcon size={16} />
                <span>WhatsApp Fitment Desk</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
