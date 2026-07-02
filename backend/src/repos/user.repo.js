import User from '../models/user.model.js';

const createUser = (userData) => {
  return User.create(userData);
};

const findUserByEmail = async (email) => {
  return User.findOne({ email }).select(
    '+emailVerificationSentAt +emailVerificationAttempts +emailVerificationToken +emailVerificationExpires +passwordResetRequestAt +isDeleted'
  );
};

const findUserById = (id) => {
  return User.findById(id).select('+isDeleted +password +googleId +githubId');
};

const isUserExists = (email, username) => {
  return User.exists({
    $or: [{ email }, { username }],
  });
};

const findByGoogleId = (googleId) => {
  return User.findOne({ googleId });
};

const getUser = (identifier) => {
  return User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select('+password');
};

const updateUser = (id, updateData) => {
  return User.findByIdAndUpdate(id, updateData, {
    runValidators: true,
    returnDocument: 'after',
  });
};

const verifyEmailToken = (email, hashedOTP) => {
  return User.findOne({
    email,
    emailVerificationToken: hashedOTP,
    emailVerificationExpires: {
      $gte: Date.now(),
    },
  }).select('+emailVerificationToken ' + '+emailVerificationExpires');
};

const findByPasswordToken = (email, hashedToken) => {
  return User.findOne({
    email,
    passwordResetToken: hashedToken,
    passwordResetExpires: {
      $gte: Date.now(),
    },
  }).select('+passwordResetToken +passwordResetExpires +password');
};

const findUserByUsername = (username) => {
  return User.findOne({ username });
};

const checkEmailToken = (email, otp) => {
  return User.findOne({
    email,
    emailVerificationToken: otp,
    emailVerificationExpires: {
      $gte: Date.now(),
    },
  }).select(
    '+emailVerificationSentAt +emailVerificationAttempts +emailVerificationToken +emailVerificationExpires +isDeleted +deletedAt'
  );
};

export default {
  createUser,
  updateUser,
  findUserByEmail,
  findUserById,
  isUserExists,
  getUser,
  findByPasswordToken,
  findByGoogleId,
  findUserByUsername,
  checkEmailToken,
};
