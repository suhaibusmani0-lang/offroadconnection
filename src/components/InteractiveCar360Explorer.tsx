'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  RotateCw,
  ShoppingBag,
  CheckCircle2,
  X,
  ExternalLink,
  ShieldCheck,
  Zap,
  PhoneCall,
  Search,
  Crosshair,
  Volume2,
  VolumeX,
  Sliders,
  ChevronRight,
  Sparkles,
  Info,
  Maximize2,
  Layers,
  Cpu,
  Compass,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatImageUrl } from '@/lib/image';
import AutoProductImage from '@/components/AutoProductImage';

interface Hotspot {
  id: string;
  name: string;
  categoryQuery: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  badge: string;
  subsystemCode: string;
  description: string;
  specs: {
    material: string;
    warranty: string;
    fitment: string;
  };
  popularParts: string[];
}

interface AngleView {
  id: 'front' | 'side' | 'rear' | 'xray';
  label: string;
  sublabel: string;
  perspectiveBadge: string;
  image: string;
  hotspots: Hotspot[];
}

const ANGLES: AngleView[] = [
  {
    id: 'front',
    label: 'Front 3/4',
    sublabel: 'Matrix LED & Aero Intakes',
    perspectiveBadge: 'PERSPECTIVE: 45° AZIMUTH FRONT',
    image: '/assets/images/360/car-front-34.jpg',
    hotspots: [
      {
        id: 'front-headlights',
        name: 'Matrix LED Headlights & Ballast Modules',
        categoryQuery: 'Headlight',
        x: 36,
        y: 47,
        badge: 'Lighting & Optical Systems',
        subsystemCode: 'SYS-OPTIC-401',
        description: 'Adaptive laser matrix LED clusters, high-frequency ballast controllers, daytime running DRL crystal modules, and automatic high-pressure headlamp washers.',
        specs: {
          material: 'Optical UV Polycarbonate & Billet Aluminum',
          warranty: '2-Year Unlimited Mileage Guarantee',
          fitment: 'Direct Plug & Play OEM Harness',
        },
        popularParts: ['Headlight Glass Lens', 'LED Control Ballast', 'Washer Jet Cylinder', 'DRL Module Board'],
      },
      {
        id: 'front-grille-cooling',
        name: 'Radiator, AC Condenser & Aero Air Flaps',
        categoryQuery: 'Radiator',
        x: 21,
        y: 57,
        badge: 'Thermal Dynamics',
        subsystemCode: 'SYS-THERM-802',
        description: 'High-efficiency brazed aluminum dual-pass radiators, AC condenser assemblies, electric brushless cooling fans, and active aerodynamic shutter flaps.',
        specs: {
          material: 'Brazed Aerospace Aluminum Core',
          warranty: '18-Month Factory Warranty',
          fitment: 'Engine Bay Subframe Bracket Mount',
        },
        popularParts: ['Radiator Core Assembly', 'AC Condenser Fan', 'Active Shutter Motor', 'Coolant Expansion Tank'],
      },
      {
        id: 'front-brakes',
        name: 'Carbon-Ceramic Rotors & 6-Piston Calipers',
        categoryQuery: 'Brake',
        x: 52,
        y: 69,
        badge: 'Kinetic Deceleration',
        subsystemCode: 'SYS-BRAKE-303',
        description: 'Cross-drilled 420mm ventilated carbon-ceramic brake discs, Brembo-spec monobloc 6-piston aluminum calipers, electronic wear sensors, and low-dust pads.',
        specs: {
          material: 'Carbon-Ceramic Matrix & Forged Monobloc',
          warranty: 'Lifetime Anti-Warp Guarantee',
          fitment: 'Direct Axle Spindle Radial Mount',
        },
        popularParts: ['Front Drilled Rotor', 'Brake Caliper Assembly', 'Ceramic Brake Pads', 'Brake Wear Sensor'],
      },
      {
        id: 'front-suspension',
        name: 'Adaptive Airmatic Suspension & Control Arms',
        categoryQuery: 'Suspension',
        x: 48,
        y: 58,
        badge: 'Chassis Dynamics',
        subsystemCode: 'SYS-SUSP-504',
        description: 'Pneumatic air spring struts with continuous damping control (CDC), forged aluminum upper/lower control arms, and heavy-duty polyurethane bushings.',
        specs: {
          material: 'Forged 6061 Aluminum & High-Pressure Rubber',
          warranty: '2-Year Replacement Warranty',
          fitment: 'Direct Chassis Turret Bolt-On',
        },
        popularParts: ['Airmatic Front Strut', 'Lower Wishbone Arm', 'Stabilizer Sway Bar Link', 'Level Ride Sensor'],
      },
      {
        id: 'front-mirrors',
        name: 'Electrochromic Aero Mirrors & 360° Cameras',
        categoryQuery: 'Side Mirror',
        x: 65,
        y: 32,
        badge: 'Surround Vision & ADAS',
        subsystemCode: 'SYS-SENS-105',
        description: 'Power-folding auto-dimming heated side mirrors equipped with 4K surround-view camera optics, blind-spot radar indicator prisms, and LED indicators.',
        specs: {
          material: 'Pre-preg Carbon Fiber & Heated Aspheric Glass',
          warranty: '1-Year Electrical Guarantee',
          fitment: 'A-Pillar Multipin Connector Assembly',
        },
        popularParts: ['Mirror Cover Carbon', 'Blind Spot Glass Mirror', 'Power Folding Motor', '360 Camera Lens'],
      },
      {
        id: 'front-aero-splitter',
        name: 'Carbon Fiber Front Lip & Downforce Splitter',
        categoryQuery: 'Bumper',
        x: 26,
        y: 72,
        badge: 'Aerodynamic Ground Effects',
        subsystemCode: 'SYS-AERO-206',
        description: 'Track-tested front aerodynamic splitter lip that channels laminar airflow into the brake cooling ducts while generating over 45kg of downforce.',
        specs: {
          material: 'Autoclave Dry Carbon Fiber (2x2 Weave)',
          warranty: 'UV Anti-Yellowing 3-Year Warranty',
          fitment: 'OEM Front Bumper Undertray Mount',
        },
        popularParts: ['Front Bumper Lower Lip', 'Air Duct Channel', 'Underbody Deflector', 'Mounting Hardware Kit'],
      },
    ],
  },
  {
    id: 'side',
    label: 'Side Profile',
    sublabel: 'Chassis, Wheels & Doors',
    perspectiveBadge: 'PERSPECTIVE: 90° LATERAL FLANK',
    image: '/assets/images/360/car-side.jpg',
    hotspots: [
      {
        id: 'side-front-wheel',
        name: '21" Forged Monoblock Wheel & Hub Bearings',
        categoryQuery: 'Wheel Hub',
        x: 22,
        y: 70,
        badge: 'Rotational Running Gear',
        subsystemCode: 'SYS-WHEEL-101',
        description: 'Ultralight aerospace-grade forged monoblock alloy wheel with integrated high-load sealed hub bearings and magnetic tone rings for traction control.',
        specs: {
          material: 'Forged T6-6061 Billet Aluminum',
          warranty: 'Lifetime Structural Integrity Warranty',
          fitment: '5x112 / 5x120 High-Torque Pattern',
        },
        popularParts: ['Wheel Bearing Hub Unit', 'CV Drive Shaft Axle', 'ABS Speed Sensor', 'Titanium Wheel Lug Bolts'],
      },
      {
        id: 'side-door-actuators',
        name: 'Soft-Close Vacuum Latches & Regulators',
        categoryQuery: 'Door',
        x: 51,
        y: 51,
        badge: 'Cabin Access & Hardware',
        subsystemCode: 'SYS-CABIN-602',
        description: 'Whisper-quiet pneumatic soft-close door latch actuators, heavy-duty anti-pinch window regulators, capacitive smart keyless door handles, and weather seals.',
        specs: {
          material: 'Die-cast Zinc & Reinforced Polymer Gearing',
          warranty: '2-Year Actuator Warranty',
          fitment: 'In-Door Structural Frame Integration',
        },
        popularParts: ['Power Window Regulator', 'Soft Close Latch Motor', 'Exterior Handle Sensor', 'Door Check Strap'],
      },
      {
        id: 'side-rear-suspension',
        name: 'Rear Multi-Link Axle & Electronic Air Springs',
        categoryQuery: 'Shock Absorber',
        x: 79,
        y: 71,
        badge: 'Rear Axle Kinematics',
        subsystemCode: 'SYS-SUSP-508',
        description: 'Independent 5-link rear suspension assembly with electronically valved dynamic dampers, self-leveling air springs, and active rear-axle steering links.',
        specs: {
          material: 'Hydroformed Tubular Steel & Billet Aluminum',
          warranty: '2-Year Unlimited Mileage Guarantee',
          fitment: 'Rear Subframe Direct Cradle',
        },
        popularParts: ['Rear Air Spring Bellow', 'Electronic Shock Damper', 'Subframe Bushing Kit', 'Rear Camber Control Arm'],
      },
      {
        id: 'side-body-skirts',
        name: 'Underbody Aero Skirts & Floor Armor',
        categoryQuery: 'Underbody',
        x: 48,
        y: 75,
        badge: 'Chassis Aerodynamics',
        subsystemCode: 'SYS-AERO-207',
        description: 'Full-length composite rocker panel skirts, high-density polyethylene undercarriage skid plates, and transmission splash guards for impact protection.',
        specs: {
          material: 'Reinforced Carbon Composite & HDPE Guard',
          warranty: '5-Year Stone Impact Resistance',
          fitment: 'Factory Underfloor Mounting Points',
        },
        popularParts: ['Underbody Engine Shield', 'Side Skirt Moulding', 'Wheel Arch Splash Liner', 'Chassis Jack Pad Points'],
      },
      {
        id: 'side-sunroof',
        name: 'Panoramic Acoustic Roof Glass & Motors',
        categoryQuery: 'Glass',
        x: 55,
        y: 26,
        badge: 'Optical Roof Architecture',
        subsystemCode: 'SYS-ROOF-704',
        description: 'Dual-pane acoustic laminated thermal-insulated tinted panoramic glass roof with twin synchronization motors and integrated electric roller blinds.',
        specs: {
          material: 'Tempered 99% UV-Rejection Laminated Glass',
          warranty: '3-Year Leak & Mechanism Warranty',
          fitment: 'Chassis Roof Frame Welded Channel',
        },
        popularParts: ['Sunroof Drive Motor', 'Roller Blind Assembly', 'Roof Glass Seal Gasket', 'Drain Hose Clean Tube'],
      },
    ],
  },
  {
    id: 'rear',
    label: 'Rear 3/4',
    sublabel: 'Lightbars, Diffusers & Exhaust',
    perspectiveBadge: 'PERSPECTIVE: 45° AZIMUTH REAR',
    image: '/assets/images/360/car-rear-34.jpg',
    hotspots: [
      {
        id: 'rear-taillights',
        name: 'Continuous 3D OLED Lightbars & Sequential DRL',
        categoryQuery: 'Taillight',
        x: 64,
        y: 47,
        badge: 'Rear Optical Cluster',
        subsystemCode: 'SYS-OPTIC-409',
        description: 'Edge-to-edge continuous 3D OLED tail lightbars with digital start-up light choreography, progressive sequential amber turn signals, and reverse lenses.',
        specs: {
          material: 'Micro-prism Acrylic & OLED Silicon Plates',
          warranty: '2-Year Circuit Board Warranty',
          fitment: 'Tailgate Trunk & Quarter Panel Cavity',
        },
        popularParts: ['OLED Center Lightbar', 'Outer Taillight Cluster', 'Reverse Camera Bezel', 'Tailgate Wiring Loom'],
      },
      {
        id: 'rear-exhaust',
        name: 'Quad Titanium Exhaust Tips & Valved Silencer',
        categoryQuery: 'Exhaust',
        x: 74,
        y: 72,
        badge: 'High-Flow Acoustics & Emission',
        subsystemCode: 'SYS-EXH-901',
        description: 'TIG-welded lightweight Grade 5 titanium quad exhaust tips with high-speed electronic servomotor acoustic exhaust valves and resonator dampening.',
        specs: {
          material: 'Titanium Ti-6Al-4V & 304 Stainless Steel',
          warranty: '5-Year Anti-Corrosion Warranty',
          fitment: 'Mid-Pipe Flange Direct Bolt-Up',
        },
        popularParts: ['Quad Chrome Exhaust Tips', 'Exhaust Valve Actuator', 'Rear Silencer Muffler', 'Exhaust Rubber Hanger'],
      },
      {
        id: 'rear-diffuser',
        name: 'Vented Aero Diffuser & PDC Radar Array',
        categoryQuery: 'Bumper',
        x: 58,
        y: 78,
        badge: 'Ground-Effect Venturi',
        subsystemCode: 'SYS-AERO-209',
        description: 'Venturi tunnel rear aerodynamic diffuser that draws low pressure underneath the vehicle, integrated with ultrasonic park assist PDC radar sensors.',
        specs: {
          material: 'Pre-preg Carbon Composite & Thermoplastic',
          warranty: '2-Year Sensor & Body Guarantee',
          fitment: 'Rear Crash Bar & Bumper Fasteners',
        },
        popularParts: ['Rear Bumper Lower Lip', 'Parking Sensor PDC Unit', 'Tow Eye Cover Cap', 'Rear Reflector Prism'],
      },
      {
        id: 'rear-tailgate',
        name: 'Electric Power Tailgate Spindle Struts',
        categoryQuery: 'Boot',
        x: 46,
        y: 35,
        badge: 'Automated Cargo Logistics',
        subsystemCode: 'SYS-LIFT-605',
        description: 'Dual electric heavy-duty spindle drive power tailgate lifting struts with anti-pinch sensors, soft closing latch hook, and hands-free kick gesture antennas.',
        specs: {
          material: 'High-Torque Planetary Gear & Steel Spindle',
          warranty: '3-Year Mechanism Warranty',
          fitment: 'D-Pillar Factory Ball Joint Studs',
        },
        popularParts: ['Electric Tailgate Motor Strut', 'Boot Lock Latch Mechanism', 'Hands-Free Kick Sensor', 'Trunk Gas Strut'],
      },
      {
        id: 'rear-spoiler',
        name: 'Active Aerodynamic Carbon Rear Wing Spoiler',
        categoryQuery: 'Spoiler',
        x: 38,
        y: 30,
        badge: 'High-Speed Downforce',
        subsystemCode: 'SYS-AERO-210',
        description: 'Speed-sensitive deployment wing spoiler that raises dynamically at speeds above 90 km/h to increase rear tire traction and stability during high-speed braking.',
        specs: {
          material: '100% Autoclaved Dry Carbon Fiber',
          warranty: '2-Year Actuator Warranty',
          fitment: 'Trunk Lid Reinforced Mount',
        },
        popularParts: ['Carbon Rear Trunk Spoiler', 'Spoiler Lift Motor', 'Spoiler Position Microswitch', 'Hardware Screw Kit'],
      },
    ],
  },
  {
    id: 'xray',
    label: 'X-Ray Blueprint',
    sublabel: 'Powertrain & Architecture',
    perspectiveBadge: 'PERSPECTIVE: INTERNAL CAD SCHEMATIC',
    image: '/assets/images/360/car-xray.jpg',
    hotspots: [
      {
        id: 'xray-engine',
        name: 'V8 Bi-Turbo Combustion Engine & Cooling Core',
        categoryQuery: 'Engine',
        x: 32,
        y: 52,
        badge: 'Internal Powertrain Engine',
        subsystemCode: 'SYS-POWR-100',
        description: '4.0-liter twin-turbocharged aluminum engine block, high-pressure 350-bar direct fuel injectors, dual water-cooled turbocharger cores, and variable timing kits.',
        specs: {
          material: 'AlSi10Mg Aluminum-Silicon Alloy',
          warranty: 'Factory Genuine Certified',
          fitment: 'Hydraulic Engine Motor Mounts',
        },
        popularParts: ['Twin Turbocharger Cartridge', 'High Pressure Fuel Pump', 'Timing Chain Tensioner Kit', 'Engine Oil Cooler'],
      },
      {
        id: 'xray-transmission',
        name: '8-Speed Dual-Clutch Mechatronic Transmission',
        categoryQuery: 'Transmission',
        x: 62,
        y: 58,
        badge: 'Electro-Hydraulic Drivetrain',
        subsystemCode: 'SYS-GEAR-700',
        description: 'Rapid-shift 8-speed automatic dual-clutch transmission with integrated mechatronic electronic valve body, dual wet clutch pack, and integrated all-wheel transfer box.',
        specs: {
          material: 'Precision Machined Alloy & Micro-Valves',
          warranty: '2-Year Mechatronic Warranty',
          fitment: 'Engine Bellhousing Bolt Pattern',
        },
        popularParts: ['Transmission Valve Body', 'Dual Clutch Module', 'ATF Filter Oil Pan Gasket', 'Transmission Solenoid Kit'],
      },
      {
        id: 'xray-suspension',
        name: 'Airmatic 5-Valve Solenoid Block & Compressor',
        categoryQuery: 'Suspension',
        x: 48,
        y: 59,
        badge: 'Pneumatic Central Hydraulics',
        subsystemCode: 'SYS-AIR-550',
        description: 'High-output 18-bar oil-less air suspension compressor pump with integrated air dryer, 5-port electronic solenoid valve block, and central nitrogen pressure reservoir.',
        specs: {
          material: 'Forged Anodized Aluminum & Piston Pump',
          warranty: '2-Year Full Replacement Guarantee',
          fitment: 'Underbody Noise-Isolated Frame Bracket',
        },
        popularParts: ['Air Suspension Compressor Pump', 'Valve Block Solenoid', 'Ride Height Level Sensor', 'Air Line Tubing Set'],
      },
      {
        id: 'xray-brakes',
        name: 'ABS Hydraulic Modulator & Master Brake Booster',
        categoryQuery: 'Brake',
        x: 52,
        y: 70,
        badge: 'Active Vehicle Stability (ESP)',
        subsystemCode: 'SYS-ESP-300',
        description: 'Multi-channel ABS/ESP electronic brake force distribution pump modulator, dual-diaphragm vacuum master brake booster, and proportioning control computer.',
        specs: {
          material: 'Aircraft Billet Monobloc Valve Chamber',
          warranty: '3-Year Critical Safety Certified',
          fitment: 'Bulkhead Fire Wall Anti-Vibration Mount',
        },
        popularParts: ['ABS Hydraulic Pump Module', 'Brake Master Cylinder', 'Ventilated Rotor Pair', 'Brake Fluid Sensor'],
      },
      {
        id: 'xray-driveshaft',
        name: 'Carbon Fiber Propeller Shaft & Rear Differential',
        categoryQuery: 'Differential',
        x: 54,
        y: 64,
        badge: 'Torque Vectoring AWD',
        subsystemCode: 'SYS-DRIVE-800',
        description: 'One-piece torsional carbon-fiber reinforced propeller driveshaft coupled to an electronically controlled limited-slip active torque-vectoring rear differential.',
        specs: {
          material: 'Continuous Filament-Wound Carbon Fiber',
          warranty: 'Lifetime Fatigue Resistance Warranty',
          fitment: 'Transmission Output to Rear Axle Flange',
        },
        popularParts: ['Propeller Shaft Center Support', 'Rear Differential Assembly', 'CV Flex Disc Coupler', 'Diff Fluid Seal Kit'],
      },
    ],
  },
];

export default function InteractiveCar360Explorer() {
  const { addToCart } = useCart();
  const [activeAngleIndex, setActiveAngleIndex] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot | null>(null);
  const [matchingProducts, setMatchingProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [addedToast, setAddedToast] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Mouse telemetry coordinates on car container
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentAngle = ANGLES[activeAngleIndex];

  // Subtle luxury HUD synthesizer click sound
  const playHudSound = useCallback((frequency = 880, duration = 0.04) => {
    if (!soundEnabled) return;
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioContextRef.current) {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not supported or blocked, fail silently
    }
  }, [soundEnabled]);

  // Handle angle rotation
  const handleNextAngle = () => {
    playHudSound(750, 0.08);
    setActiveHotspot(null);
    setHoveredHotspot(null);
    setActiveAngleIndex((prev) => (prev + 1) % ANGLES.length);
  };

  const handlePrevAngle = () => {
    playHudSound(650, 0.08);
    setActiveHotspot(null);
    setHoveredHotspot(null);
    setActiveAngleIndex((prev) => (prev - 1 + ANGLES.length) % ANGLES.length);
  };

  const selectAngle = (idx: number) => {
    playHudSound(800, 0.06);
    setActiveHotspot(null);
    setHoveredHotspot(null);
    setActiveAngleIndex(idx);
  };

  // Fetch products matching the selected component hotspot
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

  // Mouse move over car canvas: calculates 3D parallax tilt & nearest component lock-on
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePos({ x: xPct, y: yPct });

    // Subtle 3D tilt angles
    const tiltX = ((yPct - 50) / 50) * -3;
    const tiltY = ((xPct - 50) / 50) * 4;
    setTilt({ x: tiltX, y: tiltY });

    // Find closest hotspot to cursor for smart lock-on (within 18% distance radius)
    let closest: Hotspot | null = null;
    let minDistance = 18; // maximum lock-on distance threshold

    for (const spot of currentAngle.hotspots) {
      const dx = spot.x - xPct;
      const dy = spot.y - yPct;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDistance) {
        minDistance = dist;
        closest = spot;
      }
    }

    if (closest && closest.id !== hoveredHotspot?.id) {
      playHudSound(1200, 0.03);
      setHoveredHotspot(closest);
    } else if (!closest && hoveredHotspot) {
      setHoveredHotspot(null);
    }
  };

  const handleMouseLeave = () => {
    setMousePos(null);
    setTilt({ x: 0, y: 0 });
    setHoveredHotspot(null);
  };

  // Click on car canvas: if user clicks near any component, select it
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    let closest: Hotspot | null = null;
    let minDistance = 22;

    for (const spot of currentAngle.hotspots) {
      const dx = spot.x - xPct;
      const dy = spot.y - yPct;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDistance) {
        minDistance = dist;
        closest = spot;
      }
    }

    if (closest) {
      playHudSound(1400, 0.08);
      setActiveHotspot(closest);
    }
  };

  const handleQuickAdd = (product: any) => {
    addToCart(product, 1);
    playHudSound(1600, 0.09);
    setAddedToast(`Added "${product.name.slice(0, 32)}..." to your shopping bag!`);
    setTimeout(() => setAddedToast(''), 3000);
  };

  const activeOrHovered = hoveredHotspot || activeHotspot;

  return (
    <section className="relative py-16 bg-[#000000] text-white border-b border-[#27272A] overflow-hidden select-none">
      {/* Sci-Fi Blueprint Precision Grid Background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, #27272A 1px, transparent 1px),
            linear-gradient(to bottom, #27272A 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Radial Vignette Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18181B] border border-[#27272A] mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FFFFFF] animate-pulse" />
            <span
              className="text-xs font-bold uppercase tracking-widest text-[#E4E4E7]"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              Holographic 360° Component Inspector
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black text-[#FFFFFF] tracking-tight uppercase"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            Interactive Vehicle Architecture
          </h2>
          <p
            className="mt-3 text-[#A1A1AA] text-sm sm:text-base leading-relaxed"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Touch or hover anywhere across the luxury vehicle frame to scan OEM subsystems. Click any component
            to inspect live warehouse inventory, engineering tolerances, and direct procurement parts.
          </p>
        </div>

        {/* Dynamic Telemetry Angle Switcher */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6">
          {ANGLES.map((angle, index) => {
            const isActive = index === activeAngleIndex;
            return (
              <button
                key={angle.id}
                onClick={() => selectAngle(index)}
                className={`relative group px-4 py-2.5 rounded-none text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2.5 cursor-pointer border ${
                  isActive
                    ? 'bg-[#FFFFFF] text-[#000000] border-[#FFFFFF] shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                    : 'bg-[#121212] text-[#A1A1AA] hover:text-[#FFFFFF] border-[#27272A] hover:border-[#52525B]'
                }`}
                style={{ fontFamily: "'Raleway', sans-serif", borderRadius: '0px' }}
              >
                <div
                  className={`w-2 h-2 transition-all duration-300 ${
                    isActive ? 'bg-[#000000] scale-125' : 'bg-[#52525B] group-hover:bg-[#A1A1AA]'
                  }`}
                  style={{ borderRadius: '0px' }}
                />
                <span>{angle.label}</span>
                <span
                  className="hidden md:inline text-[11px] opacity-70 normal-case font-normal"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  ({angle.sublabel})
                </span>
              </button>
            );
          })}
        </div>

        {/* Master Interactive 360 HUD Viewport */}
        <div className="relative bg-[#09090B] rounded-none border border-[#27272A] shadow-2xl overflow-hidden backdrop-blur-md" style={{ borderRadius: '0px' }}>
          {/* Top Aerospace Telemetry Status Bar */}
          <div className="px-5 py-3.5 border-b border-[#27272A] bg-[#0A0A0C] flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
            {/* Left Status Indicators */}
            <div className="flex items-center gap-4 text-[#A1A1AA]">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full bg-[#FFFFFF] opacity-50" style={{ borderRadius: '0px' }} />
                  <span className="relative inline-flex h-2.5 w-2.5 bg-[#FFFFFF]" style={{ borderRadius: '0px' }} />
                </span>
                <span className="text-[#FFFFFF] font-bold text-[11px] tracking-wider uppercase" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  {currentAngle.label} VIEW
                </span>
              </div>
              <span className="hidden sm:inline text-[#52525B]">|</span>
              <span className="hidden sm:inline text-[11px] text-[#A1A1AA]">
                {currentAngle.perspectiveBadge}
              </span>
              <span className="hidden md:inline text-[#52525B]">|</span>
              <span className="hidden md:inline text-[11px] text-[#A1A1AA]">
                ACTIVE NODES: <strong className="text-white">{currentAngle.hotspots.length}</strong>
              </span>
            </div>

            {/* Right Controls: Rotate & Audio Toggle */}
            <div className="flex items-center gap-2.5">
              {/* Sound Synthesizer Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none border text-[11px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${
                  soundEnabled
                    ? 'bg-[#18181B] text-[#FFFFFF] border-[#3F3F46]'
                    : 'bg-[#121212] text-[#71717A] border-[#27272A]'
                }`}
                title={soundEnabled ? 'HUD Audio On' : 'HUD Audio Muted'}
                style={{ fontFamily: "'Raleway', sans-serif", borderRadius: '0px' }}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-white" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{soundEnabled ? 'AUDIO ON' : 'MUTED'}</span>
              </button>

              {/* View Rotation Controls */}
              <button
                onClick={handlePrevAngle}
                aria-label="Rotate View Left"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-[#18181B] hover:bg-[#27272A] text-white border border-[#3F3F46] text-[11px] font-bold uppercase transition-all cursor-pointer"
                style={{ fontFamily: "'Raleway', sans-serif", borderRadius: '0px' }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Rotate Left</span>
              </button>
              <button
                onClick={handleNextAngle}
                aria-label="Rotate View Right"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-[#18181B] hover:bg-[#27272A] text-white border border-[#3F3F46] text-[11px] font-bold uppercase transition-all cursor-pointer"
                style={{ fontFamily: "'Raleway', sans-serif", borderRadius: '0px' }}
              >
                <span className="hidden sm:inline">Rotate Right</span>
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Car Canvas Container with 3D Tilt */}
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={handleCanvasClick}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="relative w-full aspect-[16/9] min-h-[360px] sm:min-h-[460px] md:min-h-[580px] bg-gradient-to-b from-[#0A0A0A] via-[#121212] to-[#0A0A0A] flex items-center justify-center p-4 sm:p-8 cursor-crosshair overflow-hidden"
          >
            {/* Scanning Laser Beam Effect (LiDAR Style) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
              <div
                className="w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_15px_#FFFFFF] animate-pulse"
                style={{
                  position: 'absolute',
                  top: '0%',
                  animation: 'laserScan 6s ease-in-out infinite alternate',
                }}
              />
            </div>
            <style jsx>{`
              @keyframes laserScan {
                0% {
                  top: 5%;
                  opacity: 0.1;
                }
                50% {
                  opacity: 0.6;
                }
                100% {
                  top: 92%;
                  opacity: 0.1;
                }
              }
            `}</style>

            {/* Corner CAD Crop Marks */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/30 pointer-events-none" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/30 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/30 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/30 pointer-events-none" />

            {/* Live Crosshair Reticle tracking mouse position */}
            {mousePos && (
              <div
                className="absolute pointer-events-none z-30 transition-transform duration-75"
                style={{
                  left: `${mousePos.x}%`,
                  top: `${mousePos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Targeting Crosshair */}
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 border border-white/40 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
                  <div className="w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_#FFFFFF]" />
                  <div className="absolute top-0 w-[1px] h-2 bg-white/70" />
                  <div className="absolute bottom-0 w-[1px] h-2 bg-white/70" />
                  <div className="absolute left-0 h-[1px] w-2 bg-white/70" />
                  <div className="absolute right-0 h-[1px] w-2 bg-white/70" />
                </div>
              </div>
            )}

            {/* Main Luxury Car Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={currentAngle.image}
              src={currentAngle.image}
              alt={`Vehicle View - ${currentAngle.label}`}
              className="w-full h-full object-contain pointer-events-none transition-all duration-700 ease-out select-none filter contrast-105 brightness-95"
            />

            {/* Pulsing Hotspot Markers & Smart Hitboxes */}
            {currentAngle.hotspots.map((hotspot) => {
              const isSelected = activeHotspot?.id === hotspot.id;
              const isHovered = hoveredHotspot?.id === hotspot.id;
              const isTargeted = isSelected || isHovered;

              return (
                <div
                  key={hotspot.id}
                  style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  {/* Expanded Clickable & Touch Hitbox Zone (covers wider surrounding area) */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      playHudSound(1500, 0.09);
                      setActiveHotspot(hotspot);
                    }}
                    onMouseEnter={() => {
                      if (!isHovered) {
                        playHudSound(1100, 0.03);
                        setHoveredHotspot(hotspot);
                      }
                    }}
                    onMouseLeave={() => {
                      if (hoveredHotspot?.id === hotspot.id) {
                        setHoveredHotspot(null);
                      }
                    }}
                    className="relative w-14 h-14 -m-4 flex items-center justify-center cursor-pointer group"
                    role="button"
                    aria-label={`Inspect ${hotspot.name}`}
                  >
                    {/* Outer Pulsing Radar Rings */}
                    <span
                      className={`absolute rounded-full transition-all duration-300 pointer-events-none ${
                        isTargeted
                          ? 'w-12 h-12 bg-white/20 border border-white scale-125 shadow-[0_0_20px_#FFFFFF]'
                          : 'w-8 h-8 bg-white/10 group-hover:bg-white/25 animate-ping'
                      }`}
                    />

                    {/* Central Glowing Beacon Core */}
                    <div
                      className={`relative w-7 h-7 rounded-full flex items-center justify-center border-2 transition-transform duration-300 ${
                        isTargeted
                          ? 'bg-white border-white scale-125 shadow-[0_0_15px_#FFFFFF]'
                          : 'bg-[#18181B] border-white/80 group-hover:scale-110 shadow-lg'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full transition-colors ${
                          isTargeted ? 'bg-[#000000]' : 'bg-[#FFFFFF]'
                        }`}
                      />
                    </div>

                    {/* Quick HUD Subsystem Tag (Always visible next to dot on desktop) */}
                    <div
                      className={`hidden lg:flex absolute left-full ml-2.5 items-center gap-1.5 px-2 py-0.5 rounded bg-[#18181B]/90 border border-[#3F3F46] text-[10px] font-mono whitespace-nowrap pointer-events-none transition-all duration-200 ${
                        isTargeted
                          ? 'opacity-100 scale-105 border-white text-white shadow-lg'
                          : 'opacity-60 text-[#A1A1AA]'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>{hotspot.name.split(' ')[0]}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Dynamic Telemetry HUD Readout Overlay (Bottom Left of Canvas) */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 pointer-events-none max-w-sm">
              <div className="bg-[#121212]/90 backdrop-blur-md border border-[#27272A] p-3 sm:p-4 rounded-2xl shadow-2xl font-mono text-xs">
                <div className="flex items-center justify-between gap-4 text-[10px] text-[#A1A1AA] uppercase border-b border-[#27272A] pb-2 mb-2">
                  <span className="flex items-center gap-1.5 text-white font-bold" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    <Compass className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: '12s' }} />
                    TELEMETRY SCANNER
                  </span>
                  <span>{currentAngle.sublabel}</span>
                </div>

                {activeOrHovered ? (
                  <div className="space-y-1">
                    <div className="text-[10px] text-white/70 uppercase">
                      TARGET ACQUIRED: <span className="text-white font-bold">{activeOrHovered.subsystemCode}</span>
                    </div>
                    <div className="text-sm font-black text-white" style={{ fontFamily: "'Raleway', sans-serif" }}>
                      {activeOrHovered.name}
                    </div>
                    <div className="text-[11px] text-[#A1A1AA] truncate" style={{ fontFamily: "'Lato', sans-serif" }}>
                      {activeOrHovered.badge} • Click to open components catalog
                    </div>
                  </div>
                ) : (
                  <div className="text-[#71717A] text-[11px] flex items-center gap-2" style={{ fontFamily: "'Lato', sans-serif" }}>
                    <Crosshair className="w-3.5 h-3.5 text-white animate-pulse" />
                    <span>Hover or touch anywhere on the vehicle to scan component zones</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Right Coordinates Readout */}
            <div className="hidden sm:block absolute bottom-6 right-6 z-20 pointer-events-none">
              <div className="bg-[#121212]/80 backdrop-blur-md border border-[#27272A] px-3 py-1.5 rounded-xl font-mono text-[10px] text-[#A1A1AA] flex items-center gap-3">
                <span>
                  GRID: <strong className="text-white">{mousePos ? `${mousePos.x.toFixed(1)}°X / ${mousePos.y.toFixed(1)}°Y` : 'LOCKED'}</strong>
                </span>
                <span>•</span>
                <span>STATUS: <strong className="text-white">ONLINE</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COMPONENT DIAGNOSTIC & OEM PARTS EXPLORER DRAWER (Active Zone Clicked)     */}
        {/* ========================================================================= */}
        {activeHotspot && (
          <div className="mt-8 bg-[#0F0F11] rounded-3xl border border-[#27272A] shadow-2xl p-6 sm:p-8 animate-fadeIn text-white">
            {/* Header & Subsystem Overview */}
            <div className="flex items-start justify-between flex-wrap gap-4 border-b border-[#27272A] pb-6 mb-6">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C1C1E] text-white text-xs font-mono font-bold uppercase tracking-wider border border-[#3F3F46]">
                    <Cpu className="w-3.5 h-3.5 text-white" />
                    {activeHotspot.subsystemCode}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "'Raleway', sans-serif" }}>
                    {activeHotspot.badge}
                  </span>
                </div>
                <h3
                  className="text-2xl sm:text-3xl font-black text-white tracking-tight"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  {activeHotspot.name}
                </h3>
                <p className="text-[#A1A1AA] text-sm mt-2 leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>
                  {activeHotspot.description}
                </p>
              </div>

              {/* Close & Action Buttons */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/shop?search=${encodeURIComponent(activeHotspot.categoryQuery)}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-white hover:bg-[#E4E4E7] text-black font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg cursor-pointer"
                  style={{ fontFamily: "'Raleway', sans-serif", borderRadius: '0px' }}
                >
                  <span>ALL {activeHotspot.categoryQuery.toUpperCase()} PARTS</span>
                  <ExternalLink className="w-4 h-4 text-black" />
                </Link>
                <button
                  onClick={() => setActiveHotspot(null)}
                  className="p-2.5 rounded-none bg-[#1C1C1E] hover:bg-[#27272A] text-white transition-colors cursor-pointer border border-[#3F3F46]"
                  style={{ borderRadius: '0px' }}
                  aria-label="Close Inspector"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Technical Specifications Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-[#141416] p-4 rounded-none border border-[#27272A]" style={{ borderRadius: '0px' }}>
                <div className="text-[10px] font-mono uppercase text-[#71717A] tracking-wider">
                  Engineered Metallurgy & Material
                </div>
                <div className="text-xs font-bold text-white mt-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  {activeHotspot.specs.material}
                </div>
              </div>
              <div className="bg-[#141416] p-4 rounded-none border border-[#27272A]" style={{ borderRadius: '0px' }}>
                <div className="text-[10px] font-mono uppercase text-[#71717A] tracking-wider">
                  Factory Warranty & Testing
                </div>
                <div className="text-xs font-bold text-white mt-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  {activeHotspot.specs.warranty}
                </div>
              </div>
              <div className="bg-[#141416] p-4 rounded-none border border-[#27272A]" style={{ borderRadius: '0px' }}>
                <div className="text-[10px] font-mono uppercase text-[#71717A] tracking-wider">
                  Chassis & Electrical Fitment
                </div>
                <div className="text-xs font-bold text-white mt-1" style={{ fontFamily: "'Raleway', sans-serif" }}>
                  {activeHotspot.specs.fitment}
                </div>
              </div>
            </div>

            {/* Quick Filter Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span
                className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider mr-1"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                Key Assemblies:
              </span>
              {activeHotspot.popularParts.map((part) => (
                <Link
                  key={part}
                  href={`/shop?search=${encodeURIComponent(part)}`}
                  className="px-3 py-1 rounded-none bg-[#18181B] hover:bg-white hover:text-black text-[#E4E4E7] border border-[#27272A] text-xs font-medium transition-all"
                  style={{ fontFamily: "'Lato', sans-serif", borderRadius: '0px' }}
                >
                  {part}
                </Link>
              ))}
            </div>

            {/* Real Products Grid from Inventory */}
            {loadingProducts ? (
              <div className="py-16 text-center text-[#A1A1AA] text-sm flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-none animate-spin" style={{ borderRadius: '0px' }} />
                <span className="font-mono text-xs">Querying warehouse catalog for {activeHotspot.name}...</span>
              </div>
            ) : matchingProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchingProducts.map((product) => {
                  return (
                    <div
                      key={product._id || product.slug}
                      className="group bg-[#141416] rounded-none border border-[#27272A] hover:border-white transition-all duration-300 p-5 flex flex-col justify-between hover:shadow-[0_0_25px_rgba(255,255,255,0.08)]"
                      style={{ borderRadius: '0px' }}
                    >
                      <div>
                        {/* Auto Rotating Image Box */}
                        <div className="relative aspect-video rounded-none bg-[#09090B] overflow-hidden mb-4 border border-[#27272A] flex items-center justify-center p-3" style={{ borderRadius: '0px' }}>
                          <Link href={`/product/${product.slug}`} style={{ width: '100%', height: '100%', display: 'block' }}>
                            <AutoProductImage
                              images={product.images}
                              image={product.image}
                              alt={product.name}
                            />
                          </Link>
                          <span
                            className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-none bg-white text-black text-[10px] font-black uppercase tracking-wider z-20"
                            style={{ fontFamily: "'Raleway', sans-serif", borderRadius: '0px' }}
                          >
                            OEM Certified
                          </span>
                        </div>

                        {/* Category & Name */}
                        <div
                          className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider"
                          style={{ fontFamily: "'Raleway', sans-serif" }}
                        >
                          {product.category || 'Luxury Auto Spare'}
                        </div>
                        <h4
                          className="font-bold text-white text-sm line-clamp-2 mt-1 group-hover:text-white transition-colors"
                          style={{ fontFamily: "'Raleway', sans-serif" }}
                        >
                          <Link href={`/product/${product.slug}`}>{product.name}</Link>
                        </h4>
                        <div className="text-[11px] font-mono text-[#71717A] mt-1.5 flex items-center gap-2">
                          <span>SKU: {product.part_number || product.sku || 'OEM-' + String(product.id || 'N/A')}</span>
                        </div>
                      </div>

                      {/* Pricing and Actions */}
                      <div className="mt-5 pt-4 border-t border-[#27272A] flex items-center justify-between gap-3">
                        <div>
                          <span
                            className="text-[10px] text-[#71717A] block uppercase font-mono"
                            style={{ fontFamily: "'Lato', sans-serif" }}
                          >
                            Inclusive of GST
                          </span>
                          <span
                            className="text-lg font-black text-white"
                            style={{ fontFamily: "'Raleway', sans-serif" }}
                          >
                            ₹{Number(product.price || 0).toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/product/${product.slug}`}
                            className="px-3 py-2 rounded-none text-xs font-bold text-white bg-[#1C1C1E] hover:bg-[#27272A] border border-[#3F3F46] transition-colors"
                            style={{ fontFamily: "'Raleway', sans-serif", borderRadius: '0px' }}
                          >
                            Specs
                          </Link>
                          <button
                            onClick={() => handleQuickAdd(product)}
                            className="px-3.5 py-2 rounded-none text-xs font-black text-black bg-white hover:bg-[#E4E4E7] shadow flex items-center gap-1.5 transition-all cursor-pointer"
                            style={{ fontFamily: "'Raleway', sans-serif", borderRadius: '0px' }}
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
              <div className="text-center py-12 text-[#A1A1AA] bg-[#141416] rounded-none border border-[#27272A] p-6" style={{ borderRadius: '0px' }}>
                <p className="text-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
                  Direct warehouse stock for this component assembly can be reserved directly with our chassis engineers.
                </p>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <a
                    href="https://wa.me/919999999999?text=Hello%2C+I+need+pricing+for+OEM+components+in+zone"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-[#E4E4E7] transition-all"
                    style={{ fontFamily: "'Raleway', sans-serif", borderRadius: '0px' }}
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Instant WhatsApp VIP Concierge</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Success Toast */}
        {addedToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-white text-black px-6 py-3.5 rounded-2xl shadow-2xl border border-[#E4E4E7] flex items-center gap-3 animate-slideUp">
            <CheckCircle2 className="w-5 h-5 text-black flex-shrink-0" />
            <span className="text-sm font-bold" style={{ fontFamily: "'Lato', sans-serif" }}>
              {addedToast}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
