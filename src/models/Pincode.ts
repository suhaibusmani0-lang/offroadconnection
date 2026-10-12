import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPincode extends Document {
  pincode: string;
  city: string;
  state: string;
  delivery_days: number;
  cod_available: boolean;
  express_available: boolean;
  prepaid_available: boolean;
}

const PincodeSchema = new Schema<IPincode>(
  {
    pincode: { type: String, required: true, unique: true, index: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    delivery_days: { type: Number, default: 3 },
    cod_available: { type: Boolean, default: true },
    express_available: { type: Boolean, default: true },
    prepaid_available: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const Pincode: Model<IPincode> =
  mongoose.models.Pincode || mongoose.model<IPincode>('Pincode', PincodeSchema);

export default Pincode;
