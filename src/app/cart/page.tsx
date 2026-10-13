'use client';

import React from 'react';
import Link from 'next/link';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';
import { useCart } from '@/context/CartContext';
import { formatImageUrl } from '@/lib/image';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

  return (
    <>
      <OriginalHeader />

      {/* Breadcrumb Strip */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '16px 0' }}>
        <div className="auto-container">
          <div className="luxury-breadcrumb" style={{ padding: 0 }}>
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <Link href="/shop">Catalog</Link>
            <span className="separator">/</span>
            <span className="current">Shopping Bag</span>
          </div>
        </div>
      </section>

      {/* Cart Content Section */}
      <section style={{ padding: '60px 0 90px', background: '#FAFBFC' }}>
        <div className="auto-container">
          <div style={{ marginBottom: '36px' }}>
            <span style={{ color: '#C5A059', fontWeight: 800, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              REVIEW YOUR ORDER
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', fontFamily: "'Outfit', sans-serif", margin: '6px 0 0' }}>
              Shopping Bag ({cart.length})
            </h1>
          </div>

          {cart.length === 0 ? (
            <div
              className="luxury-card"
              style={{
                textAlign: 'center',
                padding: '70px 20px',
                background: '#FFFFFF',
                maxWidth: '550px',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  background: '#FBF7EE',
                  border: '1.5px solid #C5A059',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: '#C5A059',
                  fontSize: '28px',
                }}
              >
                <i className="fas fa-shopping-bag"></i>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Your Shopping Bag is Empty
              </h3>
              <p style={{ color: '#64748B', fontSize: '14px', maxWidth: '380px', margin: '0 auto 24px', lineHeight: '1.6' }}>
                Explore over 2,500+ genuine OEM auto spare parts for Audi, BMW, Mercedes-Benz, Porsche, Range Rover, and more.
              </p>
              <Link href="/shop" className="btn-luxury-primary" style={{ textDecoration: 'none' }}>
                <span>EXPLORE CATALOG</span>
                <i className="fas fa-arrow-right" style={{ fontSize: '12px' }}></i>
              </Link>
            </div>
          ) : (
            <div className="row clearfix" style={{ display: 'flex', flexWrap: 'wrap', gap: '30px 0' }}>
              {/* Left Column: Cart Table */}
              <div className="col-lg-8 col-md-12">
                <div
                  className="luxury-card"
                  style={{
                    background: '#FFFFFF',
                    padding: '24px',
                  }}
                >
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1.5px solid #F1F5F9', textAlign: 'left' }}>
                          <th style={{ padding: '12px 14px', color: '#64748B', textTransform: 'uppercase', fontSize: '11px', fontWeight: 800 }}>Product</th>
                          <th style={{ padding: '12px 14px', color: '#64748B', textTransform: 'uppercase', fontSize: '11px', fontWeight: 800 }}>Price</th>
                          <th style={{ padding: '12px 14px', color: '#64748B', textTransform: 'uppercase', fontSize: '11px', fontWeight: 800, textAlign: 'center' }}>Qty</th>
                          <th style={{ padding: '12px 14px', color: '#64748B', textTransform: 'uppercase', fontSize: '11px', fontWeight: 800, textAlign: 'right' }}>Subtotal</th>
                          <th style={{ padding: '12px 14px', width: '40px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item) => {
                          const itemSubtotal = item.price * item.quantity;
                          const imgSrc = formatImageUrl(item.image);

                          return (
                            <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                              <td style={{ padding: '18px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                  <img
                                    src={imgSrc}
                                    alt={item.name}
                                    style={{
                                      width: '65px',
                                      height: '65px',
                                      objectFit: 'contain',
                                      border: '1px solid #F1F5F9',
                                      borderRadius: '8px',
                                      padding: '4px',
                                      background: '#FFFFFF',
                                    }}
                                  />
                                  <div>
                                    <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 4px', color: '#0F172A', lineHeight: '1.3' }}>
                                      {item.name}
                                    </h4>
                                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                                      SKU: {item.sku || 'OEM-PART'}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '18px 14px', fontWeight: 700, color: '#0F172A' }}>
                                ₹{Number(item.price).toLocaleString('en-IN')}
                              </td>
                              <td style={{ padding: '18px 14px', textAlign: 'center' }}>
                                <div
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    border: '1px solid #E2E8F0',
                                    borderRadius: '8px',
                                    background: '#FFFFFF',
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    style={{ width: '28px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}
                                  >
                                    -
                                  </button>
                                  <span style={{ width: '32px', textAlign: 'center', fontWeight: 700, fontSize: '13px' }}>
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    style={{ width: '28px', height: '32px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748B' }}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td style={{ padding: '18px 14px', fontWeight: 800, color: '#0F172A', textAlign: 'right' }}>
                                ₹{itemSubtotal.toLocaleString('en-IN')}
                              </td>
                              <td style={{ padding: '18px 14px', textAlign: 'right' }}>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '14px' }}
                                  title="Remove Item"
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap', gap: '12px' }}>
                    <Link href="/shop" style={{ color: '#0F172A', fontWeight: 700, fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fas fa-arrow-left" style={{ fontSize: '11px' }}></i>
                      <span>Continue Shopping</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="col-lg-4 col-md-12">
                <div
                  className="luxury-card"
                  style={{
                    background: '#FFFFFF',
                    padding: '28px',
                    position: 'sticky',
                    top: '100px',
                  }}
                >
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
                    Order Summary
                  </h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#64748B' }}>
                    <span>Bag Subtotal</span>
                    <strong style={{ color: '#0F172A' }}>₹{cartTotal.toLocaleString('en-IN')}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '14px', color: '#64748B' }}>
                    <span>Express Air Dispatch</span>
                    <strong style={{ color: '#15803D' }}>FREE</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', paddingTop: '14px', borderTop: '1.5px solid #F1F5F9', fontSize: '18px', color: '#0F172A' }}>
                    <span style={{ fontWeight: 800 }}>Total</span>
                    <span style={{ fontWeight: 900, color: '#0F172A' }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="btn-luxury-primary"
                    style={{ width: '100%', textDecoration: 'none', marginBottom: '12px', padding: '14px 20px', fontSize: '14px' }}
                  >
                    <span>PROCEED TO SECURE CHECKOUT</span>
                    <i className="fas fa-arrow-right" style={{ fontSize: '12px' }}></i>
                  </Link>

                  <a
                    href={`https://wa.me/918860718878?text=Hello,%20I%20have%20${cart.length}%20item(s)%20in%20my%20bag%20totaling%20₹${cartTotal}.%20Can%20you%20help%20me%20confirm%20order%20and%20fitment?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '10px',
                      border: '1.5px solid #86EFAC',
                      background: '#F0FDF4',
                      color: '#15803D',
                      fontWeight: 700,
                      fontSize: '12px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <i className="fab fa-whatsapp" style={{ fontSize: '16px' }}></i>
                    <span>Order via WhatsApp Desk</span>
                  </a>

                  <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #F1F5F9', fontSize: '11px', color: '#94A3B8', textAlign: 'center' }}>
                    <i className="fas fa-lock" style={{ marginRight: '6px', color: '#C5A059' }}></i>
                    <span>256-Bit SSL Encrypted Razorpay Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <OriginalFooter />
    </>
  );
}
