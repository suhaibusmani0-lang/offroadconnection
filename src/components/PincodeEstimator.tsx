'use client';

import React, { useState, useEffect } from 'react';

interface DeliveryInfo {
  pincode: string;
  city: string;
  state: string;
  serviceable: boolean;
  deliveryDays: number;
  estimatedDate: string;
  codAvailable: boolean;
  expressAvailable: boolean;
}

export default function PincodeEstimator({ onPincodeSelect }: { onPincodeSelect?: (info: DeliveryInfo) => void }) {
  const [pincode, setPincode] = useState('');
  const [loading, setLoading] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [error, setError] = useState('');

  // Load previously checked pincode
  useEffect(() => {
    const savedPin = localStorage.getItem('offroad_user_pincode');
    if (savedPin && savedPin.length === 6) {
      setPincode(savedPin);
      checkPincode(savedPin);
    }
  }, []);

  const checkPincode = async (codeToCheck?: string) => {
    const pin = (codeToCheck || pincode).trim().replace(/\D/g, '');
    if (pin.length !== 6) {
      setError('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/pincode/${pin}`);
      const data = await res.json();

      if (data.serviceable) {
        setDeliveryInfo(data);
        localStorage.setItem('offroad_user_pincode', pin);
        if (onPincodeSelect) {
          onPincodeSelect(data);
        }
      } else {
        setError('Delivery not serviceable for this pincode yet.');
        setDeliveryInfo(null);
      }
    } catch (err) {
      setError('Unable to verify pincode at the moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '20px',
        backgroundColor: '#FFFFFF',
        margin: '20px 0',
        boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <i className="fas fa-map-marker-alt" style={{ color: '#C5A059', fontSize: '18px' }}></i>
        <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
          Pan-India Pincode Delivery Check
        </span>
      </div>

      <div style={{ display: 'flex', gap: '10px', maxWidth: '380px' }}>
        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              checkPincode();
            }
          }}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1.5px solid #E2E8F0',
            borderRadius: '8px',
            fontSize: '13px',
            outline: 'none',
            background: '#ffffff',
          }}
        />
        <button
          type="button"
          onClick={() => checkPincode()}
          disabled={loading || pincode.length !== 6}
          style={{
            background: pincode.length === 6 ? '#0F172A' : '#d1d5db',
            color: '#ffffff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            fontSize: '13px',
            cursor: pincode.length === 6 ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            if (pincode.length === 6) e.currentTarget.style.background = '#C5A059';
          }}
          onMouseLeave={(e) => {
            if (pincode.length === 6) e.currentTarget.style.background = '#0F172A';
          }}
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </div>

      {error && (
        <div style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px' }}>
          <i className="fas fa-exclamation-circle" style={{ marginRight: '6px' }}></i>
          {error}
        </div>
      )}

      {deliveryInfo && (
        <div style={{ marginTop: '14px', fontSize: '14px', color: '#374151' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              color: '#047857',
              marginBottom: '6px',
            }}
          >
            <i className="fas fa-shipping-fast" style={{ fontSize: '16px' }}></i>
            <span>
              Estimated Delivery by <strong>{deliveryInfo.estimatedDate}</strong>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px', fontSize: '13px', color: '#4b5563' }}>
            <div>
              <i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '6px' }}></i>
              {deliveryInfo.city && deliveryInfo.state ? `${deliveryInfo.city}, ${deliveryInfo.state}` : 'Serviceable Location'}
            </div>
            <div>
              <i className="fas fa-check-circle" style={{ color: '#10b981', marginRight: '6px' }}></i>
              Free Delivery on All Orders
            </div>
            <div>
              <i className="fas fa-money-bill-wave" style={{ color: '#10b981', marginRight: '6px' }}></i>
              {deliveryInfo.codAvailable ? 'Cash on Delivery Available' : 'Prepaid Only'}
            </div>
            <div>
              <i className="fas fa-undo-alt" style={{ color: '#10b981', marginRight: '6px' }}></i>
              7 Days Genuine Parts Guarantee
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
