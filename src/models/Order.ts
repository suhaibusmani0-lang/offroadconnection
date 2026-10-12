import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  product_id?: number | string;
  slug?: string;
  title: string;
  part_number?: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface IOrder extends Document {
  order_number: string;
  customer_phone: string;
  customer_name: string;
  customer_email?: string;
  shipping_address: {
    street: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: IOrderItem[];
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total_amount: number;
  payment_method: 'razorpay' | 'cod' | 'upi' | 'card';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  delivery_status: 'placed' | 'confirmed' | 'dispatched' | 'out_for_delivery' | 'delivered' | 'cancelled';
  tracking_number?: string;
  courier_name?: string;
  estimated_delivery_date?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product_id: { type: Schema.Types.Mixed },
    slug: { type: String, default: '' },
    title: { type: String, required: true },
    part_number: { type: String, default: '' },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    order_number: { type: String, required: true, unique: true, index: true },
    customer_phone: { type: String, required: true, index: true },
    customer_name: { type: String, required: true },
    customer_email: { type: String, default: '' },
    shipping_address: {
      street: { type: String, required: true },
      landmark: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true, index: true },
    },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shipping_fee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total_amount: { type: Number, required: true },
    payment_method: {
      type: String,
      enum: ['razorpay', 'cod', 'upi', 'card'],
      default: 'razorpay',
    },
    payment_status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    razorpay_order_id: { type: String, default: '' },
    razorpay_payment_id: { type: String, default: '' },
    razorpay_signature: { type: String, default: '' },
    delivery_status: {
      type: String,
      enum: ['placed', 'confirmed', 'dispatched', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'placed',
    },
    tracking_number: { type: String, default: '' },
    courier_name: { type: String, default: 'BlueDart / Delhivery Express' },
    estimated_delivery_date: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
