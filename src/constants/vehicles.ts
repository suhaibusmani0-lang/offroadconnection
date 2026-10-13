/**
 * Luxury Vehicle Taxonomy & Fitment Constants
 * Make -> Model -> Year -> Parts Flow
 */

export interface VehicleMake {
  id: string;
  name: string;
  popular: boolean;
  models: string[];
}

export const LUXURY_MAKES: VehicleMake[] = [
  {
    id: 'bmw',
    name: 'BMW',
    popular: true,
    models: [
      '3 Series (E90 / F30 / G20)',
      '5 Series (E60 / F10 / G30)',
      '7 Series (F01 / G11 / G12)',
      'X1 (E84 / F48)',
      'X3 (F25 / G01)',
      'X5 (E70 / F15 / G05)',
      'X6 (E71 / F16)',
      'X7 (G07)',
      'M3 / M4 / M5',
    ],
  },
  {
    id: 'mercedes-benz',
    name: 'Mercedes-Benz',
    popular: true,
    models: [
      'A-Class (W176 / W177)',
      'C-Class (W204 / W205 / W206)',
      'E-Class (W212 / W213)',
      'S-Class (W221 / W222 / W223)',
      'CLA / CLS',
      'GLA / GLB',
      'GLC (X253)',
      'GLE (W166 / V167)',
      'GLS (X166 / X167)',
      'G-Wagon (W463)',
    ],
  },
  {
    id: 'audi',
    name: 'Audi',
    popular: true,
    models: [
      'A3 (8V / 8Y)',
      'A4 (B8 / B9)',
      'A6 (C7 / C8)',
      'A8 (D4 / D5)',
      'Q3 (8U / F3)',
      'Q5 (8R / FY)',
      'Q7 (4L / 4M)',
      'Q8',
      'RS / S Line Series',
    ],
  },
  {
    id: 'range-rover',
    name: 'Range Rover',
    popular: true,
    models: [
      'Range Rover Vogue (L405 / L460)',
      'Range Rover Sport (L494 / L461)',
      'Range Rover Evoque (L538 / L551)',
      'Range Rover Velar (L560)',
    ],
  },
  {
    id: 'land-rover',
    name: 'Land Rover',
    popular: true,
    models: [
      'Defender (L663 / Classic)',
      'Discovery (LR4 / Discovery 5)',
      'Discovery Sport (L550)',
      'Freelander 2',
    ],
  },
  {
    id: 'porsche',
    name: 'Porsche',
    popular: true,
    models: [
      'Macan (95B)',
      'Cayenne (9PA / 92A / 9YA)',
      'Panamera (970 / 971)',
      '911 Carrera (997 / 991 / 992)',
      'Boxster / Cayman (718 / 981)',
    ],
  },
  {
    id: 'jaguar',
    name: 'Jaguar',
    popular: true,
    models: [
      'XE (X760)',
      'XF (X250 / X260)',
      'XJ / XJL (X351)',
      'F-Pace (X761)',
      'E-Pace',
      'F-Type',
    ],
  },
  {
    id: 'volvo',
    name: 'Volvo',
    popular: true,
    models: [
      'S60 (II / III)',
      'S80',
      'S90',
      'XC40',
      'XC60 (I / II)',
      'XC90 (I / II)',
    ],
  },
  {
    id: 'jeep',
    name: 'Jeep',
    popular: true,
    models: [
      'Wrangler (JK / JL / Rubicon)',
      'Compass',
      'Grand Cherokee (WK2 / WL)',
      'Cherokee',
    ],
  },
  {
    id: 'toyota',
    name: 'Toyota',
    popular: true,
    models: [
      'Fortuner (Type 1 / Type 2 / Legender)',
      'Hilux',
      'Land Cruiser (LC200 / LC300)',
      'Prado (LC120 / LC150)',
      'Camry',
      'Innova Crysta / Hycross',
    ],
  },
  {
    id: 'mahindra',
    name: 'Mahindra',
    popular: true,
    models: [
      'Thar (CRDe / Thar 2020+ / Roxx)',
      'Scorpio / Scorpio-N / Classic',
      'XUV700',
      'XUV500',
    ],
  },
  {
    id: 'isuzu',
    name: 'Isuzu',
    popular: false,
    models: [
      'D-Max V-Cross',
      'MU-X',
    ],
  },
  {
    id: 'skoda',
    name: 'Skoda',
    popular: false,
    models: [
      'Octavia (Laura / Mk3 / Mk4)',
      'Superb (B6 / B8)',
      'Kodiaq',
      'Kushaq',
    ],
  },
  {
    id: 'volkswagen',
    name: 'Volkswagen',
    popular: false,
    models: [
      'Polo / Vento / Ameo',
      'Passat',
      'Tiguan / Touareg',
      'Taigun / Virtus',
    ],
  },
  {
    id: 'mitsubishi',
    name: 'Mitsubishi',
    popular: false,
    models: [
      'Pajero SFX / Sport',
      'Montero',
      'Outlander',
      'Lancer',
    ],
  },
  {
    id: 'ford',
    name: 'Ford',
    popular: false,
    models: [
      'Endeavour 2.2 / 3.2',
      'EcoSport',
      'Mustang GT',
    ],
  },
];

// Production Model Years
export const MODEL_YEARS = [
  '2026',
  '2025',
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018',
  '2017',
  '2016',
  '2015',
  '2014',
  '2013',
  '2012',
  '2011',
  '2010',
  '2008-2009',
  '2005-2007',
  'Older Classic',
];

// Luxury Parts Categories
export interface PartCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

export const LUXURY_PART_CATEGORIES: PartCategory[] = [
  {
    id: 'lighting',
    name: 'Lighting & Headlamps',
    slug: 'lighting-headlamps',
    icon: 'fas fa-lightbulb',
    description: 'LED, Matrix, Xenon Projectors, Tail Lights, Fog Lamps & Ballast Modules',
  },
  {
    id: 'suspension',
    name: 'Suspension & Steering',
    slug: 'suspension-steering',
    icon: 'fas fa-compress-arrows-alt',
    description: 'Air Suspension Struts, Control Arms, Ball Joints, Bushings & Shock Absorbers',
  },
  {
    id: 'cooling',
    name: 'Cooling & AC Systems',
    slug: 'cooling-ac-systems',
    icon: 'fas fa-snowflake',
    description: 'AC Compressors, Radiators, Intercoolers, Oil Coolers & Water Pumps',
  },
  {
    id: 'brakes',
    name: 'Brake Systems & ABS',
    slug: 'brake-systems',
    icon: 'fas fa-circle-notch',
    description: 'Brake Discs, Ceramic Pads, ABS Wheel Speed Sensors & Calipers',
  },
  {
    id: 'engine',
    name: 'Engine & Transmission',
    slug: 'engine-transmission',
    icon: 'fas fa-cogs',
    description: 'Engine Mounts, Timing Belts, Spark Plugs, Gaskets, Filters & Flywheels',
  },
  {
    id: 'body',
    name: 'Body Parts & Grilles',
    slug: 'body-parts-grilles',
    icon: 'fas fa-car-side',
    description: 'Front Bumpers, Panamericana Grilles, Fenders, Hoods, Mirrors & Emblems',
  },
  {
    id: 'electrical',
    name: 'Electricals & Modules',
    slug: 'electrical-modules',
    icon: 'fas fa-bolt',
    description: 'ECUs, SAM Modules, Sensors, Alternators, Starters & Parking Sensors',
  },
  {
    id: '4x4-accessories',
    name: '4x4 Off-Road Accessories',
    slug: '4x4-accessories',
    icon: 'fas fa-mountain',
    description: 'Electric Winches, Heavy-Duty Tow Hooks, Snorkels, Skid Plates & Recovery Gear',
  },
];

