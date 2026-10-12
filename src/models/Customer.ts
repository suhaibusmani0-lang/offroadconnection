import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAddress {
  label?: string; // Home, Office, Workshop
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

export interface ICustomer extends Document {
  phone: string;
  name?: string;
  email?: string;
  otp?: string;
  otp_expires_at?: Date;
  is_verified: boolean;
  addresses: IAddress[];
  created_at: Date;
  updated_at: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    label: { type: String, default: 'Home' },
    street: { type: String, required: true },
    landmark: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    is_default: { type: Boolean, default: false },
  },
  { _id: false }
);

const CustomerSchema = new Schema<ICustomer>(
  {
    phone: { type: String, required: true, unique: true, index: true, trim: true },
    name: { type: String, default: 'Valued Customer', trim: true },
    email: { type: String, default: '', trim: true },
    otp: { type: String, default: null },
    otp_expires_at: { type: Date, default: null },
    is_verified: { type: Boolean, default: false },
    addresses: { type: [AddressSchema], default: [] },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const Customer: Model<ICustomer> =
  mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
