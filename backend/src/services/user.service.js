import { email } from 'zod';
import cloudinary from '../config/cloudinary.js';
import uploadFile from '../config/cloudinary.js';
import logger from '../config/winston.logger.js';
import {
  accountDeletedTemplate,
  deleteAccountOtpTemplate,
} from '../emails/templates/deleteAccount.email.js';
import userRepo from '../repos/user.repo.js';
import ApiError from '../utils/apiError.js';
import generateCode from '../utils/generate.Code.js';
import sendEmail from '../utils/sendEmail.js';
import sessionRepo from '../repos/session.repo.js';
import { passwordChangedEmailTemplate } from '../emails/templates/forgot.Password.email.js';

import { UAParser } from 'ua-parser-js';

const getMe = async (userId) => {
  const user = await userRepo.findUserById(userId);

  if (!user) throw new ApiError(404, 'User not found ');

  const { fullName, email, avatar, username } = user;

  return {
    user: user.toJSON(),
  };
};

const updateProfile = async (userData, userId) => {
  // only these feilds are update this route
  const selectedFeilds = ['fullName', 'username'];

  // prevent updating password directly
  if (userData.password) throw new ApiError(400, "Password can't updated directly");

  // find user
  const user = await userRepo.findUserById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  if (userData.username) {
    userData.username = userData.username.trim();

    if (!userData.username) {
      throw new ApiError(400, 'Username cannot be empty');
    }

    if (userData.username === user.username) {
      throw new ApiError(400, 'Please use a different username');
    }

    // check username is exist or not
    const existingUser = await userRepo.findUserByUsername(userData.username);

    // check username same or not
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      throw new ApiError(409, 'Username already exists');
    }
  }

  // maping keys to save userdata
  Object.keys(userData).forEach((key) => {
    if (selectedFeilds.includes(key)) {
      user[key] = userData[key];
    }
  });

  await user.save();
  user.password = undefined;

  return {
    success: true,
    message: `Profile updated successfully`,
  };
};

const updateAvatar = async (userId, file) => {
  // find user

  const user = await userRepo.findUserById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const oldAvatar = user?.avatar ? { ...user.avatar } : null;
  let response;

  try {
    if (file) {
      response = await cloudinary.uploadFile(file.buffer, Date.now());
    }
  } catch (error) {
    throw new ApiError(400, 'failed to upload avatar');
  }

  if (!response || !response.url || !response.fileId)
    throw new ApiError(500, 'Avatar upload failed, please try again');

  user.avatar.url = response.url;
  user.avatar.fileId = response.fileId;
  await user.save();

  if (oldAvatar?.fileId && oldAvatar?.fileId !== response.fileId) {
    cloudinary.deleteFile(oldAvatar?.fileId).catch((error) => {
      logger.error('Failed to delete old avatar file:', error);
    });
  }

  return {
    success: true,
    message: `${user.fullName} your profile picture updated successfully .`,
    data: {
      avatar: user.avatar.url,
    },
  };
};

const chnageEmail = async (userId, email) => {};

const OTP_RESEND_COOLDOWN_MS = 2 * 60 * 1000;
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const MAX_RESEND_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 60 * 60 * 1000;

const deleteAccountSendCode = async (email) => {
  const user = await userRepo.findUserByEmail(email);
  if (!user) throw new ApiError(404, 'User not found');

  if (user.isDeleted) throw new ApiError(400, 'Account already deleted');

  const sentAt = user.emailVerificationSentAt
    ? new Date(user.emailVerificationSentAt).getTime()
    : null;

  if (sentAt && Date.now() - sentAt < OTP_RESEND_COOLDOWN_MS) {
    throw new ApiError(429, 'Please wait 2 minutes before requesting another OTP');
  }

  const attemptsExpired = !sentAt || Date.now() - sentAt > ATTEMPT_WINDOW_MS;
  if (!attemptsExpired && user.emailVerificationAttempts >= MAX_RESEND_ATTEMPTS) {
    throw new ApiError(429, 'Maximum resend attempts exceeded, try again later');
  }

  const otp = generateCode.generateOTP();
  const otpHash = generateCode.generateHash(otp);

  await userRepo.updateUser(user._id, {
    $set: {
      emailVerificationToken: otpHash,
      emailVerificationExpires: new Date(Date.now() + OTP_EXPIRY_MS),
      emailVerificationSentAt: new Date(),
    },
    $inc: { emailVerificationAttempts: 1 },
  });

  const { html, subject } = deleteAccountOtpTemplate(user.fullName, otp);

  sendEmail({ to: user.email, html, subject }).catch((err) => {
    logger.error('Failed to send delete account OTP email', err);
  });

  return {
    success: true,
    message: `${user.fullName}, check your email to delete your account.`,
  };
};

const deleteAccountVerifyCode = async (email, otp) => {
  if (!otp || !email) throw new ApiError(400, 'Email and OTP are required');

  const otpHash = generateCode.generateHash(otp);
  const user = await userRepo.checkEmailToken(email, otpHash);
  if (!user) throw new ApiError(400, 'OTP expired or invalid');

  await userRepo.updateUser(user._id, {
    $set: {
      isDeleted: true,
      isActive: false,
      deletedAt: new Date(),
      emailVerificationAttempts: 0,
    },
    $unset: {
      emailVerificationSentAt: 1,
      emailVerificationToken: 1,
      emailVerificationExpires: 1,
    },
  });

  const { html, subject } = accountDeletedTemplate(user.fullName, email, new Date());

  sendEmail({ to: user.email, html, subject }).catch((err) => {
    logger.error('Failed to send account-deleted confirmation email', err);
  });

  return {
    success: true,
    message: 'Your account has been deleted successfully.',
  };
};

const getCurrentSession = async (sessionId) => {
  if (!sessionId) throw new ApiError(404, 'SessionId not found');

  const session = await sessionRepo.findSeesionById(sessionId);

  return session;
};

const changePassword = async (userId, oldPassword, newPassword, confirmPassword, sessionId) => {
  if (!oldPassword || !newPassword || !confirmPassword)
    throw new ApiError(404, 'All fields are required');

  if (confirmPassword !== newPassword)
    throw new ApiError(400, 'New Password and confirm Password do not match ');

  const user = await userRepo.findUserById(userId);
  if (!user) throw new ApiError(400, 'User not found');

  // check old password is correct
  const isMatchPassword = await user.comparePassword(oldPassword);
  if (!isMatchPassword) throw new ApiError(401, 'Current Password is incorrect');

  // check old or new password
  const isSamepassword = await user.comparePassword(newPassword);
  if (isSamepassword) throw new ApiError(400, 'New password must be different from Old Password');

  //update user
  user.password = newPassword;
  user.passwordChangedAt = new Date();

  await user.save(); // save user
  user.password = undefined;

  // delete all sessions except self
  await sessionRepo.deleteAllSessions(sessionId, userId);

  // send mail after change password
  const { html, subject } = passwordChangedEmailTemplate(user.fullName);
  sendEmail({
    html,
    subject,
    to: user?.email,
  }).catch((err) => {
    logger.error('Error on sending change password email', err);
  });

  return {
    success: true,
    message: `${user.fullName} your account password changed successfully`,
  };
};

// phase 3

const loginHistory = async (userId) => {
  if (!userId) throw new ApiError(404, 'User id is required');

  const sessions = await sessionRepo.findAllSessions(userId).sort({ createdAt: -1 });

  if (!sessions) throw new ApiError(404, 'No sessions found');

  return {
    success: true,
    history: sessions,
    message: `Login history detected`,
  };
};

const logoutDevice = async (userId, sessionId, currentSessionId) => {
  if (!userId || !sessionId) {
    throw new ApiError(400, 'UserId and sessionId are required');
  }

  if (sessionId === currentSessionId.toString()) {
    throw new ApiError(400, 'Cannot logout current device — use the regular logout instead');
  }

  const session = await sessionRepo.findSessionById(sessionId);
  if (!session) throw new ApiError(404, 'Session not found');

  if (session.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'You are not authorized to log out this device');
  }

  if (session.isRevoked) {
    throw new ApiError(400, 'This session is already logged out');
  }

  await session.revoke('Logged out by user');

  return {
    success: true,
    message: 'Device logged out successfully',
  };
};

const logoutAllDevice = async (userId, sessionId) => {
  if (!userId || !sessionId) throw new ApiError(404, 'UserId and SessionId is required');

  await sessionRepo.revokeAllSessions(userId, sessionId);

  return {
    success: true,
    message: "All Device's Logout successfully",
  };
};

export default {
  getMe,
  updateProfile,
  updateAvatar,
  chnageEmail,
  deleteAccountSendCode,
  deleteAccountVerifyCode,
  getCurrentSession,
  changePassword,
  loginHistory,
  logoutDevice,
  logoutAllDevice,
};
