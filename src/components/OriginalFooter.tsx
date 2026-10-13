'use client';

import React from 'react';
import Link from 'next/link';
import siteConfig from '@/config/site';

export default function OriginalFooter() {
  return (
    <footer className="main-footer" style={{ background: '#0A0A0A', borderTop: '1px solid #27272A', color: '#A1A1AA' }}>
      <div className="auto-container" style={{ padding: '70px 15px 40px' }}>
        <div className="widget-section">
          <div className="row clearfix" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px 0' }}>
            {/* Column 1: Brand Info & Bio */}
            <div className="col-lg-4 col-md-6 col-sm-12 footer-column">
              <div className="footer-widget logo-widget" style={{ paddingRight: '20px' }}>
                <figure className="footer-logo" style={{ marginBottom: '20px' }}>
                  <Link href="/">
                    <img src="/assets/images/mv-logo-1.png" alt="Off Road Connection Parts" style={{ maxHeight: '52px', filter: 'brightness(0) invert(1)' }} />
                  </Link>
                </figure>
                <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#71717A', marginBottom: '20px' }}>
                  {siteConfig.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '0.8px', fontFamily: "'Raleway', sans-serif" }}>
                    Follow Us:
                  </span>
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
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
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a
                    href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '6px',
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
                    <i className="fab fa-whatsapp"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Column 2: Supported Makes */}
            <div className="col-lg-2 col-md-6 col-sm-12 footer-column">
              <div className="footer-widget links-widget">
                <div className="widget-title" style={{ marginBottom: '18px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Raleway', sans-serif" }}>
                    Luxury Brands
                  </h4>
                </div>
                <div className="widget-content">
                  <ul className="links-list clearfix" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {siteConfig.supportedMakes.slice(0, 6).map((make) => (
                      <li key={make} style={{ marginBottom: '9px' }}>
                        <Link
                          href={`/shop?make=${encodeURIComponent(make)}`}
                          style={{ color: '#71717A', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#71717A')}
                        >
                          {make} Spares
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Column 3: Quick Navigation & Services */}
            <div className="col-lg-3 col-md-6 col-sm-12 footer-column">
              <div className="footer-widget links-widget">
                <div className="widget-title" style={{ marginBottom: '18px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Raleway', sans-serif" }}>
                    Quick Links
                  </h4>
                </div>
                <div className="widget-content">
                  <ul className="links-list clearfix" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '9px' }}><Link href="/shop" style={{ color: '#71717A', textDecoration: 'none', fontSize: '13px' }}>All Automotive Spares</Link></li>
                    <li style={{ marginBottom: '9px' }}><Link href="/about" style={{ color: '#71717A', textDecoration: 'none', fontSize: '13px' }}>About Our Facility</Link></li>
                    <li style={{ marginBottom: '9px' }}><Link href="/contact" style={{ color: '#71717A', textDecoration: 'none', fontSize: '13px' }}>Customer Support</Link></li>
                    <li style={{ marginBottom: '9px' }}><Link href="/cart" style={{ color: '#71717A', textDecoration: 'none', fontSize: '13px' }}>View Shopping Bag</Link></li>
                    <li style={{ marginTop: '14px' }}>
                      <Link
                        href="/admin"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
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
                        <i className="fas fa-lock"></i>
                        <span>Admin CRM Suite</span>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Column 4: Contact & Local GEO info */}
            <div className="col-lg-3 col-md-6 col-sm-12 footer-column">
              <div className="footer-widget contact-widget">
                <div className="widget-title" style={{ marginBottom: '18px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Raleway', sans-serif" }}>
                    Noida Facility & Desk
                  </h4>
                </div>
                <div className="widget-content">
                  <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#71717A', marginBottom: '12px' }}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#FFFFFF', marginRight: '8px' }}></i>
                    {siteConfig.geo.address.streetAddress}, {siteConfig.geo.address.addressLocality} {siteConfig.geo.address.postalCode}
                  </p>
                  <p style={{ fontSize: '13px', color: '#71717A', marginBottom: '8px' }}>
                    <i className="fas fa-phone-alt" style={{ color: '#FFFFFF', marginRight: '8px' }}></i>
                    <a href={`tel:${siteConfig.contact.phone}`} style={{ color: '#FFFFFF', fontWeight: 700, textDecoration: 'none' }}>
                      {siteConfig.contact.phoneFormatted}
                    </a>
                  </p>
                  <p style={{ fontSize: '13px', color: '#71717A', marginBottom: '12px' }}>
                    <i className="fas fa-clock" style={{ color: '#FFFFFF', marginRight: '8px' }}></i>
                    Mon - Sat: 9:30 AM - 7:30 PM IST
                  </p>
                  <div
                    style={{
                      background: '#18181B',
                      border: '1px solid #27272A',
                      borderRadius: '6px',
                      padding: '10px 14px',
                      fontSize: '11px',
                      color: '#FFFFFF',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <i className="fas fa-shield-alt"></i>
                    <span>Authorized Fitment & Pan-India Dispatch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div
          className="footer-bottom"
          style={{
            marginTop: '50px',
            paddingTop: '25px',
            borderTop: '1px solid #1F2937',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
            fontSize: '12px',
            color: '#71717A',
          }}
        >
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#52525B', maxWidth: '650px', textAlign: 'right' }}>
            Disclaimer: Vehicle brand names and models (Audi, BMW, Mercedes-Benz, Porsche, Land Rover, etc.) are cited strictly for identification of part compatibility and fitment under Indian trademark fair usage principles.
          </p>
        </div>
      </div>
    </footer>
  );
}
