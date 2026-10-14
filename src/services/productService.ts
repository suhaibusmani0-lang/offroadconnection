import connectToDatabase from '@/lib/mongodb';
import Product, { IProduct } from '@/models/Product';
import { FitmentService } from './fitmentService';
import { query } from '@/lib/db';

export interface ProductQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  make?: string;
  model?: string;
  year?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string; // 'price-asc' | 'price-desc' | 'newest' | 'featured'
  featured?: boolean;
}

export class ProductService {
  /**
   * Format raw MongoDB product into clean client contract
   */
  static formatProduct(p: any) {
    const rawImages = p.images || [];
    const primaryImage = rawImages[0] || p.image || p.image_path || '/assets/images/shop/shop-1.jpg';

    return {
      id: p.id || p._id?.toString(),
      _id: p._id?.toString(),
      name: p.title || p.name,
      title: p.title || p.name,
      slug: p.slug,
      part_number: p.part_number || p.sku || '',
      oem_number: p.oem_number || '',
      oem_numbers: p.oem_numbers || (p.oem_number ? [p.oem_number] : []),
      sku: p.part_number || p.sku || '',
      specifications: p.specifications || null,
      placement: p.placement || '',
      make: p.make || '',
      year_compatibility: p.year_compatibility || '',
      brand: p.brand || p.make || 'DRANparts',
      price: Number(p.price || 0),
      old_price: Number(p.old_price || 0) || Math.round(Number(p.price || 0) * 1.25),
      in_stock: p.in_stock !== false && (p.stock_quantity ?? 50) > 0,
      stock_quantity: p.stock_quantity ?? 50,
      stock: p.stock_quantity ?? 50,
      category_id: p.category_id,
      category_name: p.category_name || 'Automotive Parts',
      category_slug: p.category_slug || 'auto-parts',
      short_description: p.short_description || '',
      description: p.description || '',
      images: rawImages.length > 0 ? rawImages : [primaryImage],
      image: primaryImage,
      image_path: primaryImage,
      video_url: p.video_url || '',
      is_featured: !!p.is_featured,
      is_flash_sale: !!p.is_flash_sale,
      meta_title: p.meta_title || p.title,
      meta_description: p.meta_description || p.short_description,
      created_at: p.created_at,
    };
  }

  /**
   * Fetch products with vehicle fitment and filters
   */
  static async getProducts(options: ProductQueryOptions = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 16));
    const offset = (page - 1) * limit;

    // Build MongoDB query
    try {
      await connectToDatabase();

      const queryParts: any[] = [];

      // 1. Fitment (Make, Model, Year, Category)
      const fitmentQuery = FitmentService.buildFitmentMongoQuery({
        make: options.make,
        model: options.model,
        year: options.year,
        category: options.category,
      });

      if (Object.keys(fitmentQuery).length > 0) {
        queryParts.push(fitmentQuery);
      }

      // 2. Text Search
      if (options.search && options.search.trim()) {
        const s = options.search.trim();
        queryParts.push({
          $or: [
            { title: { $regex: s, $options: 'i' } },
            { part_number: { $regex: s, $options: 'i' } },
            { oem_numbers: { $regex: s, $options: 'i' } },
            { oem_number: { $regex: s, $options: 'i' } },
            { sku: { $regex: s, $options: 'i' } },
            { description: { $regex: s, $options: 'i' } },
            { brand: { $regex: s, $options: 'i' } },
          ],
        });
      }

      // 3. Category (if not already handled in fitment)
      if (options.category && !fitmentQuery) {
        if (/^\d+$/.test(options.category)) {
          queryParts.push({ category_id: Number(options.category) });
        } else {
          queryParts.push({ category_slug: options.category });
        }
      }

      // 4. Featured flag
      if (options.featured) {
        queryParts.push({ is_featured: true });
      }

      // 5. Price filter
      if (options.minPrice !== undefined || options.maxPrice !== undefined) {
        const priceFilter: any = {};
        if (options.minPrice !== undefined) priceFilter.$gte = options.minPrice;
        if (options.maxPrice !== undefined) priceFilter.$lte = options.maxPrice;
        queryParts.push({ price: priceFilter });
      }

      const mongoFilter = queryParts.length === 0 ? {} : queryParts.length === 1 ? queryParts[0] : { $and: queryParts };

      // Sort
      let sortObj: any = { id: -1 };
      if (options.sort === 'price-asc') sortObj = { price: 1 };
      else if (options.sort === 'price-desc') sortObj = { price: -1 };
      else if (options.sort === 'newest') sortObj = { created_at: -1 };
      else if (options.sort === 'featured') sortObj = { is_featured: -1, id: -1 };

      const total = await Product.countDocuments(mongoFilter);
      const docs = await Product.find(mongoFilter)
        .sort(sortObj)
        .skip(offset)
        .limit(limit)
        .lean();

      return {
        products: docs.map(this.formatProduct),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
        source: 'mongodb',
      };
    } catch (mongoErr) {
      console.warn('MongoDB query warning in productService (fallback):', mongoErr);
    }

    // Fallback: Local MariaDB
    return this.getFallbackProducts(options, limit, offset, page);
  }

  /**
   * Find product by Slug
   */
  static async getProductBySlug(slug: string) {
    try {
      await connectToDatabase();
      const product = await Product.findOne({ slug }).lean();
      if (product) {
        return this.formatProduct(product);
      }
    } catch (err) {
      console.warn('Product by slug Mongo error:', err);
    }

    // Fallback to MySQL
    try {
      const sql = `
        SELECT p.*, c.name as category_name, c.slug as category_slug
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.slug = ? AND p.deleted_at IS NULL
        LIMIT 1
      `;
      const res: any = await query(sql, [slug]);
      if (res && res[0]) {
        return this.formatProduct(res[0]);
      }
    } catch (err) {
      console.error('Product by slug MySQL fallback error:', err);
    }

    return null;
  }

  /**
   * Fallback MariaDB query execution
   */
  private static async getFallbackProducts(
    options: ProductQueryOptions,
    limit: number,
    offset: number,
    page: number
  ) {
    const whereConditions: string[] = ['p.deleted_at IS NULL'];
    const queryParams: any[] = [];

    if (options.search) {
      whereConditions.push('(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)');
      const s = `%${options.search}%`;
      queryParams.push(s, s, s);
    }

    if (options.make) {
      whereConditions.push('(p.name LIKE ? OR p.description LIKE ?)');
      const m = `%${options.make}%`;
      queryParams.push(m, m);
    }

    if (options.category && options.category !== 'all') {
      if (/^\d+$/.test(options.category)) {
        whereConditions.push('(p.category_id = ?)');
        queryParams.push(Number(options.category));
      } else {
        whereConditions.push('(c.slug = ?)');
        queryParams.push(options.category);
      }
    }

    const whereClause = whereConditions.length ? `WHERE ${whereConditions.join(' AND ')}` : '';
    const countSql = `SELECT COUNT(DISTINCT p.id) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id ${whereClause}`;
    const countRes: any = await query(countSql, queryParams);
    const total = countRes[0]?.total || 0;

    let orderClause = 'ORDER BY p.id DESC';
    if (options.sort === 'price-asc') orderClause = 'ORDER BY p.price ASC';
    else if (options.sort === 'price-desc') orderClause = 'ORDER BY p.price DESC';

    const productsSql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ${orderClause}
      LIMIT ? OFFSET ?
    `;

    const raw = await query(productsSql, [...queryParams, limit, offset]);
    return {
      products: (raw || []).map(this.formatProduct),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      source: 'mariadb',
    };
  }
}

export default ProductService;

