'use client';

import React from 'react';
import Link from 'next/link';

interface BrandItem {
  id: string;
  name: string;
  tagline: string;
  logo: React.ReactNode;
}

const BRANDS: BrandItem[] = [
  {
    id: 'bmw',
    name: 'BMW',
    tagline: 'M Power & Luxury Spares',
    logo: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 flex-shrink-0" fill="currentColor">
        <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="4" />
        <circle cx="50" cy="50" r="41" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M50 9 A41 41 0 0 1 91 50 L50 50 Z" fill="currentColor" opacity="0.85" />
        <path d="M9 50 A41 41 0 0 1 50 91 L50 50 Z" fill="currentColor" opacity="0.85" />
        <path d="M50 9 L50 91 M9 50 L91 50" stroke="currentColor" strokeWidth="3" />
      </svg>
    ),
  },
  {
    id: 'mercedes-benz',
    name: 'Mercedes-Benz',
    tagline: 'AMG & Genuine Star Spares',
    logo: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor">
        <circle cx="50" cy="50" r="46" strokeWidth="4" />
        <path d="M50 6 L50 50 L12 73 L50 50 L88 73 Z" fill="currentColor" stroke="none" />
        <path d="M50 6 L50 50 M12 73 L50 50 M88 73 L50 50" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    id: 'audi',
    name: 'Audi',
    tagline: 'Quattro & RS Components',
    logo: (
      <svg viewBox="0 0 160 60" className="w-11 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="5">
        <circle cx="28" cy="30" r="23" />
        <circle cx="63" cy="30" r="23" />
        <circle cx="97" cy="30" r="23" />
        <circle cx="132" cy="30" r="23" />
      </svg>
    ),
  },
  {
    id: 'porsche',
    name: 'Porsche',
    tagline: 'Stuttgart Genuine Parts',
    logo: (
      <svg viewBox="0 0 100 120" className="w-7 h-8 flex-shrink-0" fill="currentColor">
        <path d="M15 10 L85 10 L80 65 Q75 105 50 115 Q25 105 20 65 Z" fill="none" stroke="currentColor" strokeWidth="4" />
        <path d="M15 25 L85 25" stroke="currentColor" strokeWidth="3" />
        <line x1="50" y1="25" x2="50" y2="114" stroke="currentColor" strokeWidth="3" />
        <line x1="18" y1="65" x2="82" y2="65" stroke="currentColor" strokeWidth="3" />
        <path d="M22 35 H46 M22 45 H46 M22 55 H46" stroke="currentColor" strokeWidth="2" />
        <path d="M54 75 H78 M54 85 H78 M54 95 H78" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="8" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'range-rover',
    name: 'Range Rover',
    tagline: 'Air Suspension & Bodywork',
    logo: (
      <svg viewBox="0 0 160 50" className="w-12 h-6 flex-shrink-0" fill="currentColor">
        <rect x="2" y="2" width="156" height="46" rx="6" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <text x="80" y="31" textAnchor="middle" fill="currentColor" fontSize="14" fontWeight="900" fontFamily="'Raleway', sans-serif" letterSpacing="1.8">RANGE ROVER</text>
      </svg>
    ),
  },
  {
    id: 'land-rover',
    name: 'Land Rover',
    tagline: 'Defender & 4x4 Spares',
    logo: (
      <svg viewBox="0 0 140 70" className="w-11 h-7 flex-shrink-0" fill="none">
        <ellipse cx="70" cy="35" rx="66" ry="31" stroke="currentColor" strokeWidth="4" />
        <ellipse cx="70" cy="35" rx="61" ry="26" stroke="currentColor" strokeWidth="1.5" />
        <text x="70" y="32" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="900" fontFamily="'Raleway', sans-serif" letterSpacing="1.5">LAND</text>
        <text x="70" y="47" textAnchor="middle" fill="currentColor" fontSize="13" fontWeight="900" fontFamily="'Raleway', sans-serif" letterSpacing="1.5">ROVER</text>
        <path d="M18 35 L30 35 M110 35 L122 35" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
  {
    id: 'jaguar',
    name: 'Jaguar',
    tagline: 'Supercharged Performance',
    logo: (
      <svg viewBox="0 0 120 60" className="w-10 h-6 flex-shrink-0" fill="currentColor">
        <path d="M115 28 C108 24 102 23 96 24 C90 20 82 17 72 17 C60 17 50 21 42 27 C36 24 28 23 20 25 C14 26 8 30 4 35 C10 33 16 34 22 36 C18 40 14 45 10 50 C16 47 22 43 28 40 C34 44 42 46 50 46 C62 46 72 41 80 34 C88 35 96 38 104 42 C101 37 99 33 97 30 C103 31 109 30 115 28 Z" />
      </svg>
    ),
  },
  {
    id: 'volvo',
    name: 'Volvo',
    tagline: 'Scandinavian Safety Spares',
    logo: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 flex-shrink-0" fill="none" stroke="currentColor">
        <circle cx="48" cy="52" r="38" strokeWidth="4.5" />
        <path d="M72 28 L94 6" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M76 6 L94 6 L94 24" strokeWidth="4.5" strokeLinejoin="round" />
        <rect x="18" y="44" width="60" height="16" fill="currentColor" stroke="none" rx="2" />
        <text x="48" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900" fontFamily="'Raleway', sans-serif" letterSpacing="1">VOLVO</text>
      </svg>
    ),
  },
  {
    id: 'jeep',
    name: 'Jeep',
    tagline: 'Trail Rated 4x4 Off-Road',
    logo: (
      <svg viewBox="0 0 100 60" className="w-9 h-6 flex-shrink-0" fill="currentColor">
        <rect x="5" y="10" width="90" height="40" rx="8" fill="none" stroke="currentColor" strokeWidth="3.5" />
        <rect x="15" y="16" width="6" height="28" rx="3" fill="currentColor" />
        <rect x="26" y="16" width="6" height="28" rx="3" fill="currentColor" />
        <rect x="37" y="16" width="6" height="28" rx="3" fill="currentColor" />
        <rect x="47" y="16" width="6" height="28" rx="3" fill="currentColor" />
        <rect x="57" y="16" width="6" height="28" rx="3" fill="currentColor" />
        <rect x="68" y="16" width="6" height="28" rx="3" fill="currentColor" />
        <rect x="79" y="16" width="6" height="28" rx="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'toyota',
    name: 'Toyota',
    tagline: 'Fortuner & Hilux Genuine',
    logo: (
      <svg viewBox="0 0 120 90" className="w-9 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="5.5">
        <ellipse cx="60" cy="45" rx="54" ry="38" />
        <ellipse cx="60" cy="35" rx="24" ry="16" />
        <ellipse cx="60" cy="45" rx="14" ry="35" />
      </svg>
    ),
  },
  {
    id: 'mahindra',
    name: 'Mahindra',
    tagline: 'Thar & Scorpio 4x4 Spares',
    logo: (
      <svg viewBox="0 0 120 80" className="w-9 h-6 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 65 L45 20 L60 48 L75 20 L105 65" />
        <path d="M45 20 Q60 10 75 20" strokeWidth="3.5" />
      </svg>
    ),
  },
  {
    id: 'rolls-royce',
    name: 'Rolls-Royce',
    tagline: 'Pinnacle Bespoke Luxury',
    logo: (
      <svg viewBox="0 0 80 110" className="w-6 h-8 flex-shrink-0" fill="currentColor">
        <rect x="5" y="5" width="70" height="100" rx="6" fill="none" stroke="currentColor" strokeWidth="4" />
        <text x="32" y="58" textAnchor="middle" fill="currentColor" fontSize="38" fontWeight="900" fontFamily="'Raleway', serif">R</text>
        <text x="48" y="76" textAnchor="middle" fill="currentColor" fontSize="38" fontWeight="900" fontFamily="'Raleway', serif">R</text>
      </svg>
    ),
  },
  {
    id: 'bentley',
    name: 'Bentley',
    tagline: 'British Grand Tourer',
    logo: (
      <svg viewBox="0 0 140 70" className="w-10 h-6 flex-shrink-0" fill="none" stroke="currentColor">
        <path d="M10 25 C30 20 50 35 55 45 C45 40 25 35 15 45 C30 45 45 50 55 52" strokeWidth="3" strokeLinecap="round" />
        <path d="M130 25 C110 20 90 35 85 45 C95 40 115 35 125 45 C110 45 95 50 85 52" strokeWidth="3" strokeLinecap="round" />
        <circle cx="70" cy="42" r="15" fill="currentColor" stroke="none" />
        <text x="70" y="48" textAnchor="middle" fill="#FFFFFF" fontSize="17" fontWeight="900" fontFamily="'Raleway', sans-serif">B</text>
      </svg>
    ),
  },
];

export default function BrandMarquee() {
  return (
    <section
      className="brand-marquee-section"
      style={{
        padding: '34px 0 38px',
        background: '#FFFFFF',
        borderBottom: '1px solid #E4E4E7',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="auto-container" style={{ marginBottom: '18px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              height: '1px',
              width: '40px',
              background: '#D4D4D8',
              display: 'inline-block',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: '#71717A',
              fontFamily: "'Raleway', sans-serif",
            }}
          >
            DIRECT COMPATIBILITY FOR ALL PREMIUM MAKES
          </span>
          <span
            style={{
              height: '1px',
              width: '40px',
              background: '#D4D4D8',
              display: 'inline-block',
            }}
          />
        </div>
      </div>

      {/* Infinite Scrolling Track Wrapper */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          padding: '4px 0',
        }}
      >
        {/* Left & Right Smooth Edge Fade Masks */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '90px',
            background: 'linear-gradient(to right, #FFFFFF, rgba(255, 255, 255, 0))',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: '90px',
            background: 'linear-gradient(to left, #FFFFFF, rgba(255, 255, 255, 0))',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />

        {/* Marquee Track: Duplicated list for seamless infinite loop */}
        <div
          className="marquee-track"
          style={{
            display: 'flex',
            gap: '16px',
            width: 'max-content',
            willChange: 'transform',
            animation: 'marqueeLoop 38s linear infinite',
          }}
        >
          {[...BRANDS, ...BRANDS].map((brand, index) => (
            <Link
              key={`${brand.id}-${index}`}
              href={`/shop?make=${encodeURIComponent(brand.name)}`}
              className="brand-pill-card group"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '14px',
                padding: '10px 20px',
                background: '#FAFAFA',
                border: '1px solid #E4E4E7',
                borderRadius: '12px',
                textDecoration: 'none',
                color: '#18181B',
                minWidth: '200px',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#000000';
                e.currentTarget.style.borderColor = '#000000';
                e.currentTarget.style.color = '#FFFFFF';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#FAFAFA';
                e.currentTarget.style.borderColor = '#E4E4E7';
                e.currentTarget.style.color = '#18181B';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.02)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.25s ease',
                }}
              >
                {brand.logo}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 800,
                    letterSpacing: '0.4px',
                    fontFamily: "'Raleway', sans-serif",
                    lineHeight: '1.2',
                  }}
                >
                  {brand.name}
                </span>
                <span
                  style={{
                    fontSize: '10px',
                    color: '#71717A',
                    fontWeight: 600,
                    letterSpacing: '0.2px',
                    fontFamily: "'Lato', sans-serif",
                    transition: 'color 0.25s',
                  }}
                  className="group-hover:text-[#A1A1AA]"
                >
                  {brand.tagline}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Embedded CSS for infinite linear marquee animation and pause on hover */}
      <style jsx>{`
        @keyframes marqueeLoop {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .marquee-track {
            animation-duration: 26s;
          }
        }
      `}</style>
    </section>
  );
}

