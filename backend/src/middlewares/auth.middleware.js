import config from '../config/config.js';
import authService from '../services/auth.service.js';
import ApiError from '../utils/apiError.js';
import jwt from 'jsonwebtoken';

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

    if (!user) {
      return next(new ApiError(404, 'User not found'));
    }

    req.user = user;

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

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden'));
    }

    next();
  };
};

export default protect;
