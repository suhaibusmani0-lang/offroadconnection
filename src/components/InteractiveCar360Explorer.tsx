'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  RotateCw,
  Sparkles,
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
  x: number; // percentage from left
  y: number; // percentage from top
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
        x: 50,
        y: 73,
        badge: 'Protection & Aero',
        description: 'Composite engine splash shields, aerodynamic side skirts, chassis braces, and acoustic underbody sound dampeners.',
        popularParts: ['Engine Underbody Guard', 'Transmission Skid Plate', 'Fender Liner Set'],
      },
    ],
  },
  {
    id: 'rear',
    label: 'Rear 3/4',
    sublabel: 'Diffuser & Exhaust',
    image: '/assets/images/360/car-rear-34.jpg',
    hotspots: [
      {
        id: 'rear-taillights',
        name: '3D OLED Lightbar & Tail Lamps',
        categoryQuery: 'Tail Light',
        x: 75,
        y: 40,
        badge: 'Rear Illumination',
        description: 'Sequential dynamic LED lightbars, rear fog lenses, trunk brake lamps, and lighting control modules.',
        popularParts: ['LED Tail Light Inner', 'Outer Lightbar Assembly', 'Reverse Camera Lens'],
      },
      {
        id: 'rear-exhaust',
        name: 'Sport Exhaust & Valve Actuators',
        categoryQuery: 'Emission',
        x: 68,
        y: 74,
        badge: 'Acoustics & Power',
        description: 'Dual/quad stainless steel exhaust tips, electronic sound flap actuators, catalytic converters, and DPF filters.',
        popularParts: ['Exhaust Valve Actuator', 'Tailpipe Finisher Quad', 'DPF Pressure Sensor'],
      },
      {
        id: 'rear-bumper-pdc',
        name: 'Rear Bumper & Ultrasonic Sensors',
        categoryQuery: 'Bumper',
        x: 82,
        y: 65,
        badge: 'Assistance Sensors',
        description: 'PDC parking detection radar sensors, bumper brackets, rear diffuser aero fins, and towing eye covers.',
        popularParts: ['PDC Radar Sensor', 'Rear Bumper Guide Bracket', 'Tow Hook Cap'],
      },
      {
        id: 'rear-differential',
        name: 'Rear Differential & Drive Shafts',
        categoryQuery: 'Transmission',
        x: 53,
        y: 76,
        badge: 'Drivetrain',
        description: 'Limited-slip rear differential units, differential mountings, flex disc couplings, and axle prop shafts.',
        popularParts: ['Drive Shaft Flex Joint', 'Differential Mount Bush', 'Axle Seal Kit'],
      },
    ],
  },
  {
    id: 'xray',
    label: 'X-Ray Blueprint',
    sublabel: 'Engine, Turbos & Drivetrain',
    image: '/assets/images/360/car-xray.jpg',
    hotspots: [
      {
        id: 'xray-engine-core',
        name: 'Biturbo V8 Engine & Turbochargers',
        categoryQuery: 'Turbo',
        x: 27,
        y: 43,
        badge: 'Powertrain Core',
        description: 'Twin-scroll turbochargers, intercooler piping, boost pressure sensors, forged pistons, timing chains, and high-pressure fuel pumps.',
        popularParts: ['BorgWarner / Garrett Turbo', 'High Pressure Fuel Pump', 'Timing Chain Kit'],
      },
      {
        id: 'xray-oil-cooling',
        name: 'Engine Oil Cooler & Water Pump',
        categoryQuery: 'Oil Cooler',
        x: 20,
        y: 55,
        badge: 'Engine Cooling',
        description: 'Auxiliary engine oil coolers, electric thermostat housings, water pumps, coolant expansion tanks, and silicone hoses.',
        popularParts: ['Engine Oil Cooler Matrix', 'Electric Water Pump', 'Thermostat Assembly'],
      },
      {
        id: 'xray-airmatic-4corner',
        name: '4-Corner Active Air Suspension',
        categoryQuery: 'Shock Absorber Airmatic',
        x: 45,
        y: 46,
        badge: 'Airmatic Architecture',
        description: 'Air suspension air compressor pumps, distribution valve blocks, height level sensors, and 4-corner adaptive air struts.',
        popularParts: ['Airmatic Compressor Pump', 'Air Valve Block Unit', 'Ride Height Level Sensor'],
      },
      {
        id: 'xray-transmission-gearbox',
        name: '8-Speed Steptronic / PDK Gearbox',
        categoryQuery: 'Transmission',
        x: 71,
        y: 50,
        badge: 'Torque Transmission',
        description: 'Mechatronic valve bodies, dual-clutch packs, transmission fluid pans with integrated filters, and torque converter seals.',
        popularParts: ['Transmission Oil Pan Filter', 'Mechatronic Unit Overhaul', 'Gearbox Mount'],
      },
      {
        id: 'xray-carbon-brakes',
        name: 'Full Carbon Ceramic Brake Suite',
        categoryQuery: 'Brake pads',
        x: 52,
        y: 69,
        badge: 'Motorsport Spec',
        description: 'Complete cross-drilled carbon-ceramic disc rotor suite, braided stainless brake lines, and track-rated brake pads.',
        popularParts: ['Front Ceramic Pads Set', 'Rear Ceramic Pads Set', 'Brake Wear Sensor Wire'],
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
  const [addedToast, setAddedToast] = useState('');

  const currentAngle = ANGLES[activeAngleIndex];

  // When active hotspot changes, fetch real matching products from MongoDB
  useEffect(() => {
    if (!activeHotspot) {
      setMatchingProducts([]);
      return;
    }

    setLoadingProducts(true);
    fetch(`/api/products?search=${encodeURIComponent(activeHotspot.categoryQuery)}&limit=6`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setMatchingProducts(data.products);
        } else {
          // Fallback to top catalog items
          fetch('/api/products?limit=4')
            .then((r) => r.json())
            .then((d) => setMatchingProducts(d.products || []));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingProducts(false));
  }, [activeHotspot]);

  const handleNextAngle = () => {
    setActiveHotspot(null);
    setActiveAngleIndex((prev) => (prev + 1) % ANGLES.length);
  };

  const handlePrevAngle = () => {
    setActiveHotspot(null);
    setActiveAngleIndex((prev) => (prev - 1 + ANGLES.length) % ANGLES.length);
  };

  const handleQuickAdd = (product: any) => {
    addToCart(product, 1);
    setAddedToast(`Added "${product.name.slice(0, 32)}..." to your shopping bag!`);
    setTimeout(() => setAddedToast(''), 3000);
  };

  return (
    <section className="relative py-16 bg-[#FAFBFC] border-b border-slate-200 overflow-hidden font-sans">
      {/* Background Decorative Grid */}
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#C5A059 0.75px, transparent 0.75px), radial-gradient(#0F172A 0.75px, #FAFBFC 0.75px)',
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#C5A059]/15 to-[#DFBA73]/15 border border-[#C5A059]/30 mb-3.5">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#9A7731]">
              Industry First • 360° Visual Parts Explorer
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Interactive Vehicle{' '}
            <span className="bg-gradient-to-r from-[#C5A059] via-[#DFBA73] to-[#9A7731] bg-clip-text text-transparent">
              360° Component Inspector
            </span>
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Click on any glowing component zone on the vehicle below to instantly reveal matching OEM & Performance
            spare parts, verify exact chassis fitment, and explore technical specifications.
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
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20 ring-2 ring-[#C5A059]'
                    : 'bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-sm'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isActive ? 'bg-[#C5A059] animate-pulse' : 'bg-slate-300'
                  }`}
                />
                <span>{angle.label}</span>
                <span className="hidden md:inline text-[11px] font-normal opacity-70">
                  ({angle.sublabel})
                </span>
              </button>
            );
          })}
        </div>

        {/* 360 Stage Viewport */}
        <div className="relative bg-white rounded-3xl border border-slate-200/80 shadow-2xl shadow-slate-900/5 overflow-hidden">
          {/* Top Bar Controls & Angle Status */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4 bg-gradient-to-r from-slate-50 via-white to-slate-50">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C5A059] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C5A059]"></span>
              </span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  {currentAngle.label} Camera View
                </span>
                <span className="text-[11px] text-slate-500 block">
                  {currentAngle.hotspots.length} Clickable Component Zones Active
                </span>
              </div>
            </div>

            {/* Quick Angle Rotate Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevAngle}
                aria-label="Previous View Angle"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="hidden sm:inline">Rotate Left</span>
              </button>
              <button
                onClick={handleNextAngle}
                aria-label="Next View Angle"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-sm transition-all active:scale-95"
              >
                <span className="hidden sm:inline">Rotate Right</span>
                <RotateCw className="w-3.5 h-3.5 text-[#C5A059]" />
              </button>
            </div>
          </div>

          {/* Interactive Car Canvas Container */}
          <div className="relative w-full aspect-[16/9] min-h-[380px] sm:min-h-[480px] md:min-h-[560px] bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9] flex items-center justify-center p-4 select-none">
            {/* Main Luxury Car Image with smooth crossfade */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={currentAngle.image}
              src={currentAngle.image}
              alt={`360 Degree View - ${currentAngle.label}`}
              className="w-full h-full object-contain pointer-events-none transition-all duration-700 ease-out"
            />

            {/* Pulsing Hotspot Markers */}
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
                    className="relative flex items-center justify-center cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#C5A059]/40 rounded-full"
                    aria-label={`Inspect ${hotspot.name}`}
                  >
                    {/* Animated Pulsing Rings */}
                    <span
                      className={`absolute w-10 h-10 rounded-full transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#C5A059] opacity-40 scale-125'
                          : 'bg-[#C5A059] opacity-30 group-hover:opacity-60 animate-ping'
                      }`}
                    />
                    <span className="absolute w-8 h-8 rounded-full bg-[#C5A059]/25 backdrop-blur-sm" />

                    {/* Central Gold Beacon Button */}
                    <span
                      className={`relative w-6 h-6 rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-115 ${
                        isSelected
                          ? 'bg-slate-900 border-2 border-[#C5A059] text-[#C5A059]'
                          : 'bg-gradient-to-br from-[#C5A059] to-[#DFBA73] border-2 border-white text-slate-950'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                    </span>
                  </button>

                  {/* Desktop Hover Tooltip */}
                  <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 bottom-full mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 z-30">
                    <div className="bg-slate-950/95 backdrop-blur-md text-white text-xs py-2 px-3.5 rounded-xl shadow-2xl border border-slate-800 whitespace-nowrap min-w-[180px]">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#C5A059]">
                        <Zap className="w-3 h-3 text-[#C5A059]" />
                        <span>{hotspot.badge}</span>
                      </div>
                      <div className="font-bold text-white text-xs mt-0.5">{hotspot.name}</div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <span>Click to view spare parts</span>
                        <ChevronRight className="w-3 h-3 text-[#C5A059]" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Hint overlay at bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <div className="px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium border border-slate-700/50 shadow-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse"></span>
                <span>Click any pulsing gold point to inspect parts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hotspot Parts Drawer / Inspection Slide-Over */}
        {activeHotspot && (
          <div className="mt-8 bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 animate-fadeIn">
            {/* Header of Active Inspection Zone */}
            <div className="flex items-start justify-between flex-wrap gap-4 border-b border-slate-100 pb-6 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C5A059]/10 text-[#C5A059] text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Inspected Component Zone: {activeHotspot.badge}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {activeHotspot.name}
                </h3>
                <p className="text-slate-600 text-sm mt-1 max-w-2xl">
                  {activeHotspot.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/shop?search=${encodeURIComponent(activeHotspot.categoryQuery)}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm shadow-lg transition-all"
                >
                  <span>Browse All In Catalog</span>
                  <ExternalLink className="w-4 h-4 text-[#C5A059]" />
                </Link>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  aria-label="Close Inspector"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Popular Parts Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                Key System Components:
              </span>
              {activeHotspot.popularParts.map((part) => (
                <Link
                  key={part}
                  href={`/shop?search=${encodeURIComponent(part)}`}
                  className="px-3 py-1 rounded-lg bg-slate-50 hover:bg-[#C5A059]/10 hover:text-[#C5A059] text-slate-700 border border-slate-200 font-medium transition-colors"
                >
                  {part}
                </Link>
              ))}
            </div>

            {/* Real Products Grid from Catalog */}
            {loadingProducts ? (
              <div className="py-12 text-center text-slate-400 text-sm flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
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
                      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-[#C5A059]/60 hover:shadow-xl transition-all duration-300 p-4 flex flex-col justify-between"
                    >
                      <div>
                        {/* Image Thumbnail */}
                        <div className="relative aspect-video rounded-xl bg-slate-50 overflow-hidden mb-3.5 border border-slate-100 flex items-center justify-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={primaryImage}
                            alt={product.name}
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow">
                            OEM Guaranteed
                          </span>
                        </div>

                        {/* Part Details */}
                        <div className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">
                          {product.category || 'Luxury Auto Spare'}
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-2 mt-1 group-hover:text-[#9A7731] transition-colors">
                          <Link href={`/product/${product.slug}`}>{product.name}</Link>
                        </h4>
                        <div className="text-xs text-slate-500 mt-1">
                          SKU: {product.sku || 'OEM-' + String(product.id || 'N/A')}
                        </div>
                      </div>

                      {/* Pricing and Action */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                            Inclusive of GST
                          </span>
                          <span className="text-base sm:text-lg font-black text-slate-900">
                            ₹{Number(product.price || 0).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/product/${product.slug}`}
                            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => handleQuickAdd(product)}
                            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-[#C5A059] to-[#DFBA73] hover:brightness-105 shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
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
              <div className="text-center py-10 text-slate-500">
                <p>No exact parts found for this category query, but our warehouse stocks custom solutions.</p>
                <Link
                  href="/contact"
                  className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-[#C5A059] hover:underline"
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
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#C5A059]/40 flex items-center gap-3 animate-slideUp">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span className="text-sm font-semibold">{addedToast}</span>
          </div>
        )}
      </div>
    </section>
  );
}

