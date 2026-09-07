import { Router } from 'express';

import * as appointmentController from '../controllers/appointment.controller.js';

import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';

import {
  createAppointmentSchema,
  appointmentQuerySchema,
} from '../validators/appointment.validator.js';

import { idParamSchema } from '../validators/department.validator.js';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize('PATIENT'),
  validate({ body: createAppointmentSchema }),
  appointmentController.createAppointment,
);

router.get(
  '/',
  validate({ query: appointmentQuerySchema }),
  appointmentController.getAppointments,
);

router.get(
  '/:id',
  validate({ params: idParamSchema }),
  appointmentController.getAppointmentById,
);

router.put(
  '/:id/cancel',
  authorize('PATIENT', 'ADMIN'),
  validate({ params: idParamSchema }),
  appointmentController.cancelAppointment,
);

export default router;