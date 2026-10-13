'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import OriginalHeader from '@/components/OriginalHeader';
import OriginalFooter from '@/components/OriginalFooter';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { trackInitiateCheckout, trackPurchase } from '@/lib/analytics';

interface PincodeDeliveryInfo {
  pincode: string;
  city: string;
  state: string;
  serviceable: boolean;
  deliveryDays: number;
  estimatedDate: string;
  codAvailable: boolean;
  expressAvailable: boolean;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const { customer, openLoginModal } = useAuth();

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    payment_method: 'Online', // Default to Razorpay Online
  });

  const [deliveryInfo, setDeliveryInfo] = useState<PincodeDeliveryInfo | null>(null);
  const [checkingPin, setCheckingPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Track Initiate Checkout on page load
  useEffect(() => {
    if (cart.length > 0) {
      trackInitiateCheckout(cart, cartTotal);
    }
  }, [cart, cartTotal]);

  // Load saved customer data or local storage pincode
  useEffect(() => {
    if (customer) {
      const defaultAddr = customer.addresses?.[0];
      setFormData((prev) => ({
        ...prev,
        customer_name: customer.name || prev.customer_name,
        customer_phone: customer.phone || prev.customer_phone,
        customer_email: customer.email || prev.customer_email,
        street: defaultAddr?.street || prev.street,
        city: defaultAddr?.city || prev.city,
        state: defaultAddr?.state || prev.state,
        pincode: defaultAddr?.pincode || prev.pincode,
      }));
      if (defaultAddr?.pincode) {
        handlePincodeLookup(defaultAddr.pincode);
      }
    } else {
      const savedPin = localStorage.getItem('offroad_user_pincode');
      if (savedPin && savedPin.length === 6) {
        setFormData((prev) => ({ ...prev, pincode: savedPin }));
        handlePincodeLookup(savedPin);
      }
    }
  }, [customer]);

  const handlePincodeLookup = async (pin: string) => {
    const clean = pin.trim().replace(/\D/g, '');
    if (clean.length === 6) {
      setCheckingPin(true);
      try {
        const res = await fetch(`/api/pincode/${clean}`);
        const info = await res.json();
        if (info.serviceable) {
          setDeliveryInfo(info);
          setFormData((prev) => ({
            ...prev,
            city: prev.city || info.city,
            state: prev.state || info.state,
          }));
          localStorage.setItem('offroad_user_pincode', clean);
        }
      } catch (err) {
        console.warn('Pincode check error:', err);
      } finally {
        setCheckingPin(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'pincode') {
      const clean = value.replace(/\D/g, '');
      if (clean.length === 6) {
        handlePincodeLookup(clean);
      }
    }
  };

  if (cart.length === 0) {
    return (
      <>
        <OriginalHeader />
        <section className="checkout-section p_relative pt_60 pb_100">
          <div className="auto-container text-center py-5">
            <i className="fas fa-shopping-basket mb_20" style={{ fontSize: '60px', color: '#eee' }}></i>
            <h4 style={{ fontWeight: 700 }}>Your cart is empty</h4>
            <p style={{ color: '#888' }}>Please add some items to your cart before proceeding to checkout.</p>
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
              Explore Auto Parts
            </Link>
          </div>
        </section>
        <OriginalFooter />
      </>
    );
  }

  // Handle Online Payment (Razorpay)
  const handleRazorpayPayment = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      // 1. Create order on backend
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: cartTotal,
          receipt: `rcpt_${Date.now()}`,
          notes: {
            customer_name: formData.customer_name,
            customer_phone: formData.customer_phone,
            pincode: formData.pincode,
          },
        }),
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.message || 'Failed to initiate Razorpay order');
      }

      // Check if Razorpay script is loaded
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection or use COD.');
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Off Road Connection Parts',
        description: `Car Spare Parts Order (${cart.length} items)`,
        image: '/assets/images/mv-logo-13.png',
        order_id: orderData.orderId,
        prefill: {
          name: formData.customer_name,
          email: formData.customer_email || 'customer@offroadparts.in',
          contact: formData.customer_phone,
        },
        theme: {
          color: '#FF6B00',
        },
        handler: async function (response: any) {
          try {
            // 2. Verify signature
            const verifyRes = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            // 3. Save order to MongoDB & MariaDB
            const orderRes = await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...formData,
                shipping_address: `${formData.street}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
                payment_method: 'razorpay',
                payment_status: 'paid',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                items: cart,
                total_amount: cartTotal,
              }),
            });

            const savedOrder = await orderRes.json();

            // Track purchase
            trackPurchase({
              order_number: savedOrder.orderNumber,
              total_amount: cartTotal,
              items: cart,
            });

            clearCart();
            router.push(`/thank-you?orderId=${savedOrder.orderId}&orderNumber=${savedOrder.orderNumber}`);
          } catch (err: any) {
            setError('Payment captured but failed to record order. Please contact support with payment ID: ' + response.razorpay_payment_id);
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setError(response.error?.description || 'Payment failed. Please try again.');
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Payment initiation failed.');
      setIsSubmitting(false);
    }
  };

  // Handle Cash on Delivery (COD)
  const handleCodPayment = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          shipping_address: `${formData.street}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          payment_method: 'cod',
          payment_status: 'pending',
          items: cart,
          total_amount: cartTotal,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      // Track purchase
      trackPurchase({
        order_number: data.orderNumber,
        total_amount: cartTotal,
        items: cart,
      });

      clearCart();
      router.push(`/thank-you?orderId=${data.orderId}&orderNumber=${data.orderNumber}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while placing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone || !formData.street || !formData.pincode) {
      setError('Please fill in all required fields (Name, 10-Digit Mobile, Street Address, and 6-Digit Pincode).');
      return;
    }

    if (formData.customer_phone.replace(/\D/g, '').length !== 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    if (formData.pincode.replace(/\D/g, '').length !== 6) {
      setError('Please provide a valid 6-digit Indian PIN code.');
      return;
    }

    if (formData.payment_method === 'Online') {
      handleRazorpayPayment();
    } else {
      handleCodPayment();
    }
  };

  return (
    <>
      {/* Razorpay Checkout Script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <OriginalHeader />

      <section className="checkout-section p_relative pt_60 pb_100" style={{ background: '#FAFBFC' }}>
        <div className="auto-container">
          <div className="sec-title mb_30">
            <span style={{ color: '#C5A059', fontWeight: 800, fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              SECURE DISPATCH
            </span>
            <h1 style={{ fontWeight: 900, color: '#0F172A', fontFamily: "'Outfit', sans-serif", fontSize: '32px', marginTop: '6px' }}>
              Complete Your Order
            </h1>
            <p style={{ color: '#64748B', marginTop: '6px', fontSize: '14px' }}>
              Genuine OEM parts guarantee with fast Pan-India air express delivery
            </p>
          </div>

          {/* Customer Login Banner / Status */}
          <div
            style={{
              background: customer ? '#F0FDF4' : '#FBF7EE',
              border: customer ? '1px solid #86EFAC' : '1px solid rgba(197, 160, 89, 0.4)',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {customer ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#15803D', fontSize: '14px' }}>
                <i className="fas fa-check-circle" style={{ fontSize: '18px' }}></i>
                <span>
                  Logged in as <strong>+91 {customer.phone}</strong> {customer.name ? `(${customer.name})` : ''} — Saved details auto-filled!
                </span>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#854D0E', fontSize: '14px' }}>
                  <i className="fas fa-user-circle" style={{ fontSize: '20px', color: '#C5A059' }}></i>
                  <span>Have an account or want to save your address for express checkout?</span>
                </div>
                <button
                  type="button"
                  onClick={openLoginModal}
                  style={{
                    background: '#0F172A',
                    color: '#fff',
                    border: 'none',
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#C5A059')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#0F172A')}
                >
                  <i className="fas fa-mobile-alt me-1"></i> Login with Mobile OTP
                </button>
              </>
            )}
          </div>

          {error && (
            <div className="alert alert-danger mb_30" role="alert" style={{ borderRadius: '10px', border: '1px solid #FCA5A5', background: '#FEF2F2', color: '#991B1B' }}>
              <i className="fas fa-exclamation-circle me-2"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row clearfix">
              {/* Billing Column */}
              <div className="col-lg-7 col-md-12 col-sm-12 billing-column">
                <div className="billing-info luxury-card" style={{ padding: '30px', background: '#FFFFFF' }}>
                  <h4
                    style={{
                      fontWeight: 800,
                      color: '#0F172A',
                      borderBottom: '2px solid #C5A059',
                      display: 'inline-block',
                      marginBottom: '25px',
                      paddingBottom: '5px',
                      fontSize: '18px',
                    }}
                  >
                    1. Shipping & Contact Information
                  </h4>

                  <div className="row">
                    <div className="col-12 mb_20">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                        Full Name <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g. Rahul Sharma"
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                    </div>

                    <div className="col-lg-6 col-md-6 mb_20">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                        10-Digit Mobile Number <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        name="customer_phone"
                        value={formData.customer_phone}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="9876543210"
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                    </div>

                    <div className="col-lg-6 col-md-6 mb_20">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                        Email Address <small style={{ color: '#888' }}>(Optional - for invoice)</small>
                      </label>
                      <input
                        type="email"
                        name="customer_email"
                        value={formData.customer_email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="name@example.com"
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                    </div>

                    <div className="col-12 mb_20">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                        House / Flat / Shop / Street Address <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Plot No. 42, Auto Market, Main Road"
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                    </div>

                    <div className="col-lg-4 col-md-4 mb_20">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                        6-Digit PIN Code <span style={{ color: 'red' }}>*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g. 110001"
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                    </div>

                    <div className="col-lg-4 col-md-4 mb_20">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                        City / District
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g. New Delhi"
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                    </div>

                    <div className="col-lg-4 col-md-4 mb_20">
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>
                        State
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g. Delhi"
                        required
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                    </div>
                  </div>

                  {/* Pincode Estimated Delivery Banner */}
                  {deliveryInfo && (
                    <div
                      style={{
                        background: '#ecfdf5',
                        border: '1px solid #a7f3d0',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: '#065f46',
                        fontSize: '14px',
                      }}
                    >
                      <i className="fas fa-shipping-fast" style={{ fontSize: '20px', color: '#059669' }}></i>
                      <div>
                        <strong>Estimated Delivery by {deliveryInfo.estimatedDate}</strong>
                        <div style={{ fontSize: '12px', color: '#047857' }}>
                          Free Express Shipping to {deliveryInfo.city || formData.city}, {deliveryInfo.state || formData.state} ({formData.pincode})
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary & Payment Column */}
              <div className="col-lg-5 col-md-12 col-sm-12 order-column">
                <div className="order-summary luxury-card" style={{ padding: '30px', background: '#FFFFFF' }}>
                  <h4 style={{ fontWeight: 800, color: '#0F172A', marginBottom: '25px', fontSize: '18px' }}>
                    2. Order Summary
                  </h4>

                  <div className="order-items-list mb_25" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex justify-content-between align-items-center mb_15"
                        style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}
                      >
                        <div style={{ flex: 1, paddingRight: '10px' }}>
                          <span style={{ fontWeight: 600, color: '#0F172A', display: 'block', fontSize: '13px' }}>
                            {item.name}
                          </span>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                            {item.quantity} x &#8377;{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        <span style={{ fontWeight: 700, color: '#0F172A' }}>
                          &#8377;{Number(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="total-box mt_10">
                    <div className="d-flex justify-content-between mb_10" style={{ fontSize: '14px', color: '#64748B' }}>
                      <span>Subtotal ({cart.length} items)</span>
                      <span style={{ color: '#0F172A' }}>&#8377;{Number(cartTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="d-flex justify-content-between mb_10" style={{ fontSize: '14px', color: '#64748B' }}>
                      <span>Express Air Shipping</span>
                      <span style={{ color: '#15803D', fontWeight: 700 }}>FREE</span>
                    </div>
                    <div
                      className="d-flex justify-content-between mb_25"
                      style={{ fontSize: '20px', fontWeight: 900, borderTop: '1.5px solid #F1F5F9', paddingTop: '15px', color: '#0F172A' }}
                    >
                      <span>Total Amount</span>
                      <span style={{ color: '#0F172A' }}>
                        &#8377;{Number(cartTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="payment-methods" style={{ marginBottom: '25px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 800, fontSize: '14px', color: '#0F172A' }}>
                      Select Payment Method:
                    </label>

                    {/* Online via Razorpay */}
                    <div
                      className="payment-method-item mb_12"
                      style={{
                        background: formData.payment_method === 'Online' ? '#FBF7EE' : '#FFFFFF',
                        padding: '14px 18px',
                        borderRadius: '10px',
                        border: formData.payment_method === 'Online' ? '1.5px solid #C5A059' : '1px solid #E2E8F0',
                        cursor: 'pointer',
                        transition: '0.2s',
                      }}
                      onClick={() => setFormData({ ...formData, payment_method: 'Online' })}
                    >
                      <label
                        className="d-flex align-items-center justify-content-between"
                        style={{ fontWeight: 700, color: '#0F172A', cursor: 'pointer', width: '100%', margin: 0 }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <input
                            type="radio"
                            name="payment_method"
                            value="Online"
                            checked={formData.payment_method === 'Online'}
                            onChange={() => {}}
                            style={{ width: '18px', height: '18px', accentColor: '#C5A059' }}
                          />
                          <div>
                            <span style={{ display: 'block', fontSize: '13px' }}>UPI / Credit & Debit Cards / NetBanking</span>
                            <small style={{ color: '#64748B', fontWeight: 400 }}>Instant verification via Razorpay (GPay, PhonePe, Cards)</small>
                          </div>
                        </div>
                        <i className="fas fa-shield-alt" style={{ color: '#C5A059', fontSize: '18px' }}></i>
                      </label>
                    </div>

                    {/* Cash on Delivery */}
                    <div
                      className="payment-method-item"
                      style={{
                        background: formData.payment_method === 'COD' ? '#FBF7EE' : '#FFFFFF',
                        padding: '14px 18px',
                        borderRadius: '10px',
                        border: formData.payment_method === 'COD' ? '1.5px solid #C5A059' : '1px solid #E2E8F0',
                        cursor: 'pointer',
                        transition: '0.2s',
                      }}
                      onClick={() => setFormData({ ...formData, payment_method: 'COD' })}
                    >
                      <label
                        className="d-flex align-items-center justify-content-between"
                        style={{ fontWeight: 700, color: '#0F172A', cursor: 'pointer', width: '100%', margin: 0 }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <input
                            type="radio"
                            name="payment_method"
                            value="COD"
                            checked={formData.payment_method === 'COD'}
                            onChange={() => {}}
                            style={{ width: '18px', height: '18px', accentColor: '#C5A059' }}
                          />
                          <div>
                            <span style={{ display: 'block', fontSize: '13px' }}>Cash on Delivery (COD)</span>
                            <small style={{ color: '#64748B', fontWeight: 400 }}>Pay upon courier doorstep delivery</small>
                          </div>
                        </div>
                        <i className="fas fa-hand-holding-usd" style={{ color: '#10b981', fontSize: '18px' }}></i>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-luxury-primary w-100"
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '14px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.7 : 1,
                    }}
                  >
                    {isSubmitting ? (
                      <span>
                        <i className="fas fa-spinner fa-spin me-2"></i> Processing Order...
                      </span>
                    ) : formData.payment_method === 'Online' ? (
                      `Pay ₹${Number(cartTotal).toLocaleString('en-IN')} via Razorpay`
                    ) : (
                      'Confirm Cash on Delivery Order'
                    )}
                  </button>

                  <div className="checkout-help mt_25 text-center" style={{ background: '#F8FAFC', padding: '15px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <h6 style={{ fontWeight: 700, color: '#0F172A', marginBottom: '5px', fontSize: '13px' }}>
                      <i className="fas fa-lock" style={{ color: '#C5A059', marginRight: '6px' }}></i>
                      Guaranteed Safe & Secure Checkout
                    </h6>
                    <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
                      256-Bit SSL Encrypted | Genuine Car Spares | Pan-India Logistics
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>

      <OriginalFooter />
    </>
  );
}
