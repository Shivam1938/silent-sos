import { Schema, model, type Document, type Types } from 'mongoose';

export interface IContact extends Document {
  user: Types.ObjectId;
  name: string;
  phoneNumber: string;
  relationship?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    relationship: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);

contactSchema.index({ user: 1, phoneNumber: 1 }, { unique: true });

export const ContactModel = model<IContact>('Contact', contactSchema);

