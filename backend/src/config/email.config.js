import nodemailer from 'nodemailer';
import logger from './winston.logger.js';
import config from './config.js';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    pass: config.GOOGLE_APP_PASSWORD,
    user: 'testd3479@gmail.com',
  },
});

transporter.verify((error, success) => {
  if (error) {
    logger.error('Error occurred while verifying email transporter:', error);
  } else {
    logger.info('Email transporter is ready to send messages');
  }
});

export default transporter;
