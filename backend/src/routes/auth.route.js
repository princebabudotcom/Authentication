import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import protect from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * /api/v1/auth/register
 * Register user and create session with refresh token and access token
 */

router.route('/register').post(authController.register);

/**
 * /api/v1/auth/login
 * Login user and create session with refresh and access token
 */

router.route('/login').post(authController.login);

/**
 * /api/v1/auth/me
 * Get current logged in user data
 */

router.route('/me').get(protect, authController.getMe);

/**
 * /api/v1/auth/refresh
 * Create refresh token and access
 */

router.route('/refresh').get(authController.refreshToken);

/**
 * /api/v1/auth/logout
 * Logout user by revoking the session and clearing cookies
 */

router.route('/logout').get(protect, authController.logout);

/**
 * Phase 2
 * Email Verification
 */

/**
 * /api/v1/auth/verify-email
 */

router.route('/send-verification-email').post(protect, authController.sendVerifyEmailOtp);

/**
 * /api/v1/auth/verify-email
 */

router.route('/verify-email').post(protect, authController.verifyEmail);

export default router;
