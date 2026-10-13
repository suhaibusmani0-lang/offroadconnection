'use client';

import React from 'react';
import Link from 'next/link';
import siteConfig from '@/config/site';
import { ShieldCheck, Phone, Lock, MapPin, Clock, Plane, ExternalLink } from 'lucide-react';

const WhatsAppIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={{ display: 'inline-block' }}>
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.004.577 1.764.846 2.806.847h.005c3.182 0 5.768-2.587 5.768-5.766.001-3.18-2.584-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.824 0-3.535-.49-5.012-1.344l-5.988 1.569 1.6-5.836c-.958-1.536-1.5-3.351-1.5-5.275 0-5.514 4.486-10 10-10 5.514 0 10 4.486 10 10z" />
  </svg>
);

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block' }}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function OriginalFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="main-footer"
      style={{
        background: '#0A0A0A',
        borderTop: '1px solid #27272A',
        color: '#A1A1AA',
        fontFamily: "'Lato', sans-serif",
      }}
    >
      {/* Top Concierge & VIP Fitment Strip */}
      <div
        style={{
          borderBottom: '1px solid #1C1C1E',
          background: '#121212',
          padding: '24px 0',
        }}
      >
        <div className="auto-container">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  background: '#1C1C1E',
                  border: '1px solid #27272A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '18px',
                }}
              >
                <ShieldCheck size={20} className="text-white" />
              </div>
              <div>
                <h4
                  style={{
                    color: '#FFFFFF',
                    fontSize: '15px',
                    fontWeight: 800,
                    margin: 0,
                    fontFamily: "'Raleway', sans-serif",
                    letterSpacing: '0.3px',
                  }}
                >
                  Need OEM Fitment Verification or Hard-to-Find European Spares?
                </h4>
                <p style={{ color: '#71717A', fontSize: '13px', margin: '2px 0 0' }}>
                  Our senior parts specialists in Noida verify chassis &amp; VIN numbers before dispatch.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                  'Hello Off Road Connection Parts, I need help verifying part fitment for my vehicle.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  color: '#000000',
                  fontWeight: 800,
                  fontSize: '13px',
                  fontFamily: "'Raleway', sans-serif",
                  letterSpacing: '0.5px',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#E4E4E7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#FFFFFF';
                }}
              >
                <WhatsAppIcon size={16} />
                <span>Direct WhatsApp Fitment Desk</span>
              </a>

              <a
                href={`tel:${siteConfig.contact.phone}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: '#1C1C1E',
                  border: '1px solid #27272A',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  fontFamily: "'Raleway', sans-serif",
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#27272A';
                }}
              >
                <Phone size={13} className="text-white" />
                <span>{siteConfig.contact.phoneFormatted}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Widget Area */}
      <div className="auto-container" style={{ padding: '60px 15px 40px' }}>
        <div className="row clearfix" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px 0' }}>
          {/* Column 1: Brand Info & Bio */}
          <div className="col-lg-4 col-md-6 col-sm-12 footer-column">
            <div className="footer-widget logo-widget" style={{ paddingRight: '20px' }}>
              <figure className="footer-logo" style={{ marginBottom: '18px' }}>
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img
                    src="/assets/images/mv-logo-1.png"
                    alt="Off Road Connection Parts"
                    style={{ maxHeight: '48px', filter: 'brightness(0) invert(1)' }}
                  />
                </Link>
              </figure>
              <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#71717A', marginBottom: '20px' }}>
                {siteConfig.description}
              </p>

              {/* Social Channels */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.8px',
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  Follow:
                </span>
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: '#18181B',
                    border: '1px solid #27272A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.color = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#18181B';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                >
                  <InstagramIcon size={16} />
                </a>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: '#18181B',
                    border: '1px solid #27272A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FFFFFF';
                    e.currentTarget.style.color = '#000000';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#18181B';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                >
                  <WhatsAppIcon size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Supported Luxury Brands */}
          <div className="col-lg-2 col-md-6 col-sm-12 footer-column">
            <div className="footer-widget links-widget">
              <div className="widget-title" style={{ marginBottom: '18px' }}>
                <h4
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  Luxury Brands
                </h4>
              </div>
              <div className="widget-content">
                <ul className="links-list clearfix" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {siteConfig.supportedMakes.slice(0, 7).map((make) => (
                    <li key={make} style={{ marginBottom: '10px' }}>
                      <Link
                        href={`/shop?make=${encodeURIComponent(make)}`}
                        style={{
                          color: '#71717A',
                          textDecoration: 'none',
                          fontSize: '13px',
                          transition: 'all 0.2s',
                          display: 'inline-block',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#FFFFFF';
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#71717A';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        {make} Genuine Spares
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Column 3: Quick Navigation */}
          <div className="col-lg-3 col-md-6 col-sm-12 footer-column">
            <div className="footer-widget links-widget">
              <div className="widget-title" style={{ marginBottom: '18px' }}>
                <h4
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  Store &amp; Services
                </h4>
              </div>
              <div className="widget-content">
                <ul className="links-list clearfix" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  <li style={{ marginBottom: '10px' }}>
                    <Link href="/shop" style={{ color: '#71717A', textDecoration: 'none', fontSize: '13px' }}>
                      Browse All 2,500+ Spares
                    </Link>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <Link href="/#car-explorer" style={{ color: '#71717A', textDecoration: 'none', fontSize: '13px' }}>
                      360° Interactive Car Explorer
                    </Link>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <Link href="/about" style={{ color: '#71717A', textDecoration: 'none', fontSize: '13px' }}>
                      About Our Noida Facility
                    </Link>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <Link href="/contact" style={{ color: '#71717A', textDecoration: 'none', fontSize: '13px' }}>
                      Technical Fitment &amp; Enquiry Desk
                    </Link>
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <Link href="/cart" style={{ color: '#71717A', textDecoration: 'none', fontSize: '13px' }}>
                      Shopping Bag &amp; Checkout
                    </Link>
                  </li>
                  <li style={{ marginTop: '16px' }}>
                    <Link
                      href="/admin"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 14px',
                        background: '#18181B',
                        border: '1px solid #27272A',
                        color: '#FFFFFF',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.6px',
                        fontFamily: "'Raleway', sans-serif",
                        textDecoration: 'none',
                      }}
                    >
                      <Lock size={12} style={{ marginRight: '6px' }} />
                      <span>Enterprise CRM &amp; Inventory Suite</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Facility Desk */}
          <div className="col-lg-3 col-md-6 col-sm-12 footer-column">
            <div className="footer-widget contact-widget">
              <div className="widget-title" style={{ marginBottom: '18px' }}>
                <h4
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    fontFamily: "'Raleway', sans-serif",
                  }}
                >
                  Central Distribution
                </h4>
              </div>
              <div className="widget-content">
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#71717A', marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                  <MapPin size={15} style={{ color: '#FFFFFF', marginRight: '8px', flexShrink: 0, marginTop: '2px' }} />
                  <span>{siteConfig.geo.address.streetAddress}, {siteConfig.geo.address.addressLocality} {siteConfig.geo.address.postalCode}</span>
                </p>
                <p style={{ fontSize: '13px', color: '#71717A', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                  <Phone size={14} style={{ color: '#FFFFFF', marginRight: '8px', flexShrink: 0 }} />
                  <a href={`tel:${siteConfig.contact.phone}`} style={{ color: '#FFFFFF', fontWeight: 700, textDecoration: 'none' }}>
                    {siteConfig.contact.phoneFormatted}
                  </a>
                </p>
                <p style={{ fontSize: '13px', color: '#71717A', marginBottom: '14px', display: 'flex', alignItems: 'center' }}>
                  <Clock size={14} style={{ color: '#FFFFFF', marginRight: '8px', flexShrink: 0 }} />
                  <span>Mon – Sat: 9:30 AM – 7:30 PM IST</span>
                </p>

                <div
                  style={{
                    background: '#18181B',
                    border: '1px solid #27272A',
                    borderRadius: '8px',
                    padding: '12px 14px',
                    fontSize: '11px',
                    color: '#FFFFFF',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <Plane size={14} style={{ color: '#FFFFFF', flexShrink: 0 }} />
                  <span>Pan-India Air Logistics • 19,000+ PIN Codes Serviceable</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM STRIP: COPYRIGHT, DEVELOPED BY ZARNETIC & DISCLAIMER               */}
        {/* ========================================================================= */}
        <div
          className="footer-bottom"
          style={{
            marginTop: '50px',
            paddingTop: '25px',
            borderTop: '1px solid #27272A',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
            fontSize: '12px',
            color: '#71717A',
          }}
        >
          {/* Left: Copyright */}
          <div style={{ margin: 0 }}>
            © {currentYear} {siteConfig.legalName}. All rights reserved.
          </div>

          {/* Center / Highlight: DEVELOPED BY ZARNETIC */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span style={{ fontSize: '12px', color: '#71717A', fontWeight: 500 }}>
              Engineered &amp; Developed By
            </span>
            <a
              href="https://www.zarnetic.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '20px',
                background: '#18181B',
                border: '1.5px solid #3F3F46',
                color: '#FFFFFF',
                fontWeight: 900,
                fontSize: '12px',
                fontFamily: "'Raleway', sans-serif",
                letterSpacing: '1px',
                textDecoration: 'none',
                boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.color = '#000000';
                e.currentTarget.style.borderColor = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#18181B';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.borderColor = '#3F3F46';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
              }}
            >
              <span>ZARNETIC</span>
              <ExternalLink size={11} />
            </a>
          </div>

          {/* Right: Trademark fair use disclaimer */}
          <div style={{ margin: 0, fontSize: '11px', color: '#52525B', maxWidth: '420px', textAlign: 'right' }}>
            Brand names &amp; OEM badges (Audi, BMW, Mercedes, Porsche, Range Rover) are cited strictly for fitment identification under Indian fair use.
          </div>
        </div>
      </div>
    </footer>
  );
}
