import type { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SosEventModel } from '../models/SosEvent.js';
import { ContactModel } from '../models/Contact.js';
import { sendSosAlerts } from '../services/notification.js';
import type { AuthenticatedRequest } from '../types/authenticated-request.js';

export const triggerSos = async (req: AuthenticatedRequest, res: Response) => {
  const { latitude, longitude, accuracy } = req.body;
  const event = await SosEventModel.create({
    user: req.userId,
    locations: [{ latitude, longitude, accuracy }],
  });

  const contacts = await ContactModel.find({ user: req.userId }).lean();
  await sendSosAlerts({
    contacts,
    event,
  });

  return res.status(StatusCodes.CREATED).json({ eventId: event.id });
};

export const sendHeartbeat = async (req: AuthenticatedRequest, res: Response) => {
  const { eventId, latitude, longitude, accuracy } = req.body;
  await SosEventModel.findByIdAndUpdate(eventId, {
    $push: {
      locations: { latitude, longitude, accuracy, timestamp: new Date() },
    },
  });
  return res.status(StatusCodes.OK).json({ ok: true });
};

export const cancelSos = async (req: AuthenticatedRequest, res: Response) => {
  const { eventId, reason } = req.body;
  await SosEventModel.findOneAndUpdate(
    { _id: eventId, user: req.userId },
    {
      status: 'cancelled',
      cancelledReason: reason,
      cancelledAt: new Date(),
    }
  );
  return res.status(StatusCodes.OK).json({ ok: true });
};

