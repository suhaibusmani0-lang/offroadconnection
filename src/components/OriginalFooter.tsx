'use client';

import React from 'react';
import Link from 'next/link';
import siteConfig from '@/config/site';

export default function OriginalFooter() {
  return (
    <footer className="main-footer" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', color: '#475569' }}>
      <div className="auto-container" style={{ padding: '70px 15px 40px' }}>
        <div className="widget-section">
          <div className="row clearfix" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px 0' }}>
            {/* Column 1: Brand Info & Bio */}
            <div className="col-lg-4 col-md-6 col-sm-12 footer-column">
              <div className="footer-widget logo-widget" style={{ paddingRight: '20px' }}>
                <figure className="footer-logo" style={{ marginBottom: '20px' }}>
                  <Link href="/">
                    <img src="/assets/images/mv-logo-1.png" alt="Off Road Connection Parts" style={{ maxHeight: '55px' }} />
                  </Link>
                </figure>
                <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#64748B', marginBottom: '20px' }}>
                  {siteConfig.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', textTransform: 'uppercase' }}>
                    Follow Us:
                  </span>
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#C5A059',
                      textDecoration: 'none',
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
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#25D366',
                      textDecoration: 'none',
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
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Luxury Brands
                  </h4>
                </div>
                <div className="widget-content">
                  <ul className="links-list clearfix" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {siteConfig.supportedMakes.slice(0, 6).map((make) => (
                      <li key={make} style={{ marginBottom: '9px' }}>
                        <Link
                          href={`/shop?make=${encodeURIComponent(make)}`}
                          style={{ color: '#64748B', textDecoration: 'none', fontSize: '13px', transition: 'color 0.2s' }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#C5A059')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
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
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Quick Links
                  </h4>
                </div>
                <div className="widget-content">
                  <ul className="links-list clearfix" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '9px' }}><Link href="/shop" style={{ color: '#64748B', textDecoration: 'none', fontSize: '13px' }}>All Automotive Spares</Link></li>
                    <li style={{ marginBottom: '9px' }}><Link href="/about" style={{ color: '#64748B', textDecoration: 'none', fontSize: '13px' }}>About Our Facility</Link></li>
                    <li style={{ marginBottom: '9px' }}><Link href="/contact" style={{ color: '#64748B', textDecoration: 'none', fontSize: '13px' }}>Customer Support</Link></li>
                    <li style={{ marginBottom: '9px' }}><Link href="/cart" style={{ color: '#64748B', textDecoration: 'none', fontSize: '13px' }}>View Shopping Cart</Link></li>
                    <li style={{ marginTop: '14px' }}>
                      <a
                        href="http://localhost:8000/admin/login.php"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '7px 14px',
                          background: '#0F172A',
                          color: '#FFFFFF',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 700,
                          textDecoration: 'none',
                        }}
                      >
                        <i className="fas fa-lock" style={{ color: '#C5A059' }}></i>
                        <span>Admin Portal</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Column 4: Contact & Local GEO info */}
            <div className="col-lg-3 col-md-6 col-sm-12 footer-column">
              <div className="footer-widget contact-widget">
                <div className="widget-title" style={{ marginBottom: '18px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Noida Facility & Desk
                  </h4>
                </div>
                <div className="widget-content">
                  <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#64748B', marginBottom: '12px' }}>
                    <i className="fas fa-map-marker-alt" style={{ color: '#C5A059', marginRight: '8px' }}></i>
                    {siteConfig.geo.address.streetAddress}, {siteConfig.geo.address.addressLocality} {siteConfig.geo.address.postalCode}
                  </p>
                  <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '8px' }}>
                    <i className="fas fa-phone-alt" style={{ color: '#C5A059', marginRight: '8px' }}></i>
                    <a href={`tel:${siteConfig.contact.phone}`} style={{ color: '#0F172A', fontWeight: 700, textDecoration: 'none' }}>
                      {siteConfig.contact.phoneFormatted}
                    </a>
                  </p>
                  <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '12px' }}>
                    <i className="fas fa-clock" style={{ color: '#C5A059', marginRight: '8px' }}></i>
                    Mon - Sat: 9:30 AM - 7:30 PM IST
                  </p>
                  <div
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      fontSize: '11px',
                      color: '#15803D',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <i className="fas fa-shield-check" style={{ fontSize: '14px' }}></i>
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
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
            fontSize: '12px',
            color: '#94A3B8',
          }}
        >
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <p style={{ margin: 0, fontSize: '11px', color: '#94A3B8', maxWidth: '650px', textAlign: 'right' }}>
            Disclaimer: Vehicle brand names and models (Audi, BMW, Mercedes-Benz, Porsche, Land Rover, etc.) are cited strictly for identification of part compatibility and fitment under Indian trademark fair usage principles.
          </p>
        </div>
      </div>
    </footer>
  );
}
