import mysql from 'mysql2/promise';

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
    // avoid years like 20162018 or generic numbers
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
                    .filter(l => l.length > 0 && !l.includes('productView-') && !l.includes('data-ved='));
  
  return lines.join('\n');
}

async function run() {
  const conn = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'offroad' });
  const [rows] = await conn.query('SELECT id, name, sku, description FROM products WHERE id IN (4, 8, 9, 10, 11, 50, 100, 250, 500, 1000)');
  
  for (const r of rows) {
    const partNumbers = extractPartNumbers(r.name, r.description);
    const cleaned = cleanDescription(r.description);
    console.log(`\n========================================`);
    console.log(`ID: ${r.id} | NAME: ${r.name}`);
    console.log(`EXTRACTED PART NUMBERS:`, partNumbers);
    console.log(`CLEAN DESCRIPTION PREVIEW:`);
    console.log(cleaned.slice(0, 250) + '...');
  }
  
  await conn.end();
}

run();

