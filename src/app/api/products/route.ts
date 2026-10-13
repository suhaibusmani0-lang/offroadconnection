import { NextRequest, NextResponse } from 'next/server';
import ProductService from '@/services/productService';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '16')));
    const search = searchParams.get('search')?.trim() || '';
    const category = searchParams.get('category')?.trim() || '';
    const make = searchParams.get('make')?.trim() || '';
    const model = searchParams.get('model')?.trim() || '';
    const year = searchParams.get('year')?.trim() || '';
    const sort = searchParams.get('sort')?.trim() || 'newest';
    const featured = searchParams.get('featured') === 'true' || searchParams.get('featured') === '1';

    const minPrice = searchParams.has('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
    const maxPrice = searchParams.has('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;

    const result = await ProductService.getProducts({
      page,
      limit,
      search,
      category,
      make,
      model,
      year,
      sort,
      featured,
      minPrice,
      maxPrice,
    });

    return NextResponse.json({
      success: true,
      products: result.products,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
      source: result.source,
    });
  } catch (error: any) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
