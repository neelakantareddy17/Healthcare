import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as notificationService from '../services/notification.service.js';

export const getMyNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await notificationService.getUserNotifications(req.user!.userId);
  return ApiResponse.ok(res, 'Notifications fetched', notifications);
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await notificationService.markAsRead(req.params.id, req.user!.userId);
  return ApiResponse.ok(res, 'Notification marked as read', notification);
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  await notificationService.deleteNotification(req.params.id, req.user!.userId);
  return ApiResponse.ok(res, 'Notification deleted');
});
