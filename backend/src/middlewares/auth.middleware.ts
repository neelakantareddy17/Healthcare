import type {
  NextFunction,
  Request,
  Response,
} from 'express';

import { ApiError } from '../utils/ApiError.js';
import { verifyToken } from '../utils/jwt.js';

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;

    if (
      !header ||
      !header.startsWith('Bearer ')
    ) {
      throw ApiError.unauthorized(
        'Authentication token missing',
      );
    }

    const token = header.split(' ')[1];

    if (!token) {
      throw ApiError.unauthorized(
        'Authentication token missing',
      );
    }

    const payload = verifyToken(token);

    req.user = {
      userId: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(
      ApiError.unauthorized(
        'Invalid or expired token',
      ),
    );
  }
};