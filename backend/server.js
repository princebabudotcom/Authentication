import httpServer from './src/app.js';
import config from './src/config/config.js';
import connectDB from './src/config/db.js';
import logger from './src/config/winston.logger.js';

// Handle uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  logger.error(err.stack);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
  process.exit(1);
});

// connect to database
connectDB(config.DB_URI);

const server = httpServer.listen(config.PORT, () => {
  logger.info(`Server is running on ${config.PORT}`);
  logger.debug(`Environment ${config.NODE_ENV}`);
});
