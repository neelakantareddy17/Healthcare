import { Router } from 'express';
import * as notificationController from '../controllers/notification.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { idParamSchema } from '../validators/department.validator.js';

const router = Router();

router.use(authenticate);

router.get('/', notificationController.getMyNotifications);
router.put('/:id/read', validate({ params: idParamSchema }), notificationController.markAsRead);
router.delete('/:id', validate({ params: idParamSchema }), notificationController.deleteNotification);

export default router;
