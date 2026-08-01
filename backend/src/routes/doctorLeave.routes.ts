import { Router } from 'express';
import * as leaveController from '../controllers/doctorLeave.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createLeaveSchema } from '../validators/doctorLeave.validator.js';
import { idParamSchema } from '../validators/department.validator.js';

const router = Router();

router.use(authenticate);

router.post('/', authorize('DOCTOR'), validate({ body: createLeaveSchema }), leaveController.createLeave);
router.get('/', authorize('DOCTOR', 'ADMIN'), leaveController.getLeaves);
router.get('/:id', validate({ params: idParamSchema }), leaveController.getLeaveById);
router.delete(
  '/:id',
  authorize('DOCTOR', 'ADMIN'),
  validate({ params: idParamSchema }),
  leaveController.deleteLeave,
);

export default router;
