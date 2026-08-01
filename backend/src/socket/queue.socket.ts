import { emitToDoctorQueue } from './index.js';

/**
 * Broadcasts a live queue update to every client subscribed to a doctor's queue room.
 * Called from the queue/payment services whenever a queue entry changes.
 */
export const broadcastQueueUpdate = (doctorId: string, queueSnapshot: unknown) => {
  emitToDoctorQueue(doctorId, 'queue:update', queueSnapshot);
};

export const broadcastTokenCalled = (doctorId: string, tokenNumber: number) => {
  emitToDoctorQueue(doctorId, 'queue:token-called', { tokenNumber });
};
