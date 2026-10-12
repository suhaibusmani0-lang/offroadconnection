import connectToDatabase from './mongodb';
import Pincode from '@/models/Pincode';

export interface PincodeDeliveryInfo {
  pincode: string;
  city: string;
  state: string;
  serviceable: boolean;
  deliveryDays: number;
  estimatedDate: string;
  codAvailable: boolean;
  expressAvailable: boolean;
  shippingCharge: number;
}

// Major Indian PIN code ranges for instant offline fallback
const PINCODE_REGIONS: Record<string, { city: string; state: string; days: number }> = {
  // Delhi NCR
  '110': { city: 'New Delhi', state: 'Delhi', days: 1 },
  '121': { city: 'Faridabad', state: 'Haryana', days: 2 },
  '122': { city: 'Gurugram', state: 'Haryana', days: 1 },
  '201': { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh', days: 1 },
  // Mumbai / Maharashtra
  '400': { city: 'Mumbai', state: 'Maharashtra', days: 2 },
  '411': { city: 'Pune', state: 'Maharashtra', days: 2 },
  '440': { city: 'Nagpur', state: 'Maharashtra', days: 3 },
  // Karnataka
  '560': { city: 'Bengaluru', state: 'Karnataka', days: 2 },
  '570': { city: 'Mysuru', state: 'Karnataka', days: 3 },
  // Tamil Nadu
  '600': { city: 'Chennai', state: 'Tamil Nadu', days: 2 },
  '641': { city: 'Coimbatore', state: 'Tamil Nadu', days: 3 },
  // Telangana & AP
  '500': { city: 'Hyderabad', state: 'Telangana', days: 2 },
  '530': { city: 'Visakhapatnam', state: 'Andhra Pradesh', days: 3 },
  // Gujarat
  '380': { city: 'Ahmedabad', state: 'Gujarat', days: 2 },
  '395': { city: 'Surat', state: 'Gujarat', days: 2 },
  // West Bengal
  '700': { city: 'Kolkata', state: 'West Bengal', days: 3 },
  // Rajasthan
  '302': { city: 'Jaipur', state: 'Rajasthan', days: 2 },
  // Punjab & Chandigarh
  '160': { city: 'Chandigarh', state: 'Chandigarh', days: 2 },
  '141': { city: 'Ludhiana', state: 'Punjab', days: 2 },
  // Madhya Pradesh
  '452': { city: 'Indore', state: 'Madhya Pradesh', days: 2 },
  '462': { city: 'Bhopal', state: 'Madhya Pradesh', days: 3 },
  // UP / Bihar
  '226': { city: 'Lucknow', state: 'Uttar Pradesh', days: 2 },
  '208': { city: 'Kanpur', state: 'Uttar Pradesh', days: 2 },
  '800': { city: 'Patna', state: 'Bihar', days: 3 },
};

function formatDeliveryDate(days: number): string {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days);

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  };
  return targetDate.toLocaleDateString('en-IN', options);
}

export async function checkPincodeServiceability(pincode: string): Promise<PincodeDeliveryInfo> {
  const cleanPin = pincode.trim().replace(/\D/g, '');

  if (cleanPin.length !== 6) {
    return {
      pincode: cleanPin,
      city: '',
      state: '',
      serviceable: false,
      deliveryDays: 0,
      estimatedDate: '',
      codAvailable: false,
      expressAvailable: false,
      shippingCharge: 0,
    };
  }

  // 1. Check in MongoDB if custom pincode rule exists
  try {
    await connectToDatabase();
    const dbPin = await Pincode.findOne({ pincode: cleanPin }).lean();
    if (dbPin) {
      return {
        pincode: cleanPin,
        city: dbPin.city,
        state: dbPin.state,
        serviceable: true,
        deliveryDays: dbPin.delivery_days,
        estimatedDate: formatDeliveryDate(dbPin.delivery_days),
        codAvailable: dbPin.cod_available,
        expressAvailable: dbPin.express_available,
        shippingCharge: 0, // Free shipping
      };
    }
  } catch (err) {
    console.warn('MongoDB pincode lookup fallback to regional index:', err);
  }

  // 2. Regional prefix lookup
  const prefix3 = cleanPin.substring(0, 3);
  const region = PINCODE_REGIONS[prefix3];

  if (region) {
    return {
      pincode: cleanPin,
      city: region.city,
      state: region.state,
      serviceable: true,
      deliveryDays: region.days,
      estimatedDate: formatDeliveryDate(region.days),
      codAvailable: true,
      expressAvailable: region.days <= 2,
      shippingCharge: 0,
    };
  }

  // 3. General Indian delivery fallback (Standard 3-5 days across all 19,000+ PIN codes)
  const defaultDays = 4;
  return {
    pincode: cleanPin,
    city: 'Your City',
    state: 'India',
    serviceable: true,
    deliveryDays: defaultDays,
    estimatedDate: formatDeliveryDate(defaultDays),
    codAvailable: true,
    expressAvailable: false,
    shippingCharge: 0,
  };
}
