import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  id?: number;
  title: string;
  slug: string;
  part_number: string;
  oem_number?: string;
  brand?: string;
  category_id?: number;
  category_slug?: string;
  category_name?: string;
  price: number;
  old_price?: number;
  cost_price?: number;
  short_description?: string;
  description?: string;
  images: string[];
  video_url?: string;
  cloudinary_public_ids?: string[];
  in_stock: boolean;
  stock_quantity: number;
  sku?: string;
  is_featured: boolean;
  is_flash_sale: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: Number, index: true },
    title: { type: String, required: true, trim: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    part_number: { type: String, required: true, trim: true, index: true },
    oem_number: { type: String, default: '', trim: true },
    brand: { type: String, default: 'Off Road Connection Parts', trim: true },
    category_id: { type: Number, index: true },
    category_slug: { type: String, index: true },
    category_name: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    old_price: { type: Number, default: 0 },
    cost_price: { type: Number, default: 0 },
    short_description: { type: String, default: '' },
    description: { type: String, default: '' },
    images: { type: [String], default: [] },
    video_url: { type: String, default: '' },
    cloudinary_public_ids: { type: [String], default: [] },
    in_stock: { type: Boolean, default: true },
    stock_quantity: { type: Number, default: 50 },
    sku: { type: String, default: '' },
    is_featured: { type: Boolean, default: false },
    is_flash_sale: { type: Boolean, default: false },
    meta_title: { type: String, default: '' },
    meta_description: { type: String, default: '' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

// Search index for fast 15,000 product queries
ProductSchema.index({
  title: 'text',
  part_number: 'text',
  oem_number: 'text',
  brand: 'text',
  description: 'text',
});

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
