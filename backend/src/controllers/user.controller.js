import userService from '../services/user.service.js';
import asyncHandler from '../utils/asyncHandler.js';

const getMe = asyncHandler(async (req, res) => {
  const { user } = await userService.getMe(req.user._id);

  res.status(200).json(user);
});

/*
 * PATCH /api/v1/users/profile
 * Update Profile -> fullName and username
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { success, message } = await userService.updateProfile(req.body, req.user._id);

  res.status(200).json({
    success,
    message,
  });
});

/*
 * PATCH /api/v1/users/profile/avatar
 * Update Profile picture
 */

const updateAvatar = asyncHandler(async (req, res) => {
  const { success, message, data } = await userService.updateAvatar(req.user._id, req.file);

  res.status(200).json({
    success,
    message,
    data,
  });
});

export default {
  getMe,
  updateProfile,
  updateAvatar,
};
