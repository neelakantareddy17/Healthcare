import { Router } from 'express';
import * as doctorController from '../controllers/doctor.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createDoctorSchema, updateDoctorSchema } from '../validators/doctor.validator.js';
import { idParamSchema } from '../validators/department.validator.js';

const router = Router();

router.get('/', doctorController.getAllDoctors);
router.get('/:id', validate({ params: idParamSchema }), doctorController.getDoctorById);

// Only ADMIN can create doctor accounts. Doctors cannot self-register.
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate({ body: createDoctorSchema }),
  doctorController.createDoctor,
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: idParamSchema, body: updateDoctorSchema }),
  doctorController.updateDoctor,
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: idParamSchema }),
  doctorController.deleteDoctor,
);

export default router;
