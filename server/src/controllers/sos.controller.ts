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
    status: 'triggered',
    locations: [{ latitude, longitude, accuracy, timestamp: new Date() }],
  });

  // Update lastLocation for easy access
  const updatedEvent = await SosEventModel.findByIdAndUpdate(
    event._id,
    {
      $set: {
        lastLocation: { latitude, longitude, accuracy },
        lastUpdate: new Date(),
      },
    },
    { new: true }
  );

  const contacts = await ContactModel.find({ user: req.userId }).lean();
  await sendSosAlerts({
    contacts,
    event: updatedEvent || event,
  });

  return res.status(StatusCodes.CREATED).json({ eventId: event.id });
};

export const sendHeartbeat = async (req: AuthenticatedRequest, res: Response) => {
  const { eventId, latitude, longitude, accuracy } = req.body;
  
  // Update event with new location and lastLocation
  await SosEventModel.findByIdAndUpdate(
    eventId,
    {
      $push: {
        locations: { latitude, longitude, accuracy, timestamp: new Date() },
      },
      $set: {
        lastLocation: { latitude, longitude, accuracy },
        lastUpdate: new Date(),
      },
    },
    { new: true }
  );
  
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

