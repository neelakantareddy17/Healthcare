import { Router } from 'express';
import * as departmentController from '../controllers/department.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  idParamSchema,
} from '../validators/department.validator.js';

const router = Router();

router.get('/', departmentController.getAllDepartments);
router.get('/:id', validate({ params: idParamSchema }), departmentController.getDepartmentById);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate({ body: createDepartmentSchema }),
  departmentController.createDepartment,
);

router.put(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: idParamSchema, body: updateDepartmentSchema }),
  departmentController.updateDepartment,
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate({ params: idParamSchema }),
  departmentController.deleteDepartment,
);

export default router;
