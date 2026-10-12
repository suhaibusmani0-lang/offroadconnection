import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    // 1. Try MongoDB
    try {
      await connectToDatabase();
      let mongoProduct: any = null;
      if (/^\d+$/.test(slug)) {
        mongoProduct = await Product.findOne({ id: Number(slug) }).lean();
      } else {
        mongoProduct = await Product.findOne({ slug }).lean();
      }

      if (mongoProduct) {
        const related = await Product.find({
          category_id: mongoProduct.category_id,
          slug: { $ne: mongoProduct.slug },
        })
          .limit(4)
          .lean();

        const formattedProduct = {
          ...mongoProduct,
          name: mongoProduct.title,
          image: mongoProduct.images?.[0] || '',
          stock: mongoProduct.stock_quantity ?? 50,
        };

        const formattedImages = (mongoProduct.images || []).map((img: string, idx: number) => ({
          image_path: img,
          alt_text: mongoProduct.title,
          is_primary: idx === 0 ? 1 : 0,
        }));

        const formattedRelated = related.map((r: any) => ({
          id: r.id,
          name: r.title,
          slug: r.slug,
          price: r.price,
          stock: r.stock_quantity ?? 50,
          image_path: r.images?.[0] || '',
        }));

        return NextResponse.json({
          product: formattedProduct,
          images: formattedImages,
          related: formattedRelated,
          source: 'mongodb',
        });
      }
    } catch (mongoErr) {
      console.warn('MongoDB single product lookup notice:', mongoErr);
    }

    // 2. MariaDB Fallback
    let products: any[] = [];
    if (/^\d+$/.test(slug)) {
      products = await query(
        `SELECT p.*, c.name as category_name, c.slug as category_slug 
         FROM products p 
         LEFT JOIN categories c ON p.category_id = c.id 
         WHERE p.id = ? AND p.deleted_at IS NULL LIMIT 1`,
        [Number(slug)]
      );
    } else {
      products = await query(
        `SELECT p.*, c.name as category_name, c.slug as category_slug 
         FROM products p 
         LEFT JOIN categories c ON p.category_id = c.id 
         WHERE p.slug = ? AND p.deleted_at IS NULL LIMIT 1`,
        [slug]
      );
    }

    if (products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = products[0];

    // Fetch images
    const images = await query(
      `SELECT image_path, alt_text, is_primary 
       FROM product_images 
       WHERE product_id = ? 
       ORDER BY is_primary DESC, id ASC`,
      [product.id]
    );

    // Fetch related products
    const related = await query(
      `SELECT p.id, p.name, p.slug, p.price, p.stock,
              COALESCE(
                (SELECT image_path FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1),
                (SELECT image_path FROM product_images WHERE product_id = p.id LIMIT 1),
                ''
              ) as image_path
       FROM products p
       WHERE p.category_id = ? AND p.id != ? AND p.deleted_at IS NULL
       ORDER BY p.id DESC LIMIT 4`,
      [product.category_id, product.id]
    );

    return NextResponse.json({
      product,
      images,
      related,
      source: 'mariadb',
    });
  } catch (error: any) {
    console.error('Product Detail API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
