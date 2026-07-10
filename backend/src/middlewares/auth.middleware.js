import config from '../config/config.js';
import sessionRepo from '../repos/session.repo.js';
import authService from '../services/auth.service.js';
import userService from '../services/user.service.js';
import ApiError from '../utils/apiError.js';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import logger from '../config/winston.logger.js';

const protect = async (req, res, next) => {
  try {
    logger.info('========== AUTH MIDDLEWARE ==========');

    let token;

    logger.info(`Cookies: ${JSON.stringify(req.cookies)}`);
    logger.info(`Authorization Header: ${req.headers.authorization || 'Not Present'}`);

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
      logger.info('Using Bearer Token');
    } else if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
      logger.info('Using Cookie Token');
    }

    if (!token) {
      logger.error('No Access Token Found');
      return next(new ApiError(401, 'Not authorized, no token'));
    }

    logger.info(`Token: ${token}`);

    const decoded = jwt.verify(token, config.ACCESS_TOKEN);

    logger.info(`Decoded Token: ${JSON.stringify(decoded)}`);

    const user = await authService.getMe(decoded.id);

    if (!user) {
      logger.error(`User Not Found: ${decoded.id}`);
      return next(new ApiError(404, 'User not found'));
    }

    logger.info(`User Found: ${user.email}`);

    const session = await userService.getCurrentSession(decoded.sessionId);

    if (!session) {
      logger.error(`Session Not Found: ${decoded.sessionId}`);
      return next(new ApiError(401, 'Session has been revoked, please login again'));
    }

    logger.info(`Session Found: ${session._id}`);

    if (user.isDeleted) {
      logger.error(`Deleted User: ${user.email}`);
      return next(new ApiError(403, 'Your account has been deleted. Please contact support.'));
    }

    req.user = user;
    req.session = session;

    logger.info('Authentication Successful');
    logger.info('====================================');

    next();
  } catch (error) {
    logger.error('AUTH ERROR');
    logger.error(error);

    if (error instanceof jwt.TokenExpiredError) {
      logger.error('Access Token Expired');
      return next(new ApiError(401, 'Token expired'));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      logger.error('Invalid JWT Token');
      return next(new ApiError(401, 'Invalid token'));
    }

    next(error);
  }
};

export const socketAuth = async (socket, next) => {
  try {
    logger.info('========== SOCKET AUTH ==========');

    let token;

    if (socket.handshake?.headers?.cookie) {
      token = cookie.parse(socket.handshake.headers.cookie).accessToken;
      logger.info('Socket Cookie Token Found');
    } else if (socket.handshake.headers?.authorization?.startsWith('Bearer ')) {
      token = socket.handshake.headers.authorization.split(' ')[1];
      logger.info('Socket Bearer Token Found');
    }

    if (!token) {
      logger.error('Socket Token Missing');
      return next(new Error('Not authorized, no token'));
    }

    logger.info(`Socket Token: ${token}`);

    const decoded = jwt.verify(token, config.ACCESS_TOKEN);

    logger.info(`Decoded Socket Token: ${JSON.stringify(decoded)}`);

    const user = await authService.getMe(decoded.id);

    if (!user) {
      logger.error('Socket User Not Found');
      return next(new Error('User not found'));
    }

    const session = await userService.getCurrentSession(decoded.sessionId);

    if (!session) {
      logger.error('Socket Session Not Found');
      return next(new Error('Session has been revoked'));
    }

    socket.user = user;
    socket.session = session;

    logger.info('Socket Authentication Successful');

    next();
  } catch (error) {
    logger.error(error);

    if (error instanceof jwt.TokenExpiredError) {
      return next(new Error('Token expired'));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new Error('Invalid token'));
    }

    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.error(`Authorization Failed. Required: ${roles.join(', ')}, User: ${req.user.role}`);
      return next(new ApiError(403, 'Forbidden'));
    }

    logger.info(`Authorization Successful for ${req.user.email}`);

    next();
  };
};

export default protect;
