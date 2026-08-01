import { prisma } from '../config/db.js';
import { ApiError } from '../utils/ApiError.js';
import type { NotificationType } from '@prisma/client';
import { emitToUser } from '../socket/index.js';

interface CreateNotificationInput {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
}

export const createNotification = async (input: CreateNotificationInput) => {
  const notification = await prisma.notification.create({
    data: {
      userId: input.userId,
      title: input.title,
      message: input.message,
      type: input.type ?? 'GENERAL',
    },
  });

  // Push a real-time event to the user if they are connected via Socket.IO
  emitToUser(input.userId, 'notification:new', notification);

  return notification;
};

export const getUserNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
};

export const markAsRead = async (id: string, userId: string) => {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }
  if (notification.userId !== userId) {
    throw ApiError.forbidden('You cannot modify this notification');
  }
  return prisma.notification.update({ where: { id }, data: { isRead: true } });
};

export const deleteNotification = async (id: string, userId: string) => {
  const notification = await prisma.notification.findUnique({ where: { id } });
  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }
  if (notification.userId !== userId) {
    throw ApiError.forbidden('You cannot delete this notification');
  }
  await prisma.notification.delete({ where: { id } });
};
