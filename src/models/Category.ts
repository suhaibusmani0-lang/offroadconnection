import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICategory extends Document {
  id?: number;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  parent_id?: number;
  meta_title?: string;
  meta_description?: string;
  product_count?: number;
}

const CategorySchema = new Schema<ICategory>(
  {
    id: { type: Number, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    parent_id: { type: Number, default: 0 },
    meta_title: { type: String, default: '' },
    meta_description: { type: String, default: '' },
    product_count: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
