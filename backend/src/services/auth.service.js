import config from '../config/config.js';
import sessionRepo from '../repos/session.repo.js';
import userRepo from '../repos/user.repo.js';
import ApiError from '../utils/apiError.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const register = async (userData, ip, agent) => {
  if (!userData.email || !userData.password || !userData.username || !userData.fullName) {
    throw new Error('Missing required fields');
  }

  const { email, username, fullName, password } = userData;

  const existUser = await userRepo.isUserExists(email, username);

  if (existUser) throw new ApiError(400, 'Email or username already exists');

  const user = await userRepo.createUser(userData);

  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

  const userJson = user.toJSON();

  await sessionRepo.createSession(user._id, hashedRefreshToken, ip, agent);

  return { accessToken, refreshToken, user: userJson };
};

const refreshToken = async (refreshToken, ip, agent) => {
  // Check if refresh token is provided
  if (!refreshToken) throw new ApiError(400, 'Refresh token is required');

  // Verify the refresh token and decode it to get the user ID
  let decoded;

  try {
    // Verify the refresh token using the same secret used to sign it
    decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN);
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  // Hash the provided refresh token to compare with stored hash
  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  // find session by refresh token hash
  const session = await sessionRepo.findSession(refreshTokenHash);

  // if session not found or expired, throw error
  if (!session) throw new ApiError(401, 'Refresh token is invalid or expired');

  // if session user id does not match decoded token user id or session is revoked, throw error
  if (!decoded || !decoded.id || decoded.id !== session.user.toString())
    throw new ApiError(401, 'Refresh token does not match session');

  // find user by session user id
  const user = await userRepo.findUserById(session.user);

  // if user not found, throw error
  if (!user) throw new ApiError(404, 'User not found');

  // create new access token and refresh token
  const newAccessToken = await user.generateAccessToken();
  const newRefreshToken = await user.generateRefreshToken();

  // hash the new refresh token and update session with new hash, ip, agent, and expiration
  const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');

  session.refreshToken = newRefreshTokenHash;
  session.ipAddress = ip;
  session.userAgent = agent;
  session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Extend session for another 7 days

  await session.save();

  // Return the new access token and refresh token
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const getMe = async (userId) => {
  try {
    const user = await userRepo.findUserById(userId);

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user.toJSON();
  } catch (error) {
    throw new ApiError(500, 'Failed to retrieve user data');
  }
};

export default {
  register,
  refreshToken,
  getMe,
};
