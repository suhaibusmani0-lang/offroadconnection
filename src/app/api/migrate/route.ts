import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Pincode from '@/models/Pincode';

export async function GET() {
  try {
    await connectToDatabase();

    // 1. Migrate Categories
    const categories: any = await query('SELECT * FROM categories');
    let catsMigrated = 0;
    for (const cat of categories) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          image: cat.image || '',
          description: cat.description || '',
          parent_id: cat.parent_id || 0,
          meta_title: cat.meta_title || '',
          meta_description: cat.meta_description || '',
        },
        { upsert: true, new: true }
      );
      catsMigrated++;
    }

    // 2. Migrate Products + Product Images
    const products: any = await query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `);

    const images: any = await query('SELECT * FROM product_images ORDER BY is_primary DESC, id ASC');
    const imageMap: Record<number, string[]> = {};
    for (const img of images) {
      if (!imageMap[img.product_id]) imageMap[img.product_id] = [];
      imageMap[img.product_id].push(img.image_path);
    }

    let prodsMigrated = 0;
    for (const prod of products) {
      let prodImages = imageMap[prod.id] || [];
      if (prod.image && !prodImages.includes(prod.image)) {
        prodImages.unshift(prod.image);
      }

      await Product.findOneAndUpdate(
        { slug: prod.slug },
        {
          id: prod.id,
          title: prod.name || prod.title,
          slug: prod.slug,
          part_number: prod.part_number || `PN-${prod.id}`,
          oem_number: prod.oem_number || '',
          brand: prod.brand || 'DRANparts',
          category_id: prod.category_id,
          category_slug: prod.category_slug || '',
          category_name: prod.category_name || '',
          price: Number(prod.price),
          old_price: Number(prod.old_price || 0),
          cost_price: Number(prod.cost_price || 0),
          short_description: prod.short_description || '',
          description: prod.description || '',
          images: prodImages,
          in_stock: Boolean(prod.in_stock ?? true),
          stock_quantity: Number(prod.stock_quantity || 50),
          sku: prod.sku || '',
          is_featured: Boolean(prod.is_featured ?? false),
          is_flash_sale: Boolean(prod.is_flash_sale ?? false),
          meta_title: prod.meta_title || '',
          meta_description: prod.meta_description || '',
        },
        { upsert: true, new: true }
      );
      prodsMigrated++;
    }

    // 3. Seed Major Indian Pincodes
    const defaultPincodes = [
      { pincode: '110001', city: 'Connaught Place, New Delhi', state: 'Delhi', delivery_days: 1, cod_available: true, express_available: true },
      { pincode: '110005', city: 'Karol Bagh, New Delhi', state: 'Delhi', delivery_days: 1, cod_available: true, express_available: true },
      { pincode: '122001', city: 'Gurugram', state: 'Haryana', delivery_days: 1, cod_available: true, express_available: true },
      { pincode: '201301', city: 'Noida Sector 18', state: 'Uttar Pradesh', delivery_days: 1, cod_available: true, express_available: true },
      { pincode: '400001', city: 'Fort, Mumbai', state: 'Maharashtra', delivery_days: 2, cod_available: true, express_available: true },
      { pincode: '411001', city: 'Pune Camp', state: 'Maharashtra', delivery_days: 2, cod_available: true, express_available: true },
      { pincode: '560001', city: 'MG Road, Bengaluru', state: 'Karnataka', delivery_days: 2, cod_available: true, express_available: true },
      { pincode: '500001', city: 'Abids, Hyderabad', state: 'Telangana', delivery_days: 2, cod_available: true, express_available: true },
      { pincode: '600001', city: 'George Town, Chennai', state: 'Tamil Nadu', delivery_days: 2, cod_available: true, express_available: true },
      { pincode: '700001', city: 'BBD Bagh, Kolkata', state: 'West Bengal', delivery_days: 3, cod_available: true, express_available: true },
      { pincode: '302001', city: 'Jaipur City', state: 'Rajasthan', delivery_days: 2, cod_available: true, express_available: true },
      { pincode: '380001', city: 'Bhadra, Ahmedabad', state: 'Gujarat', delivery_days: 2, cod_available: true, express_available: true },
      { pincode: '160017', city: 'Sector 17, Chandigarh', state: 'Chandigarh', delivery_days: 2, cod_available: true, express_available: true },
      { pincode: '226001', city: 'Hazratganj, Lucknow', state: 'Uttar Pradesh', delivery_days: 2, cod_available: true, express_available: true },
    ];

    for (const pin of defaultPincodes) {
      await Pincode.findOneAndUpdate(
        { pincode: pin.pincode },
        { ...pin, prepaid_available: true },
        { upsert: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully migrated MariaDB data and seeded MongoDB!',
      categories_migrated: catsMigrated,
      products_migrated: prodsMigrated,
      pincodes_seeded: defaultPincodes.length,
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Migration failed' },
      { status: 500 }
    );
  }
}
