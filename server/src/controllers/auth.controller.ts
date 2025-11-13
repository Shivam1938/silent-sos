import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
import { getEnv } from '../config/env.js';
import { hashPin, verifyPin } from '../services/auth.js';

export const registerDevice = async (req: Request, res: Response) => {
  const { deviceId, displayName, pin } = req.body as {
    deviceId?: string;
    displayName?: string;
    pin?: string;
  };

  if (!deviceId) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'deviceId is required' });
  }

  let user = await UserModel.findOne({ deviceId });

  if (!user) {
    if (!pin) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'PIN is required for first-time registration' });
    }

    const pinHash = await hashPin(pin);
    user = await UserModel.create({
      deviceId,
      displayName,
      pinHash,
    });
  } else {
    if (displayName) {
      user.displayName = displayName;
    }
    if (pin) {
      user.pinHash = await hashPin(pin);
    }
    await user.save();
  }

  const env = getEnv();
  const token = jwt.sign({ userId: user.id, deviceId: user.deviceId }, env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return res.status(StatusCodes.OK).json({
    token,
    user: {
      id: user.id,
      deviceId: user.deviceId,
      displayName: user.displayName,
    },
  });
};

export const loginDevice = async (req: Request, res: Response) => {
  const { deviceId, pin } = req.body as { deviceId?: string; pin?: string };

  if (!deviceId || !pin) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'deviceId and pin are required' });
  }

  const user = await UserModel.findOne({ deviceId });
  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
  }

  const isValid = await verifyPin(pin, user.pinHash);
  if (!isValid) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid credentials' });
  }

  const env = getEnv();
  const token = jwt.sign({ userId: user.id, deviceId: user.deviceId }, env.JWT_SECRET, {
    expiresIn: '7d',
  });

  return res.status(StatusCodes.OK).json({
    token,
    user: {
      id: user.id,
      deviceId: user.deviceId,
      displayName: user.displayName,
    },
  });
};

