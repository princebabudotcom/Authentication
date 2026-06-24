import { Server } from 'socket.io';
import logger from '../config/winston.logger.js';
import { socketAuth } from '../middlewares/auth.middleware.js';

export let io;

const onlineUsers = new Map();

export const initSocket = (httpServer) => {
  io = new Server(httpServer);

  // socket auth middleware
  io.use(socketAuth);

  io.on('connection', (socket) => {
    logger.info(`User connected : ${socket.id}`);

    const userId = socket.user._id.toString();

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    // Notify everyone except current user

    // Notify everyone except current user
    socket.broadcast.emit('user-online', {
      userId,
      // isOnline: 'Online',
    });

    socket.on('disconnect', () => {
      onlineUsers.get(userId)?.delete(socket.id);

      if (onlineUsers.get(userId)?.size === 0) {
        onlineUsers.delete(userId);
      }

      socket.broadcast.emit('user-offline', {
        userId,
        // isOnline: 'Offline',
      });

      logger.info(`User Disconnected : ${socket.id}`);
    });
  });

  return io;
};
