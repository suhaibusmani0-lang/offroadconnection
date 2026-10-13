'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function CustomerLoginModal() {
  const { loginModalOpen, closeLoginModal, sendOtp, verifyOtp } = useAuth();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testOtpNotice, setTestOtpNotice] = useState('');

  if (!loginModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');
    const res = await sendOtp(cleanPhone);
    setLoading(false);

    if (res.success) {
      setStep('otp');
      if (res.testOtp) {
        setTestOtpNotice(`Demo OTP: ${res.testOtp}`);
        setOtp(res.testOtp);
      }
    } else {
      setError(res.message || 'Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }

    setLoading(true);
    setError('');
    const res = await verifyOtp(phone, otp, name);
    setLoading(false);

    if (!res.success) {
      setError(res.message);
    } else {
      // Reset form
      setStep('phone');
      setPhone('');
      setOtp('');
      setName('');
      setTestOtpNotice('');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '20px',
      }}
      onClick={closeLoginModal}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '420px',
          padding: '30px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeLoginModal}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            fontSize: '20px',
            color: '#6b7280',
            cursor: 'pointer',
          }}
        >
          <i className="fas fa-times"></i>
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              background: '#F4F4F5',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              color: '#000000',
              fontSize: '22px',
              border: '1px solid #E4E4E7',
            }}
          >
            <i className="fas fa-mobile-alt"></i>
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: '20px', fontWeight: 800, color: '#000000', fontFamily: "'Raleway', sans-serif" }}>
            {step === 'phone' ? 'Customer Login / Sign Up' : 'Verify Mobile OTP'}
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#71717A', fontFamily: "'Lato', sans-serif" }}>
            {step === 'phone'
              ? 'Enter your mobile number to view orders, saved addresses & faster checkout'
              : `Enter the 6-digit OTP sent to +91 ${phone}`}
          </p>
        </div>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            <i className="fas fa-exclamation-circle" style={{ marginRight: '6px' }}></i>
            {error}
          </div>
        )}

        {testOtpNotice && (
          <div
            style={{
              background: '#F4F4F5',
              border: '1px solid #D4D4D8',
              color: '#000000',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              marginBottom: '14px',
              fontWeight: 700,
              fontFamily: "'Lato', sans-serif",
            }}
          >
            <i className="fas fa-key" style={{ marginRight: '6px', color: '#000000' }}></i>
            {testOtpNotice}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Mobile Number
              </label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    background: '#f3f4f6',
                    border: '1px solid #d1d5db',
                    borderRight: 'none',
                    padding: '10px 12px',
                    borderRadius: '6px 0 0 6px',
                    fontSize: '14px',
                    color: '#374151',
                    fontWeight: 600,
                  }}
                >
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="Enter 10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  required
                  autoFocus
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    border: '1px solid #d1d5db',
                    borderRadius: '0 6px 6px 0',
                    fontSize: '14px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Your Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || phone.length !== 10}
              style={{
                width: '100%',
                background: phone.length === 10 ? '#000000' : '#A1A1AA',
                color: '#ffffff',
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: phone.length === 10 ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                fontFamily: "'Raleway', sans-serif",
                letterSpacing: '0.5px',
              }}
            >
              {loading ? 'Sending OTP...' : 'SEND OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                Enter 6-Digit OTP
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px',
                  textAlign: 'center',
                  letterSpacing: '8px',
                  fontSize: '20px',
                  fontWeight: 700,
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              style={{
                width: '100%',
                background: otp.length === 6 ? '#000000' : '#A1A1AA',
                color: '#ffffff',
                padding: '12px',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: otp.length === 6 ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                marginBottom: '12px',
                fontFamily: "'Raleway', sans-serif",
                letterSpacing: '0.5px',
              }}
            >
              {loading ? 'Verifying...' : 'VERIFY & CONTINUE'}
            </button>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setError('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#71717A',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Change Phone Number
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
