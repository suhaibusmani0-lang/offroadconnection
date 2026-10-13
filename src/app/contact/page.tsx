'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';
import siteConfig from '@/config/site';

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
        throw new Error(data.error || 'Failed to submit enquiry');
      }

      setStatus({
        type: 'success',
        message: 'Thank you! Your enquiry has been received. Our luxury parts specialists will contact you shortly.',
      });
      setFormData({ username: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Something went wrong. Please try again or WhatsApp us directly.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <OriginalHeader />

      {/* Breadcrumb Strip */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '16px 0' }}>
        <div className="auto-container">
          <div className="luxury-breadcrumb" style={{ padding: 0 }}>
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">Contact & Noida Facility</span>
          </div>
        </div>
      </section>

      {/* Contact Info Cards Grid */}
      <section style={{ padding: '60px 0 40px', background: '#FAFBFC' }}>
        <div className="auto-container">
          <div style={{ textAlign: 'center', marginBottom: '45px' }}>
            <span style={{ color: '#C5A059', fontWeight: 800, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              REACH OUR SPECIALISTS
            </span>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#0F172A',
                fontFamily: "'Outfit', sans-serif",
                marginTop: '8px',
              }}
            >
              Get In Touch With Our Technical Parts Desk
            </h1>
            <div style={{ width: '60px', height: '3px', background: '#C5A059', margin: '14px auto 0', borderRadius: '2px' }}></div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Card 1: Facility Location */}
            <div className="luxury-card" style={{ padding: '32px 24px', textAlign: 'center', background: '#FFFFFF' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#FBF7EE',
                  border: '1.5px solid #C5A059',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                  color: '#C5A059',
                  fontSize: '20px',
                }}
              >
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Central Facility & Warehouse
              </h4>
              <p style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                {siteConfig.geo.address.streetAddress}, {siteConfig.geo.address.addressLocality} {siteConfig.geo.address.postalCode}
              </p>
            </div>

            {/* Card 2: Phone & WhatsApp */}
            <div className="luxury-card" style={{ padding: '32px 24px', textAlign: 'center', background: '#FFFFFF' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#F0FDF4',
                  border: '1.5px solid #86EFAC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                  color: '#15803D',
                  fontSize: '20px',
                }}
              >
                <i className="fab fa-whatsapp"></i>
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Direct Hotline & WhatsApp
              </h4>
              <p style={{ margin: '0 0 6px', fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                <a href={`tel:${siteConfig.contact.phone}`} style={{ color: '#0F172A', textDecoration: 'none' }}>
                  {siteConfig.contact.phoneFormatted}
                </a>
              </p>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#15803D', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}
              >
                Chat on WhatsApp Now →
              </a>
            </div>

            {/* Card 3: Support Hours */}
            <div className="luxury-card" style={{ padding: '32px 24px', textAlign: 'center', background: '#FFFFFF' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: '#EFF6FF',
                  border: '1.5px solid #BFDBFE',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px',
                  color: '#1D4ED8',
                  fontSize: '20px',
                }}
              >
                <i className="fas fa-clock"></i>
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Operating Hours
              </h4>
              <p style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.6', margin: '0 0 4px' }}>
                Monday to Saturday: 9:30 AM – 7:30 PM IST
              </p>
              <span style={{ fontSize: '12px', color: '#94A3B8' }}>Sunday: Urgent Dispatch on Request</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section style={{ padding: '40px 0 80px', background: '#FAFBFC' }}>
        <div className="auto-container" style={{ maxWidth: '750px' }}>
          <div className="luxury-card" style={{ padding: '36px', background: '#FFFFFF' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
              Send an Enquiry or Fitment Request
            </h3>
            <p style={{ color: '#64748B', fontSize: '14px', marginBottom: '24px' }}>
              Provide your vehicle details (Make, Model, Year, VIN) and the exact part you are looking for.
            </p>

            {status.message && (
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: '10px',
                  marginBottom: '20px',
                  background: status.type === 'success' ? '#F0FDF4' : '#FEF2F2',
                  border: status.type === 'success' ? '1px solid #86EFAC' : '1px solid #FCA5A5',
                  color: status.type === 'success' ? '#15803D' : '#991B1B',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {status.message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', textTransform: 'uppercase' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Singhania"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', textTransform: 'uppercase' }}>
                    10-Digit Mobile / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '12px 14px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', fontSize: '13px' }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0F172A', marginBottom: '6px', textTransform: 'uppercase' }}>
                  Vehicle Model, Year & Required Part *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="e.g. BMW 520d (F10, 2015) - Need front right LED headlight module and brake pads. Chassis number: WBA..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '12px 14px', fontSize: '13px', resize: 'vertical' }}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-luxury-primary"
                style={{ width: '100%', padding: '14px', fontSize: '14px' }}
              >
                {loading ? 'Submitting Enquiry...' : 'SUBMIT ENQUIRY'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <OriginalFooter />
    </>
  );
}
