import type { IContact } from '../models/Contact.js';
import type { ISosEvent } from '../models/SosEvent.js';
import { getEnv } from '../config/env.js';
import { twilioClient } from './twilio.js';

// Type for lean contact (plain object from .lean() query)
type ContactData = Pick<IContact, 'phoneNumber'>;

interface SendSosAlertsParams {
  contacts: ContactData[];
  event: ISosEvent;
}

const buildSosMessage = (event: ISosEvent) => {
  // Use lastLocation if available, otherwise use latest from locations array
  const location = (event.lastLocation && event.lastLocation.latitude && event.lastLocation.longitude)
    ? event.lastLocation
    : event.locations.at(-1);
    
  if (!location || !location.latitude || !location.longitude) {
    return 'Silent SOS alert triggered. Location unavailable.';
  }
  
  const { latitude, longitude } = location;
  const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
  return [
    '🚨 Silent SOS Alert 🚨',
    'Your contact triggered an emergency alert.',
    `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
    `Live map: ${mapsUrl}`,
    '\n⚠️ Location updates automatically. Check the map link for latest position.',
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

