'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  RotateCw,
  Layers,
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  Zap,
  PhoneCall,
  Search,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatImageUrl } from '@/lib/image';

interface Hotspot {
  id: string;
  name: string;
  categoryQuery: string;
  x: number;
  y: number;
  badge: string;
  description: string;
  popularParts: string[];
}

interface AngleView {
  id: 'front' | 'side' | 'rear' | 'xray';
  label: string;
  sublabel: string;
  image: string;
  hotspots: Hotspot[];
}

const ANGLES: AngleView[] = [
  {
    id: 'front',
    label: 'Front 3/4',
    sublabel: 'Matrix LED & Aero Intakes',
    image: '/assets/images/360/car-front-34.jpg',
    hotspots: [
      {
        id: 'front-headlights',
        name: 'Matrix LED Headlights & Ballasts',
        categoryQuery: 'Headlight',
        x: 36,
        y: 47,
        badge: 'Lighting & Optical',
        description: 'Adaptive laser matrix LED clusters, ballasts, daytime running DRL modules and headlamp washer assemblies.',
        popularParts: ['Headlight Glass Lens', 'LED Control Ballast', 'Washer Jet Cylinder'],
      },
      {
        id: 'front-grille-cooling',
        name: 'Radiator, Condenser & Show Grille',
        categoryQuery: 'Radiator',
        x: 21,
        y: 57,
        badge: 'Thermal Management',
        description: 'High-efficiency aluminum core radiators, intercoolers, AC condensers, active air flaps and honey-comb grilles.',
        popularParts: ['Radiator Core Support', 'AC Condenser Fan', 'Show Center Grille'],
      },
      {
        id: 'front-brakes',
        name: 'Front Ceramic Brakes & Calipers',
        categoryQuery: 'Brake',
        x: 52,
        y: 69,
        badge: 'Stopping Power',
        description: 'Drilled ventilated carbon-ceramic discs, 6-piston multi-pot calipers, wear sensors, and low-dust ceramic pads.',
        popularParts: ['Front Drilled Rotor', 'Brake Caliper Assembly', 'Ceramic Brake Pads'],
      },
      {
        id: 'front-suspension',
        name: 'Adaptive Air Suspension & Control Arms',
        categoryQuery: 'Suspension',
        x: 48,
        y: 58,
        badge: 'Ride Dynamics',
        description: 'Pneumatic air spring struts, active damper sensors, aluminum wishbones, and heavy-duty stabilizer links.',
        popularParts: ['Airmatic Front Strut', 'Lower Control Arm Bushing', 'Sway Bar End Link'],
      },
      {
        id: 'front-mirrors',
        name: 'Aero Mirrors & Camera Sensors',
        categoryQuery: 'Side Mirror',
        x: 65,
        y: 32,
        badge: 'Driver Assistance',
        description: 'Heated electrochromic side mirrors with integrated 360 blind-spot cameras, LED turn indicators, and power-folding motors.',
        popularParts: ['Mirror Cover Carbon', 'Blind Spot Glass Mirror', 'Motor Actuator'],
      },
    ],
  },
  {
    id: 'side',
    label: 'Side Profile',
    sublabel: 'Chassis, Wheels & Doors',
    image: '/assets/images/360/car-side.jpg',
    hotspots: [
      {
        id: 'side-front-wheel',
        name: 'Front Axle & Wheel Hub Bearings',
        categoryQuery: 'Wheel Hub',
        x: 22,
        y: 70,
        badge: 'Running Gear',
        description: 'Precision forged wheel hub bearings, ABS tone rings, steering knuckle spindles, and CV axle drive shafts.',
        popularParts: ['Wheel Bearing Hub Unit', 'Drive Shaft CV Joint', 'ABS Speed Sensor'],
      },
      {
        id: 'side-door-actuators',
        name: 'Soft-Close Latches & Window Winders',
        categoryQuery: 'Door',
        x: 51,
        y: 51,
        badge: 'Cabin Hardware',
        description: 'Automatic soft-close door latch actuators, heavy duty power window regulators, exterior door handles, and weatherstrips.',
        popularParts: ['Power Window Regulator', 'Soft Close Latch Motor', 'Exterior Handle Sensor'],
      },
      {
        id: 'side-rear-suspension',
        name: 'Rear Multi-Link & Air Bellows',
        categoryQuery: 'Shock Absorber',
        x: 79,
        y: 71,
        badge: 'Rear Axle Tech',
        description: 'Rear air suspension bellows, electronically valved dampers, toe arms, camber links, and subframe mountings.',
        popularParts: ['Rear Air Spring Bag', 'Electronic Shock Damper', 'Subframe Bushing Set'],
      },
      {
        id: 'side-body-skirts',
        name: 'Underbody Aero Skirts & Shields',
        categoryQuery: 'Underbody',
        x: 48,
        y: 75,
        badge: 'Aerodynamics',
        description: 'Reinforced underbody splash guards, rocker panel side skirts, sound deadening plates, and engine skid pans.',
        popularParts: ['Underbody Engine Shield', 'Side Skirt Moulding', 'Wheel Arch Liner'],
      },
    ],
  },
  {
    id: 'rear',
    label: 'Rear 3/4',
    sublabel: 'Lightbars, Diffusers & Exhaust',
    image: '/assets/images/360/car-rear-34.jpg',
    hotspots: [
      {
        id: 'rear-taillights',
        name: 'Connected 3D OLED Tail Lightbars',
        categoryQuery: 'Taillight',
        x: 64,
        y: 47,
        badge: 'Rear Optics',
        description: 'Full width continuous dynamic OLED lightbars, sequential LED turn indicators, reverse projector lamps, and wiring looms.',
        popularParts: ['OLED Center Lightbar', 'Outer Taillight Cluster', 'Reverse Camera Bezel'],
      },
      {
        id: 'rear-exhaust',
        name: 'Sport Quad Exhaust Tips & Valved Muffler',
        categoryQuery: 'Exhaust',
        x: 74,
        y: 72,
        badge: 'Powertrain Output',
        description: 'Stainless steel quad exhaust tips, electronic flap actuators, catalytic converter downpipes, and heat shield insulation.',
        popularParts: ['Quad Chrome Exhaust Tips', 'Exhaust Valve Actuator', 'Rear Silencer Muffler'],
      },
      {
        id: 'rear-diffuser',
        name: 'Aero Diffuser & Bumper Assembly',
        categoryQuery: 'Bumper',
        x: 58,
        y: 78,
        badge: 'Rear Aerodynamics',
        description: 'Rear bumper skin, diffuser fins, parking sensor ultrasonic brackets, tow hook eye covers, and red reflector prisms.',
        popularParts: ['Rear Bumper Lower Lip', 'Parking Sensor PDC Unit', 'Tow Eye Cover Cap'],
      },
      {
        id: 'rear-tailgate',
        name: 'Electric Power Tailgate Struts',
        categoryQuery: 'Boot',
        x: 46,
        y: 35,
        badge: 'Cargo Systems',
        description: 'Spindle drive electric power tailgate lifting struts, lock latch actuators, trunk release switches, and seal gaskets.',
        popularParts: ['Electric Tailgate Motor Strut', 'Boot Lock Latch Mechanism', 'Hands-Free Kick Sensor'],
      },
    ],
  },
  {
    id: 'xray',
    label: 'X-Ray Blueprint',
    sublabel: 'Powertrain & Architecture',
    image: '/assets/images/360/car-xray.jpg',
    hotspots: [
      {
        id: 'xray-engine',
        name: 'V6 / V8 Twin-Turbo Core Powertrain',
        categoryQuery: 'Engine',
        x: 32,
        y: 52,
        badge: 'Internal Combustion',
        description: 'Direct injection high-pressure fuel pumps, turbochargers, timing chain kits, intake manifolds, and oil filter housings.',
        popularParts: ['Twin Turbocharger Cartridge', 'High Pressure Fuel Pump', 'Timing Chain Tensioner Kit'],
      },
      {
        id: 'xray-suspension',
        name: 'Pneumatic Air Struts & Solenoid Block',
        categoryQuery: 'Suspension',
        x: 48,
        y: 59,
        badge: 'Chassis Hydraulics',
        description: 'Heavy duty air compressor pumps, 5-valve solenoid manifold blocks, height level sensors, and pressure accumulators.',
        popularParts: ['Air Suspension Compressor Pump', 'Valve Block Solenoid', 'Ride Height Level Sensor'],
      },
      {
        id: 'xray-brakes',
        name: 'Cross-Drilled Rotors & ABS Control Unit',
        categoryQuery: 'Brake',
        x: 52,
        y: 70,
        badge: 'Active Braking',
        description: 'Hydraulic ABS pump control modules, master brake boosters, brake fluid reservoirs, and carbon ceramic discs.',
        popularParts: ['ABS Hydraulic Pump Module', 'Brake Master Cylinder', 'Ventilated Rotor Pair'],
      },
      {
        id: 'xray-transmission',
        name: '8-Speed Steptronic / PDK Gearbox',
        categoryQuery: 'Transmission',
        x: 62,
        y: 58,
        badge: 'Drivetrain Dynamics',
        description: 'Transmission mechatronic electro-hydraulic valve bodies, dual clutch packs, oil pans with integrated filters, and transfer boxes.',
        popularParts: ['Transmission Valve Body', 'Dual Clutch Module', 'ATF Filter Oil Pan Gasket'],
      },
    ],
  },
];

export default function InteractiveCar360Explorer() {
  const { addToCart } = useCart();
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [matchingProducts, setMatchingProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [addedToast, setAddedToast] = useState<string>('');

  const currentAngle = ANGLES[activeAngleIndex];

  const handleNextAngle = () => {
    setActiveHotspot(null);
    setActiveAngleIndex((prev) => (prev + 1) % ANGLES.length);
  };

  const handlePrevAngle = () => {
    setActiveHotspot(null);
    setActiveAngleIndex((prev) => (prev - 1 + ANGLES.length) % ANGLES.length);
  };

  useEffect(() => {
    if (!activeHotspot) {
      setMatchingProducts([]);
      return;
    }

    setLoadingProducts(true);
    const query = activeHotspot.categoryQuery;
    fetch(`/api/products?search=${encodeURIComponent(query)}&limit=6`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setMatchingProducts(data.products);
        } else {
          fetch('/api/products?limit=6')
            .then((r) => r.json())
            .then((d) => setMatchingProducts(d.products || []))
            .catch(() => setMatchingProducts([]));
        }
      })
      .catch((e) => {
        console.error('Failed to fetch matching parts for zone', e);
        setMatchingProducts([]);
      })
      .finally(() => setLoadingProducts(false));
  }, [activeHotspot]);

  const handleQuickAdd = (product: any) => {
    addToCart(product, 1);
    setAddedToast(`Added "${product.name.slice(0, 32)}..." to your shopping bag!`);
    setTimeout(() => setAddedToast(''), 3000);
  };

  return (
    <section className="relative py-16 bg-[#FAFAFA] border-b border-[#E4E4E7] overflow-hidden">
      {/* Background Decorative Grid */}
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#18181B 0.75px, transparent 0.75px), radial-gradient(#71717A 0.75px, #FAFAFA 0.75px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F4F4F5] border border-[#E4E4E7] mb-3.5">
            <span className="w-2 h-2 rounded-full bg-[#000000]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#000000]" style={{ fontFamily: "'Raleway', sans-serif" }}>
              360° Visual Component Inspector
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#000000] tracking-tight" style={{ fontFamily: "'Raleway', sans-serif" }}>
            Interactive Vehicle Parts Architecture
          </h2>
          <p className="mt-3 text-[#52525B] text-sm sm:text-base leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>
            Click on any highlighted component zone on the luxury vehicle below to reveal verified OEM & performance
            replacement components, chassis numbers, and direct warehouse inventory.
          </p>
        </div>

        {/* 360 Angle Selection Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {ANGLES.map((angle, index) => {
            const isActive = index === activeAngleIndex;
            return (
              <button
                key={angle.id}
                onClick={() => {
                  setActiveHotspot(null);
                  setActiveAngleIndex(index);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-[#000000] text-[#FFFFFF] shadow-lg border border-[#000000]'
                    : 'bg-[#FFFFFF] text-[#27272A] hover:bg-[#F4F4F5] border border-[#E4E4E7]'
                }`}
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isActive ? 'bg-[#FFFFFF]' : 'bg-[#D4D4D8]'
                  }`}
                />
                <span>{angle.label}</span>
                <span className="hidden md:inline text-[11px] font-normal opacity-70" style={{ fontFamily: "'Lato', sans-serif" }}>
                  ({angle.sublabel})
                </span>
              </button>
            );
          })}
        </div>

        {/* 360 Stage Viewport */}
        <div className="relative bg-[#FFFFFF] rounded-2xl border border-[#E4E4E7] shadow-xl overflow-hidden">
          {/* Top Bar Controls & Angle Status */}
          <div className="px-6 py-4 border-b border-[#F4F4F5] flex items-center justify-between flex-wrap gap-4 bg-[#FFFFFF]">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#000000] opacity-30"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#000000]"></span>
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#000000]" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  {currentAngle.label} Camera Angle
                </span>
                <span className="text-[11px] text-[#71717A] block" style={{ fontFamily: "'Lato', sans-serif" }}>
                  {currentAngle.hotspots.length} Component Zones Online
                </span>
              </div>
            </div>

            {/* Quick Angle Rotate Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevAngle}
                aria-label="Previous View Angle"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#000000] bg-[#FFFFFF] hover:bg-[#F4F4F5] border border-[#E4E4E7] transition-all"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#000000]" />
                <span className="hidden sm:inline">Rotate Left</span>
              </button>
              <button
                onClick={handleNextAngle}
                aria-label="Next View Angle"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#000000] bg-[#FFFFFF] hover:bg-[#F4F4F5] border border-[#E4E4E7] transition-all"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                <span className="hidden sm:inline">Rotate Right</span>
                <RotateCw className="w-3.5 h-3.5 text-[#000000]" />
              </button>
            </div>
          </div>

          {/* Interactive Car Canvas Container */}
          <div className="relative w-full aspect-[16/9] min-h-[380px] sm:min-h-[480px] md:min-h-[560px] bg-gradient-to-b from-white via-[#FAFAFA] to-[#F4F4F5] flex items-center justify-center p-4 select-none">
            {/* Main Luxury Car Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={currentAngle.image}
              src={currentAngle.image}
              alt={`360 Degree View - ${currentAngle.label}`}
              className="w-full h-full object-contain pointer-events-none transition-all duration-700 ease-out"
            />

            {/* Pulsing Hotspot Markers - Monochrome Black Beacons */}
            {currentAngle.hotspots.map((hotspot) => {
              const isSelected = activeHotspot?.id === hotspot.id;
              return (
                <div
                  key={hotspot.id}
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 group"
                >
                  <button
                    onClick={() => setActiveHotspot(hotspot)}
                    className="relative flex items-center justify-center cursor-pointer focus:outline-none focus:ring-4 focus:ring-black/20 rounded-full"
                    aria-label={`Inspect ${hotspot.name}`}
                  >
                    {/* Animated Pulsing Rings */}
                    <span
                      className={`absolute w-10 h-10 rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'bg-black opacity-30 scale-125'
                          : 'bg-black opacity-20 group-hover:opacity-40 animate-ping'
                      }`}
                    />
                    <span className="absolute w-8 h-8 rounded-full bg-black/15 backdrop-blur-sm" />

                    {/* Central Beacon Button */}
                    <span
                      className={`relative w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 ${
                        isSelected
                          ? 'bg-black border-2 border-white text-white'
                          : 'bg-black border-2 border-white text-white'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-white" />
                    </span>
                  </button>

                  {/* Desktop Hover Tooltip */}
                  <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 bottom-full mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-30">
                    <div className="bg-[#000000] text-white text-xs py-2 px-3.5 rounded-lg shadow-xl border border-[#27272A] whitespace-nowrap min-w-[180px]">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA]" style={{ fontFamily: "'Raleway', sans-serif" }}>
                        <Zap className="w-3 h-3 text-white" />
                        <span>{hotspot.badge}</span>
                      </div>
                      <div className="font-bold text-white text-xs mt-0.5" style={{ fontFamily: "'Raleway', sans-serif" }}>{hotspot.name}</div>
                      <div className="text-[10px] text-[#A1A1AA] mt-1 flex items-center gap-1" style={{ fontFamily: "'Lato', sans-serif" }}>
                        <span>Click to inspect matching parts</span>
                        <ChevronRight className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Hint overlay at bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <div className="px-4 py-1.5 rounded-full bg-[#000000]/90 backdrop-blur-md text-white text-[11px] font-medium border border-[#27272A] shadow-lg flex items-center gap-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span>Click any component zone to view matching OEM spare parts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hotspot Parts Drawer / Inspection Slide-Over */}
        {activeHotspot && (
          <div className="mt-8 bg-[#FFFFFF] rounded-2xl border border-[#E4E4E7] shadow-xl p-6 sm:p-8 animate-fadeIn">
            {/* Header of Active Inspection Zone */}
            <div className="flex items-start justify-between flex-wrap gap-4 border-b border-[#F4F4F5] pb-6 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F4F4F5] text-[#000000] text-xs font-bold uppercase tracking-wider mb-2 border border-[#E4E4E7]" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Inspected Component Zone: {activeHotspot.badge}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#000000]" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  {activeHotspot.name}
                </h3>
                <p className="text-[#52525B] text-sm mt-1 max-w-2xl" style={{ fontFamily: "'Lato', sans-serif" }}>
                  {activeHotspot.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/shop?search=${encodeURIComponent(activeHotspot.categoryQuery)}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#000000] hover:bg-[#27272A] text-white font-bold text-xs sm:text-sm shadow-md transition-all"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  <span>BROWSE ALL IN CATALOG</span>
                  <ExternalLink className="w-4 h-4 text-white" />
                </Link>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="p-2.5 rounded-lg bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#000000] transition-colors"
                  aria-label="Close Inspector"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Key System Components Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
              <span className="font-bold text-[#71717A] uppercase tracking-wider text-[11px]" style={{ fontFamily: "'Raleway', sans-serif" }}>
                Key System Components:
              </span>
              {activeHotspot.popularParts.map((part) => (
                <Link
                  key={part}
                  href={`/shop?search=${encodeURIComponent(part)}`}
                  className="px-3 py-1 rounded-md bg-[#F4F4F5] hover:bg-[#000000] hover:text-[#FFFFFF] text-[#27272A] border border-[#E4E4E7] font-medium transition-colors"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {part}
                </Link>
              ))}
            </div>

            {/* Real Products Grid from Catalog */}
            {loadingProducts ? (
              <div className="py-12 text-center text-[#71717A] text-sm flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-[#000000] border-t-transparent rounded-full animate-spin"></div>
                <span>Scanning 2,524 spare parts database for matching inventory...</span>
              </div>
            ) : matchingProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingProducts.map((product) => {
                  const primaryImage =
                    product.images && product.images.length > 0
                      ? formatImageUrl(product.images[0])
                      : '/assets/images/banner/banner-1.jpg';

                  return (
                    <div
                      key={product._id || product.slug}
                      className="group bg-[#FFFFFF] rounded-xl border border-[#E4E4E7] hover:border-[#000000] hover:shadow-lg transition-all duration-200 p-4 flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Thumbnail */}
                        <div className="relative aspect-video rounded-lg bg-[#FFFFFF] overflow-hidden mb-3.5 border border-[#F4F4F5] flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={primaryImage}
                            alt={product.name}
                            className="w-full h-full object-contain p-2 group-hover:scale-104 transition-transform duration-300"
                            loading="lazy"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#000000] text-white text-[10px] font-bold uppercase tracking-wider" style={{ fontFamily: "'Raleway', sans-serif" }}>
                            OEM Genuine
                          </span>
                        </div>

                        {/* Part Details */}
                        <div className="text-[11px] font-bold text-[#71717A] uppercase tracking-wider" style={{ fontFamily: "'Raleway', sans-serif" }}>
                          {product.category || 'Luxury Auto Spare'}
                        </div>
                        <h4 className="font-bold text-[#000000] text-sm line-clamp-2 mt-1 group-hover:text-[#52525B] transition-colors" style={{ fontFamily: "'Raleway', sans-serif" }}>
                          <Link href={`/product/${product.slug}`}>{product.name}</Link>
                        </h4>
                        <div className="text-xs font-mono text-[#52525B] mt-1">
                          SKU: {product.part_number || product.sku || 'OEM-' + String(product.id || 'N/A')}
                        </div>
                      </div>

                      {/* Pricing and Action */}
                      <div className="mt-4 pt-3 border-t border-[#F4F4F5] flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-[#71717A] block uppercase font-semibold" style={{ fontFamily: "'Lato', sans-serif" }}>
                            Inclusive of GST
                          </span>
                          <span className="text-base sm:text-lg font-black text-[#000000]" style={{ fontFamily: "'Raleway', sans-serif" }}>
                            ₹{Number(product.price || 0).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/product/${product.slug}`}
                            className="px-3 py-2 rounded-lg text-xs font-bold text-[#000000] bg-[#F4F4F5] hover:bg-[#E4E4E7] transition-colors"
                            style={{ fontFamily: "'Raleway', sans-serif" }}
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => handleQuickAdd(product)}
                            className="px-3 py-2 rounded-lg text-xs font-bold text-[#FFFFFF] bg-[#000000] hover:bg-[#27272A] shadow flex items-center gap-1.5 transition-all"
                            style={{ fontFamily: "'Raleway', sans-serif" }}
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 text-[#71717A]">
                <p>No exact parts found for this category query, but our warehouse stocks custom solutions.</p>
                <Link
                  href="/contact"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#000000] hover:underline"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Contact Our VIP Concierge Desk for Custom Procurement</span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Success Toast */}
        {addedToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#000000] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#27272A] flex items-center gap-3 animate-slideUp">
            <CheckCircle2 className="w-5 h-5 text-white flex-shrink-0" />
            <span className="text-sm font-semibold" style={{ fontFamily: "'Lato', sans-serif" }}>{addedToast}</span>
          </div>
        )}
      </div>
    </section>
  );
}
