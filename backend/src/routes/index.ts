import { Router } from 'express';
import authRoutes from './auth.routes.js';
import patientRoutes from './patient.routes.js';
import doctorRoutes from './doctor.routes.js';
import departmentRoutes from './department.routes.js';
import appointmentRoutes from './appointment.routes.js';
import paymentRoutes from './payment.routes.js';
import queueRoutes from './queue.routes.js';
import notificationRoutes from './notification.routes.js';
import doctorLeaveRoutes from './doctorLeave.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/doctors', doctorRoutes);
router.use('/departments', departmentRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/payments', paymentRoutes);
router.use('/queue', queueRoutes);
router.use('/notifications', notificationRoutes);
router.use('/doctor-leaves', doctorLeaveRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
