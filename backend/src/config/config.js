import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DB_URI: process.env.DB_URI,

  // token
  ACCESS_TOKEN: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN_SECRET,

  // email
  RESEND_API_KEY: process.env.RESEND_API_KEY,

  GOOGLE_APP_PASSWORD: process.env.GOOGLE_APP_PASSWORD,
  EMAIL_USER: process.env.EMAIL_USER,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_URL: process.env.GOOGLE_CLIENT_URL,

  // cloud storage
  IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
  IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
  IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
};

export default config;
