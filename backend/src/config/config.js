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
};

export default config;
