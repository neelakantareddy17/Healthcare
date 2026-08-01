import bcrypt from 'bcrypt';
import { env } from '../config/env.js';

export const hashPassword = async (plain: string): Promise<string> => {
  return bcrypt.hash(plain, env.bcryptSaltRounds);
};

export const comparePassword = async (plain: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(plain, hashed);
};
