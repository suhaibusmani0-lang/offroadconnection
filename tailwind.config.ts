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
          black: '#000000',
          charcoal: '#111111',
          obsidian: '#18181B',
          white: '#FFFFFF',
          card: '#FFFFFF',
          pearl: '#FAFAFA',
          border: '#E4E4E7',
          'border-dark': '#27272A',
          grey: {
            50: '#FAFAFA',
            100: '#F4F4F5',
            200: '#E4E4E7',
            300: '#D4D4D8',
            400: '#A1A1AA',
            500: '#71717A',
            600: '#52525B',
            700: '#3F3F46',
            800: '#27272A',
            900: '#18181B',
            950: '#09090B',
          },
        },
      },
      fontFamily: {
        sans: ['Lato', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        heading: ['Raleway', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
      },
      boxShadow: {
        luxury: '0 10px 30px -5px rgba(0, 0, 0, 0.05)',
        'luxury-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.12)',
        'luxury-dark': '0 10px 30px -5px rgba(0, 0, 0, 0.4)',
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

