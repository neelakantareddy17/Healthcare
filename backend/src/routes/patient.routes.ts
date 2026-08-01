import { Router } from 'express';
import * as patientController from '../controllers/patient.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updatePatientSchema } from '../validators/patient.validator.js';
import { idParamSchema } from '../validators/department.validator.js';

const router = Router();

router.get('/', authenticate, authorize('ADMIN', 'DOCTOR'), patientController.getAllPatients);
router.get('/:id', authenticate, validate({ params: idParamSchema }), patientController.getPatientById);

router.put(
  '/:id',
  authenticate,
  validate({ params: idParamSchema, body: updatePatientSchema }),
  patientController.updatePatient,
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: idParamSchema }),
  patientController.deletePatient,
);

export default router;
