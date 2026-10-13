import { LUXURY_MAKES, MODEL_YEARS, LUXURY_PART_CATEGORIES, VehicleMake } from '@/constants/vehicles';

export interface VehicleSearchParams {
  make?: string;
  model?: string;
  year?: string;
  category?: string;
}

export class FitmentService {
  /**
   * Get all supported luxury vehicle makes
   */
  static getMakes(): VehicleMake[] {
    return LUXURY_MAKES;
  }

  /**
   * Find a specific make by id or name
   */
  static getMakeByIdOrName(query: string): VehicleMake | undefined {
    const q = query.toLowerCase().trim();
    return LUXURY_MAKES.find(
      (m) => m.id.toLowerCase() === q || m.name.toLowerCase() === q
    );
  }

  /**
   * Get available models for a given make
   */
  static getModelsForMake(makeQuery: string): string[] {
    const make = this.getMakeByIdOrName(makeQuery);
    return make ? make.models : [];
  }

  /**
   * Get available model years
   */
  static getYears(): string[] {
    return MODEL_YEARS;
  }

  /**
   * Get part categories
   */
  static getCategories() {
    return LUXURY_PART_CATEGORIES;
  }

  /**
   * Constructs MongoDB search clauses from vehicle fitment parameters
   */
  static buildFitmentMongoQuery(params: VehicleSearchParams): any {
    const conditions: any[] = [];

    // Make Filter
    if (params.make && params.make.trim()) {
      const makeClean = params.make.trim();
      let makeRegex = makeClean;
      // Handle aliases: Mercedes / Benz, Range Rover / Land Rover, VW / Volkswagen
      if (/mercedes|benz/i.test(makeClean)) {
        makeRegex = 'Mercedes|Benz';
      } else if (/range|land rover/i.test(makeClean)) {
        makeRegex = 'Range Rover|Land Rover';
      } else if (/vw|volkswagen/i.test(makeClean)) {
        makeRegex = 'Volkswagen|VW';
      }

      conditions.push({
        $or: [
          { title: { $regex: makeRegex, $options: 'i' } },
          { description: { $regex: makeRegex, $options: 'i' } },
          { brand: { $regex: makeRegex, $options: 'i' } },
        ],
      });
    }

    // Model Filter (e.g., "A4", "5 Series", "E-Class", "Macan")
    if (params.model && params.model.trim()) {
      // Extract base model token e.g., "3 Series (E90 / F30 / G20)" -> "3 Series|F30|E90|G20"
      const m = params.model.trim();
      const tokens: string[] = [];

      // Extract parentheses content
      const parenMatch = m.match(/\(([^)]+)\)/);
      if (parenMatch) {
        const chassisList = parenMatch[1].split('/').map((s) => s.trim()).filter(Boolean);
        tokens.push(...chassisList);
      }

      // Base name before parenthesis
      const baseName = m.replace(/\s*\([^)]*\)/, '').trim();
      if (baseName) {
        tokens.push(baseName);
      }

      const modelRegex = tokens.join('|');

      conditions.push({
        $or: [
          { title: { $regex: modelRegex, $options: 'i' } },
          { description: { $regex: modelRegex, $options: 'i' } },
        ],
      });
    }

    // Year Filter (e.g., "2018", "2015-2018")
    if (params.year && params.year.trim()) {
      const y = params.year.trim();
      // Year in title e.g. 2018, or range
      const yearRegex = y.replace(/[^0-9]/g, '');
      if (yearRegex.length === 4) {
        conditions.push({
          $or: [
            { title: { $regex: yearRegex, $options: 'i' } },
            { description: { $regex: yearRegex, $options: 'i' } },
          ],
        });
      }
    }

    // Category / Part Type Filter
    if (params.category && params.category.trim()) {
      const cat = params.category.trim().toLowerCase();
      let keywords: string[] = [cat];

      if (cat.includes('light') || cat.includes('headlamp')) {
        keywords = ['headlight', 'headlamp', 'light', 'lamp', 'tail', 'ballast', 'led', 'fog'];
      } else if (cat.includes('suspension') || cat.includes('steering')) {
        keywords = ['suspension', 'strut', 'shock', 'arm', 'control arm', 'ball joint', 'bushing'];
      } else if (cat.includes('cool') || cat.includes('ac')) {
        keywords = ['compressor', 'radiator', 'cooler', 'oil cooler', 'condenser', 'water pump'];
      } else if (cat.includes('brake') || cat.includes('abs')) {
        keywords = ['brake', 'pad', 'disc', 'rotor', 'abs', 'speed sensor', 'caliper'];
      } else if (cat.includes('engine') || cat.includes('transmission')) {
        keywords = ['engine', 'mount', 'belt', 'spark', 'gasket', 'filter', 'flywheel'];
      } else if (cat.includes('body') || cat.includes('grille')) {
        keywords = ['bumper', 'grille', 'grill', 'fender', 'hood', 'mirror', 'door'];
      } else if (cat.includes('electric') || cat.includes('module')) {
        keywords = ['module', 'ecu', 'sensor', 'switch', 'relay', 'alternator', 'starter'];
      } else if (cat.includes('4x4') || cat.includes('offroad') || cat.includes('accessories')) {
        keywords = ['winch', 'snorkel', 'tow', 'skid', 'rack', 'guard'];
      }

      const catRegex = keywords.join('|');
      conditions.push({
        $or: [
          { category_name: { $regex: catRegex, $options: 'i' } },
          { category_slug: { $regex: catRegex, $options: 'i' } },
          { title: { $regex: catRegex, $options: 'i' } },
          { description: { $regex: catRegex, $options: 'i' } },
        ],
      });
    }

    if (conditions.length === 0) return {};
    if (conditions.length === 1) return conditions[0];
    return { $and: conditions };
  }
}

export default FitmentService;

