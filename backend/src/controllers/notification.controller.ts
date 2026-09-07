import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as notificationService from '../services/notification.service.js';
import { ApiError } from '../utils/ApiError.js';

export const getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await notificationService.getUserNotifications(req.user!.userId);
  return ApiResponse.ok(res, 'Notifications fetched', notifications);
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
const { id } = req.params;

if (!id) {
  throw ApiError.badRequest(
    'Notification ID is required',
  );
}

const notification =
  await notificationService.markAsRead(
    id,
    req.user!.userId,
  );
  return ApiResponse.ok(res, 'Notification marked as read', notification);
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
const { id } = req.params;

if (!id) {
  throw ApiError.badRequest(
    'Notification ID is required',
  );
}

await notificationService.deleteNotification(
  id,
  req.user!.userId,
);
  return ApiResponse.ok(res, 'Notification deleted');
});
