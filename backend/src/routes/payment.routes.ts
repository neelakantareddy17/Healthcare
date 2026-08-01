import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { payAppointmentSchema } from '../validators/payment.validator.js';

const router = Router();

router.use(authenticate);

// Mocked payment gateway — no real transaction occurs.
router.post(
  '/:appointmentId/pay',
  authorize('PATIENT', 'ADMIN'),
  validate({ body: payAppointmentSchema }),
  paymentController.payForAppointment,
);

router.get('/', authorize('ADMIN'), paymentController.getAllPayments);
router.get('/:id', paymentController.getPaymentById);

export default router;
