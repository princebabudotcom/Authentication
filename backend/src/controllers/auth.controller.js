import authService from '../services/auth.service.js';
import asyncHandler from '../utils/asyncHandler.js';

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
    accessToken,
    refreshToken,
    user,
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  res.status(200).json(user);
});

export default {
  register,
  getMe,
};
