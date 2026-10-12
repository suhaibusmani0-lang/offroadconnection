'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'ORCP-' + Math.floor(100000 + Math.random() * 900000);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    if (orderNumber) {
      fetch(`/api/orders/${orderNumber}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.order) setOrderDetails(data.order);
        })
        .catch(() => {});
    }
  }, [orderNumber]);

  return (
    <>
      <OriginalHeader />
      <section className="thank-you-section p_relative pt_80 pb_100">
        <div className="auto-container">
          <div
            className="card p-5 text-center shadow-sm"
            style={{ borderRadius: '20px', border: 'none', maxWidth: '850px', margin: '0 auto', background: '#fff' }}
          >
            <div className="icon-box mb_20">
              <i className="fas fa-check-circle" style={{ fontSize: '75px', color: '#10b981' }}></i>
            </div>
            <h2 style={{ fontWeight: 800, color: '#111', marginBottom: '8px' }}>Order Placed Successfully!</h2>
            <p style={{ fontSize: '16px', color: '#666', maxWidth: '600px', margin: '0 auto 20px' }}>
              Thank you for shopping with Off Road Connection Parts. Your order is confirmed and our warehouse is preparing dispatch.
            </p>

            <div
              style={{
                background: '#fffaf5',
                border: '1.5px dashed #FF6B00',
                padding: '16px 30px',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '15px',
                margin: '0 auto 30px',
              }}
            >
              <div>
                <span style={{ fontSize: '13px', color: '#888', display: 'block', textTransform: 'uppercase' }}>
                  Your Tracking Order ID
                </span>
                <strong style={{ fontSize: '22px', color: '#FF6B00', letterSpacing: '1px' }}>{orderNumber}</strong>
              </div>
              <span
                style={{
                  background: '#10b981',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                {orderDetails?.payment_status === 'paid' ? 'PAID ONLINE (RAZORPAY)' : 'COD CONFIRMED'}
              </span>
            </div>

            {/* Estimated Delivery & Tracking card */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'left',
                marginBottom: '30px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                <h5 style={{ fontWeight: 800, margin: 0, color: '#1e293b' }}>
                  <i className="fas fa-shipping-fast text-success me-2"></i> Pan-India Express Logistics
                </h5>
                <span style={{ fontSize: '13px', color: '#047857', fontWeight: 700 }}>
                  Estimated Delivery: {orderDetails?.estimated_delivery_date || 'Within 2-4 Business Days'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', fontSize: '14px', color: '#475569' }}>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Courier Partner</span>
                  <strong>{orderDetails?.courier_name || 'BlueDart / Delhivery Express'}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Delivery Pincode</span>
                  <strong>{orderDetails?.shipping_address?.pincode || 'Verified Serviceable'}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: '#94a3b8' }}>Customer Contact</span>
                  <strong>+91 {orderDetails?.customer_phone || 'Registered Phone'}</strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="actions d-flex justify-content-center gap-3 flex-wrap">
              <Link
                href="/shop"
                className="theme-btn"
                style={{
                  background: '#FF6B00',
                  color: '#fff',
                  padding: '14px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  display: 'inline-block',
                }}
              >
                Continue Shopping
              </Link>

              <button
                type="button"
                onClick={() => window.print()}
                className="theme-btn"
                style={{
                  background: '#1e293b',
                  color: '#fff',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <i className="fas fa-print"></i> Print Invoice
              </button>

              <a
                href={`https://wa.me/919871336369?text=${encodeURIComponent(
                  `Hi Off Road Connection Parts, I have placed order ${orderNumber}. Please share tracking and dispatch confirmation.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="theme-btn"
                style={{
                  background: '#25D366',
                  color: '#fff',
                  padding: '14px 28px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <i className="fab fa-whatsapp" style={{ fontSize: '1.2rem' }}></i> WhatsApp Updates
              </a>
            </div>
          </div>
        </div>
      </section>
      <OriginalFooter />
    </>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="py-5 text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '36px', color: '#FF6B00' }}></i>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
