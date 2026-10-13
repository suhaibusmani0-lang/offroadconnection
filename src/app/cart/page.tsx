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
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E4E4E7', padding: '16px 0' }}>
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
      <section style={{ padding: '50px 0 80px', background: '#FAFAFA' }}>
        <div className="auto-container">
          <div style={{ marginBottom: '32px' }}>
            <span style={{ color: '#71717A', fontWeight: 800, fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: "'Raleway', sans-serif" }}>
              REVIEW YOUR ORDER
            </span>
            <h1 style={{ fontSize: '30px', fontWeight: 900, color: '#000000', fontFamily: "'Raleway', sans-serif", margin: '6px 0 0', letterSpacing: '-1px' }}>
              Shopping Bag ({cart.length})
            </h1>
          </div>

          {cart.length === 0 ? (
            <div
              className="luxury-card"
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: '#FFFFFF',
                maxWidth: '520px',
                margin: '0 auto',
                borderRadius: '10px',
                border: '1px solid #E4E4E7',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: '#F4F4F5',
                  border: '1.5px solid #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  color: '#000000',
                  fontSize: '24px',
                }}
              >
                <i className="fas fa-shopping-bag"></i>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#000000', marginBottom: '8px', fontFamily: "'Raleway', sans-serif" }}>
                Your Shopping Bag is Empty
              </h3>
              <p style={{ color: '#71717A', fontSize: '14px', maxWidth: '380px', margin: '0 auto 24px', lineHeight: '1.6', fontFamily: "'Lato', sans-serif" }}>
                Explore over 2,500+ genuine OEM auto spare parts for Audi, BMW, Mercedes-Benz, Porsche, Range Rover, and more.
              </p>
              <Link href="/shop" className="btn-luxury-primary" style={{ textDecoration: 'none', fontFamily: "'Raleway', sans-serif" }}>
                <span>EXPLORE CATALOG</span>
                <i className="fas fa-arrow-right" style={{ fontSize: '11px' }}></i>
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
                    borderRadius: '10px',
                    border: '1px solid #E4E4E7',
                  }}
                >
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', fontFamily: "'Lato', sans-serif" }}>
                      <thead>
                        <tr style={{ borderBottom: '1.5px solid #F4F4F5', textAlign: 'left' }}>
                          <th style={{ padding: '12px 14px', color: '#71717A', textTransform: 'uppercase', fontSize: '11px', fontWeight: 800, fontFamily: "'Raleway', sans-serif" }}>Product</th>
                          <th style={{ padding: '12px 14px', color: '#71717A', textTransform: 'uppercase', fontSize: '11px', fontWeight: 800, fontFamily: "'Raleway', sans-serif" }}>Price</th>
                          <th style={{ padding: '12px 14px', color: '#71717A', textTransform: 'uppercase', fontSize: '11px', fontWeight: 800, textAlign: 'center', fontFamily: "'Raleway', sans-serif" }}>Qty</th>
                          <th style={{ padding: '12px 14px', color: '#71717A', textTransform: 'uppercase', fontSize: '11px', fontWeight: 800, textAlign: 'right', fontFamily: "'Raleway', sans-serif" }}>Subtotal</th>
                          <th style={{ padding: '12px 14px', width: '40px' }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item) => {
                          const itemSubtotal = item.price * item.quantity;
                          const imgSrc = formatImageUrl(item.image);

                          return (
                            <tr key={item.id} style={{ borderBottom: '1px solid #F4F4F5' }}>
                              <td style={{ padding: '16px 14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                  {/* eslint-disable-next-line @next/next/no-img-element */}
                                  <img
                                    src={imgSrc}
                                    alt={item.name}
                                    style={{
                                      width: '60px',
                                      height: '60px',
                                      objectFit: 'contain',
                                      border: '1px solid #F4F4F5',
                                      borderRadius: '6px',
                                      padding: '4px',
                                      background: '#FFFFFF',
                                    }}
                                  />
                                  <div>
                                    <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 4px', color: '#000000', lineHeight: '1.3', fontFamily: "'Raleway', sans-serif" }}>
                                      {item.name}
                                    </h4>
                                    <span style={{ fontSize: '11px', color: '#71717A', fontFamily: 'monospace' }}>
                                      SKU: {item.sku || 'OEM-PART'}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '16px 14px', fontWeight: 700, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>
                                ₹{Number(item.price).toLocaleString('en-IN')}
                              </td>
                              <td style={{ padding: '16px 14px', textAlign: 'center' }}>
                                <div
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    border: '1px solid #E4E4E7',
                                    borderRadius: '6px',
                                    background: '#FFFFFF',
                                  }}
                                >
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                    style={{ width: '28px', height: '30px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#000000', fontWeight: 700 }}
                                  >
                                    -
                                  </button>
                                  <span style={{ width: '30px', textAlign: 'center', fontWeight: 700, fontSize: '13px', color: '#000000' }}>
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    style={{ width: '28px', height: '30px', border: 'none', background: 'transparent', cursor: 'pointer', color: '#000000', fontWeight: 700 }}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>
                              <td style={{ padding: '16px 14px', fontWeight: 800, color: '#000000', textAlign: 'right', fontFamily: "'Raleway', sans-serif" }}>
                                ₹{itemSubtotal.toLocaleString('en-IN')}
                              </td>
                              <td style={{ padding: '16px 14px', textAlign: 'right' }}>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.id)}
                                  style={{ background: 'transparent', border: 'none', color: '#A1A1AA', cursor: 'pointer', fontSize: '14px' }}
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

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F4F4F5', flexWrap: 'wrap', gap: '12px' }}>
                    <Link href="/shop" style={{ color: '#000000', fontWeight: 700, fontSize: '13px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: "'Raleway', sans-serif" }}>
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
                    padding: '24px',
                    borderRadius: '10px',
                    border: '1px solid #E4E4E7',
                    position: 'sticky',
                    top: '100px',
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#000000', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid #F4F4F5', fontFamily: "'Raleway', sans-serif" }}>
                    Order Summary
                  </h3>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px', color: '#52525B' }}>
                    <span>Bag Subtotal</span>
                    <strong style={{ color: '#000000', fontFamily: "'Raleway', sans-serif" }}>₹{cartTotal.toLocaleString('en-IN')}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '13px', color: '#52525B' }}>
                    <span>Express Air Dispatch</span>
                    <strong style={{ color: '#000000', fontFamily: "'Raleway', sans-serif" }}>FREE</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', paddingTop: '12px', borderTop: '1.5px solid #F4F4F5', fontSize: '17px', color: '#000000' }}>
                    <span style={{ fontWeight: 800, fontFamily: "'Raleway', sans-serif" }}>Total</span>
                    <span style={{ fontWeight: 900, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>₹{cartTotal.toLocaleString('en-IN')}</span>
                  </div>

                  <Link
                    href="/checkout"
                    className="btn-luxury-primary"
                    style={{ width: '100%', textDecoration: 'none', marginBottom: '10px', padding: '13px 20px', fontSize: '13px', fontFamily: "'Raleway', sans-serif", letterSpacing: '0.5px' }}
                  >
                    <span>PROCEED TO SECURE CHECKOUT</span>
                    <i className="fas fa-arrow-right" style={{ fontSize: '11px' }}></i>
                  </Link>

                  <a
                    href={`https://wa.me/918860718878?text=Hello,%20I%20have%20${cart.length}%20item(s)%20in%20my%20bag%20totaling%20₹${cartTotal}.%20Can%20you%20help%20me%20confirm%20order%20and%20fitment?`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      width: '100%',
                      padding: '11px 16px',
                      borderRadius: '8px',
                      border: '1.5px solid #E4E4E7',
                      background: '#F4F4F5',
                      color: '#000000',
                      fontWeight: 700,
                      fontSize: '12px',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontFamily: "'Raleway', sans-serif",
                    }}
                  >
                    <i className="fab fa-whatsapp"></i>
                    <span>Order via WhatsApp Desk</span>
                  </a>

                  <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #F4F4F5', fontSize: '11px', color: '#71717A', textAlign: 'center' }}>
                    <i className="fas fa-lock" style={{ marginRight: '6px', color: '#000000' }}></i>
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
