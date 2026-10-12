'use client';

import React from 'react';
import Link from 'next/link';

export default function OriginalFooter() {
  return (
    <footer className="main-footer">
      <div className="auto-container">
        <div className="widget-section">
          <div className="row clearfix">
            <div className="col-lg-4 col-md-6 col-sm-12 footer-column">
              <div className="footer-widget logo-widget">
                <figure className="footer-logo">
                  <Link href="/">
                    <img src="/assets/images/mv-logo-1.png" alt="Off Road Connection Parts" />
                  </Link>
                </figure>
                <p>
                  Off Road Connection Parts is your trusted destination for genuine auto spare parts. We
                  provide OEM-quality products, affordable prices, and fast delivery, ensuring every vehicle
                  owner gets reliable solutions and unmatched customer satisfaction nationwide.
                </p>
                <ul className="social-links">
                  <li><a href="#"><i className="fab fa-facebook-f"></i></a></li>
                  <li><a href="#"><i className="fab fa-twitter"></i></a></li>
                  <li><a href="https://www.instagram.com/mv.spareshub"><i className="fab fa-instagram"></i></a></li>
                  <li><a href="#"><i className="fab fa-linkedin-in"></i></a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-2 col-md-6 col-sm-12 footer-column">
              <div className="footer-widget links-widget">
                <div className="widget-title">
                  <h4>Our Links</h4>
                </div>
                <div className="widget-content">
                  <ul className="links-list clearfix">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/shop">Shop</Link></li>
                    <li><Link href="/contact">Contact Us</Link></li>
                    <li><Link href="/cart">Shopping Cart</Link></li>
                    <li>
                      <a href="http://localhost:8000/admin/login.php" target="_blank" rel="noopener noreferrer" style={{ color: '#FF6B00', fontWeight: 600 }}>
                        <i className="fas fa-user-shield" style={{ marginRight: '6px' }}></i> Admin Portal
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 footer-column">
              <div className="footer-widget links-widget">
                <div className="widget-title">
                  <h4>Customer Care</h4>
                </div>
                <div className="widget-content">
                  <ul className="links-list clearfix">
                    <li><Link href="/contact">Support & Inquiries</Link></li>
                    <li><Link href="/shop">Genuine Auto Spares</Link></li>
                    <li><a href="https://wa.me/918860718878">WhatsApp Orders</a></li>
                  </ul>
                  <div style={{ marginTop: '18px' }}>
                    <a
                      href="http://localhost:8000/admin/login.php"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'linear-gradient(135deg, #FF6B00 0%, #e65e00 100%)',
                        color: '#fff',
                        padding: '9px 18px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        boxShadow: '0 4px 10px rgba(255, 107, 0, 0.3)',
                        transition: '0.2s',
                      }}
                    >
                      <i className="fas fa-lock"></i>
                      <span>Inventory & Order CRM</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 footer-column">
              <div className="footer-widget contact-widget">
                <div className="widget-title">
                  <h4>Contact Info</h4>
                </div>
                <div className="widget-content">
                  <p>
                    <i className="fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i>
                    Plot 2, Opp Asgarpur park, kharsa Number 307 Asgarpur jaagir sector 128 Noida 201301
                  </p>
                  <ul className="info mb_25 clearfix" style={{ listStyle: 'none', paddingLeft: 0 }}>
                    <li>
                      <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
                      <a href="mailto:info@offroadconnectionparts.com">info@offroadconnectionparts.com</a>
                    </li>
                    <li>
                      <i className="fas fa-phone" style={{ marginRight: '8px' }}></i>
                      <a href="tel:8860718878">8860718878</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="auto-container">
          <div
            className="d-flex justify-content-between align-items-center flex-wrap"
            style={{ padding: '15px 0' }}
          >
            <div className="copyright">
              <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>
                Copyright © 2025-2026 <b>Off Road Connection Parts</b>. All Rights Reserved.
              </p>
            </div>
            <div className="admin-portal-link" style={{ marginTop: '5px' }}>
              <a
                href="http://localhost:8000/admin/login.php"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#1a1a1a',
                  color: '#fff',
                  border: '1px solid #333',
                  padding: '7px 16px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: '0.3s',
                }}
                onMouseOver={(e: any) => {
                  e.currentTarget.style.background = '#FF6B00';
                  e.currentTarget.style.borderColor = '#FF6B00';
                }}
                onMouseOut={(e: any) => {
                  e.currentTarget.style.background = '#1a1a1a';
                  e.currentTarget.style.borderColor = '#333';
                }}
              >
                <i className="fas fa-user-shield" style={{ color: '#FF6B00', fontSize: '13px' }}></i>
                <span>Admin Login (Inventory, Orders & CRM)</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

