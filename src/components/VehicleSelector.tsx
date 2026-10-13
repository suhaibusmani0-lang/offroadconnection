'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LUXURY_MAKES, MODEL_YEARS, LUXURY_PART_CATEGORIES, VehicleMake } from '@/constants/vehicles';

interface VehicleSelectorProps {
  variant?: 'hero' | 'bar' | 'compact';
  onSearch?: (params: { make: string; model: string; year: string; category: string }) => void;
  className?: string;
}

export default function VehicleSelector({ variant = 'hero', onSearch, className = '' }: VehicleSelectorProps) {
  const router = useRouter();

  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [savedVehicle, setSavedVehicle] = useState<string | null>(null);

  // Initialize from URL or LocalStorage
  useEffect(() => {
    let urlMake = '';
    let urlModel = '';
    let urlYear = '';
    let urlCat = '';

    if (typeof window !== 'undefined') {
      const sp = new URLSearchParams(window.location.search);
      urlMake = sp.get('make') || '';
      urlModel = sp.get('model') || '';
      urlYear = sp.get('year') || '';
      urlCat = sp.get('category') || '';
    }

    if (urlMake) setSelectedMake(urlMake);
    if (urlModel) setSelectedModel(urlModel);
    if (urlYear) setSelectedYear(urlYear);
    if (urlCat) setSelectedCategory(urlCat);

    // Check localStorage for "My Garage"
    try {
      const garage = localStorage.getItem('offroad_my_garage');
      if (garage) {
        const parsed = JSON.parse(garage);
        if (!urlMake && parsed.make) setSelectedMake(parsed.make);
        if (!urlModel && parsed.model) setSelectedModel(parsed.model);
        if (!urlYear && parsed.year) setSelectedYear(parsed.year);
        setSavedVehicle(`${parsed.year ? parsed.year + ' ' : ''}${parsed.make} ${parsed.model || ''}`);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Update available models when make changes
  useEffect(() => {
    if (!selectedMake) {
      setAvailableModels([]);
      setSelectedModel('');
      return;
    }

    const foundMake = LUXURY_MAKES.find(
      (m) => m.name.toLowerCase() === selectedMake.toLowerCase() || m.id.toLowerCase() === selectedMake.toLowerCase()
    );

    if (foundMake) {
      setAvailableModels(foundMake.models);
      // Reset model if not in the new list
      if (selectedModel && !foundMake.models.includes(selectedModel)) {
        setSelectedModel('');
      }
    } else {
      setAvailableModels([]);
    }
  }, [selectedMake]);

  const handleMakeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMake(e.target.value);
    setSelectedModel('');
  };

  const handleFindParts = (e: React.FormEvent) => {
    e.preventDefault();

    // Save to My Garage
    if (selectedMake) {
      try {
        localStorage.setItem(
          'offroad_my_garage',
          JSON.stringify({
            make: selectedMake,
            model: selectedModel,
            year: selectedYear,
          })
        );
        setSavedVehicle(`${selectedYear ? selectedYear + ' ' : ''}${selectedMake} ${selectedModel || ''}`);
      } catch (e) {
        // ignore
      }
    }

    if (onSearch) {
      onSearch({
        make: selectedMake,
        model: selectedModel,
        year: selectedYear,
        category: selectedCategory,
      });
      return;
    }

    const params = new URLSearchParams();
    if (selectedMake) params.set('make', selectedMake);
    if (selectedModel) params.set('model', selectedModel);
    if (selectedYear) params.set('year', selectedYear);
    if (selectedCategory) params.set('category', selectedCategory);

    router.push(`/shop?${params.toString()}`);
  };

  const handleClearGarage = () => {
    try {
      localStorage.removeItem('offroad_my_garage');
    } catch (e) {}
    setSavedVehicle(null);
    setSelectedMake('');
    setSelectedModel('');
    setSelectedYear('');
    setSelectedCategory('');
    if (typeof window !== 'undefined' && window.location.pathname.includes('/shop')) {
      router.push('/shop');
    }
  };

  return (
    <div
      className={`vehicle-selector-wrapper ${className}`}
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 20px 45px -12px rgba(15, 23, 42, 0.08)',
        padding: variant === 'hero' ? '28px 32px' : '20px',
        position: 'relative',
        zIndex: 10,
      }}
    >
      {/* Top Header & Guarantee Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #FBF7EE 0%, #F5E8CC 100%)',
              border: '1px solid #C5A059',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C5A059',
              fontSize: '16px',
            }}
          >
            <i className="fas fa-car-alt"></i>
          </div>
          <div>
            <h3
              style={{
                fontSize: variant === 'hero' ? '18px' : '16px',
                fontWeight: 800,
                color: '#0F172A',
                margin: 0,
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: '-0.3px',
              }}
            >
              Select Your Vehicle
            </h3>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>
              Find exact-fit parts for luxury & 4x4 models
            </span>
          </div>
        </div>

        {/* Fitment Guarantee Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#F0FDF4',
            border: '1px solid #86EFAC',
            color: '#15803D',
            padding: '4px 12px',
            borderRadius: '9999px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.3px',
          }}
        >
          <i className="fas fa-shield-alt"></i>
          <span>100% Guaranteed Fitment</span>
        </div>
      </div>

      {/* Active Vehicle (Garage) Indicator */}
      {savedVehicle && (
        <div
          style={{
            marginBottom: '16px',
            padding: '10px 16px',
            background: '#FBF7EE',
            border: '1px solid rgba(197, 160, 89, 0.4)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#854D0E' }}>
            <i className="fas fa-check-circle" style={{ color: '#C5A059' }}></i>
            <span>
              <strong>My Garage:</strong> {savedVehicle}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClearGarage}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              fontSize: '11px',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
            }}
          >
            Clear / Change
          </button>
        </div>
      )}

      {/* 4-Step Form */}
      <form onSubmit={handleFindParts}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              variant === 'hero' ? 'repeat(auto-fit, minmax(200px, 1fr))' : '1fr',
            gap: '16px',
            alignItems: 'flex-end',
          }}
        >
          {/* STEP 1: MAKE */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#64748B',
                marginBottom: '6px',
                letterSpacing: '0.5px',
              }}
            >
              1. Vehicle Make
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedMake}
                onChange={handleMakeChange}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: selectedMake ? '1.5px solid #C5A059' : '1.5px solid #E2E8F0',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '13px',
                  fontWeight: 600,
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <option value="">Select Make (Audi, BMW, Benz...)</option>
                {LUXURY_MAKES.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
              <i
                className="fas fa-chevron-down"
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  fontSize: '11px',
                  color: '#94A3B8',
                }}
              ></i>
            </div>
          </div>

          {/* STEP 2: MODEL */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#64748B',
                marginBottom: '6px',
                letterSpacing: '0.5px',
              }}
            >
              2. Vehicle Model
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedMake || availableModels.length === 0}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: selectedModel ? '1.5px solid #C5A059' : '1.5px solid #E2E8F0',
                  background: !selectedMake ? '#F8FAFC' : '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '13px',
                  fontWeight: 600,
                  outline: 'none',
                  appearance: 'none',
                  cursor: !selectedMake ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <option value="">
                  {!selectedMake ? 'Select Make First' : 'Select Model'}
                </option>
                {availableModels.map((mod) => (
                  <option key={mod} value={mod}>
                    {mod}
                  </option>
                ))}
              </select>
              <i
                className="fas fa-chevron-down"
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  fontSize: '11px',
                  color: '#94A3B8',
                }}
              ></i>
            </div>
          </div>

          {/* STEP 3: YEAR */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#64748B',
                marginBottom: '6px',
                letterSpacing: '0.5px',
              }}
            >
              3. Year
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: selectedYear ? '1.5px solid #C5A059' : '1.5px solid #E2E8F0',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '13px',
                  fontWeight: 600,
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <option value="">All Model Years</option>
                {MODEL_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <i
                className="fas fa-chevron-down"
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  fontSize: '11px',
                  color: '#94A3B8',
                }}
              ></i>
            </div>
          </div>

          {/* STEP 4: PART CATEGORY */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#64748B',
                marginBottom: '6px',
                letterSpacing: '0.5px',
              }}
            >
              4. Part Category
            </label>
            <div style={{ position: 'relative' }}>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: selectedCategory ? '1.5px solid #C5A059' : '1.5px solid #E2E8F0',
                  background: '#FFFFFF',
                  color: '#0F172A',
                  fontSize: '13px',
                  fontWeight: 600,
                  outline: 'none',
                  appearance: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <option value="">All Part Categories</option>
                {LUXURY_PART_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <i
                className="fas fa-chevron-down"
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  fontSize: '11px',
                  color: '#94A3B8',
                }}
              ></i>
            </div>
          </div>

          {/* CTA BUTTON */}
          <div>
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.5px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(15, 23, 42, 0.25)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #C5A059 0%, #B38E46 100%)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(197, 160, 89, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(15, 23, 42, 0.25)';
              }}
            >
              <i className="fas fa-search" style={{ fontSize: '13px' }}></i>
              <span>FIND PARTS</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

