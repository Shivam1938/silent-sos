import { Schema, model, type Document } from 'mongoose';

export interface IUser extends Document {
  deviceId: string;
  pinHash?: string;
  displayName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    deviceId: { type: String, required: true, unique: true },
    pinHash: { type: String },
    displayName: { type: String },
  },
  { timestamps: true }
);

export const UserModel = model<IUser>('User', userSchema);

