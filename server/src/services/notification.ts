import type { IContact } from '../models/Contact.js';
import type { ISosEvent } from '../models/SosEvent.js';
import { getEnv } from '../config/env.js';
import { twilioClient } from './twilio.js';

interface SendSosAlertsParams {
  contacts: IContact[];
  event: ISosEvent;
}

const buildSosMessage = (event: ISosEvent) => {
  const latestLocation = event.locations.at(-1);
  if (!latestLocation) {
    return 'Silent SOS alert triggered. Location unavailable.';
  }
  const { latitude, longitude } = latestLocation;
  const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
  return [
    '🚨 Silent SOS Alert 🚨',
    'Your contact triggered an emergency alert.',
    `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
    `Live map: ${mapsUrl}`,
  ].join('\n');
};

export const sendSosAlerts = async ({ contacts, event }: SendSosAlertsParams) => {
  const env = getEnv();
  const message = buildSosMessage(event);

  const smsPromises = contacts.map((contact) =>
    twilioClient.messages.create({
      to: contact.phoneNumber,
      from: env.TWILIO_FROM_NUMBER,
      body: message,
    })
  );

  await Promise.allSettled(smsPromises);
};

