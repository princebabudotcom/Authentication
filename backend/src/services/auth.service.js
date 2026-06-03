import config from '../config/config.js';
import sessionRepo from '../repos/session.repo.js';
import userRepo from '../repos/user.repo.js';
import ApiError from '../utils/apiError.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import sendEmail from '../utils/sendEmail.js';
import LoginAlert from '../emails/templates/loginAlert.email.js';
import logger from '../config/winston.logger.js';
import welcomeTemplate from '../emails/templates/register.email.js';
import generateCode from '../utils/generate.Code.js';
import verifyEmailTemplate from '../emails/templates/verify.email.js';
import User from '../models/user.model.js';
import emailVerifiedTemplate from '../emails/templates/emailVerified.email.js';
import { passwordResetEmailTemplate } from '../emails/templates/forgot.Password.email.js';

/**
 * Phase 1
 */

const register = async (userData, ip, agent) => {
  if (!userData.email || !userData.password || !userData.username || !userData.fullName) {
    throw new Error('Missing required fields');
  }

  // Destructure user data for easier access
  const { email, username, fullName, password } = userData;

  // Check if a user with the same email or username already exists
  const existUser = await userRepo.isUserExists(email, username);

  // If a user with the same email or username exists, throw an error
  if (existUser) throw new ApiError(400, 'Email or username already exists');

  // create new user
  const user = await userRepo.createUser(userData);

  // Generate access token and refresh token for the new user
  const refreshToken = user.generateRefreshToken();

  const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

  const accessToken = user.generateAccessToken();

  // Create a new session for the user with the hashed refresh token, IP address, and user agent
  await sessionRepo.createSession(user._id, hashedRefreshToken, ip, agent);

  // send email user is register successfully
  sendEmail({
    subject: 'User account register sucessfully',
    to: user.email,
    html: welcomeTemplate({
      name: user.fullName,
      loginUrl: 'https://gradebuilds.in',
    }),
  }).catch((err) => {
    logger.error(`Error on sending email ${err}`);
  });

  const userJson = user.toJSON();

  // Return the access token, refresh token, and user data
  return { accessToken, refreshToken, user: userJson };
};

const login = async (identifier, password, ip, agent) => {
  if (!identifier || !password) throw new ApiError(400, 'User credential is required');

  // Find the user by email or username
  const user = await userRepo.getUser(identifier);

  if (!user) throw new ApiError(401, 'Invalid credentials');

  // check is user locked

  if (user.isLocked)
    throw new ApiError(
      403,
      'Account is locked due to multiple failed login attempts. Please try again later.'
    );

  // Prevent user enumeration
  if (!(await user.comparePassword(password))) {
    user.loginAttempts += 1; // Increment login attempts on failed login

    if (user.loginAttempts >= 5) {
      user.lockUntil = Date.now() + 30 * 60 * 1000; // Lock account for 30 minutes
    }

    await user.save();

    throw new ApiError(401, 'Invalid credentials');
  }

  // Generate access token and refresh token for the user

  const refreshToken = user.generateRefreshToken();

  // hashed token to store in session
  const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

  // Create a new session for the user with the hashed refresh token, IP address, and user agent

  await Promise.all([
    // create session with hashed refresh token to prevent token theft from database
    sessionRepo.createSession(user._id, hashedRefreshToken, ip, agent),
    // Reset login attempts and lock status on successful login
    userRepo.updateUser(user._id, {
      lastlogin: new Date(),
      lockUntil: undefined,
      loginAttempts: 0, // Reset login attempts on successful login
    }),
  ]);

  // sending login alert email to user user .catch for for send
  sendEmail({
    to: user.email,
    subject: 'New Login Alert',
    html: LoginAlert({
      fullName: user.fullName,
      ip,
      agent,
      loginTime: new Date().toLocaleString(),
      email: user.email,
    }),
  }).catch((error) => {
    logger.error('Failed to send login alert email:', error);
  });

  const accessToken = user.generateAccessToken();

  const userJson = user.toJSON();

  return {
    user: userJson,
    accessToken,
    refreshToken,
  };
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
  const newAccessToken = user.generateAccessToken();
  const newRefreshToken = user.generateRefreshToken();

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
    logger.error(`Failed to fetch data ${error}`);
    throw new ApiError(500, 'Failed to retrieve user data' + error);
  }
};

const logout = async (refreshToken) => {
  if (!refreshToken) throw new ApiError(400, 'Refresh token is required for logout');

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, config.REFRESH_TOKEN);
  } catch (error) {
    if (error instanceof JsonWebTokenError) throw new ApiError(401, 'Invalid refresh token');
    throw new ApiError(500, 'Failed to verify refresh token');

    if (!decoded || !decoded.id) throw new ApiError(401, 'Invalid refresh token payload');
  }

  const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  const session = await sessionRepo.findSession(refreshTokenHash);

  if (!session) throw new ApiError(404, 'Session not found');

  session.isRevoked = true;
  session.revokedAt = new Date();
  await session.save();

  return true;
};

/**
 * Phase 2
 */

const sendEmailVarification = async ({ email, userId }) => {
  const user = await userRepo.findUserByEmail(email);

  if (!user) throw new ApiError(404, 'Email not found ');

  // if already verified

  if (user.isEmailVerified) throw new ApiError(400, 'Email already verified');

  // cooldown check
  if (
    user.emailVerificationSentAt &&
    Date.now() - new Date(user.emailVerificationSentAt).getTime() < 2 * 60 * 1000
  )
    throw new ApiError(429, 'Please wait 2 minutes before requesting another OTP');

  // max resend attempts

  if (user.emailVerificationAttempts >= 5)
    throw new ApiError(429, 'Maximum resend attempts exceeded');

  // generate opt
  const OTP = generateCode.generateOTP();

  //  hashed otp
  const hashedOTP = generateCode.generateHash(OTP);

  // updated user email verification token
  await userRepo.updateUser(userId, {
    emailVerificationToken: hashedOTP,
    emailVerificationExpires: new Date(Date.now() + 5 * 60 * 1000),
    emailVerificationSentAt: new Date(),
    $inc: { emailVerificationAttempts: 1 },
  });

  sendEmail({
    to: email,
    subject: 'Verify Your Email Address',
    html: verifyEmailTemplate({
      fullName: user?.fullName,
      otp: OTP,
    }),
  }).catch((err) => {
    throw new ApiError('Error on sending email OTP');
    logger.error(`Error on sending email OTP ${err} `);
  });

  return {
    success: true,
    message: 'OTP send sucessfully to email',
  };
};

const verifyEmail = async ({ otp, email, userId }) => {
  if (!otp) throw new ApiError(404, 'OTP is required to verify email');

  const user = await userRepo.findUserByEmail(email);

  if (!user) throw new ApiError(404, 'User not found with this email');

  const hashedOTP = generateCode.generateHash(otp);

  if (user.emailVerificationToken !== hashedOTP.toString())
    throw new ApiError(400, 'Invalid OTP please enter correct OTP ');

  if (user.emailVerificationExpires < Date.now()) throw new ApiError(400, 'OTP expired');

  await userRepo.updateUser(userId, {
    isEmailVerified: true,
    $unset: {
      emailVerificationToken: 1,
      emailVerificationExpires: 1,
      emailVerificationSentAt: 1,
      emailVerificationAttempts: 0,
    },
  });

  sendEmail({
    to: email,
    subject: 'Email verified',
    html: emailVerifiedTemplate({ fullName: user?.fullName }),
  }).catch((err) => {
    throw new ApiError(400, 'Email sending error');
  });

  return {
    success: true,
    message: `${user.fullName} your Email is verified succefully`,
  };
};

const forgotPasswordToken = async ({ email }) => {
  if (!email) throw new ApiError(404, 'Email is required to forgot password');

  // find user
  const user = await userRepo.findUserByEmail(email);

  /*
   * add cooldown time and limting
   * add limter to send email
   */

  // if user not found
  if (!user) throw new ApiError(404, 'USer not found with this email');

  // cooldown timer
  if (
    user.passwordResetRequestAt &&
    Date.now() - new Date(user.passwordResetRequestAt).getTime() < 2 * 60 * 1000
  )
    throw new ApiError(429, 'Please wait 2 minutes before requesting another password reset');

  // genereate tokens

  const token = generateCode.generateRandomToken();

  const hasedToken = generateCode.generateHash(token);

  await userRepo.updateUser(user._id, {
    passwordResetToken: hasedToken,
    passwordResetExpires: Date.now() + 5 * 60 * 1000,
    passwordResetRequestAt: new Date(),
  });

  // send email
  const { subject, html } = passwordResetEmailTemplate({
    fullName: user.fullName,
    resetPasswordLink: `https//localhost:5173/forgot-password?${token}`,
    appName: 'Authenticate App',
    expiryTime: '5 minutes',
  });

  sendEmail({
    to: user.email,
    subject,
    html,
  }).catch((err) => {
    throw new ApiError(400, 'Something went wrong on email send');
  });

  return {
    success: true,
    message: `Password reset link sent on ${user?.email} at ${new Date()}`,
    token,
  };
};

const resetPasswordByEmailLink = async ({ email, token, password }) => {
  if (!token || !email || !password) throw new ApiError(400, 'Required credentials');

  // hased Token
  const hasedToken = generateCode.generateHash(token);

  //find by email, hasedToken and expiryAT
  const user = await userRepo.findByPasswordToken(email, hasedToken);

  // is user not found
  if (!user) throw new ApiError(400, 'Invalid Token or expiry password reset link');

  if (!user.password)
    throw new ApiError(
      400,
      'Please set password for this account because it is register with google or github'
    );

  // chech if password same
  if (await user.comparePassword(password))
    throw new ApiError(403, 'Please set a different password from the old one');

  // update user data
  user.password = password;
  user.passwordChangedAt = new Date();

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetRequestAt = undefined;

  await user.save();

  return {
    success: true,
    message: `${user.fullName} has password changed at ${new Date()}`,
  };
};

const googleCallback = async (req) => {
  const user = req.user;

  const refreshToken = user.generateRefreshToken();

  const hashedRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

  const accessToken = user.generateAccessToken();

  // create session with hashed refresh token to prevent token theft from database
  await sessionRepo.createSession(user._id, hashedRefreshToken, req.ip, req.headers['user-agent']);

  return {
    accessToken,
    refreshToken,
    user: user.toJSON(),
  };
};

export default {
  register,
  login,
  refreshToken,
  getMe,
  logout,

  // phase 2 => verify email
  sendEmailVarification,
  verifyEmail,

  // phase 3 => recovery password
  forgotPasswordToken,
  resetPasswordByEmailLink,

  googleCallback,
};
