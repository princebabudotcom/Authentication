import crypto from 'crypto';

const generateOTP = (length = 6) => {
  let otp = '';

  // First digit (1-9)
  otp += Math.floor(Math.random() * 9) + 1;

  // Remaining digits
  for (let i = 1; i < length; i++) {
    otp += Math.floor(Math.random() * 10);
  }

  return otp;
};

const generateHash = (token) => crypto.createHash('sha256').update(token).digest('hex');

const generateRandomToken = (size = 32) => crypto.randomBytes(size).toString('hex');

export default {
  generateOTP,
  generateHash,
  generateRandomToken,
};
