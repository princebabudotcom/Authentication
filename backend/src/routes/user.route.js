import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import userController from '../controllers/user.controller.js';
import upload from '../config/multer.config.js';
const router = express.Router();

router.get('/', async (req, res) => {
  res.send(req.ip);
});

router.route('/me').get(protect, userController.getMe);

/*
 * /api/v1/users/profile/
 * update profile picture
 */
router.route('/profile').patch(protect, userController.updateProfile);

/*
 * /api/v1/users/profile/avatar
 * update profile picture
 */

router
  .route('/profile/avatar')
  .patch(protect, upload.single('avatar'), userController.updateAvatar);

/*
 * PATCH /api/v1/users/profile/trasfer-email
 * Transfer email to another account
 */

router.route('/profile/transfer-email').patch(protect, userController.changeEmail);

/*
 * DELETE /api/v1/users/account/send-code
 * Delete account
 */

router.route('/account/send-code').delete(protect, userController.deleteAccountSendCode);

/*
 * DELETE /api/v1/users/account/verify-code
 * Delete account
 */

router.route('/account/verify-code').delete(protect, userController.deleteAccountVerifyCode);

/*
 * DELETE /api/v1/users/account/change-password
 * PATCH account change password
 */

router.route('/account/change-password').patch(protect, userController.changePassword);

/*
 *  Phase 3 — User Activity System
 * Login history
 * Account activity
 * Recently used devices
 * User status
 * Online/offline tracking
 */

/*
 * GET /api/v1/users/login-history
 * Get all Sessions
 */

router.route('/account/login-history').get(protect, userController.loginHistory);

/*
 * GET /api/v1/users/account/session:id
 * Get current sessions
 */

router.route('/account/sessions/:id').delete(protect, userController.logoutDevice);

/*
 * GET /api/v1/users/account/logout-all
 * Revoke all sessions
 */

router.route('/account/logout-all').patch(protect, userController.logoutAllDevice);

/*
 * SetPassword /api/v1/users/account/set-password
 * OAuth account set password
 */

router.route('/account/set-password').patch(protect, userController.setPassword);

/*
 * check providers /api/v1/users/account/set-password
 * OAuth account providers
 */

router.route('/account/OAuth-providers').get(protect, userController.OAuthProviders);
export default router;
