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
      <section className="cart-section p_relative pt_60 pb_100">
      <div className="auto-container">
        <div className="sec-title mb_40">
          <h2 style={{ fontWeight: 800 }}>Shopping Cart</h2>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-shopping-basket mb_20" style={{ fontSize: '60px', color: '#eee' }}></i>
            <h4 style={{ fontWeight: 700, marginTop: '15px' }}>Your cart is empty!</h4>
            <p style={{ color: '#888', marginTop: '5px' }}>Explore thousands of genuine auto parts and add them to your cart.</p>
            <Link
              href="/shop"
              className="theme-btn mt_20"
              style={{
                background: '#FF6B00',
                color: '#fff',
                padding: '12px 30px',
                borderRadius: '5px',
                textDecoration: 'none',
                display: 'inline-block',
                fontWeight: 700,
              }}
            >
              Return to Shop
            </Link>
          </div>
        ) : (
          <div className="row clearfix">
            <div className="col-lg-8 col-md-12 col-sm-12 table-column">
              <div className="table-outer card p-4 shadow-sm" style={{ borderRadius: '15px', border: 'none' }}>
                <div className="table-responsive">
                  <table className="cart-table" style={{ width: '100%' }}>
                    <thead style={{ borderBottom: '1px solid #eee' }}>
                      <tr>
                        <th style={{ padding: '15px', textAlign: 'left' }}>Product</th>
                        <th style={{ padding: '15px', textAlign: 'center' }}>Price</th>
                        <th style={{ padding: '15px', textAlign: 'center' }}>Quantity</th>
                        <th style={{ padding: '15px', textAlign: 'center' }}>Subtotal</th>
                        <th style={{ padding: '15px', textAlign: 'right' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => {
                        const itemSubtotal = item.price * item.quantity;
                        const imgSrc = formatImageUrl(item.image);

                        return (
                          <tr key={item.id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                            <td style={{ padding: '20px 15px' }}>
                              <div className="d-flex align-items-center gap-3">
                                <img
                                  src={imgSrc}
                                  alt={item.name}
                                  style={{
                                    width: '70px',
                                    height: '70px',
                                    objectFit: 'contain',
                                    border: '1px solid #eee',
                                    borderRadius: '8px',
                                    padding: '5px',
                                    background: '#fff',
                                  }}
                                  onError={(e: any) => {
                                    e.target.src = '/assets/images/resource/Wheel-1.png';
                                  }}
                                />
                                <div>
                                  <Link href={`/product/${item.slug || item.id}`} style={{ textDecoration: 'none' }}>
                                    <h6 style={{ margin: 0, fontWeight: 700, color: '#333' }}>{item.name}</h6>
                                  </Link>
                                  {item.sku && <small style={{ color: '#888' }}>SKU: {item.sku}</small>}
                                </div>
                              </div>
                            </td>
                            <td align="center" style={{ fontWeight: 600 }}>
                              &#8377;{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td align="center">
                              <div
                                className="quantity-box"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                              >
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    border: '1px solid #ddd',
                                    background: '#f8f9fa',
                                    borderRadius: '4px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                                >
                                  -
                                </button>
                                <input
                                  type="number"
                                  value={item.quantity}
                                  min="1"
                                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                  style={{
                                    width: '50px',
                                    height: '32px',
                                    textAlign: 'center',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    padding: '5px',
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  style={{
                                    width: '32px',
                                    height: '32px',
                                    border: '1px solid #ddd',
                                    background: '#f8f9fa',
                                    borderRadius: '4px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td align="center" style={{ fontWeight: 700, color: '#FF6B00' }}>
                              &#8377;{Number(itemSubtotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td align="right">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                title="Remove item"
                                style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '16px' }}
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
              </div>
            </div>

            <div className="col-lg-4 col-md-12 col-sm-12 cart-summary-column">
              <div
                className="cart-summary card p-4 shadow-sm"
                style={{ borderRadius: '15px', border: 'none', background: '#fdfaf8' }}
              >
                <h4 style={{ fontWeight: 800, marginBottom: '25px' }}>Cart Total</h4>
                <div className="d-flex justify-content-between mb_10" style={{ fontSize: '16px' }}>
                  <span>Subtotal</span>
                  <span>&#8377;{Number(cartTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="d-flex justify-content-between mb_10" style={{ fontSize: '16px' }}>
                  <span>Shipping</span>
                  <span style={{ color: '#28a745', fontWeight: 600 }}>FREE</span>
                </div>
                <hr style={{ background: '#eee' }} />
                <div
                  className="d-flex justify-content-between mb_30"
                  style={{ fontSize: '20px', fontWeight: 800, color: '#333' }}
                >
                  <span>Total</span>
                  <span style={{ color: '#FF6B00' }}>
                    &#8377;{Number(cartTotal).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  className="theme-btn w-100 text-center"
                  style={{
                    background: '#222',
                    color: '#fff',
                    padding: '15px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'block',
                    border: 'none',
                    transition: '0.3s',
                  }}
                  onMouseOver={(e: any) => (e.target.style.background = '#000')}
                  onMouseOut={(e: any) => (e.target.style.background = '#222')}
                >
                  Proceed to Checkout
                </Link>

                {/* Trust & Support Section */}
                <div
                  className="trust-signals mt_30"
                  style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}
                >
                  <div className="d-flex align-items-center mb_15" style={{ gap: '15px' }}>
                    <div
                      style={{
                        width: '45px',
                        height: '45px',
                        background: 'rgba(52, 152, 219, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#3498db',
                      }}
                    >
                      <i className="fas fa-lock" style={{ fontSize: '20px' }}></i>
                    </div>
                    <div>
                      <h6 style={{ margin: 0, fontWeight: 700, color: '#333' }}>Secure Checkout</h6>
                      <small style={{ color: '#777' }}>Protected & Encrypted Transactions</small>
                    </div>
                  </div>
                  <div className="d-flex align-items-center" style={{ gap: '15px' }}>
                    <div
                      style={{
                        width: '45px',
                        height: '45px',
                        background: 'rgba(0, 184, 148, 0.1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#00b894',
                      }}
                    >
                      <i className="fas fa-shield-alt" style={{ fontSize: '20px' }}></i>
                    </div>
                    <div>
                      <h6 style={{ margin: 0, fontWeight: 700, color: '#333' }}>Trust Off Road Connection Parts</h6>
                      <small style={{ color: '#777' }}>100% Genuine Spare Parts</small>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: '20px',
                      paddingTop: '15px',
                      borderTop: '1px dashed #eee',
                      fontSize: '13px',
                      color: '#666',
                      textAlign: 'center',
                    }}
                  >
                    <strong>Off Road Connection Parts</strong>
                    <br />
                    Need Help? Call/WhatsApp: +91 9871336369
                  </div>
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

