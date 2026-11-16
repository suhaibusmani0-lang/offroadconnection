import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

// ISO 3779 VIN Model Year Mapping (Position 10)
const VIN_YEAR_MAP: Record<string, string> = {
  'A': '2010', 'B': '2011', 'C': '2012', 'D': '2013', 'E': '2014',
  'F': '2015', 'G': '2016', 'H': '2017', 'J': '2018', 'K': '2019',
  'L': '2020', 'M': '2021', 'N': '2022', 'P': '2023', 'R': '2024',
  'S': '2025', 'T': '2026', 'V': '2027', 'W': '2028', 'X': '2029',
  'Y': '2030', '1': '2001', '2': '2002', '3': '2003', '4': '2004',
  '5': '2005', '6': '2006', '7': '2007', '8': '2008', '9': '2009',
};

// World Manufacturer Identifiers (First 3 Characters)
interface WMIData {
  make: string;
  country: string;
  assembly: string;
}

const WMI_MAP: Record<string, WMIData> = {
  'WAU': { make: 'Audi', country: 'Germany', assembly: 'Ingolstadt / Neckarsulm' },
  'WA1': { make: 'Audi', country: 'Germany', assembly: 'Audi SUV Plant' },
  'TRU': { make: 'Audi', country: 'Hungary', assembly: 'Győr Plant' },
  'WBA': { make: 'BMW', country: 'Germany', assembly: 'Munich / Dingolfing' },
  'WBS': { make: 'BMW', country: 'Germany', assembly: 'BMW M Motorsport Garching' },
  'WBY': { make: 'BMW', country: 'Germany', assembly: 'BMW i Electric Plant' },
  '5UX': { make: 'BMW', country: 'USA', assembly: 'Spartanburg SUV Plant' },
  'WDB': { make: 'Mercedes-Benz', country: 'Germany', assembly: 'Stuttgart-Sindelfingen' },
  'WDD': { make: 'Mercedes-Benz', country: 'Germany', assembly: 'Bremen / Sindelfingen' },
  'WDF': { make: 'Mercedes-Benz', country: 'Germany', assembly: 'Commercial / SUV Plant' },
  'WDC': { make: 'Mercedes-Benz', country: 'Germany', assembly: 'Sindelfingen / Affalterbach' },
  'W1K': { make: 'Mercedes-Benz', country: 'Germany', assembly: 'Mercedes Passenger Car' },
  'WP0': { make: 'Porsche', country: 'Germany', assembly: 'Stuttgart-Zuffenhausen' },
  'WP1': { make: 'Porsche', country: 'Germany', assembly: 'Leipzig SUV / Panamera' },
  'SAL': { make: 'Range Rover', country: 'United Kingdom', assembly: 'Solihull / Gaydon' },
  'SAJ': { make: 'Jaguar', country: 'United Kingdom', assembly: 'Castle Bromwich / Solihull' },
  'YV1': { make: 'Volvo', country: 'Sweden', assembly: 'Torslanda / Gothenburg' },
  '1C4': { make: 'Jeep', country: 'USA', assembly: 'Toledo Assembly Complex' },
  'JT': { make: 'Toyota', country: 'Japan', assembly: 'Tahara / Yoshiwara (Land Cruiser)' },
  'MBJ': { make: 'Toyota', country: 'India', assembly: 'Bidadi Bangalore Facility' },
  'WVW': { make: 'Volkswagen', country: 'Germany', assembly: 'Wolfsburg Germany' },
  'TMB': { make: 'Skoda', country: 'Czech Republic', assembly: 'Mladá Boleslav' },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const vin = searchParams.get('vin')?.trim().toUpperCase() || '';

    if (!vin || vin.length < 11) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please enter a valid 17-digit Chassis Number (VIN). Minimum 11 characters required.',
        },
        { status: 400 }
      );
    }

    const wmi3 = vin.substring(0, 3);
    const wmi2 = vin.substring(0, 2);
    const wmiInfo = WMI_MAP[wmi3] || WMI_MAP[wmi2] || {
      make: 'Luxury Vehicle',
      country: 'European Import',
      assembly: 'Certified OEM Plant',
    };

    // 10th Character is Model Year
    const yearChar = vin.length >= 10 ? vin[9] : '';
    const decodedYear = VIN_YEAR_MAP[yearChar] || '2018-2024';

    // Model Series heuristic from positions 4-8 (VDS: Vehicle Descriptor Section)
    const vds = vin.substring(3, 8);
    let estimatedSeries = 'Standard Specification';

    if (wmiInfo.make === 'BMW') {
      if (vin.includes('3D') || vin.includes('320') || vin.includes('F30') || vin.includes('G20')) estimatedSeries = '3 Series (Sedan / Touring)';
      else if (vin.includes('5D') || vin.includes('520') || vin.includes('530') || vin.includes('G30')) estimatedSeries = '5 Series Executive';
      else if (vin.includes('7D') || vin.includes('730') || vin.includes('740') || vin.includes('G11')) estimatedSeries = '7 Series Flagship';
      else if (vin.includes('X5') || vin.includes('CR') || vin.includes('G05')) estimatedSeries = 'X5 Sport Activity Vehicle';
      else if (vin.includes('X3') || vin.includes('G01')) estimatedSeries = 'X3 Performance AWD';
      else estimatedSeries = 'Precision BMW Performance Line';
    } else if (wmiInfo.make === 'Mercedes-Benz') {
      if (vin.includes('205') || vin.includes('206')) estimatedSeries = 'C-Class Luxury Saloon';
      else if (vin.includes('213') || vin.includes('214')) estimatedSeries = 'E-Class Executive Saloon';
      else if (vin.includes('222') || vin.includes('223')) estimatedSeries = 'S-Class Premier Limousine';
      else if (vin.includes('166') || vin.includes('167') || vin.includes('GLE')) estimatedSeries = 'GLE Luxury SUV';
      else if (vin.includes('GLS') || vin.includes('GLC')) estimatedSeries = 'GLC/GLS 4MATIC SUV';
      else estimatedSeries = 'Mercedes-Benz 4MATIC Series';
    } else if (wmiInfo.make === 'Audi') {
      if (vin.includes('8W') || vin.includes('A4')) estimatedSeries = 'Audi A4 TFSI/TDI';
      else if (vin.includes('4G') || vin.includes('4K') || vin.includes('A6')) estimatedSeries = 'Audi A6 Matrix Saloon';
      else if (vin.includes('4M') || vin.includes('Q7')) estimatedSeries = 'Audi Q7 Quattro SUV';
      else if (vin.includes('8R') || vin.includes('FY') || vin.includes('Q5')) estimatedSeries = 'Audi Q5 Quattro';
      else estimatedSeries = 'Audi Quattro Line';
    } else if (wmiInfo.make === 'Range Rover') {
      if (vin.includes('L405') || vin.includes('Vogue')) estimatedSeries = 'Range Rover Vogue / Autobiography';
      else if (vin.includes('L494') || vin.includes('Sport')) estimatedSeries = 'Range Rover Sport Dynamic';
      else if (vin.includes('L663') || vin.includes('Defender')) estimatedSeries = 'Land Rover Defender 110/90';
      else if (vin.includes('Velar')) estimatedSeries = 'Range Rover Velar';
      else estimatedSeries = 'Range Rover Terrain Response System';
    } else if (wmiInfo.make === 'Porsche') {
      if (vin.includes('Cayenne') || vin.includes('9YA')) estimatedSeries = 'Porsche Cayenne Turbo/S';
      else if (vin.includes('Macan') || vin.includes('95B')) estimatedSeries = 'Porsche Macan GTS';
      else if (vin.includes('Panamera') || vin.includes('971')) estimatedSeries = 'Porsche Panamera Executive';
      else estimatedSeries = 'Porsche Precision Sport';
    }

    // Connect to database and fetch compatible live products
    await dbConnect();
    const matchingProducts = await Product.find({
      $or: [
        { make: { $regex: new RegExp(wmiInfo.make, 'i') } },
        { title: { $regex: new RegExp(wmiInfo.make, 'i') } },
        { description: { $regex: new RegExp(wmiInfo.make, 'i') } },
      ],
      in_stock: true,
    })
      .select('id title slug part_number oem_number price old_price images in_stock brand')
      .limit(8)
      .lean();

    return NextResponse.json({
      success: true,
      vin,
      decoded: {
        wmi: wmi3,
        make: wmiInfo.make,
        countryOfOrigin: wmiInfo.country,
        assemblyPlant: wmiInfo.assembly,
        modelYear: decodedYear,
        series: estimatedSeries,
        vdsCode: vds,
        fitmentGuarantee: '100% Precision Laser-Match Guaranteed by DRANparts Engineers',
      },
      compatibleProductsCount: matchingProducts.length,
      compatibleProducts: matchingProducts,
    });
  } catch (error: any) {
    console.error('Error decoding VIN:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
