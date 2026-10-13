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
    tagline: 'M Performance & Luxury',
    logo: (
      <svg viewBox="0 0 100 100" className="w-9 h-9 flex-shrink-0">
        <circle cx="50" cy="50" r="48" fill="#1C1C1E" stroke="#D1D5DB" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="32" fill="#FFFFFF" />
        <path d="M50 18 A32 32 0 0 1 82 50 L50 50 Z" fill="#0066B1" />
        <path d="M18 50 A32 32 0 0 1 50 82 L50 50 Z" fill="#0066B1" />
        <line x1="50" y1="18" x2="50" y2="82" stroke="#FFFFFF" strokeWidth="2.5" />
        <line x1="18" y1="50" x2="82" y2="50" stroke="#FFFFFF" strokeWidth="2.5" />
        <text x="50" y="14" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="3">BMW</text>
      </svg>
    ),
  },
  {
    id: 'mercedes-benz',
    name: 'Mercedes-Benz',
    tagline: 'AMG & Genuine Star',
    logo: (
      <svg viewBox="0 0 100 100" className="w-9 h-9 flex-shrink-0">
        <defs>
          <linearGradient id="mb-silver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#D1D5DB" />
            <stop offset="70%" stopColor="#9CA3AF" />
            <stop offset="100%" stopColor="#4B5563" />
          </linearGradient>
          <linearGradient id="mb-star-l" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9FAFB" />
            <stop offset="100%" stopColor="#9CA3AF" />
          </linearGradient>
          <linearGradient id="mb-star-r" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9CA3AF" />
            <stop offset="100%" stopColor="#4B5563" />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="none" stroke="url(#mb-silver)" strokeWidth="4.5" />
        <polygon points="50,6 50,50 36,44" fill="url(#mb-star-l)" />
        <polygon points="50,6 50,50 64,44" fill="url(#mb-star-r)" />
        <polygon points="12,72 50,50 48,34" fill="url(#mb-star-l)" />
        <polygon points="12,72 50,50 32,58" fill="url(#mb-star-r)" />
        <polygon points="88,72 50,50 68,58" fill="url(#mb-star-l)" />
        <polygon points="88,72 50,50 52,34" fill="url(#mb-star-r)" />
      </svg>
    ),
  },
  {
    id: 'audi',
    name: 'Audi',
    tagline: 'Quattro & RS Components',
    logo: (
      <svg viewBox="0 0 160 60" className="w-12 h-7 flex-shrink-0">
        <defs>
          <linearGradient id="audi-chrome" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#E5E7EB" />
            <stop offset="50%" stopColor="#9CA3AF" />
            <stop offset="75%" stopColor="#D1D5DB" />
            <stop offset="100%" stopColor="#4B5563" />
          </linearGradient>
        </defs>
        <circle cx="28" cy="30" r="23" fill="none" stroke="url(#audi-chrome)" strokeWidth="5.5" />
        <circle cx="63" cy="30" r="23" fill="none" stroke="url(#audi-chrome)" strokeWidth="5.5" />
        <circle cx="97" cy="30" r="23" fill="none" stroke="url(#audi-chrome)" strokeWidth="5.5" />
        <circle cx="132" cy="30" r="23" fill="none" stroke="url(#audi-chrome)" strokeWidth="5.5" />
      </svg>
    ),
  },
  {
    id: 'porsche',
    name: 'Porsche',
    tagline: 'Stuttgart Genuine Parts',
    logo: (
      <svg viewBox="0 0 100 120" className="w-8 h-9 flex-shrink-0">
        <defs>
          <linearGradient id="porsche-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F9DF7B" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#AA820A" />
          </linearGradient>
        </defs>
        <path d="M12 8 L88 8 L82 70 Q76 112 50 118 Q24 112 18 70 Z" fill="url(#porsche-gold)" stroke="#8A6707" strokeWidth="2" />
        <rect x="14" y="9" width="72" height="15" fill="#1C1C1E" />
        <text x="50" y="20" textAnchor="middle" fill="url(#porsche-gold)" fontSize="8" fontWeight="900" fontFamily="sans-serif" letterSpacing="1.5">PORSCHE</text>
        <path d="M15 25 H49 V68 H18 Z" fill="#D50000" />
        <rect x="23" y="25" width="6" height="43" fill="#1C1C1E" />
        <rect x="37" y="25" width="6" height="43" fill="#1C1C1E" />
        <path d="M51 25 H85 V68 H51 Z" fill="url(#porsche-gold)" />
        <path d="M54 34 H80 M54 44 H80 M54 54 H78" stroke="#1C1C1E" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 68 H50 V115 Q28 108 20 70 Z" fill="url(#porsche-gold)" />
        <path d="M24 78 H46 M26 88 H46 M28 98 H44" stroke="#1C1C1E" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M50 68 H82 Q76 108 50 115 Z" fill="#D50000" />
        <path d="M58 68 L58 112" stroke="#1C1C1E" strokeWidth="6" />
        <path d="M72 68 L70 98" stroke="#1C1C1E" strokeWidth="6" />
        <path d="M38 48 H62 V74 Q62 86 50 89 Q38 86 38 74 Z" fill="url(#porsche-gold)" stroke="#1C1C1E" strokeWidth="1.5" />
        <circle cx="50" cy="66" r="6" fill="#1C1C1E" />
        <text x="50" y="55" textAnchor="middle" fill="#1C1C1E" fontSize="5" fontWeight="900">STUTTGART</text>
      </svg>
    ),
  },
  {
    id: 'range-rover',
    name: 'Range Rover',
    tagline: 'Vogue, Sport & Velar',
    logo: (
      <svg viewBox="0 0 160 50" className="w-14 h-6 flex-shrink-0">
        <defs>
          <linearGradient id="rr-silver" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#E5E7EB" />
            <stop offset="100%" stopColor="#9CA3AF" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="156" height="46" rx="8" fill="#18181B" stroke="url(#rr-silver)" strokeWidth="2.5" />
        <text x="80" y="31" textAnchor="middle" fill="url(#rr-silver)" fontSize="14" fontWeight="900" fontFamily="'Raleway', sans-serif" letterSpacing="2.2">RANGE ROVER</text>
      </svg>
    ),
  },
  {
    id: 'land-rover',
    name: 'Land Rover',
    tagline: 'Defender & 4x4 Spares',
    logo: (
      <svg viewBox="0 0 140 70" className="w-12 h-7 flex-shrink-0">
        <defs>
          <linearGradient id="lr-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
        </defs>
        <ellipse cx="70" cy="35" rx="66" ry="32" fill="#005A2B" stroke="url(#lr-gold)" strokeWidth="3.5" />
        <ellipse cx="70" cy="35" rx="60" ry="26" fill="none" stroke="url(#lr-gold)" strokeWidth="1.5" />
        <text x="70" y="32" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="'Raleway', sans-serif" letterSpacing="1.5">LAND</text>
        <text x="70" y="47" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900" fontFamily="'Raleway', sans-serif" letterSpacing="1.5">ROVER</text>
        <path d="M18 35 L30 35 M110 35 L122 35" stroke="url(#lr-gold)" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    id: 'jaguar',
    name: 'Jaguar',
    tagline: 'Supercharged Performance',
    logo: (
      <svg viewBox="0 0 120 60" className="w-11 h-7 flex-shrink-0">
        <defs>
          <linearGradient id="jag-silver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#D1D5DB" />
            <stop offset="80%" stopColor="#9CA3AF" />
            <stop offset="100%" stopColor="#4B5563" />
          </linearGradient>
        </defs>
        <path d="M115 28 C108 24 102 23 96 24 C90 20 82 17 72 17 C60 17 50 21 42 27 C36 24 28 23 20 25 C14 26 8 30 4 35 C10 33 16 34 22 36 C18 40 14 45 10 50 C16 47 22 43 28 40 C34 44 42 46 50 46 C62 46 72 41 80 34 C88 35 96 38 104 42 C101 37 99 33 97 30 C103 31 109 30 115 28 Z" fill="url(#jag-silver)" stroke="#374151" strokeWidth="1" />
        <text x="60" y="56" textAnchor="middle" fill="#1C1C1E" fontSize="9" fontWeight="900" fontFamily="'Raleway', sans-serif" letterSpacing="2">JAGUAR</text>
      </svg>
    ),
  },
  {
    id: 'volvo',
    name: 'Volvo',
    tagline: 'Scandinavian Safety Spares',
    logo: (
      <svg viewBox="0 0 100 100" className="w-9 h-9 flex-shrink-0">
        <defs>
          <linearGradient id="volvo-silver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#9CA3AF" />
            <stop offset="100%" stopColor="#4B5563" />
          </linearGradient>
        </defs>
        <circle cx="48" cy="52" r="38" fill="none" stroke="url(#volvo-silver)" strokeWidth="6" />
        <path d="M72 28 L94 6" stroke="url(#volvo-silver)" strokeWidth="6" strokeLinecap="round" />
        <path d="M76 6 L94 6 L94 24" stroke="url(#volvo-silver)" strokeWidth="6" strokeLinejoin="round" />
        <rect x="14" y="44" width="68" height="16" fill="#003057" rx="2" stroke="#FFFFFF" strokeWidth="1" />
        <text x="48" y="56" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="900" fontFamily="'Raleway', sans-serif" letterSpacing="1.2">VOLVO</text>
      </svg>
    ),
  },
  {
    id: 'jeep',
    name: 'Jeep',
    tagline: 'Wrangler & Rubicon 4x4',
    logo: (
      <svg viewBox="0 0 100 60" className="w-10 h-7 flex-shrink-0">
        <rect x="4" y="8" width="92" height="44" rx="8" fill="#1F2937" stroke="#374151" strokeWidth="2" />
        <rect x="14" y="14" width="7" height="32" rx="3.5" fill="#9CA3AF" />
        <rect x="25" y="14" width="7" height="32" rx="3.5" fill="#9CA3AF" />
        <rect x="36" y="14" width="7" height="32" rx="3.5" fill="#9CA3AF" />
        <rect x="47" y="14" width="7" height="32" rx="3.5" fill="#9CA3AF" />
        <rect x="58" y="14" width="7" height="32" rx="3.5" fill="#9CA3AF" />
        <rect x="69" y="14" width="7" height="32" rx="3.5" fill="#9CA3AF" />
        <rect x="80" y="14" width="7" height="32" rx="3.5" fill="#9CA3AF" />
        <rect x="26" y="24" width="48" height="12" rx="2" fill="#111827" />
        <text x="50" y="33" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="900" fontFamily="'Raleway', sans-serif" letterSpacing="1.5">JEEP</text>
      </svg>
    ),
  },
  {
    id: 'toyota',
    name: 'Toyota',
    tagline: 'Fortuner & Hilux Spares',
    logo: (
      <svg viewBox="0 0 120 90" className="w-10 h-7 flex-shrink-0">
        <ellipse cx="60" cy="45" rx="54" ry="38" fill="none" stroke="#EB0A1E" strokeWidth="6" />
        <ellipse cx="60" cy="35" rx="25" ry="17" fill="none" stroke="#EB0A1E" strokeWidth="5.5" />
        <ellipse cx="60" cy="45" rx="14" ry="35" fill="none" stroke="#EB0A1E" strokeWidth="5.5" />
      </svg>
    ),
  },
  {
    id: 'mahindra',
    name: 'Mahindra',
    tagline: 'Thar & Scorpio-N 4x4',
    logo: (
      <svg viewBox="0 0 120 80" className="w-10 h-7 flex-shrink-0">
        <defs>
          <linearGradient id="mah-red" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#B91C1C" />
          </linearGradient>
        </defs>
        <path d="M15 65 L45 20 L60 48 L75 20 L105 65" fill="none" stroke="url(#mah-red)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M45 20 Q60 10 75 20" fill="none" stroke="#1F2937" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'ferrari',
    name: 'Ferrari',
    tagline: 'Maranello Supercars',
    logo: (
      <svg viewBox="0 0 80 110" className="w-7 h-9 flex-shrink-0">
        <path d="M10 8 L70 8 L65 75 Q60 105 40 108 Q20 105 15 75 Z" fill="#FFDD00" stroke="#000000" strokeWidth="2.5" />
        <rect x="10" y="8" width="20" height="7" fill="#009246" />
        <rect x="30" y="8" width="20" height="7" fill="#FFFFFF" />
        <rect x="50" y="8" width="20" height="7" fill="#CE2B37" />
        <path d="M42 25 C45 28 47 32 46 36 C42 35 38 33 36 30 C35 35 37 42 41 46 C37 48 33 46 30 43 C31 52 38 60 44 65 C40 68 35 66 32 64 C35 74 44 80 50 82 L42 92 L47 92 L53 84 C56 84 58 80 58 75 C58 68 53 60 48 54 C54 52 58 46 56 38 C55 32 50 27 45 25 Z" fill="#000000" />
        <text x="25" y="88" fill="#000000" fontSize="11" fontWeight="900" fontFamily="serif">S</text>
        <text x="55" y="88" fill="#000000" fontSize="11" fontWeight="900" fontFamily="serif">F</text>
      </svg>
    ),
  },
  {
    id: 'lamborghini',
    name: 'Lamborghini',
    tagline: 'Sant’Agata Bolognese',
    logo: (
      <svg viewBox="0 0 90 110" className="w-8 h-9 flex-shrink-0">
        <defs>
          <linearGradient id="lambo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#D6A848" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>
        </defs>
        <path d="M45 5 L85 20 L75 85 L45 106 L15 85 L5 20 Z" fill="#1C1C1E" stroke="url(#lambo-gold)" strokeWidth="3" />
        <text x="45" y="24" textAnchor="middle" fill="url(#lambo-gold)" fontSize="6" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">LAMBORGHINI</text>
        <path d="M45 35 C52 38 60 45 62 55 C58 54 52 52 48 54 C46 62 52 70 56 76 L48 76 C44 70 40 64 38 58 C34 60 30 65 28 72 L22 72 C24 64 28 56 34 50 C32 44 38 38 45 35 Z" fill="url(#lambo-gold)" />
      </svg>
    ),
  },
  {
    id: 'bentley',
    name: 'Bentley',
    tagline: 'British Grand Tourer',
    logo: (
      <svg viewBox="0 0 140 70" className="w-11 h-7 flex-shrink-0">
        <defs>
          <linearGradient id="bentley-silver" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#9CA3AF" />
            <stop offset="100%" stopColor="#4B5563" />
          </linearGradient>
        </defs>
        <path d="M10 25 C30 20 50 35 55 45 C45 40 25 35 15 45 C30 45 45 50 55 52" stroke="url(#bentley-silver)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <path d="M130 25 C110 20 90 35 85 45 C95 40 115 35 125 45 C110 45 95 50 85 52" stroke="url(#bentley-silver)" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        <circle cx="70" cy="42" r="16" fill="#004225" stroke="url(#bentley-silver)" strokeWidth="2" />
        <text x="70" y="48" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900" fontFamily="'Raleway', sans-serif">B</text>
      </svg>
    ),
  },
  {
    id: 'rolls-royce',
    name: 'Rolls-Royce',
    tagline: 'Goodwood Bespoke Spares',
    logo: (
      <svg viewBox="0 0 80 110" className="w-7 h-9 flex-shrink-0">
        <defs>
          <linearGradient id="rr-metal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#D1D5DB" />
            <stop offset="100%" stopColor="#6B7280" />
          </linearGradient>
        </defs>
        <rect x="5" y="5" width="70" height="100" rx="8" fill="#18181B" stroke="url(#rr-metal)" strokeWidth="3.5" />
        <text x="32" y="58" textAnchor="middle" fill="url(#rr-metal)" fontSize="40" fontWeight="900" fontFamily="serif">R</text>
        <text x="48" y="78" textAnchor="middle" fill="url(#rr-metal)" fontSize="40" fontWeight="900" fontFamily="serif">R</text>
      </svg>
    ),
  },
];

export default function BrandMarquee() {
  return (
    <section
      className="brand-marquee-section"
      style={{
        padding: '36px 0 42px',
        background: '#FFFFFF',
        borderBottom: '1px solid #E4E4E7',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="auto-container" style={{ marginBottom: '22px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              height: '1px',
              width: '46px',
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
              color: '#52525B',
              fontFamily: "'Raleway', sans-serif",
            }}
          >
            DIRECT COMPATIBILITY FOR ALL PREMIUM MAKES
          </span>
          <span
            style={{
              height: '1px',
              width: '46px',
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
          padding: '6px 0',
        }}
      >
        {/* Left & Right Smooth Edge Fade Masks */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: '100px',
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
            width: '100px',
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
            gap: '18px',
            width: 'max-content',
            willChange: 'transform',
            animation: 'marqueeLoop 42s linear infinite',
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
                padding: '10px 22px',
                background: '#FFFFFF',
                border: '1.5px solid #E4E4E7',
                borderRadius: '14px',
                textDecoration: 'none',
                color: '#18181B',
                minWidth: '220px',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#000000';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E4E4E7';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.03)';
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.25s ease',
                }}
                className="group-hover:scale-105"
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
                    color: '#000000',
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
                  }}
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
            animation-duration: 28s;
          }
        }
      `}</style>
    </section>
  );
}
