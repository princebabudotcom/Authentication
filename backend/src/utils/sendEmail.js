import config from '../config/config.js';
import transporter from '../config/email.config.js';
import logger from '../config/winston.logger.js';

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Authentication App" <${config.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      html, // html body
    });

    logger.info(`Email sent to ${to}: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error(`Failed to send email to ${to}: ${error.message}`);
    throw new Error('Failed to send email: ' + error.message);
  }
};

export default sendEmail;
