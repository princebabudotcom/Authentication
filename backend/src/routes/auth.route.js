import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import protect from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(authController.register);

router.route('/me').get(protect, authController.getMe);

export default router;
