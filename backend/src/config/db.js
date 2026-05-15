import mongoose from 'mongoose';
import logger from './winston.logger.js';

const connectDB = (dburl) => {
  mongoose
    .connect(dburl)
    .then(() => {
      logger.info('Mongodb is connected sucessfully');
    })
    .catch((err) => {
      logger.error(`Error on connecting : ${err} `);
    });
};

export default connectDB;
