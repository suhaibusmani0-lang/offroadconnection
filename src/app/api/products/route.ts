import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '16')));
    const offset = (page - 1) * limit;

    const search = searchParams.get('search')?.trim() || '';
    const category = searchParams.get('category')?.trim() || '';
    const featured = searchParams.get('featured');

    // 1. Try querying MongoDB first
    try {
      await connectToDatabase();
      const mongoFilter: any = {};

      if (search) {
        mongoFilter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { part_number: { $regex: search, $options: 'i' } },
          { oem_number: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }

      if (category && category !== 'all') {
        if (/^\d+$/.test(category)) {
          mongoFilter.category_id = Number(category);
        } else {
          mongoFilter.category_slug = category;
        }
      }

      if (featured === 'true' || featured === '1') {
        mongoFilter.is_featured = true;
      }

      const totalMongo = await Product.countDocuments(mongoFilter);
      if (totalMongo > 0) {
        const mongoProducts = await Product.find(mongoFilter)
          .sort({ id: -1 })
          .skip(offset)
          .limit(limit)
          .lean();

        const formatted = mongoProducts.map((p: any) => ({
          id: p.id,
          name: p.title,
          title: p.title,
          slug: p.slug,
          sku: p.part_number || p.sku,
          price: p.price,
          stock: p.stock_quantity ?? 50,
          category_id: p.category_id,
          category_name: p.category_name,
          category_slug: p.category_slug,
          image: p.images?.[0] || '',
          image_path: p.images?.[0] || '',
          images: p.images || [],
          video_url: p.video_url || '',
        }));

        return NextResponse.json({
          products: formatted,
          pagination: {
            page,
            limit,
            total: totalMongo,
            totalPages: Math.ceil(totalMongo / limit) || 1,
          },
          source: 'mongodb',
        });
      }
    } catch (mongoErr) {
      console.warn('MongoDB query warning (fallback to MySQL):', mongoErr);
    }

    // 2. Fallback to MySQL MariaDB
    const whereConditions: string[] = ['p.deleted_at IS NULL'];
    const queryParams: any[] = [];

    if (search) {
      whereConditions.push('(p.name LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)');
      const s = `%${search}%`;
      queryParams.push(s, s, s);
    }

    if (category && category !== 'all') {
      if (/^\d+$/.test(category)) {
        whereConditions.push(
          '(p.category_id = ? OR p.category_id IN (SELECT id FROM categories WHERE parent_id = ?))'
        );
        queryParams.push(Number(category), Number(category));
      } else {
        whereConditions.push(
          '(c.slug = ? OR p.category_id IN (SELECT id FROM categories WHERE parent_id = (SELECT id FROM categories WHERE slug = ? LIMIT 1)))'
        );
        queryParams.push(category, category);
      }
    }

    if (featured === 'true' || featured === '1') {
      whereConditions.push('p.is_featured = 1');
    }

    const whereClause = whereConditions.length ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countSql = `
      SELECT COUNT(DISTINCT p.id) as total
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
    `;
    const countRes: any = await query(countSql, queryParams);
    const total = countRes[0]?.total || 0;

    const productsSql = `
      SELECT p.id, p.name, p.slug, p.sku, p.price, p.stock, p.category_id,
             c.name as category_name, c.slug as category_slug,
             COALESCE(
               (SELECT image_path FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1),
               (SELECT image_path FROM product_images WHERE product_id = p.id LIMIT 1),
               ''
             ) as image_path,
             COALESCE(
               (SELECT image_path FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1),
               (SELECT image_path FROM product_images WHERE product_id = p.id LIMIT 1),
               ''
             ) as image
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.id DESC
      LIMIT ? OFFSET ?
    `;

    const products = await query(productsSql, [...queryParams, limit, offset]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      source: 'mariadb',
    });
  } catch (error: any) {
    console.error('Products API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
