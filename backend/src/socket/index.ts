import type { Server as HttpServer } from 'node:http';
import { Server as SocketIOServer } from 'socket.io';
import { verifyToken } from '../utils/jwt.js';
import { env } from '../config/env.js';

let io: SocketIOServer | null = null;

/**
 * Initializes Socket.IO on top of the existing HTTP server.
 * Clients authenticate by sending a JWT in the `auth.token` handshake field.
 * Every connected socket joins two rooms:
 *   - `user:<userId>`   -> for personal notifications
 *   - `doctor-queue:<doctorId>` -> joined explicitly via the `queue:join` event
 */
export const initSocket = (httpServer: HttpServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token as string | undefined;
      if (!token) {
        return next();
      }
      const payload = verifyToken(token);
      socket.data.userId = payload.userId;
      socket.data.role = payload.role;
      next();
    } catch {
      next();
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId as string | undefined;

    if (userId) {
      socket.join(`user:${userId}`);
    }

    // Doctor / staff dashboards explicitly subscribe to a doctor's live queue
    socket.on('queue:join', (doctorId: string) => {
      socket.join(`doctor-queue:${doctorId}`);
    });

    socket.on('queue:leave', (doctorId: string) => {
      socket.leave(`doctor-queue:${doctorId}`);
    });

    socket.on('disconnect', () => {
      // no-op, rooms are cleaned up automatically by socket.io
    });
  });

  return io;
};

export const getIO = (): SocketIOServer | null => io;

export const emitToUser = (userId: string, event: string, payload: unknown) => {
  io?.to(`user:${userId}`).emit(event, payload);
};

export const emitToDoctorQueue = (doctorId: string, event: string, payload: unknown) => {
  io?.to(`doctor-queue:${doctorId}`).emit(event, payload);
};
