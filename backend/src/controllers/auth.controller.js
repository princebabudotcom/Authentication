import config from '../config/config.js';
import authService from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';

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

  res.status(200).json(user);
});

export default {
  register,
  refreshToken,
  getMe,
};
