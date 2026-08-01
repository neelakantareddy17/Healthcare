import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

// Patients can self-register. Doctors and Admins CANNOT register via this endpoint.
router.post('/register', validate({ body: registerSchema }), authController.register);
router.post('/login', validate({ body: loginSchema }), authController.login);
router.get('/me', authenticate, authController.me);

export default router;
