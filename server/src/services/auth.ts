import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export const hashPin = async (pin: string) => {
  return bcrypt.hash(pin, SALT_ROUNDS);
};

export const verifyPin = async (pin: string, hash?: string | null) => {
  if (!hash) {
    return false;
  }
  return bcrypt.compare(pin, hash);
};

