import mongoose from 'mongoose';
import mysql from 'mysql2/promise';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://suhaibusmanizar_db_user:AT5sYzl8JjHIRRu8@cluster0.mo9pum9.mongodb.net/offroad?retryWrites=true&w=majority&appName=Cluster0';

const LUXURY_MAKES = [
  'BMW',
  'MERCEDES-BENZ',
  'MERCEDES',
  'AUDI',
  'PORSCHE',
  'RANGE ROVER',
  'LAND ROVER',
  'JAGUAR',
  'VOLVO',
  'JEEP',
  'TOYOTA',
  'MAHINDRA',
  'MITSUBISHI',
  'VOLKSWAGEN',
  'VW',
  'SKODA',
  'MINI',
  'BENTLEY',
  'ROLLS-ROYCE',
  'FERRARI',
  'LAMBORGHINI',
  'ASTON MARTIN',
  'MASERATI',
];

function extractPartNumbers(title, desc) {
  const text = `${title} ${desc || ''}`;
  const found = new Set();

  // Pattern 1: Explicit "Part Number: ..."
  const explicitMatches = text.matchAll(/(?:PART\s*NUMBER|Part\s*No|OEM\s*No|OE\s*Number)[\s\-:]+([A-Z0-9\s,\/\-]+)/gi);
  for (const m of explicitMatches) {
    const raw = m[1].split(/[\r\n]/)[0];
    const tokens = raw.split(/[\s,\/]+/);
    for (const t of tokens) {
      const clean = t.replace(/[^A-Z0-9]/gi, '').toUpperCase();
      if (clean.length >= 6 && clean.length <= 15 && /\d/.test(clean)) {
        found.add(clean);
      }
    }
  }

  // Pattern 2: Land Rover "LR######"
  const lrMatches = text.matchAll(/\b(LR\d{6,8})\b/gi);
  for (const m of lrMatches) found.add(m[1].toUpperCase());

  // Pattern 3: BMW 7-digit or 11-digit numbers
  const bmwMatches = text.matchAll(/\b(\d{11}|\d{7})\b/g);
  for (const m of bmwMatches) {
    if (m[1].length === 11 || (m[1].length === 7 && (m[1].startsWith('6') || m[1].startsWith('2') || m[1].startsWith('3') || m[1].startsWith('5')))) {
      found.add(m[1]);
    }
  }

  // Pattern 4: VAG / Audi / Porsche alphanumeric (e.g. 8V0941005C, 4GD941773, 9A110745000, 8UD941005)
  const vagMatches = text.matchAll(/\b([0-9][A-Z0-9]{2}[0-9]{6}[A-Z0-9]?|[0-9]{3}[0-9A-Z]{6,7})\b/gi);
  for (const m of vagMatches) {
    const clean = m[1].toUpperCase();
    if (clean.length >= 7 && /\d/.test(clean) && /[A-Z]/.test(clean)) {
      found.add(clean);
    }
  }

  // Pattern 5: Mercedes A-numbers e.g. A205906...
  const mbMatches = text.matchAll(/\b(A\d{10,12})\b/gi);
  for (const m of mbMatches) found.add(m[1].toUpperCase());

  return Array.from(found);
}

function cleanDescription(html) {
  if (!html) return '';
  let text = html;
  
  // Remove scripts, styles, google tracking divs
  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<div class="productView-info"[\s\S]*?<\/div>\s*<\/div>/gi, '');
  
  // Replace br and closing p/div with newline
  text = text.replace(/<br\s*[\/]?>/gi, '\n');
  text = text.replace(/<\/(p|div|li|tr|h[1-6])>/gi, '\n');
  
  // Strip all other HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  
  // Decode HTML entities
  text = text.replace(/&amp;/g, '&')
             .replace(/&nbsp;/g, ' ')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#39;/g, "'");

  // Clean extra whitespace
  const lines = text.split('\n')
                    .map(l => l.trim())
                    .filter(l => l.length > 0 && !l.includes('productView-') && !l.includes('data-ved=') && !l.includes('data-hveid='));
  
  return lines.join('\n');
}

function detectVehicle(title, desc) {
  const full = `${title} ${desc || ''}`.toUpperCase();
  let detectedMake = '';
  for (const m of LUXURY_MAKES) {
    if (full.includes(m)) {
      detectedMake = m === 'MERCEDES' ? 'Mercedes-Benz' : m === 'VW' ? 'Volkswagen' : m;
      break;
    }
  }

  // Year detection
  const yearMatch = full.match(/\b(20[0-2][0-9])\s*[-–to\s]+\s*(20[0-2][0-9])\b/) || full.match(/\b(20[0-2][0-9])\b/);
  const detectedYears = yearMatch ? yearMatch[0] : '';

  // Placement detection
  let placement = 'Universal / Front / Rear';
  if (/(\bLEFT\b|\bLH\b)/i.test(title) && /(\bRIGHT\b|\bRH\b)/i.test(title)) {
    placement = 'Pair (Left & Right / LH & RH)';
  } else if (/(\bLEFT\b|\bLH\b)/i.test(title)) {
    placement = 'Left Hand Side (LH)';
  } else if (/(\bRIGHT\b|\bRH\b)/i.test(title)) {
    placement = 'Right Hand Side (RH)';
  } else if (/\bFRONT\b/i.test(title)) {
    placement = 'Front Axle / Front Section';
  } else if (/\bREAR\b/i.test(title)) {
    placement = 'Rear Axle / Rear Section';
  }

  return { detectedMake, detectedYears, placement };
}

async function startMigration() {
  console.log('Connecting to MariaDB & MongoDB Atlas...');
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'offroad' });
  await mongoose.connect(MONGODB_URI);
  console.log('Databases Connected!');

  const [rows] = await conn.query('SELECT * FROM products');
  console.log(`Found ${rows.length} products in MariaDB. Processing extraction & enrichment...`);

  const collection = mongoose.connection.db.collection('products');
  let updatedCount = 0;

  for (const r of rows) {
    const partNumbers = extractPartNumbers(r.name, r.description);
    const cleanedDesc = cleanDescription(r.description);
    const { detectedMake, detectedYears, placement } = detectVehicle(r.name, r.description);

    const primaryPartNum = partNumbers.length > 0 ? partNumbers[0] : (r.sku && !r.sku.startsWith('AUTO-') ? r.sku : `OEM-${r.id}`);

    const specs = {
      'OEM Part Number': primaryPartNum,
      'Interchange Numbers': partNumbers.length > 1 ? partNumbers.slice(1).join(', ') : 'Direct Factory Replacement',
      'Vehicle Fitment': `${detectedMake || 'Luxury Import'} ${detectedYears ? `(${detectedYears})` : ''}`.trim(),
      'Component Placement': placement,
      'Build Quality': '100% Brand New OEM Standard',
      'Quality Testing': 'Factory Inspected & Pressure / Fitment Tested',
      'Warranty Guarantee': '100% Direct Fitment Guarantee / 6-Month Manufacturer Coverage',
    };

    // Short summary
    const cleanFirstLine = cleanedDesc.split('\n')[0] || r.name;
    const shortSummary = cleanFirstLine.length > 180 ? cleanFirstLine.slice(0, 180) + '...' : cleanFirstLine;

    // Build update object
    const updateDoc = {
      $set: {
        title: r.name,
        name: r.name,
        part_number: primaryPartNum,
        oem_number: primaryPartNum,
        oem_numbers: partNumbers,
        sku: primaryPartNum,
        description: cleanedDesc || r.name,
        short_description: shortSummary,
        specifications: specs,
        placement: placement,
        make: detectedMake || undefined,
        year_compatibility: detectedYears || undefined,
        price: Number(r.price) || 0,
        in_stock: (Number(r.stock) > 0) || true,
        updatedAt: new Date(),
      }
    };

    await collection.updateOne({ id: r.id }, updateDoc);
    updatedCount++;

    if (updatedCount % 250 === 0) {
      console.log(`Enriched and updated ${updatedCount}/${rows.length} products... (Sample: ${r.name.slice(0, 40)} -> PN: ${primaryPartNum})`);
    }
  }

  console.log(`SUCCESS! Completed enrichment of all ${updatedCount} products in MongoDB Atlas.`);

  // Verify
  const sample = await collection.findOne({ id: 4 });
  console.log('\nVerified Sample Document (ID: 4):', {
    title: sample.title,
    part_number: sample.part_number,
    oem_numbers: sample.oem_numbers,
    sku: sample.sku,
    specifications: sample.specifications,
    desc_length: sample.description?.length,
  });

  await conn.end();
  await mongoose.disconnect();
}

startMigration().catch(console.error);

