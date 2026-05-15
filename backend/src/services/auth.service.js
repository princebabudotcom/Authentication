import sessionRepo from '../repos/session.repo.js';
import userRepo from '../repos/user.repo.js';
import ApiError from '../utils/apiError.js';
import crypto from 'crypto';

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
  getMe,
};
