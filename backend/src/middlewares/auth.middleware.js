import config from '../config/config.js';
import sessionRepo from '../repos/session.repo.js';
import authService from '../services/auth.service.js';
import userService from '../services/user.service.js';
import ApiError from '../utils/apiError.js';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(new ApiError(401, 'Not authorized, no token'));
    }

    const decoded = jwt.verify(token, config.ACCESS_TOKEN);

    const user = await authService.getMe(decoded.id);
    const session = await userService.getCurrentSession(decoded.sessionId);

    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    if (!session) return next(new ApiError(401, 'Session has been revoked, please login again'));

    if (user.isDeleted) {
      return next(
        new ApiError(
          403,
          'Your account has been deleted. Please contact support if you believe this is a mistake.'
        )
      );
    }

    req.user = user;
    req.session = session;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Token expired'));
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, 'Invalid token'));
    }

    next(error);
  }
};

export const socketAuth = async (socket, next) => {
  try {
    let token;
    if (socket.handshake?.headers?.cookie) {
      token = cookie.parse(socket.handshake.headers?.cookie).accessToken || ' ';
    } else if (socket.handshake.headers?.authorization?.startsWith('Bearer ')) {
      token = socket.handshake.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return next(new Error('Not authorized, no token'));
    }
    const decoded = jwt.verify(token, config.ACCESS_TOKEN);
    const user = await authService.getMe(decoded.id);
    const session = await userService.getCurrentSession(decoded.sessionId);
    if (!user) {
      return next(new Error('User not found'));
    }
    if (!session) {
      return next(new Error('Session has been revoked, please login again'));
    }
    if (user.isDeleted) {
      return next(
        new Error(
          'Your account has been deleted. Please contact support if you believe this is a mistake.'
        )
      );
    }
    socket.user = user;
    socket.session = session;
    next();
  } catch (error) {
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
      return next(new ApiError(403, 'Forbidden'));
    }

    next();
  };
};

export default protect;
