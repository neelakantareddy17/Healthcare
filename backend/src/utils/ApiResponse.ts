import type { Response } from 'express';

export class ApiResponse {
  static send<T>(res: Response, statusCode: number, message: string, data?: T) {
    return res.status(statusCode).json({
      success: statusCode < 400,
      message,
      data: data ?? null,
    });
  }

  static ok<T>(res: Response, message = 'Success', data?: T) {
    return this.send(res, 200, message, data);
  }

  static created<T>(res: Response, message = 'Created', data?: T) {
    return this.send(res, 201, message, data);
  }
}
