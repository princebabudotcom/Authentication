import { Server } from 'socket.io';
import logger from '../config/winston.logger.js';
import { socketAuth } from '../middlewares/auth.middleware.js';

export let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  io.use(socketAuth);

  io.on('connection', (socket) => {
    logger.info(`User connected : ${socket.id}`);

    socket.on('disconnect', () => {
      logger.info(`User Disconnected : ${socket.id}`);
    });
  });

  return io;
};
