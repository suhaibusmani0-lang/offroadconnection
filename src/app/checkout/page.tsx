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
    payment_method: 'Online',
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
        <section style={{ padding: '80px 0', background: '#FAFAFA' }}>
          <div className="auto-container text-center py-5">
            <i className="fas fa-shopping-bag mb_20" style={{ fontSize: '48px', color: '#A1A1AA' }}></i>
            <h4 style={{ fontWeight: 800, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>Your shopping bag is empty</h4>
            <p style={{ color: '#71717A', fontFamily: "'Lato', sans-serif" }}>Please add items before proceeding to checkout.</p>
            <Link
              href="/shop"
              className="btn-luxury-primary mt_20"
              style={{
                textDecoration: 'none',
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              Explore Parts Catalog
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

      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection or use COD.');
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'DRANparts',
        description: `Car Spare Parts Order (${cart.length} items)`,
        image: '/assets/images/banner/banner-1.jpg',
        order_id: orderData.orderId,
        prefill: {
          name: formData.customer_name,
          email: formData.customer_email || 'customer@dranparts.com',
          contact: formData.customer_phone,
        },
        theme: {
          color: '#000000',
        },
        handler: async function (response: any) {
          try {
            await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

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

  // Handle COD Payment
  const handleCODPayment = async () => {
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
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to place COD order');
      }

      trackPurchase({
        order_number: data.orderNumber,
        total_amount: cartTotal,
        items: cart,
      });

      clearCart();
      router.push(`/thank-you?orderId=${data.orderId}&orderNumber=${data.orderNumber}`);
    } catch (err: any) {
      setError(err.message || 'Something went wrong while placing your order.');
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.customer_phone || !formData.street || !formData.pincode) {
      setError('Please fill in all mandatory shipping address fields.');
      return;
    }

    if (formData.customer_phone.length !== 10) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }

    if (formData.payment_method === 'Online') {
      handleRazorpayPayment();
    } else {
      handleCODPayment();
    }
  };

  return (
    <>
      <OriginalHeader />

      {/* Razorpay SDK */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      {/* Breadcrumb Strip */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid #E4E4E7', padding: '16px 0' }}>
        <div className="auto-container">
          <div className="luxury-breadcrumb" style={{ padding: 0 }}>
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <Link href="/cart">Bag</Link>
            <span className="separator">/</span>
            <span className="current">Secure Checkout</span>
          </div>
        </div>
      </section>

      {/* Checkout Form Section */}
      <section style={{ padding: '50px 0 80px', background: '#FAFAFA' }}>
        <div className="auto-container">
          {/* Customer Auth Banner */}
          <div
            style={{
              background: '#FFFFFF',
              border: '1px solid #E4E4E7',
              borderRadius: '8px',
              padding: '16px 20px',
              marginBottom: '26px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            {customer ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#000000', fontSize: '13px' }}>
                <i className="fas fa-check-circle" style={{ fontSize: '16px' }}></i>
                <span>
                  Logged in as <strong>+91 {customer.phone}</strong> {customer.name ? `(${customer.name})` : ''} — Verified address loaded!
                </span>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#18181B', fontSize: '13px' }}>
                  <i className="fas fa-user-circle" style={{ fontSize: '18px', color: '#000000' }}></i>
                  <span>Returning customer? Log in with Mobile OTP to use saved addresses:</span>
                </div>
                <button
                  type="button"
                  onClick={openLoginModal}
                  style={{
                    background: '#000000',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer',
                    fontFamily: "'Raleway', sans-serif",
                    letterSpacing: '0.5px',
                  }}
                >
                  LOGIN WITH OTP
                </button>
              </>
            )}
          </div>

          {error && (
            <div className="alert alert-danger mb_30" role="alert" style={{ borderRadius: '8px', border: '1px solid #E4E4E7', background: '#FFFFFF', color: '#000000', padding: '14px 20px', fontWeight: 600, fontSize: '13px' }}>
              <i className="fas fa-exclamation-circle me-2"></i> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row clearfix">
              {/* Billing Column */}
              <div className="col-lg-7 col-md-12 col-sm-12 billing-column">
                <div className="billing-info luxury-card" style={{ padding: '28px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E4E4E7' }}>
                  <h4
                    style={{
                      fontWeight: 800,
                      color: '#000000',
                      borderBottom: '2px solid #000000',
                      display: 'inline-block',
                      marginBottom: '22px',
                      paddingBottom: '4px',
                      fontSize: '16px',
                      fontFamily: "'Raleway', sans-serif",
                      letterSpacing: '-0.3px',
                    }}
                  >
                    1. Shipping & Contact Information
                  </h4>

                  <div className="row">
                    <div className="col-12 mb_20">
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '12px', color: '#52525B', fontFamily: "'Raleway', sans-serif" }}>
                        Full Name <span style={{ color: '#000000' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="e.g. Rahul Sharma"
                        required
                        style={{ padding: '11px', borderRadius: '6px', border: '1.5px solid #E4E4E7', fontFamily: "'Lato', sans-serif", fontSize: '13px' }}
                      />
                    </div>

                    <div className="col-lg-6 col-md-6 mb_20">
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '12px', color: '#52525B', fontFamily: "'Raleway', sans-serif" }}>
                        10-Digit Mobile Number <span style={{ color: '#000000' }}>*</span>
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
                        style={{ padding: '11px', borderRadius: '6px', border: '1.5px solid #E4E4E7', fontFamily: "'Lato', sans-serif", fontSize: '13px' }}
                      />
                    </div>

                    <div className="col-lg-6 col-md-6 mb_20">
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '12px', color: '#52525B', fontFamily: "'Raleway', sans-serif" }}>
                        Email Address <small style={{ color: '#71717A' }}>(Optional)</small>
                      </label>
                      <input
                        type="email"
                        name="customer_email"
                        value={formData.customer_email}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="name@example.com"
                        style={{ padding: '11px', borderRadius: '6px', border: '1.5px solid #E4E4E7', fontFamily: "'Lato', sans-serif", fontSize: '13px' }}
                      />
                    </div>

                    <div className="col-12 mb_20">
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '12px', color: '#52525B', fontFamily: "'Raleway', sans-serif" }}>
                        House / Flat / Shop / Street Address <span style={{ color: '#000000' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className="form-control"
                        placeholder="Plot No. 42, Sector 10, Main Road"
                        required
                        style={{ padding: '11px', borderRadius: '6px', border: '1.5px solid #E4E4E7', fontFamily: "'Lato', sans-serif", fontSize: '13px' }}
                      />
                    </div>

                    <div className="col-lg-4 col-md-4 mb_20">
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '12px', color: '#52525B', fontFamily: "'Raleway', sans-serif" }}>
                        6-Digit PIN Code <span style={{ color: '#000000' }}>*</span>
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
                        style={{ padding: '11px', borderRadius: '6px', border: '1.5px solid #E4E4E7', fontFamily: "'Lato', sans-serif", fontSize: '13px' }}
                      />
                    </div>

                    <div className="col-lg-4 col-md-4 mb_20">
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '12px', color: '#52525B', fontFamily: "'Raleway', sans-serif" }}>
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
                        style={{ padding: '11px', borderRadius: '6px', border: '1.5px solid #E4E4E7', fontFamily: "'Lato', sans-serif", fontSize: '13px' }}
                      />
                    </div>

                    <div className="col-lg-4 col-md-4 mb_20">
                      <label style={{ display: 'block', marginBottom: '6px', fontWeight: 700, fontSize: '12px', color: '#52525B', fontFamily: "'Raleway', sans-serif" }}>
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
                        style={{ padding: '11px', borderRadius: '6px', border: '1.5px solid #E4E4E7', fontFamily: "'Lato', sans-serif", fontSize: '13px' }}
                      />
                    </div>
                  </div>

                  {/* Pincode Estimated Delivery Banner */}
                  {deliveryInfo && (
                    <div
                      style={{
                        background: '#F4F4F5',
                        border: '1px solid #E4E4E7',
                        borderRadius: '6px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: '#000000',
                        fontSize: '13px',
                      }}
                    >
                      <i className="fas fa-truck-moving" style={{ fontSize: '18px', color: '#000000' }}></i>
                      <div>
                        <strong style={{ fontFamily: "'Raleway', sans-serif" }}>Estimated Air Express Delivery by {deliveryInfo.estimatedDate}</strong>
                        <div style={{ fontSize: '12px', color: '#71717A', fontFamily: "'Lato', sans-serif" }}>
                          Free Dispatch to {deliveryInfo.city || formData.city}, {deliveryInfo.state || formData.state} ({formData.pincode})
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Summary & Payment Column */}
              <div className="col-lg-5 col-md-12 col-sm-12 order-column">
                <div className="order-summary luxury-card" style={{ padding: '28px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E4E4E7' }}>
                  <h4 style={{ fontWeight: 800, color: '#000000', marginBottom: '20px', fontSize: '16px', fontFamily: "'Raleway', sans-serif" }}>
                    2. Order Summary
                  </h4>

                  <div className="order-items-list mb_25" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex justify-content-between align-items-center mb_15"
                        style={{ borderBottom: '1px solid #F4F4F5', paddingBottom: '10px' }}
                      >
                        <div style={{ flex: 1, paddingRight: '10px' }}>
                          <span style={{ fontWeight: 700, color: '#000000', display: 'block', fontSize: '13px', fontFamily: "'Raleway', sans-serif" }}>
                            {item.name}
                          </span>
                          <div style={{ fontSize: '11px', color: '#71717A', marginTop: '2px', fontFamily: "'Lato', sans-serif" }}>
                            {item.quantity} x &#8377;{Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                        <span style={{ fontWeight: 800, color: '#000000', fontFamily: "'Raleway', sans-serif", fontSize: '13px' }}>
                          &#8377;{Number(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="total-box mt_10">
                    <div className="d-flex justify-content-between mb_10" style={{ fontSize: '13px', color: '#71717A', fontFamily: "'Lato', sans-serif" }}>
                      <span>Subtotal ({cart.length} items)</span>
                      <span style={{ color: '#000000', fontWeight: 700, fontFamily: "'Raleway', sans-serif" }}>&#8377;{Number(cartTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="d-flex justify-content-between mb_10" style={{ fontSize: '13px', color: '#71717A', fontFamily: "'Lato', sans-serif" }}>
                      <span>Express Air Shipping</span>
                      <span style={{ color: '#000000', fontWeight: 700, fontFamily: "'Raleway', sans-serif" }}>FREE</span>
                    </div>
                    <div
                      className="d-flex justify-content-between mb_25"
                      style={{ fontSize: '18px', fontWeight: 900, borderTop: '1.5px solid #F4F4F5', paddingTop: '14px', color: '#000000', fontFamily: "'Raleway', sans-serif" }}
                    >
                      <span>Total Amount</span>
                      <span style={{ color: '#000000' }}>
                        &#8377;{Number(cartTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="payment-methods" style={{ marginBottom: '22px' }}>
                    <label style={{ display: 'block', marginBottom: '10px', fontWeight: 800, fontSize: '13px', color: '#000000', fontFamily: "'Raleway', sans-serif" }}>
                      Select Payment Method:
                    </label>

                    {/* Online via Razorpay */}
                    <div
                      className="payment-method-item mb_12"
                      style={{
                        background: formData.payment_method === 'Online' ? '#F4F4F5' : '#FFFFFF',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: formData.payment_method === 'Online' ? '1.5px solid #000000' : '1px solid #E4E4E7',
                        cursor: 'pointer',
                        transition: '0.15s',
                      }}
                      onClick={() => setFormData({ ...formData, payment_method: 'Online' })}
                    >
                      <label
                        className="d-flex align-items-center justify-content-between"
                        style={{ fontWeight: 700, color: '#000000', cursor: 'pointer', width: '100%', margin: 0 }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <input
                            type="radio"
                            name="payment_method"
                            value="Online"
                            checked={formData.payment_method === 'Online'}
                            onChange={() => {}}
                            style={{ width: '16px', height: '16px', accentColor: '#000000' }}
                          />
                          <div>
                            <span style={{ display: 'block', fontSize: '13px', fontFamily: "'Raleway', sans-serif" }}>UPI / Cards / NetBanking</span>
                            <small style={{ color: '#71717A', fontWeight: 400, fontFamily: "'Lato', sans-serif" }}>Instant secure checkout via Razorpay</small>
                          </div>
                        </div>
                        <i className="fas fa-shield-alt" style={{ color: '#000000', fontSize: '16px' }}></i>
                      </label>
                    </div>

                    {/* Cash on Delivery */}
                    <div
                      className="payment-method-item"
                      style={{
                        background: formData.payment_method === 'COD' ? '#F4F4F5' : '#FFFFFF',
                        padding: '12px 16px',
                        borderRadius: '8px',
                        border: formData.payment_method === 'COD' ? '1.5px solid #000000' : '1px solid #E4E4E7',
                        cursor: 'pointer',
                        transition: '0.15s',
                      }}
                      onClick={() => setFormData({ ...formData, payment_method: 'COD' })}
                    >
                      <label
                        className="d-flex align-items-center justify-content-between"
                        style={{ fontWeight: 700, color: '#000000', cursor: 'pointer', width: '100%', margin: 0 }}
                      >
                        <div className="d-flex align-items-center gap-3">
                          <input
                            type="radio"
                            name="payment_method"
                            value="COD"
                            checked={formData.payment_method === 'COD'}
                            onChange={() => {}}
                            style={{ width: '16px', height: '16px', accentColor: '#000000' }}
                          />
                          <div>
                            <span style={{ display: 'block', fontSize: '13px', fontFamily: "'Raleway', sans-serif" }}>Cash on Delivery (COD)</span>
                            <small style={{ color: '#71717A', fontWeight: 400, fontFamily: "'Lato', sans-serif" }}>Pay upon courier delivery</small>
                          </div>
                        </div>
                        <i className="fas fa-hand-holding-usd" style={{ color: '#000000', fontSize: '16px' }}></i>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-luxury-primary w-100"
                    style={{
                      width: '100%',
                      padding: '14px',
                      fontSize: '13px',
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      opacity: isSubmitting ? 0.7 : 1,
                      fontFamily: "'Raleway', sans-serif",
                      letterSpacing: '0.8px',
                      borderRadius: '8px',
                    }}
                  >
                    {isSubmitting ? (
                      <span>
                        <i className="fas fa-spinner fa-spin me-2"></i> Processing Order...
                      </span>
                    ) : formData.payment_method === 'Online' ? (
                      `PAY ₹${Number(cartTotal).toLocaleString('en-IN')} VIA RAZORPAY`
                    ) : (
                      'CONFIRM CASH ON DELIVERY ORDER'
                    )}
                  </button>

                  <div className="checkout-help mt_25 text-center" style={{ background: '#F4F4F5', padding: '14px', borderRadius: '8px', border: '1px solid #E4E4E7' }}>
                    <h6 style={{ fontWeight: 700, color: '#000000', marginBottom: '4px', fontSize: '12px', fontFamily: "'Raleway', sans-serif" }}>
                      <i className="fas fa-lock" style={{ color: '#000000', marginRight: '6px' }}></i>
                      Guaranteed Safe & Secure Checkout
                    </h6>
                    <p style={{ margin: 0, fontSize: '11px', color: '#71717A', fontFamily: "'Lato', sans-serif" }}>
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
