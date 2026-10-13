import { NextRequest, NextResponse } from 'next/server';
import ProductService from '@/services/productService';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    const product = await ProductService.getProductBySlug(slug);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    // Fetch related products (same category or same brand)
    let related: any[] = [];
    try {
      await connectToDatabase();
      const relatedDocs = await Product.find({
        $or: [
          { category_id: product.category_id },
          { brand: product.brand },
        ],
        slug: { $ne: product.slug },
      })
        .limit(4)
        .lean();

      related = relatedDocs.map(ProductService.formatProduct);
    } catch (e) {
      // fallback
    }

    const formattedImages = (product.images || []).map((img: string, idx: number) => ({
      image_path: img,
      alt_text: product.name,
      is_primary: idx === 0 ? 1 : 0,
    }));

    return NextResponse.json({
      success: true,
      product,
      images: formattedImages,
      related,
    });
  } catch (error: any) {
    console.error('Product Detail API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
