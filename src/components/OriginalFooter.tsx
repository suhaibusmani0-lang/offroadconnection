'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import siteConfig from '@/config/site';
import {
  ShieldCheck,
  Phone,
  Lock,
  MapPin,
  Clock,
  Plane,
  ExternalLink,
  Mail,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react';

const WhatsAppIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ display: 'inline-block' }}
  >
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.004.577 1.764.846 2.806.847h.005c3.182 0 5.768-2.587 5.768-5.766.001-3.18-2.584-5.766-5.768-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.824 0-3.535-.49-5.012-1.344l-5.988 1.569 1.6-5.836c-.958-1.536-1.5-3.351-1.5-5.275 0-5.514 4.486-10 10-10 5.514 0 10 4.486 10 10z" />
  </svg>
);

const InstagramIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block' }}
  >
    <rect x="2" y="2" width="20" height="20" rx="0" ry="0" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export default function OriginalFooter() {
  const currentYear = new Date().getFullYear();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Dynamic Live Time in IST
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: true,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 4000);
  };

  return (
    <footer
      className="main-footer relative bg-[#050505] text-[#A1A1AA] border-t border-[#27272A] overflow-hidden"
      style={{
        fontFamily: "'Lato', sans-serif",
        borderRadius: '0px',
      }}
    >
      {/* Background Precision Grid Lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, #27272A 1px, transparent 1px),
            linear-gradient(to bottom, #27272A 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ========================================================================= */}
      {/* TOP DYNAMIC TELEMETRY & LIVE DISPATCH STRIP                              */}
      {/* ========================================================================= */}
      <div className="relative z-10 border-b border-[#1C1C1E] bg-[#0A0A0C] py-3.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4 text-xs font-mono">
          {/* Live Distribution Status */}
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full bg-[#FFFFFF] opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 bg-[#FFFFFF]" />
            </span>
            <span
              className="text-[#FFFFFF] font-bold text-xs tracking-wider uppercase"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              CENTRAL WAREHOUSE: ACTIVE
            </span>
            <span className="hidden sm:inline text-[#52525B]">|</span>
            <span className="hidden sm:inline text-[11px] text-[#A1A1AA]">
              NOIDA SECTOR 10 HUB • 19,000+ PIN CODES DELIVERABLE
            </span>
          </div>

          {/* Real-Time Live Clock & Inventory Counter */}
          <div className="flex items-center gap-4 text-[11px] text-[#A1A1AA]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-white" />
              <span>IST: <strong className="text-white">{currentTime || '09:30:00 AM'}</strong></span>
            </div>
            <span className="text-[#52525B]">|</span>
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-white" />
              <span>STOCK: <strong className="text-white">2,524+ OEM PARTS</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIP CHASSIS & FITMENT ASSISTANCE STRIP (Sharp Edges)                      */}
      {/* ========================================================================= */}
      <div className="relative z-10 border-b border-[#1C1C1E] bg-[#0F0F12] py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 bg-[#18181B] border border-[#27272A] flex items-center justify-center text-white flex-shrink-0"
              style={{ borderRadius: '0px' }}
            >
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4
                className="text-white text-base sm:text-lg font-black tracking-wide uppercase"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                Require Precision OEM Chassis Fitment or Hard-To-Find European Spares?
              </h4>
              <p className="text-[#A1A1AA] text-xs sm:text-sm mt-0.5" style={{ fontFamily: "'Lato', sans-serif" }}>
                Our senior automotive engineers verify VIN numbers, chassis schematics & parts numbers prior to dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent(
                'Hello Off Road Connection Parts, I need help verifying part fitment for my luxury vehicle.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#FFFFFF] hover:bg-[#E4E4E7] text-[#000000] font-black text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer border border-[#FFFFFF]"
              style={{ fontFamily: "'Raleway', sans-serif", borderRadius: '0px' }}
            >
              <WhatsAppIcon size={16} />
              <span>DIRECT WHATSAPP FITMENT DESK</span>
            </a>

            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#18181B] hover:bg-[#27272A] text-[#FFFFFF] font-bold text-xs uppercase tracking-wider transition-all border border-[#27272A] cursor-pointer"
              style={{ fontFamily: "'Raleway', sans-serif", borderRadius: '0px' }}
            >
              <Phone size={14} className="text-white" />
              <span>{siteConfig.contact.phoneFormatted}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN FOOTER WIDGET AREA                                                   */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand Info & Real Logo (Fixed White Box Issue) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Brand Logo Presentation: Clean, High-Contrast Luxury Emblem Frame */}
            <div className="flex flex-col gap-3">
              <Link href="/" className="inline-block">
                <div
                  className="bg-[#FFFFFF] p-2.5 inline-flex items-center justify-center border border-[#27272A] shadow-lg hover:border-white transition-all"
                  style={{ borderRadius: '0px' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/images/mv-logo-13.png"
                    alt="Off Road Connection Parts"
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                </div>
              </Link>
              <div>
                <span
                  className="text-white font-black text-lg tracking-wider uppercase block"
                  style={{ fontFamily: "'Raleway', sans-serif" }}
                >
                  OFF ROAD CONNECTION PARTS
                </span>
                <span
                  className="text-[#71717A] text-[11px] font-mono uppercase tracking-widest block mt-0.5"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Luxury European Auto Spares • Direct OEM Importer
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-sm" style={{ fontFamily: "'Lato', sans-serif" }}>
              India’s premier independent procurement house for Audi, BMW, Mercedes-Benz, Porsche, Range Rover, Land
              Rover, Jaguar, Volvo, Jeep and Toyota genuine OEM replacement parts, body modules, and performance
              engineering components.
            </p>

            {/* Social Channels with Sharp Edges */}
            <div className="flex items-center gap-3 pt-2">
              <span
                className="text-[11px] font-bold text-white uppercase tracking-wider"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                CONNECT:
              </span>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#18181B] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#27272A] flex items-center justify-center transition-all cursor-pointer"
                style={{ borderRadius: '0px' }}
                title="Instagram"
              >
                <InstagramIcon size={16} />
              </a>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-[#18181B] hover:bg-[#FFFFFF] text-[#FFFFFF] hover:text-[#000000] border border-[#27272A] flex items-center justify-center transition-all cursor-pointer"
                style={{ borderRadius: '0px' }}
                title="WhatsApp VIP Concierge"
              >
                <WhatsAppIcon size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Supported European Marques */}
          <div className="lg:col-span-2 space-y-4">
            <h4
              className="text-white text-xs font-black uppercase tracking-widest border-b border-[#27272A] pb-2.5"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              Luxury Marques
            </h4>
            <ul className="space-y-2 text-xs">
              {siteConfig.supportedMakes.slice(0, 7).map((make) => (
                <li key={make}>
                  <Link
                    href={`/shop?make=${encodeURIComponent(make)}`}
                    className="text-[#71717A] hover:text-white transition-colors block py-0.5"
                  >
                    {make} Genuine Spares
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: High Demand Subsystems */}
          <div className="lg:col-span-3 space-y-4">
            <h4
              className="text-white text-xs font-black uppercase tracking-widest border-b border-[#27272A] pb-2.5"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              Component Systems
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/shop?category=air-suspension" className="text-[#71717A] hover:text-white transition-colors block py-0.5">
                  Adaptive Air Suspension Struts &amp; Pumps
                </Link>
              </li>
              <li>
                <Link href="/shop?category=braking" className="text-[#71717A] hover:text-white transition-colors block py-0.5">
                  Carbon Ceramic Brakes &amp; Calipers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=lighting" className="text-[#71717A] hover:text-white transition-colors block py-0.5">
                  Matrix LED Headlights &amp; Tail Lightbars
                </Link>
              </li>
              <li>
                <Link href="/shop?category=engine" className="text-[#71717A] hover:text-white transition-colors block py-0.5">
                  Twin-Turbo Cartridges &amp; Fuel Pumps
                </Link>
              </li>
              <li>
                <Link href="/shop?category=cooling" className="text-[#71717A] hover:text-white transition-colors block py-0.5">
                  Radiators, Intercoolers &amp; AC Condensers
                </Link>
              </li>
              <li>
                <Link href="/#car-explorer" className="text-white font-bold hover:underline transition-colors block py-0.5">
                  → 360° Visual Vehicle Inspector
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Central Distribution & VIP Newsletter */}
          <div className="lg:col-span-3 space-y-4">
            <h4
              className="text-white text-xs font-black uppercase tracking-widest border-b border-[#27272A] pb-2.5"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              VIP Allocation Network
            </h4>

            {/* Interactive Newsletter Box (Sharp Edge) */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <p className="text-[11px] text-[#A1A1AA]" style={{ fontFamily: "'Lato', sans-serif" }}>
                Subscribe for private container arrivals, rare European spare stock updates, and OEM import alerts.
              </p>
              <div className="flex border border-[#27272A] focus-within:border-white transition-colors">
                <input
                  type="email"
                  required
                  placeholder="Enter corporate / personal email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-[#121212] text-white text-xs px-3 py-2.5 w-full border-none outline-none placeholder-[#52525B]"
                  style={{ borderRadius: '0px' }}
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-[#E4E4E7] text-black px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex-shrink-0"
                  style={{ fontFamily: "'Raleway', sans-serif", borderRadius: '0px' }}
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {newsletterSubscribed && (
                <div className="text-[11px] text-white flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Subscribed! Welcome to the VIP Priority Spares Network.</span>
                </div>
              )}
            </form>

            {/* Warehouse Facility Details */}
            <div className="pt-2 space-y-2 text-xs text-[#A1A1AA]">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
                <span>{siteConfig.geo.address.streetAddress}, {siteConfig.geo.address.addressLocality} {siteConfig.geo.address.postalCode}</span>
              </div>
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-white flex-shrink-0" />
                <span>Air Cargo Express • 24hr Pan-India Transit</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BOTTOM STRIP: COPYRIGHT, DEVELOPED BY ZARNETIC & ADMIN LOGIN              */}
        {/* ========================================================================= */}
        <div className="mt-14 pt-6 border-t border-[#27272A] flex items-center justify-between flex-wrap gap-4 text-xs text-[#71717A]">
          {/* Left: Copyright & Discreet Admin Login */}
          <div className="flex items-center gap-3 flex-wrap">
            <span>&copy; {currentYear} {siteConfig.name}. All rights reserved.</span>
            <span className="text-[#3F3F46]">•</span>
            <Link
              href="/admin/login"
              className="text-[#52525B] hover:text-white transition-colors inline-flex items-center gap-1.5 font-bold"
              style={{ fontFamily: "'Raleway', sans-serif" }}
              title="Store Administrator Portal"
            >
              <Lock size={11} />
              <span>Admin Log In</span>
            </Link>
          </div>

          {/* Center: DEVELOPED BY ZARNETIC (Sharp Geometric Luxury Badge) */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#71717A]">Engineered &amp; Developed By</span>
            <a
              href="https://www.zarnetic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#18181B] hover:bg-[#FFFFFF] text-white hover:text-black border border-[#3F3F46] hover:border-white text-xs font-black tracking-widest uppercase transition-all shadow-md"
              style={{ fontFamily: "'Raleway', sans-serif", borderRadius: '0px' }}
            >
              <span>ZARNETIC</span>
              <ExternalLink size={11} />
            </a>
          </div>

          {/* Right: Legal Fair Use */}
          <div className="text-[11px] text-[#52525B] max-w-sm text-right">
            Audi, BMW, Mercedes, Porsche &amp; Range Rover trademarks are referenced solely for OEM fitment verification under Indian fair use.
          </div>
        </div>
      </div>
    </footer>
  );
}
