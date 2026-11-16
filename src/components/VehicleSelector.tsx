'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LUXURY_MAKES, MODEL_YEARS, LUXURY_PART_CATEGORIES } from '@/constants/vehicles';
import { Car, Search, ShieldCheck, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, Sparkles } from 'lucide-react';

interface VehicleSelectorProps {
  variant?: 'hero' | 'bar' | 'compact';
  onSearch?: (params: { make: string; model: string; year: string; category: string }) => void;
  className?: string;
}

export default function VehicleSelector({ variant = 'hero', onSearch, className = '' }: VehicleSelectorProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'vehicle' | 'vin'>('vehicle');

  // Vehicle Form State
  const [selectedMake, setSelectedMake] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [savedVehicle, setSavedVehicle] = useState<string | null>(null);

  // VIN State
  const [vinNumber, setVinNumber] = useState('');
  const [vinLoading, setVinLoading] = useState(false);
  const [vinError, setVinError] = useState('');
  const [vinResult, setVinResult] = useState<any>(null);

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
    } catch (e) {}
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
      } catch (e) {}
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

  const handleVinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vinNumber.trim()) return;
    setVinLoading(true);
    setVinError('');
    setVinResult(null);

    try {
      const res = await fetch(`/api/vin/decode?vin=${encodeURIComponent(vinNumber.trim())}`);
      const json = await res.json();
      if (json.success) {
        setVinResult(json);
        // Save to My Garage
        try {
          localStorage.setItem(
            'offroad_my_garage',
            JSON.stringify({
              make: json.decoded.make,
              model: json.decoded.series,
              year: json.decoded.modelYear,
              vin: json.vin,
            })
          );
          setSavedVehicle(`${json.decoded.modelYear} ${json.decoded.make} (${json.decoded.series})`);
        } catch (e) {}
      } else {
        setVinError(json.error || 'Failed to decode VIN. Please check the 17-digit chassis code.');
      }
    } catch (err) {
      setVinError('Service temporarily unreachable. Please try again.');
    } finally {
      setVinLoading(false);
    }
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
      className={`vehicle-selector-wrapper ${className} rounded-2xl bg-white border border-[#E2E8F0] shadow-2xl p-6 lg:p-8 relative z-10`}
    >
      {/* Selector Header with Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#E5B869] shadow-[0_0_8px_#E5B869]" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0F172A]" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Laser-Precision Fitment Engine
            </span>
          </div>
          <h3 className="text-xl font-black text-[#0F172A]" style={{ fontFamily: "'Raleway', sans-serif" }}>
            Select Your Vehicle
          </h3>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="flex items-center bg-[#F1F5F9] p-1 rounded-xl border border-zinc-200">
          <button
            type="button"
            onClick={() => setActiveTab('vehicle')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'vehicle'
                ? 'bg-white text-black shadow-sm font-extrabold'
                : 'text-zinc-600 hover:text-black'
            }`}
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            By Make & Model
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vin')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'vin'
                ? 'bg-white text-black shadow-sm font-extrabold'
                : 'text-zinc-600 hover:text-black'
            }`}
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            <Sparkles className="w-3 h-3 text-[#C59D4F]" />
            <span>By 17-Digit VIN</span>
          </button>
        </div>
      </div>

      {/* Active Garage Banner */}
      {savedVehicle && (
        <div className="mb-5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5 text-[#0F172A]">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong className="font-extrabold" style={{ fontFamily: "'Raleway', sans-serif" }}>Active Garage:</strong>{' '}
              {savedVehicle}
            </span>
          </div>
          <button
            type="button"
            onClick={handleClearGarage}
            className="text-zinc-500 hover:text-black font-semibold text-[11px] underline cursor-pointer"
          >
            Reset
          </button>
        </div>
      )}

      {/* TAB 1: Make / Model / Year / Category */}
      {activeTab === 'vehicle' ? (
        <form onSubmit={handleFindParts} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. MAKE */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 mb-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>
                1. Make
              </label>
              <select
                value={selectedMake}
                onChange={handleMakeChange}
                className="w-full bg-[#F8FAFC] border border-zinc-200 rounded-xl px-3.5 py-3 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#C59D4F] focus:outline-none transition-all cursor-pointer"
              >
                <option value="">Select Make (BMW, Audi, Benz...)</option>
                {LUXURY_MAKES.map((m) => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. MODEL */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 mb-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>
                2. Model Series
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedMake || availableModels.length === 0}
                className="w-full bg-[#F8FAFC] border border-zinc-200 rounded-xl px-3.5 py-3 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#C59D4F] focus:outline-none transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">
                  {selectedMake ? 'Select Model' : 'Choose Make First'}
                </option>
                {availableModels.map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. YEAR */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 mb-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>
                3. Production Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-zinc-200 rounded-xl px-3.5 py-3 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#C59D4F] focus:outline-none transition-all cursor-pointer"
              >
                <option value="">All Years (2010 - 2026)</option>
                {MODEL_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. COMPONENT CATEGORY */}
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 mb-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>
                4. Part Subsystem
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-zinc-200 rounded-xl px-3.5 py-3 text-xs font-bold text-[#0F172A] focus:bg-white focus:border-[#C59D4F] focus:outline-none transition-all cursor-pointer"
              >
                <option value="">All Luxury Categories</option>
                {LUXURY_PART_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-zinc-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>100% VIN Chassis Fitment Guarantee with 6-Month Manufacturer Replacement</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#E5B869] text-black font-black text-xs tracking-wider shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              <Search className="w-4 h-4 stroke-[3]" />
              <span>EXPLORE COMPATIBLE PARTS</span>
            </button>
          </div>
        </form>
      ) : (
        /* TAB 2: Instant 17-Digit VIN Lookup */
        <form onSubmit={handleVinSubmit} className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
            <label className="block text-xs font-bold text-[#0F172A] mb-1.5" style={{ fontFamily: "'Raleway', sans-serif" }}>
              Enter 17-Digit Chassis Number (VIN) from your RC or Dashboard Plate
            </label>
            <div className="flex gap-2.5">
              <input
                type="text"
                maxLength={17}
                placeholder="e.g. WAUZZZ4G8EN012345 or WBA3D..."
                value={vinNumber}
                onChange={(e) => setVinNumber(e.target.value.toUpperCase())}
                className="flex-1 bg-white border border-zinc-300 rounded-xl px-4 py-3 text-sm font-mono font-bold tracking-wider text-[#0F172A] focus:border-[#C59D4F] focus:outline-none uppercase"
              />
              <button
                type="submit"
                disabled={vinLoading || !vinNumber.trim()}
                className="px-6 py-3 rounded-xl bg-black text-white font-black text-xs tracking-wider hover:bg-zinc-800 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                {vinLoading ? <RefreshCw className="w-4 h-4 animate-spin text-[#E5B869]" /> : <Search className="w-4 h-4" />}
                <span>DECODE VIN</span>
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 mt-2">
              Our automated engine identifies your exact chassis series, engine assembly, and matches factory OEM spare part numbers with zero margin of error.
            </p>
          </div>

          {vinError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{vinError}</span>
            </div>
          )}

          {vinResult && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/40 border border-amber-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[#0F172A] text-sm" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  ✓ {vinResult.decoded.make} • {vinResult.decoded.series} ({vinResult.decoded.modelYear})
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                  Chassis Validated
                </span>
              </div>
              <div className="text-zinc-600 text-[11px]">
                Assembly Plant: {vinResult.decoded.assemblyPlant} • Origin: {vinResult.decoded.countryOfOrigin}
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-emerald-700 font-bold">
                  {vinResult.compatibleProductsCount} Precision Compatible Parts in Live Stock
                </span>
                <button
                  type="button"
                  onClick={() => router.push(`/shop?make=${encodeURIComponent(vinResult.decoded.make)}`)}
                  className="px-4 py-1.5 rounded-lg bg-black text-white font-bold text-xs hover:bg-zinc-800 flex items-center gap-1.5 cursor-pointer"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  <span>Browse Compatible Spares</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
