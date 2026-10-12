'use client';

import React from 'react';
import Link from 'next/link';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';

export default function AboutPage() {
  return (
    <>
      <OriginalHeader />
      {/* page-title */}
      <section className="page-title">
        <div className="auto-container">
          <div className="content-box">
            <h1>About Us</h1>
            <ul className="bread-crumb clearfix">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>About Us</li>
            </ul>
          </div>
        </div>
      </section>
      {/* page-title end */}

      {/* about-section */}
      <section className="about-section pt_100 pb_70">
        <div className="auto-container">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-12 col-sm-12 content-column">
              <div className="about-content mr_30">
                <div className="sec-title mb_30">
                  <span className="sub-title">Who We Are</span>
                  <h2>Welcome to Off Road Connection Parts</h2>
                </div>
                <div className="text-box mb_40" style={{ color: '#666', lineHeight: '1.8' }}>
                  <p>
                    At <strong>Off Road Connection Parts</strong>, we are an independent automotive spare parts supplier
                    committed to providing high-quality OEM and aftermarket replacement parts for a wide range of vehicles,
                    including off-road and performance models.
                  </p>
                  <p>
                    Based in Noida, Uttar Pradesh, India, we serve customers across the country with a strong focus on
                    transparency, reliability, and customer satisfaction. Every part listed on our platform is carefully
                    sourced from verified suppliers and inspected before dispatch to ensure quality and compatibility.
                  </p>
                  <p>
                    We aim to provide accurate product information, fair pricing, and clear return and shipping policies so
                    that our customers can shop with confidence.
                  </p>
                </div>
                <div className="inner-box">
                  <div className="row clearfix">
                    <div className="col-lg-6 col-md-6 col-sm-12 single-column">
                      <div className="single-item mb_30">
                        <div className="icon-box" style={{ fontSize: '24px', color: '#FF6B00', marginBottom: '10px' }}>
                          <i className="fas fa-check-circle"></i>
                        </div>
                        <h5 style={{ fontWeight: 700 }}>100% Genuine Parts</h5>
                        <p style={{ color: '#777', fontSize: '14px' }}>Sourced directly from trusted manufacturers.</p>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 single-column">
                      <div className="single-item mb_30">
                        <div className="icon-box" style={{ fontSize: '24px', color: '#FF6B00', marginBottom: '10px' }}>
                          <i className="fas fa-shipping-fast"></i>
                        </div>
                        <h5 style={{ fontWeight: 700 }}>Pan-India Delivery</h5>
                        <p style={{ color: '#777', fontSize: '14px' }}>Fast and secure shipping to your doorstep.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12 image-column">
              <div className="image-box ml_30">
                <figure className="image">
                  <img
                    src="/assets/images/resource/about-1.jpg"
                    alt="About Off Road Connection Parts"
                    style={{ borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '100%' }}
                    onError={(e: any) => {
                      e.target.src = '/assets/images/resource/Wheel-1.png';
                    }}
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* about-section end */}

      {/* feature-section */}
      <section className="feature-section pb_70">
        <div className="auto-container">
          <div className="sec-title centred mb_50">
            <span className="sub-title">Our Values</span>
            <h2>Why Choose Us?</h2>
          </div>
          <div className="row clearfix text-center">
            <div className="col-lg-4 col-md-6 col-sm-12 column">
              <div
                className="feature-block-one mb_30 p-4 shadow-sm"
                style={{ borderRadius: '15px', background: '#fff', border: '1px solid #f0f0f0' }}
              >
                <div style={{ fontSize: '40px', color: '#FF6B00', marginBottom: '15px' }}>
                  <i className="fas fa-boxes"></i>
                </div>
                <h4 style={{ fontWeight: 700, marginBottom: '10px' }}>Extensive Inventory</h4>
                <p style={{ color: '#666' }}>Over 15,000+ spare parts for all major automotive makes and models in stock.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 column">
              <div
                className="feature-block-one mb_30 p-4 shadow-sm"
                style={{ borderRadius: '15px', background: '#fff', border: '1px solid #f0f0f0' }}
              >
                <div style={{ fontSize: '40px', color: '#FF6B00', marginBottom: '15px' }}>
                  <i className="fas fa-award"></i>
                </div>
                <h4 style={{ fontWeight: 700, marginBottom: '10px' }}>Tested Quality</h4>
                <p style={{ color: '#666' }}>Rigorous inspection and fitment checks to prevent compatibility issues.</p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 column">
              <div
                className="feature-block-one mb_30 p-4 shadow-sm"
                style={{ borderRadius: '15px', background: '#fff', border: '1px solid #f0f0f0' }}
              >
                <div style={{ fontSize: '40px', color: '#FF6B00', marginBottom: '15px' }}>
                  <i className="fas fa-user-shield"></i>
                </div>
                <h4 style={{ fontWeight: 700, marginBottom: '10px' }}>Secure Ordering</h4>
                <p style={{ color: '#666' }}>Safe online payment processing, COD options, and quick responsive support.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* feature-section end */}
      <OriginalFooter />
    </>
  );
}

