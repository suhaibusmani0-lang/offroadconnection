import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          gold: '#C5A059',
          'gold-light': '#DFBA73',
          'gold-dark': '#9A7731',
          obsidian: '#0B0F19',
          slate: '#0F172A',
          muted: '#64748B',
          pearl: '#FAFBFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          emerald: '#10B981',
          azure: '#0284C7',
        },
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        luxury: '0 20px 45px -12px rgba(15, 23, 42, 0.08)',
        'luxury-hover': '0 30px 60px -15px rgba(197, 160, 89, 0.2)',
        'luxury-gold': '0 10px 30px -5px rgba(197, 160, 89, 0.3)',
      },
      animation: {
        pulseSlow: 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

