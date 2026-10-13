import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICRMLead extends Document {
  name: string;
  phone: string;
  email?: string;
  vehicle_info?: string;
  requested_part: string;
  estimated_value: number;
  status: 'NEW' | 'CONTACTED' | 'QUOTED' | 'WON' | 'LOST';
  notes?: string;
  source?: string;
  created_at: Date;
  updated_at: Date;
}

const CRMLeadSchema = new Schema<ICRMLead>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, default: '' },
    vehicle_info: { type: String, trim: true, default: '' },
    requested_part: { type: String, required: true, trim: true },
    estimated_value: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST'],
      default: 'NEW',
    },
    notes: { type: String, default: '' },
    source: { type: String, default: 'Website Form' },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

CRMLeadSchema.index({ status: 1 });
CRMLeadSchema.index({ phone: 1 });
CRMLeadSchema.index({ name: 'text', vehicle_info: 'text', requested_part: 'text' });

const CRMLead: Model<ICRMLead> =
  mongoose.models.CRMLead || mongoose.model<ICRMLead>('CRMLead', CRMLeadSchema);

export default CRMLead;

