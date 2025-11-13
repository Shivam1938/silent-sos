import { Schema, model, type Document, type Types } from 'mongoose';

export type SosStatus = 'triggered' | 'acknowledged' | 'cancelled' | 'resolved';

export interface ISosEvent extends Document {
  user: Types.ObjectId;
  status: SosStatus;
  locations: Array<{
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp: Date;
  }>;
  cancelledReason?: string;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const sosEventSchema = new Schema<ISosEvent>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['triggered', 'acknowledged', 'cancelled', 'resolved'],
      default: 'triggered',
    },
    locations: [
      {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        accuracy: { type: Number },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    cancelledReason: { type: String },
    cancelledAt: { type: Date },
  },
  { timestamps: true }
);

export const SosEventModel = model<ISosEvent>('SosEvent', sosEventSchema);

