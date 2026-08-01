import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorize } from '../middlewares/role.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/admin', authorize('ADMIN'), dashboardController.getAdminDashboard);
router.get('/doctor', authorize('DOCTOR'), dashboardController.getDoctorDashboard);
router.get('/patient', authorize('PATIENT'), dashboardController.getPatientDashboard);

export default router;
