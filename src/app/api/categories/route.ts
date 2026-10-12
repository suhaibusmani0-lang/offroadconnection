import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await query(
      `SELECT c.id, c.name, c.slug, c.parent_id,
        (SELECT COUNT(*) FROM products p WHERE (p.category_id = c.id OR p.category_id IN (SELECT id FROM categories WHERE parent_id = c.id)) AND p.deleted_at IS NULL) as product_count
       FROM categories c
       WHERE c.deleted_at IS NULL AND c.parent_id = 0 AND TRIM(c.name) != '' AND c.name IS NOT NULL
       ORDER BY c.name ASC`
    );

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error('Categories API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

