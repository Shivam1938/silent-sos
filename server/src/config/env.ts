import { config } from 'dotenv';
import { z } from 'zod';

let cachedEnv: EnvConfig | null = null;

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z
    .string()
    .transform((value) => parseInt(value, 10))
    .or(z.number())
    .default(4000),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  TWILIO_ACCOUNT_SID: z.string().min(1, 'TWILIO_ACCOUNT_SID is required'),
  TWILIO_AUTH_TOKEN: z.string().min(1, 'TWILIO_AUTH_TOKEN is required'),
  TWILIO_FROM_NUMBER: z.string().min(1, 'TWILIO_FROM_NUMBER is required'),
  CLIENT_BASE_URL: z.string().min(1, 'CLIENT_BASE_URL is required'),
});

type EnvConfig = z.infer<typeof envSchema>;

export const initEnv = (): EnvConfig => {
  if (cachedEnv) {
    return cachedEnv;
  }

  config();
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Environment validation failed:', parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment configuration');
  }
  cachedEnv = parsed.data;
  return cachedEnv;
};

export const getEnv = (): EnvConfig => {
  if (!cachedEnv) {
    return initEnv();
  }
  return cachedEnv;
};

