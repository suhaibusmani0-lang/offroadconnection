import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupon extends Document {
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number; // e.g. 10 for 10% or 1500 for ₹1500
  min_order_amount: number;
  max_discount_amount?: number; // Cap for percentage discount
  valid_from: Date;
  valid_until: Date;
  usage_limit?: number;
  used_count: number;
  is_active: boolean;
  applicable_categories?: string[];
  applicable_makes?: string[];
  created_at: Date;
  updated_at: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    description: { type: String, default: '' },
    discount_type: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
    discount_value: { type: Number, required: true, min: 0 },
    min_order_amount: { type: Number, default: 0 },
    max_discount_amount: { type: Number, default: 0 },
    valid_from: { type: Date, default: Date.now },
    valid_until: { type: Date, required: true },
    usage_limit: { type: Number, default: 1000 },
    used_count: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
    applicable_categories: { type: [String], default: [] },
    applicable_makes: { type: [String], default: [] },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
