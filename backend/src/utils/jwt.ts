import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { JwtPayload } from '../types/index.js';

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
};
