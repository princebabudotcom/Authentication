import mongoose from 'mongoose';
import logger from './winston.logger.js';

const connectDB = (dburl) => {
  mongoose
    .connect(dburl, {
      maxPoolSize: 10,
    })
    .then(() => {
      logger.info('Mongodb is connected sucessfully');
    })
    .catch((err) => {
      logger.error(`Error on connecting : ${err} `);
      process.exit(1); // Exit the process with failure code
    });
};

export default connectDB;
