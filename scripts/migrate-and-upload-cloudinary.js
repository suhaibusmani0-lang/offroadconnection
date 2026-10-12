const mongoose = require('mongoose');
const mysql = require('mysql2/promise');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// 1. Cloudinary Config
cloudinary.config({
  cloud_name: 'coui9wpl',
  api_key: '849272247247994',
  api_secret: 'ru3Gvn9lOcMvBrLqeLuSqgucvkI',
});

// 2. MongoDB Atlas Config
const MONGODB_URI = 'mongodb+srv://suhaibusmanizar_db_user:AT5sYzl8JjHIRRu8@cluster0.mo9pum9.mongodb.net/offroad?retryWrites=true&w=majority&appName=Cluster0';

// 3. MySQL Config
const mysqlConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'offroad',
};

async function main() {
  console.log('🚀 Connecting to MongoDB Atlas...');
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Connected to MongoDB Atlas!');

  console.log('🚀 Connecting to Local MariaDB...');
  const pool = mysql.createPool(mysqlConfig);
  console.log('✅ Connected to MariaDB!');

  // Schemas
  const CategorySchema = new mongoose.Schema({
    id: Number,
    name: String,
    slug: { type: String, unique: true },
    image: String,
    description: String,
    parent_id: Number,
    meta_title: String,
    meta_description: String,
  }, { timestamps: true });

  const ProductSchema = new mongoose.Schema({
    id: Number,
    title: String,
    slug: { type: String, unique: true },
    part_number: String,
    oem_number: String,
    brand: String,
    category_id: Number,
    category_slug: String,
    category_name: String,
    price: Number,
    old_price: Number,
    cost_price: Number,
    short_description: String,
    description: String,
    images: [String],
    cloudinary_public_ids: [String],
    video_url: String,
    in_stock: Boolean,
    stock_quantity: Number,
    sku: String,
    is_featured: Boolean,
    is_flash_sale: Boolean,
    meta_title: String,
    meta_description: String,
  }, { timestamps: true });

  const PincodeSchema = new mongoose.Schema({
    pincode: { type: String, unique: true },
    city: String,
    state: String,
    delivery_days: Number,
    cod_available: Boolean,
    express_available: Boolean,
    prepaid_available: Boolean,
  }, { timestamps: true });

  const Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
  const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
  const Pincode = mongoose.models.Pincode || mongoose.model('Pincode', PincodeSchema);

  // 1. Migrate Categories
  console.log('📦 Migrating Categories to Atlas...');
  const [cats] = await pool.query('SELECT * FROM categories');
  for (const cat of cats) {
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
      { upsert: true }
    );
  }
  console.log(`✅ Migrated ${cats.length} categories to Atlas.`);

  // 2. Migrate Products and upload images to Cloudinary
  console.log('📦 Migrating Products and Uploading Images to Cloudinary...');
  const [prods] = await pool.query(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
  `);

  const [images] = await pool.query('SELECT * FROM product_images ORDER BY is_primary DESC, id ASC');
  const imageMap = {};
  for (const img of images) {
    if (!imageMap[img.product_id]) imageMap[img.product_id] = [];
    imageMap[img.product_id].push(img.image_path);
  }

  const publicDir = path.resolve(__dirname, '../public');
  const uploadedCloudinaryUrls = {};

  let uploadedCount = 0;
  for (const prod of prods) {
    let rawImages = imageMap[prod.id] || [];
    if (prod.image && !rawImages.includes(prod.image)) {
      rawImages.unshift(prod.image);
    }

    const finalCloudinaryImages = [];
    const publicIds = [];

    for (const imgPath of rawImages) {
      if (!imgPath) continue;

      // Already uploaded in this batch?
      if (uploadedCloudinaryUrls[imgPath]) {
        finalCloudinaryImages.push(uploadedCloudinaryUrls[imgPath]);
        continue;
      }

      // Check if file exists on disk
      let localDiskPath = path.join(publicDir, imgPath.replace(/^\//, ''));
      if (!fs.existsSync(localDiskPath)) {
        // Check in uploads or assets/images
        const alt1 = path.join(publicDir, 'assets/uploads/products', path.basename(imgPath));
        const alt2 = path.join(publicDir, 'assets/images/products', path.basename(imgPath));
        if (fs.existsSync(alt1)) localDiskPath = alt1;
        else if (fs.existsSync(alt2)) localDiskPath = alt2;
      }

      if (fs.existsSync(localDiskPath) && fs.statSync(localDiskPath).isFile()) {
        try {
          const uploadRes = await cloudinary.uploader.upload(localDiskPath, {
            folder: 'offroad_products',
            use_filename: true,
            unique_filename: false,
            overwrite: false,
          });
          finalCloudinaryImages.push(uploadRes.secure_url);
          publicIds.push(uploadRes.public_id);
          uploadedCloudinaryUrls[imgPath] = uploadRes.secure_url;
          uploadedCount++;
          console.log(`[Cloudinary] Uploaded: ${path.basename(localDiskPath)} -> ${uploadRes.secure_url}`);
        } catch (uploadErr) {
          console.warn(`[Cloudinary] Warning for ${imgPath}:`, uploadErr.message);
          finalCloudinaryImages.push(imgPath); // fallback
        }
      } else {
        finalCloudinaryImages.push(imgPath);
      }
    }

    await Product.findOneAndUpdate(
      { slug: prod.slug },
      {
        id: prod.id,
        title: prod.name || prod.title,
        slug: prod.slug,
        part_number: prod.part_number || `PN-${prod.id}`,
        oem_number: prod.oem_number || '',
        brand: prod.brand || 'Off Road Connection Parts',
        category_id: prod.category_id,
        category_slug: prod.category_slug || '',
        category_name: prod.category_name || '',
        price: Number(prod.price),
        old_price: Number(prod.old_price || 0),
        cost_price: Number(prod.cost_price || 0),
        short_description: prod.short_description || '',
        description: prod.description || '',
        images: finalCloudinaryImages.length > 0 ? finalCloudinaryImages : ['/assets/images/resource/Wheel-1.png'],
        cloudinary_public_ids: publicIds,
        video_url: prod.video_url || '',
        in_stock: Boolean(prod.in_stock ?? true),
        stock_quantity: Number(prod.stock_quantity || 50),
        sku: prod.sku || '',
        is_featured: Boolean(prod.is_featured ?? false),
        is_flash_sale: Boolean(prod.is_flash_sale ?? false),
        meta_title: prod.meta_title || '',
        meta_description: prod.meta_description || '',
      },
      { upsert: true }
    );
  }

  console.log(`✅ Successfully migrated ${prods.length} products to Atlas! Uploaded ${uploadedCount} photos to Cloudinary CDN.`);

  // 3. Seed Indian Pincodes
  console.log('📍 Seeding Indian Pincode Delivery Matrix to Atlas...');
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
  console.log(`✅ Seeded ${defaultPincodes.length} priority delivery pincodes to Atlas.`);

  console.log('🎉 ALL DATA MIGRATED TO MONGODB ATLAS & CLOUDINARY SUCCESSFULLY!');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error during migration:', err);
  process.exit(1);
});

