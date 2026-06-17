import cloudinary from '../config/cloudinary.js';
import uploadFile from '../config/cloudinary.js';
import logger from '../config/winston.logger.js';
import userRepo from '../repos/user.repo.js';
import ApiError from '../utils/apiError.js';

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

export default {
  getMe,
  updateProfile,
  updateAvatar,
};
