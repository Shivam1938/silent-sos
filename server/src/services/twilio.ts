import twilio from 'twilio';
import { getEnv } from '../config/env.js';

const env = getEnv();

export const twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

