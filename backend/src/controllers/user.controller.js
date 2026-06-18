import userRepo from '../repos/user.repo.js';
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

/*
 *  PATCH /api/v1/users/profile/transfer-email
 * Transfer Account
 */

const changeEmail = asyncHandler(async (req, res) => {});

/*
 * DELETE /api/v1/users/account
 * Delete account
 */

const deleteAccountSendCode = asyncHandler(async (req, res) => {
  const { success, messsage } = await userService.deleteAccountSendCode(req.user?.email);

  res.status(200).json({
    success,
    messsage,
  });
});

const deleteAccountVerifyCode = asyncHandler(async (req, res) => {
  const { success, message } = await userService.deleteAccountVerifyCode(
    req.user?.email,
    req.body.otp
  );

  res.status(200).json({
    success,
    message,
  });
});

/*
 * PATCH /api/v1/users/account/change-password
 * Change account password
 */

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const { success, message } = await userService.changePassword(
    req.user._id,
    oldPassword,
    newPassword,
    confirmPassword,
    req.session._id
  );

  res.status(200).json({
    success,
    message,
  });
});

export default {
  getMe,
  updateProfile,
  updateAvatar,
  changeEmail,
  deleteAccountSendCode,
  deleteAccountVerifyCode,
  changePassword,
};
