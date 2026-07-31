import rateLimit from 'express-rate-limit';

/**
 * ============================================================================
 * Authentication Rate Limiter
 * ============================================================================
 * Protects authentication endpoints from brute-force attacks.
 *
 * Used for:
 * - Register
 * - Login
 *
 * Limit: 10 requests per 15 minutes per IP
 * ============================================================================
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
  },
});

/**
 * ============================================================================
 * Password Recovery Rate Limiter
 * ============================================================================
 * Protects password recovery endpoints from abuse.
 *
 * Used for:
 * - Forgot Password
 * - Reset Password
 *
 * Limit: 5 requests per 15 minutes per IP
 * ============================================================================
 */
export const passwordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: 'Too many password reset attempts. Please try again later.',
  },
});

/**
 * ============================================================================
 * Refresh Token Rate Limiter
 * ============================================================================
 * Protects refresh token endpoint from abuse.
 *
 * Used for:
 * - Refresh Token
 *
 * Limit: 30 requests per 15 minutes per IP
 * ============================================================================
 */
export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: 'Too many refresh requests. Please try again later.',
  },
});

/**
 * ============================================================================
 * Email Verification Rate Limiter
 * ============================================================================
 * Protects email verification endpoints.
 *
 * Used for:
 * - Send Verification Email
 * - Verify Email OTP
 *
 * Limit: 5 requests per 15 minutes per IP
 * ============================================================================
 */
export const verificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: 'Too many verification requests. Please try again later.',
  },
});
