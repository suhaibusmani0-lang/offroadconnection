'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber') || 'DRAN-' + Math.floor(100000 + Math.random() * 900000);
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
      <section className="thank-you-section p_relative pt_80 pb_100" style={{ background: '#FAFBFC' }}>
        <div className="auto-container">
          <div
            className="card p-5 text-center shadow-sm"
            style={{ borderRadius: '0px', border: '1px solid #E4E4E7', maxWidth: '850px', margin: '0 auto', background: '#fff' }}
          >
            <div className="icon-box mb_20">
              <i className="fas fa-check-circle" style={{ fontSize: '75px', color: '#000000' }}></i>
            </div>
            <h2 style={{ fontWeight: 900, color: '#000000', marginBottom: '8px', fontFamily: "'Raleway', sans-serif" }}>Order Placed Successfully!</h2>
            <p style={{ fontSize: '15px', color: '#71717A', maxWidth: '600px', margin: '0 auto 20px', fontFamily: "'Lato', sans-serif" }}>
              Thank you for shopping with DRANparts. Your order is confirmed and our warehouse is preparing dispatch.
            </p>

            <div
              style={{
                background: '#F4F4F5',
                border: '1.5px solid #D4D4D8',
                padding: '16px 30px',
                borderRadius: '0px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '15px',
                margin: '0 auto 30px',
              }}
            >
              <div>
                <span style={{ fontSize: '12px', color: '#71717A', display: 'block', textTransform: 'uppercase', fontFamily: "'Raleway', sans-serif", fontWeight: 700, letterSpacing: '0.5px' }}>
                  Your Tracking Order ID
                </span>
                <strong style={{ fontSize: '22px', color: '#000000', letterSpacing: '1px', fontFamily: "'Raleway', sans-serif" }}>{orderNumber}</strong>
              </div>
              <span
                style={{
                  background: '#000000',
                  color: '#fff',
                  padding: '6px 14px',
                  borderRadius: '0px',
                  fontSize: '11px',
                  fontWeight: 800,
                  fontFamily: "'Raleway', sans-serif",
                  letterSpacing: '0.5px',
                }}
              >
                {orderDetails?.payment_status === 'paid' ? 'PAID ONLINE (RAZORPAY)' : 'COD CONFIRMED'}
              </span>
            </div>

            {/* Estimated Delivery & Tracking card */}
            <div
              style={{
                background: '#FAFBFC',
                border: '1px solid #E4E4E7',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'left',
                marginBottom: '30px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                <h5 style={{ fontWeight: 800, margin: 0, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>
                  <i className="fas fa-shipping-fast text-dark me-2"></i> Pan-India Express Logistics
                </h5>
                <span style={{ fontSize: '13px', color: '#52525B', fontWeight: 700, fontFamily: "'Lato', sans-serif" }}>
                  Estimated Delivery: {orderDetails?.estimated_delivery_date || 'Within 2-4 Business Days'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', fontSize: '14px', color: '#52525B', fontFamily: "'Lato', sans-serif" }}>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', fontFamily: "'Raleway', sans-serif", fontWeight: 700, textTransform: 'uppercase' }}>Courier Partner</span>
                  <strong style={{ color: '#000000' }}>{orderDetails?.courier_name || 'BlueDart / Delhivery Express'}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', fontFamily: "'Raleway', sans-serif", fontWeight: 700, textTransform: 'uppercase' }}>Delivery Pincode</span>
                  <strong style={{ color: '#000000' }}>{orderDetails?.shipping_address?.pincode || 'Verified Serviceable'}</strong>
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '12px', color: '#A1A1AA', fontFamily: "'Raleway', sans-serif", fontWeight: 700, textTransform: 'uppercase' }}>Customer Contact</span>
                  <strong style={{ color: '#000000' }}>+91 {orderDetails?.customer_phone || 'Registered Phone'}</strong>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="actions d-flex justify-content-center gap-3 flex-wrap">
              <Link
                href="/shop"
                className="btn-luxury-primary"
                style={{
                  padding: '14px 32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: 800,
                  display: 'inline-block',
                }}
              >
                Continue Shopping
              </Link>

              <button
                type="button"
                onClick={() => window.print()}
                style={{
                  background: '#F4F4F5',
                  color: '#000000',
                  padding: '14px 28px',
                  borderRadius: '0px',
                  border: '1px solid #D4D4D8',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
                <i className="fas fa-print"></i> Print Invoice
              </button>

              <a
                href={`https://wa.me/918860718878?text=${encodeURIComponent(
                  `Hi DRANparts, I have placed order ${orderNumber}. Please share tracking and dispatch confirmation.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: '#27272A',
                  color: '#fff',
                  padding: '14px 28px',
                  borderRadius: '0px',
                  textDecoration: 'none',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'Raleway', sans-serif",
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
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '36px', color: '#000000' }}></i>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
