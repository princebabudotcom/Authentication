import { z } from 'zod';

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name cannot exceed 50 characters')
    .optional(),

  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username cannot exceed 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers and underscores')
    .optional(),

  isPrivate: z.boolean().optional(),
});

/*
|--------------------------------------------------------------------------
| Transfer Email
|--------------------------------------------------------------------------
*/

export const transferEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid email address'),
});

/*
|--------------------------------------------------------------------------
| Delete Account - Send Code
|--------------------------------------------------------------------------
*/

export const deleteAccountSendCodeSchema = z.object({});

/*
|--------------------------------------------------------------------------
| Delete Account - Verify Code
|--------------------------------------------------------------------------
*/

export const deleteAccountVerifyCodeSchema = z.object({
  otp: z
    .string()
    .trim()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Current password is required'),

    newPassword: z.string().min(8, 'New password must be at least 8 characters').max(100),

    confirmPassword: z.string().min(8, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

/*
|--------------------------------------------------------------------------
| Logout Device
|--------------------------------------------------------------------------
*/

export const logoutDeviceParamsSchema = z.object({
  id: z.string().length(24, 'Invalid session id'),
});

/*
|--------------------------------------------------------------------------
| Logout All Devices
|--------------------------------------------------------------------------
*/

export const logoutAllSchema = z.object({});

/*
|--------------------------------------------------------------------------
| OAuth Set Password
|--------------------------------------------------------------------------
*/

export const setPasswordSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters').max(100),

    confirmPassword: z.string().min(8, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

/*
|--------------------------------------------------------------------------
| OAuth Providers
|--------------------------------------------------------------------------
*/

export const oauthProvidersSchema = z.object({});
