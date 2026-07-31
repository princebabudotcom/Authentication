import { z } from 'zod';

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name cannot exceed 50 characters'),

  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores'),

  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password cannot exceed 100 characters'),
});

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
| Either email or username is required.
*/

export const loginSchema = z.object({
  identifier: z.string().trim().min(1, 'Email or username is required'),

  password: z.string().min(1, 'Password is required'),
});

/*
|--------------------------------------------------------------------------
| Forgot Password
|--------------------------------------------------------------------------
*/

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email'),
});

/*
|--------------------------------------------------------------------------
| Reset Password
|--------------------------------------------------------------------------
*/

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),

  password: z.string().min(8, 'Password must be at least 8 characters').max(100),
});

/*
|--------------------------------------------------------------------------
| Verify Email OTP
|--------------------------------------------------------------------------
*/

export const verifyEmailSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

/*
|--------------------------------------------------------------------------
| Send Verification Email
|--------------------------------------------------------------------------
*/

export const sendVerificationSchema = z.object({});
