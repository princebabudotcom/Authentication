import ApiError from '../utils/ApiError.js';

const errorMiddleware = (err, req, res, next) => {
  // console.error(err); // 🔥 VERY IMPORTANT

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // ✅ Handle Mongo duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field: ${Object.keys(err.keyValue).join(', ')}`;
  }

  // ✅ Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => e.message);
  }

  const response = {
    success: false,
    message,
    ...(errors.length && { errors }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack, // 👈 original error stack
    }),
  };

  res.status(statusCode).json(response);
};

export default errorMiddleware;
