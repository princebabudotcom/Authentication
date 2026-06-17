import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import userController from '../controllers/user.controller.js';
import upload from '../config/multer.config.js';
const router = express.Router();

router.get('/', async (req, res) => {
  res.send(req.ip);
});

router.route('/me').get(protect, userController.getMe);

router.route('/profile').patch(protect, userController.updateProfile);

/**
 * /api/v1/users/avatar
 * update profile picture
 */

router
  .route('/profile/avatar')
  .patch(protect, upload.single('avatar'), userController.updateAvatar);

export default router;
