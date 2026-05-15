import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  DB_URI: process.env.DB_URI,

  // token
  ACCESS_TOKEN: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN: process.env.REFRESH_TOKEN_SECRET,
};

export default config;
