import { Router } from 'express';
import * as queueController from '../controllers/queue.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { checkInSchema, updateQueueStatusSchema } from '../validators/queue.validator.js';
import { idParamSchema } from '../validators/department.validator.js';

const router = Router();

router.use(authenticate);

// Doctor's own live queue (dashboard)
router.get('/my-queue', authorize('DOCTOR'), queueController.getMyQueue);

// Public-ish (authenticated) view of a specific doctor's queue for the day
router.get('/doctor/:doctorId', queueController.getDoctorQueue);

// QR code check-in: PENDING->PAID must already be true; moves appointment to CHECKED_IN
router.post(
  '/check-in',
  authorize('ADMIN', 'DOCTOR', 'PATIENT'),
  validate({ body: checkInSchema }),
  queueController.checkIn,
);

router.get('/:id', validate({ params: idParamSchema }), queueController.getQueueEntryById);

router.put(
  '/:id/status',
  authorize('DOCTOR', 'ADMIN'),
  validate({ params: idParamSchema, body: updateQueueStatusSchema }),
  queueController.updateQueueStatus,
);

export default router;
