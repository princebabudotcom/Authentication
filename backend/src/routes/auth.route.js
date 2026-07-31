import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import protect from '../middlewares/auth.middleware.js';
import passport from 'passport';
import {
  authLimiter,
  passwordLimiter,
  refreshLimiter,
  verificationLimiter,
} from '../rateLimit/auth.limtter.js';
import { validate } from '../middlewares/validate.middleware.js';

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  sendVerificationSchema,
} from '../validation/auth.validation.js';

const router = Router();

/**
 * /api/v1/auth/register
 * Register user and create session with refresh token and access token
 */

router.route('/register').post(authLimiter, validate(registerSchema), authController.register);

/**
 * /api/v1/auth/login
 * Login user and create session with refresh and access token
 */

router.route('/login').post(authLimiter, validate(loginSchema), authController.login);

/**
 * /api/v1/auth/me
 * Get current logged in user data
 */

router.route('/me').get(protect, authController.getMe);

/**
 * /api/v1/auth/refresh
 * Create refresh token and access
 */

router.route('/refresh').get(refreshLimiter, authController.refreshToken);

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
 * /api/v1/auth/send-verification-email
 */

router
  .route('/send-verification-email')
  .post(
    verificationLimiter,
    protect,
    validate(sendVerificationSchema),
    authController.sendVerifyEmailOtp
  );

/**
 * /api/v1/auth/verify-email
 */

router
  .route('/verify-email')
  .post(verificationLimiter, protect, validate(verifyEmailSchema), authController.verifyEmail);

/**
 * /api/v1/auth/forgot-password
 * Reset password using email link
 */

router
  .route('/forgot-password')
  .post(passwordLimiter, validate(forgotPasswordSchema), authController.forgotPassword);

/**
 * /api/v1/auth/reset-password
 * Reset password
 */

router
  .route('/reset-password')
  .post(passwordLimiter, validate(resetPasswordSchema), authController.resetPassword);

/**
 * /api/v1/auth/google
 */

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
);

/*
 * /api/v1/auth/google/callback
 */

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  authController.googleCallback
);

router.route('/login/alert').post(protect, authController.testAlert);

export default router;
