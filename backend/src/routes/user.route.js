import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import userController from '../controllers/user.controller.js';
import upload from '../config/multer.config.js';

import { userLimiter, sensitiveLimiter, uploadLimiter } from '../rateLimit/user.limtter.js';

import {
  updateProfileSchema,
  transferEmailSchema,
  deleteAccountSendCodeSchema,
  deleteAccountVerifyCodeSchema,
  changePasswordSchema,
  logoutDeviceParamsSchema,
  logoutAllSchema,
  setPasswordSchema,
} from '../validation/user.validation.js';

import { validate, validateParams } from '../middlewares/validate.middleware.js';

const router = express.Router();

/**
 * Apply default rate limit to all user routes
 */
router.use(userLimiter);

router.get('/', (req, res) => {
  res.send(req.ip);
});

router.get('/me', protect, userController.getMe);

router.patch('/profile', protect, validate(updateProfileSchema), userController.updateProfile);

router.patch(
  '/profile/avatar',
  uploadLimiter,
  protect,
  upload.single('avatar'),
  userController.updateAvatar
);

router.patch(
  '/profile/transfer-email',
  sensitiveLimiter,
  protect,
  validate(transferEmailSchema),
  userController.changeEmail
);

router.delete(
  '/account/send-code',
  sensitiveLimiter,
  protect,
  validate(deleteAccountSendCodeSchema),
  userController.deleteAccountSendCode
);

router.delete(
  '/account/verify-code',
  sensitiveLimiter,
  protect,
  validate(deleteAccountVerifyCodeSchema),
  userController.deleteAccountVerifyCode
);

router.patch(
  '/account/change-password',
  sensitiveLimiter,
  protect,
  validate(changePasswordSchema),
  userController.changePassword
);

router.get('/account/login-history', protect, userController.loginHistory);

router.delete(
  '/account/sessions/:id',
  sensitiveLimiter,
  protect,
  validateParams(logoutDeviceParamsSchema),
  userController.logoutDevice
);

router.patch(
  '/account/logout-all',
  sensitiveLimiter,
  protect,
  // validate(logoutAllSchema),
  userController.logoutAllDevice
);

router.patch(
  '/account/set-password',
  sensitiveLimiter,
  protect,
  validate(setPasswordSchema),
  userController.setPassword
);

router.get('/account/OAuth-providers', protect, userController.OAuthProviders);

export default router;
