'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    message: '',
  });

  const [status, setStatus] = useState<{ type: 'success' | 'error' | ''; message: string }>({
    type: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setStatus({
        type: 'success',
        message: 'Thank you! Your message has been sent successfully. Our team will contact you shortly.',
      });
      setFormData({ username: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <OriginalHeader />
      {/* page-title */}
      <section className="page-title">
        <div className="auto-container">
          <div className="content-box">
            <h1>Contact Us</h1>
            <ul className="bread-crumb clearfix">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>Contact Us</li>
            </ul>
          </div>
        </div>
      </section>
      {/* page-title end */}

      {/* contact-info-section */}
      <section className="contact-info-section pt_100 pb_50">
        <div className="auto-container">
          <div className="sec-title centred mb_50">
            <h2>Contact Information</h2>
          </div>
          <div className="row clearfix">
            <div className="col-lg-4 col-md-6 col-sm-12 info-column">
              <div className="info-block-one">
                <div
                  className="inner-box"
                  style={{ textAlign: 'center', padding: '40px', border: '1px solid #eee', borderRadius: '15px', background: '#fff' }}
                >
                  <div className="icon-box" style={{ fontSize: '40px', marginBottom: '20px', color: '#FF6B00' }}>
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <h4>Our Location</h4>
                  <p style={{ color: '#666', marginTop: '10px' }}>
                    Plot 2, Opp Asgarpur park, kharsa Number 307 Asgarpur jaagir sector 128 Noida 201301
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 info-column">
              <div className="info-block-one">
                <div
                  className="inner-box"
                  style={{ textAlign: 'center', padding: '40px', border: '1px solid #eee', borderRadius: '15px', background: '#fff' }}
                >
                  <div className="icon-box" style={{ fontSize: '40px', marginBottom: '20px', color: '#FF6B00' }}>
                    <i className="fas fa-envelope"></i>
                  </div>
                  <h4>Email Address</h4>
                  <p style={{ color: '#666', marginTop: '10px' }}>
                    <a href="mailto:danish.ameer@gmail.com" style={{ color: '#333', fontWeight: 600 }}>
                      danish.ameer@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 col-sm-12 info-column">
              <div className="info-block-one">
                <div
                  className="inner-box"
                  style={{ textAlign: 'center', padding: '40px', border: '1px solid #eee', borderRadius: '15px', background: '#fff' }}
                >
                  <div className="icon-box" style={{ fontSize: '40px', marginBottom: '20px', color: '#FF6B00' }}>
                    <i className="fas fa-phone"></i>
                  </div>
                  <h4>Phone Number</h4>
                  <p style={{ color: '#666', marginTop: '10px' }}>
                    <a href="tel:9871336369" style={{ color: '#333', fontWeight: 600 }}>
                      +91 9871336369
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* contact-info-section end */}

      {/* contact-section */}
      <section className="contact-section pb_100">
        <div className="auto-container">
          <div className="sec-title centred mb_50">
            <h2 style={{ fontWeight: 800 }}>Send a Message</h2>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              {status.message && (
                <div
                  className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} mb_30`}
                  role="alert"
                  style={{ borderRadius: '8px' }}
                >
                  {status.message}
                </div>
              )}

              <div
                className="form-inner"
                style={{
                  background: '#fff',
                  padding: '40px',
                  borderRadius: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  border: '1px solid #eee',
                }}
              >
                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">
                    <div className="col-lg-6 col-md-6 col-sm-12 form-group mb_20">
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Your Name *"
                        required
                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
                      />
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 form-group mb_20">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Your Email *"
                        required
                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
                      />
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 form-group mb_20">
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Your Phone Number (Optional)"
                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px' }}
                      />
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 form-group mb_20">
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Type your message or auto parts query..."
                        required
                        style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '5px', height: '150px' }}
                      ></textarea>
                    </div>
                    <div className="col-lg-12 col-md-12 col-sm-12 form-group message-btn centred">
                      <button
                        type="submit"
                        disabled={loading}
                        className="theme-btn"
                        style={{
                          background: '#000',
                          color: '#fff',
                          padding: '12px 40px',
                          borderRadius: '5px',
                          border: 'none',
                          fontWeight: 700,
                          cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {loading ? 'Sending...' : 'Send Message'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* contact-section end */}
      <OriginalFooter />
    </>
  );
}

