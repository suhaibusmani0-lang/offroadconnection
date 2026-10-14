'use client';

import React from 'react';
import Link from 'next/link';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';
import siteConfig from '@/config/site';

export default function AboutPage() {
  return (
    <>
      <OriginalHeader />

      {/* Breadcrumb Strip */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '16px 0' }}>
        <div className="auto-container">
          <div className="luxury-breadcrumb" style={{ padding: 0 }}>
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">About Us</span>
          </div>
        </div>
      </section>

      {/* Executive Intro Section */}
      <section style={{ padding: '70px 0', background: '#FAFBFC' }}>
        <div className="auto-container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 content-column" style={{ marginBottom: '30px' }}>
              <div style={{ paddingRight: '20px' }}>
                <span style={{ color: '#000000', fontWeight: 800, fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Raleway', sans-serif" }}>
                  OUR HERITAGE & PHILOSOPHY
                </span>
                <h1
                  style={{
                    fontSize: '36px',
                    fontWeight: 900,
                    color: '#000000',
                    fontFamily: "'Raleway', sans-serif",
                    marginTop: '8px',
                    lineHeight: '1.3',
                    marginBottom: '20px',
                  }}
                >
                  India’s Specialist for <span style={{ color: '#52525B' }}>Luxury & 4x4</span> Automotive Spares
                </h1>
                <p style={{ color: '#52525B', lineHeight: '1.8', fontSize: '15px', marginBottom: '16px', fontFamily: "'Lato', sans-serif" }}>
                  Founded on a passion for precision automotive engineering, <strong>DRANparts</strong> is India’s foremost independent distributor of genuine OEM and certified replacement parts for Audi, BMW, Mercedes-Benz, Porsche, Range Rover, Land Rover, Jaguar, and heavy-duty 4x4 vehicles.
                </p>
                <p style={{ color: '#52525B', lineHeight: '1.8', fontSize: '15px', marginBottom: '28px', fontFamily: "'Lato', sans-serif" }}>
                  Operating from our primary distribution facility in Sector 128, Noida, Uttar Pradesh, every part in our 2,500+ product catalog undergoes strict chassis-compatibility and VIN verification before dispatch, guaranteeing that vehicle owners and automotive workshops receive the exact component required without guesswork.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                  <div className="luxury-card" style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: '0px' }}>
                    <div style={{ color: '#000000', fontSize: '24px', marginBottom: '10px' }}>
                      <i className="fas fa-certificate"></i>
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#000000', marginBottom: '6px', fontFamily: "'Raleway', sans-serif" }}>
                      100% Genuine OEM
                    </h4>
                    <p style={{ color: '#71717A', fontSize: '12px', margin: 0, fontFamily: "'Lato', sans-serif" }}>
                      Sourced strictly from certified automotive component manufacturers.
                    </p>
                  </div>

                  <div className="luxury-card" style={{ padding: '20px', background: '#FFFFFF', border: '1px solid #E4E4E7', borderRadius: '0px' }}>
                    <div style={{ color: '#000000', fontSize: '24px', marginBottom: '10px' }}>
                      <i className="fas fa-truck-moving"></i>
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#000000', marginBottom: '6px', fontFamily: "'Raleway', sans-serif" }}>
                      Express Dispatch
                    </h4>
                    <p style={{ color: '#71717A', fontSize: '12px', margin: 0, fontFamily: "'Lato', sans-serif" }}>
                      Air logistics network covering all 19,000+ Indian pincodes in 2-5 days.
                    </p>
                  </div>
                </div>

                <div>
                  <Link href="/shop" className="btn-luxury-primary" style={{ textDecoration: 'none', borderRadius: '0px' }}>
                    <span>BROWSE PARTS CATALOG</span>
                    <i className="fas fa-arrow-right" style={{ fontSize: '12px' }}></i>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-12">
              <div
                className="luxury-card"
                style={{
                  padding: '16px',
                  background: '#FFFFFF',
                  borderRadius: '0px',
                  border: '1px solid #E4E4E7',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/assets/images/banner/banner-1.jpg"
                  alt="DRANparts Facility"
                  style={{ width: '100%', borderRadius: '0px', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facility & Customer Assurance */}
      <section style={{ padding: '70px 0', background: '#FFFFFF', borderTop: '1px solid #E4E4E7' }}>
        <div className="auto-container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          <span style={{ color: '#000000', fontWeight: 800, fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', fontFamily: "'Raleway', sans-serif" }}>
            FACILITY & LOGISTICS
          </span>
          <h2 style={{ fontSize: '30px', fontWeight: 900, color: '#000000', fontFamily: "'Raleway', sans-serif", margin: '8px 0 20px' }}>
            Noida Central Warehouse & Distribution Desk
          </h2>
          <p style={{ color: '#52525B', fontSize: '15px', lineHeight: '1.8', marginBottom: '30px', fontFamily: "'Lato', sans-serif" }}>
            Located strategically in Sector 128 Noida, our facility maintains active stocks of complex lighting assemblies, electronic modules, air suspension struts, braking components, and engine ancillaries.
          </p>
          <div
            style={{
              background: '#F4F4F5',
              border: '1px solid #E4E4E7',
              borderRadius: '0px',
              padding: '24px 30px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '11px', color: '#71717A', textTransform: 'uppercase', fontWeight: 700, fontFamily: "'Lato', sans-serif" }}>Direct Hotline</span>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>{siteConfig.contact.phoneFormatted}</div>
            </div>
            <div style={{ height: '35px', width: '1px', background: '#D4D4D8' }}></div>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '11px', color: '#71717A', textTransform: 'uppercase', fontWeight: 700, fontFamily: "'Lato', sans-serif" }}>WhatsApp Parts Desk</span>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>Live Consultation Available</div>
            </div>
            <a
              href="https://wa.me/918860718878"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-luxury-primary"
              style={{ textDecoration: 'none', padding: '10px 20px', fontSize: '13px' }}
            >
              <i className="fab fa-whatsapp"></i>
              <span>Connect on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      <OriginalFooter />
    </>
  );
}
