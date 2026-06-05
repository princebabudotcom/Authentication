import config from '../config/config.js';
import authService from '../services/auth.service.js';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Phase 1
 * Basic Authentication
 */

/**
 * /api/v1/auth/register
 * Register user and create session with refresh token and access token
 */

const register = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.register(
    req.body,
    req.ip,
    req.headers['user-agent']
  );

  if (!accessToken || !refreshToken || !user) {
    return res.status(500).json({ message: 'Registration failed' });
  }

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.status(201).json({
    user,
  });
});

/**
 * /api/v1/auth/login
 * Login user and create session with refresh token and access token
 */

const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;
  const { accessToken, refreshToken, user } = await authService.login(
    identifier,
    password,
    req.ip,
    req.headers['user-agent']
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.status(200).json(user);
});

/**
 * /api/v1/auth/refresh
 * Create refresh token and access
 */

const refreshToken = asyncHandler(async (req, res) => {
  // call refreshToken service
  const { accessToken, refreshToken } = await authService.refreshToken(
    req.cookies.refreshToken,
    req.ip,
    req.headers['user-agent']
  );

  // set new refresh token and access token in httpOnly cookies
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // set new access token in httpOnly cookie with 15 minutes expiration
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.status(200).json({
    accessToken,
    refreshToken,
  });
});

/**
 * /api/v1/auth/me
 * Get current logged in user data
 */

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json({
    user,
  });
});

/**
 * /api/v1/auth/logout
 * Logout user and clear refresh token and access token cookies
 */

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  await authService.logout(refreshToken);

  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');

  res.status(200).json({ message: 'Logged out successfully' });
});

/**
 * Phase 2
 * Email Verification
 */

/**
 * /api/v1/auth/verfiy-email
 *
 */

const sendVerifyEmailOtp = asyncHandler(async (req, res) => {
  const { success, message } = await authService.sendEmailVarification({
    email: req.user?.email,
    userId: req.user?._id,
  });

  res.status(200).json({
    success,
    message,
  });
});

/*
 * /api/v1/auth/verify-email
 * verify email using otp
 */

const verifyEmail = asyncHandler(async (req, res) => {
  const { success, message } = await authService.verifyEmail({
    otp: req.body?.otp,
    email: req.user?.email,
    userId: req.user?._id,
  });

  res.status(200).json({
    success,
    message,
  });
});

/*
 * phase 3
 * recover password
 */

/*
 * /api/v1/auth/forgot-password
 * Reset pasword using email link
 */

const forgotPassword = asyncHandler(async (req, res) => {
  const { success, message, token } = await authService.forgotPasswordToken({
    email: req.body?.email,
  });

  if (!success) throw new ApiError(400, 'Somwthing went wrong');

  res.status(200).json({
    success,
    message,
    token,
  });
});

/**
 * /api/v1/auth/verify-password-reset
 * Reset password
 */

const resetPassword = asyncHandler(async (req, res) => {
  const data = req.body;
  const { token } = req.query;

  if (data?.type === 'email') {
    const { success, message } = await authService.resetPasswordByEmailLink({
      email: data.email,
      token,
      password: data.password,
    });
    return res.status(200).json({
      success,
      message,
    });
  }

  throw new ApiError(400, 'Invalid reset password type');
});

// google callback handler

const googleCallback = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.googleCallback(req);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.redirect('http://localhost:5173/').status(200).json({
    success: true,
    message: 'Google authentication successful',
    user,
  });
});

export default {
  register,
  login,
  refreshToken,
  getMe,
  logout,

  // phase 2 => verfiy email
  sendVerifyEmailOtp,
  verifyEmail,

  // phase 3 => recover password
  forgotPassword,
  resetPassword,

  // google callback
  googleCallback,
};
