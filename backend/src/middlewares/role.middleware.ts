import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to perform this action'));
    }

    next();
  };
};
