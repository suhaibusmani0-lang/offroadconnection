/**
 * DRANparts - Global Platform Configuration
 * Luxury Automotive Spare Parts & High-Performance Fitments
 */

export const siteConfig = {
  name: 'DRANparts',
  legalName: 'DRANparts Private Limited',
  tagline: 'India’s Premier Destination for Luxury & High-Performance Automotive Spare Parts',
  description:
    'Genuine OEM and performance spare parts for Audi, BMW, Mercedes-Benz, Porsche, Range Rover, Land Rover, Jaguar, Volvo, Jeep, and Toyota. 100% fitment guarantee, express nationwide delivery.',
  url: 'https://dranparts.com',
  domain: 'dranparts.com',
  
  // Geographic / Local SEO
  geo: {
    region: 'IN-UP',
    placename: 'Noida',
    position: '28.5355;77.3910',
    latitude: 28.5355,
    longitude: 77.3910,
    address: {
      streetAddress: 'Plot 2, Opp Asgarpur park, kharsa Number 307 Asgarpur jaagir sector 128',
      addressLocality: 'Noida',
      addressRegion: 'Uttar Pradesh',
      postalCode: '201301',
      addressCountry: 'IN',
    },
  },

  // Contact Details
  contact: {
    phone: '+918860718878',
    phoneFormatted: '+91 88607 18878',
    whatsapp: '918860718878',
    email: 'support@dranparts.com',
    openingHours: 'Mo-Sa 09:30-19:30',
  },

  // Social Channels
  social: {
    instagram: 'https://www.instagram.com/mv.spareshub',
    facebook: 'https://facebook.com/dranparts',
    youtube: 'https://youtube.com',
  },

  // Luxury Branding Theme (Strict Monochrome: Black, Grey, White)
  theme: {
    black: '#000000',
    greyDark: '#27272A',
    greyMuted: '#71717A',
    greyBorder: '#E4E4E7',
    greyLight: '#F4F4F5',
    white: '#FFFFFF',
    surfaceBg: '#FAFAFA',
    cardBg: '#FFFFFF',
  },

  // Supported Luxury Makes
  supportedMakes: [
    'BMW',
    'Mercedes-Benz',
    'Audi',
    'Range Rover',
    'Land Rover',
    'Porsche',
    'Jaguar',
    'Volvo',
    'Jeep',
    'Toyota',
    'Isuzu',
    'Mahindra',
    'Skoda',
    'Volkswagen',
    'Mitsubishi',
    'Ford',
  ],
};

export default siteConfig;

