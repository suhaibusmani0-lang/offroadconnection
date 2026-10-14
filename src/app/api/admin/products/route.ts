import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductService from '@/services/productService';

export const dynamic = 'force-dynamic';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * GET /api/admin/products
 * Fetch products with admin metrics, filtering, search, and CSV/JSON export
 */
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '25')));
    const search = searchParams.get('search')?.trim() || '';
    const category = searchParams.get('category')?.trim() || '';
    const make = searchParams.get('make')?.trim() || '';
    const stockStatus = searchParams.get('stock')?.trim() || '';
    const exportFormat = searchParams.get('export')?.toLowerCase(); // 'csv' | 'json'

    // Build filter
    const queryParts: any[] = [];

    if (search) {
      queryParts.push({
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { part_number: { $regex: search, $options: 'i' } },
          { oem_numbers: { $regex: search, $options: 'i' } },
          { oem_number: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
          { make: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { category_name: { $regex: search, $options: 'i' } },
        ],
      });
    }

    if (category && category !== 'all') {
      if (/^\d+$/.test(category)) {
        queryParts.push({ category_id: Number(category) });
      } else {
        queryParts.push({
          $or: [{ category_slug: category }, { category_name: { $regex: category, $options: 'i' } }],
        });
      }
    }

    if (make && make !== 'all') {
      queryParts.push({
        $or: [{ make: { $regex: make, $options: 'i' } }, { title: { $regex: make, $options: 'i' } }],
      });
    }

    if (stockStatus === 'in_stock') {
      queryParts.push({ in_stock: true, stock_quantity: { $gt: 0 } });
    } else if (stockStatus === 'out_of_stock') {
      queryParts.push({ $or: [{ in_stock: false }, { stock_quantity: { $lte: 0 } }] });
    } else if (stockStatus === 'low_stock') {
      queryParts.push({ in_stock: true, stock_quantity: { $lte: 10, $gt: 0 } });
    }

    const filter = queryParts.length === 0 ? {} : queryParts.length === 1 ? queryParts[0] : { $and: queryParts };

    // Handle Bulk Export
    if (exportFormat === 'csv' || exportFormat === 'json') {
      const allDocs = await Product.find(filter).sort({ id: -1, created_at: -1 }).lean();
      const formatted = allDocs.map((p) => ProductService.formatProduct(p));

      if (exportFormat === 'json') {
        return new NextResponse(JSON.stringify(formatted, null, 2), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="inventory-export-${new Date().toISOString().slice(0, 10)}.json"`,
          },
        });
      }

      // Generate CSV
      const headers = [
        'ID',
        'Title',
        'Slug',
        'Part Number',
        'OEM Numbers',
        'Make',
        'Category',
        'Price (INR)',
        'Old Price',
        'Stock Quantity',
        'In Stock',
        'Brand',
        'Images',
      ];

      const csvRows = [headers.join(',')];

      formatted.forEach((p: any) => {
        const oemStr = Array.isArray(p.oem_numbers) ? p.oem_numbers.join('; ') : p.oem_number || '';
        const imgStr = Array.isArray(p.images) ? p.images.join('; ') : p.image || '';

        const row = [
          `"${p.id || p._id}"`,
          `"${(p.title || '').replace(/"/g, '""')}"`,
          `"${p.slug || ''}"`,
          `"${p.part_number || ''}"`,
          `"${oemStr.replace(/"/g, '""')}"`,
          `"${(p.make || '').replace(/"/g, '""')}"`,
          `"${(p.category_name || '').replace(/"/g, '""')}"`,
          p.price || 0,
          p.old_price || 0,
          p.stock_quantity || 0,
          p.in_stock ? 'YES' : 'NO',
          `"${(p.brand || '').replace(/"/g, '""')}"`,
          `"${imgStr.replace(/"/g, '""')}"`,
        ];
        csvRows.push(row.join(','));
      });

      return new NextResponse(csvRows.join('\r\n'), {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="inventory-export-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    // Standard paginated listing
    const total = await Product.countDocuments(filter);
    const offset = (page - 1) * limit;

    const docs = await Product.find(filter)
      .sort({ id: -1, created_at: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    // Overall catalog stats for inventory analytics
    const [totalCount, inStockCount, valuationResult] = await Promise.all([
      Product.countDocuments({}),
      Product.countDocuments({ in_stock: true, stock_quantity: { $gt: 0 } }),
      Product.aggregate([
        {
          $group: {
            _id: null,
            totalValuation: { $sum: { $multiply: ['$price', { $ifNull: ['$stock_quantity', 50] }] } },
          },
        },
      ]),
    ]);

    const totalValuation = valuationResult[0]?.totalValuation || 0;
    const outOfStockCount = totalCount - inStockCount;

    return NextResponse.json({
      success: true,
      products: docs.map((d) => ProductService.formatProduct(d)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
      stats: {
        totalCount,
        inStockCount,
        outOfStockCount,
        totalValuation,
      },
    });
  } catch (error: any) {
    console.error('Admin Products GET error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/products
 * Create single product OR bulk import array of products
 */
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    // 1. Bulk Import Mode
    if (body.bulk && Array.isArray(body.items)) {
      const items = body.items;
      if (items.length === 0) {
        return NextResponse.json({ success: false, error: 'No items provided for bulk import' }, { status: 400 });
      }

      let imported = 0;
      let updated = 0;
      const errors: string[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        try {
          const title = item.title || item.name || '';
          if (!title) {
            errors.push(`Row ${i + 1}: Missing title`);
            continue;
          }

          const partNumber = item.part_number || item.sku || `ORCP-${Math.floor(100000 + Math.random() * 900000)}`;
          let slug = item.slug ? slugify(item.slug) : slugify(title);

          const oemNumbers = Array.isArray(item.oem_numbers)
            ? item.oem_numbers
            : typeof item.oem_numbers === 'string'
            ? item.oem_numbers.split(/[;,|]/).map((s: string) => s.trim()).filter(Boolean)
            : item.oem_number
            ? [item.oem_number]
            : [];

          const images = Array.isArray(item.images)
            ? item.images
            : typeof item.images === 'string'
            ? item.images.split(/[;,|]/).map((s: string) => s.trim()).filter(Boolean)
            : item.image
            ? [item.image]
            : ['/assets/images/banner/banner-1.jpg'];

          const price = Number(item.price || 0);
          const oldPrice = Number(item.old_price || Math.round(price * 1.25));
          const stockQuantity = item.stock_quantity !== undefined ? Number(item.stock_quantity) : 50;
          const inStock = item.in_stock !== false && stockQuantity > 0;

          // Check if item exists by part_number or slug
          const existing = await Product.findOne({
            $or: [{ part_number: partNumber }, { slug }],
          });

          if (existing) {
            await Product.updateOne(
              { _id: existing._id },
              {
                $set: {
                  title,
                  part_number: partNumber,
                  oem_numbers: oemNumbers.length > 0 ? oemNumbers : existing.oem_numbers,
                  oem_number: oemNumbers[0] || existing.oem_number,
                  make: item.make || existing.make,
                  model: item.model || existing.model,
                  category_name: item.category_name || item.category || existing.category_name,
                  category_slug: item.category_slug || slugify(item.category_name || item.category || existing.category_name || ''),
                  price,
                  old_price: oldPrice,
                  stock_quantity: stockQuantity,
                  in_stock: inStock,
                  description: item.description || existing.description,
                  images: images.length > 0 ? images : existing.images,
                  brand: item.brand || existing.brand,
                },
              }
            );
            updated++;
          } else {
            // Check slug uniqueness
            const slugCollision = await Product.findOne({ slug });
            if (slugCollision) {
              slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
            }

            const highestDoc = await Product.findOne().sort({ id: -1 }).select('id').lean();
            const newId = (highestDoc?.id || 2530) + 1;

            await Product.create({
              id: newId,
              title,
              slug,
              part_number: partNumber,
              sku: partNumber,
              oem_number: oemNumbers[0] || '',
              oem_numbers: oemNumbers,
              make: item.make || '',
              model: item.model || '',
              brand: item.brand || item.make || 'DRANparts',
              category_name: item.category_name || item.category || 'Automotive Parts',
              category_slug: slugify(item.category_name || item.category || 'auto-parts'),
              price,
              old_price: oldPrice,
              stock_quantity: stockQuantity,
              in_stock: inStock,
              description: item.description || '',
              short_description: item.short_description || '',
              images,
              is_featured: !!item.is_featured,
            });
            imported++;
          }
        } catch (rowErr: any) {
          errors.push(`Row ${i + 1}: ${rowErr.message}`);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Bulk import completed: ${imported} created, ${updated} updated.`,
        imported,
        updated,
        errors,
      });
    }

    // 2. Single Product Creation Mode
    const {
      title,
      part_number,
      oem_number,
      oem_numbers,
      make,
      model,
      year_compatibility,
      category_name,
      category_slug,
      price,
      old_price,
      cost_price,
      stock_quantity,
      in_stock,
      description,
      short_description,
      images,
      brand,
      is_featured,
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'Product title is required' }, { status: 400 });
    }

    let slug = body.slug ? slugify(body.slug) : slugify(title);
    const existingSlug = await Product.findOne({ slug });
    if (existingSlug) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const partNum = (part_number || '').trim() || `ORCP-${Math.floor(100000 + Math.random() * 900000)}`;

    const parsedOem = Array.isArray(oem_numbers)
      ? oem_numbers
      : typeof oem_numbers === 'string'
      ? oem_numbers.split(/[;,|]/).map((s: string) => s.trim()).filter(Boolean)
      : oem_number
      ? [oem_number]
      : [];

    const parsedImages = Array.isArray(images)
      ? images
      : typeof images === 'string'
      ? images.split(/[;,|]/).map((s: string) => s.trim()).filter(Boolean)
      : ['/assets/images/banner/banner-1.jpg'];

    const highestDoc = await Product.findOne().sort({ id: -1 }).select('id').lean();
    const newId = (highestDoc?.id || 2530) + 1;

    const newProduct = await Product.create({
      id: newId,
      title: title.trim(),
      slug,
      part_number: partNum,
      sku: partNum,
      oem_number: parsedOem[0] || (oem_number ? oem_number.trim() : ''),
      oem_numbers: parsedOem,
      make: (make || '').trim(),
      model: (model || '').trim(),
      year_compatibility: (year_compatibility || '').trim(),
      brand: (brand || make || 'DRANparts').trim(),
      category_name: (category_name || 'Automotive Parts').trim(),
      category_slug: category_slug ? slugify(category_slug) : slugify(category_name || 'auto-parts'),
      price: Number(price || 0),
      old_price: Number(old_price || Math.round(Number(price || 0) * 1.25)),
      cost_price: Number(cost_price || 0),
      stock_quantity: stock_quantity !== undefined ? Number(stock_quantity) : 50,
      in_stock: in_stock !== false && (stock_quantity ?? 50) > 0,
      description: description || '',
      short_description: short_description || '',
      images: parsedImages,
      is_featured: !!is_featured,
    });

    return NextResponse.json({
      success: true,
      message: 'Product created successfully',
      product: ProductService.formatProduct(newProduct),
    });
  } catch (error: any) {
    console.error('Admin Products POST error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/products
 * Update existing product by ID or _id
 */
export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { id, _id, ...updates } = body;

    const targetId = _id || id;
    if (!targetId) {
      return NextResponse.json({ success: false, error: 'Product ID is required for update' }, { status: 400 });
    }

    // Prepare update payload
    const updatePayload: any = {};

    if (updates.title) updatePayload.title = updates.title.trim();
    if (updates.slug) updatePayload.slug = slugify(updates.slug);
    if (updates.part_number) {
      updatePayload.part_number = updates.part_number.trim();
      updatePayload.sku = updates.part_number.trim();
    }
    if (updates.oem_number !== undefined) updatePayload.oem_number = updates.oem_number.trim();
    if (updates.oem_numbers !== undefined) {
      updatePayload.oem_numbers = Array.isArray(updates.oem_numbers)
        ? updates.oem_numbers
        : updates.oem_numbers.split(/[;,|]/).map((s: string) => s.trim()).filter(Boolean);
    }
    if (updates.make !== undefined) updatePayload.make = updates.make.trim();
    if (updates.model !== undefined) updatePayload.model = updates.model.trim();
    if (updates.brand !== undefined) updatePayload.brand = updates.brand.trim();
    if (updates.category_name !== undefined) {
      updatePayload.category_name = updates.category_name.trim();
      updatePayload.category_slug = slugify(updates.category_name);
    }
    if (updates.price !== undefined) updatePayload.price = Number(updates.price);
    if (updates.old_price !== undefined) updatePayload.old_price = Number(updates.old_price);
    if (updates.stock_quantity !== undefined) {
      updatePayload.stock_quantity = Number(updates.stock_quantity);
      if (updates.in_stock === undefined) {
        updatePayload.in_stock = Number(updates.stock_quantity) > 0;
      }
    }
    if (updates.in_stock !== undefined) updatePayload.in_stock = Boolean(updates.in_stock);
    if (updates.description !== undefined) updatePayload.description = updates.description;
    if (updates.short_description !== undefined) updatePayload.short_description = updates.short_description;
    if (updates.images !== undefined) {
      updatePayload.images = Array.isArray(updates.images)
        ? updates.images
        : updates.images.split(/[;,|]/).map((s: string) => s.trim()).filter(Boolean);
    }
    if (updates.is_featured !== undefined) updatePayload.is_featured = Boolean(updates.is_featured);

    const filter = /^[0-9a-fA-F]{24}$/.test(String(targetId))
      ? { _id: targetId }
      : { id: Number(targetId) };

    const updatedDoc = await Product.findOneAndUpdate(filter, { $set: updatePayload }, { new: true });

    if (!updatedDoc) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully',
      product: ProductService.formatProduct(updatedDoc),
    });
  } catch (error: any) {
    console.error('Admin Products PATCH error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/products
 * Delete single product OR bulk delete array of IDs
 */
export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    // 1. Single Delete
    if (id) {
      const filter = /^[0-9a-fA-F]{24}$/.test(id) ? { _id: id } : { id: Number(id) };
      const deleted = await Product.findOneAndDelete(filter);
      if (!deleted) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Product deleted successfully' });
    }

    // 2. Bulk Delete
    const body = await req.json().catch(() => ({}));
    if (Array.isArray(body.ids) && body.ids.length > 0) {
      const objectIds = body.ids.filter((i: string) => /^[0-9a-fA-F]{24}$/.test(i));
      const numericIds = body.ids.filter((i: string) => /^\d+$/.test(i)).map(Number);

      const deleteFilter = {
        $or: [{ _id: { $in: objectIds } }, { id: { $in: numericIds } }],
      };

      const result = await Product.deleteMany(deleteFilter);
      return NextResponse.json({
        success: true,
        message: `${result.deletedCount} products deleted successfully`,
        deletedCount: result.deletedCount,
      });
    }

    return NextResponse.json({ success: false, error: 'Missing product ID or IDs array' }, { status: 400 });
  } catch (error: any) {
    console.error('Admin Products DELETE error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error' }, { status: 500 });
  }
}

