import { Server } from 'socket.io';
import logger from '../config/winston.logger.js';
import { socketAuth } from '../middlewares/auth.middleware.js';
import onlineUsers from '../utils/onlineUsers.js';

export let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      credentials: true,
    },
  });

  // socket auth middleware
  io.use(socketAuth);

  io.on('connection', (socket) => {
    const userId = socket.user._id.toString();

    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }

    onlineUsers.get(userId).add(socket.id);

    logger.info(
      `Socket Connected | User: ${userId} | Socket: ${socket.id} | Email: ${socket.user.email}`
    );

    socket.on('disconnect', () => {
      const sockets = onlineUsers.get(userId);

      if (sockets) {
        sockets.delete(socket.id);

        if (sockets.size === 0) {
          onlineUsers.delete(userId);
        }
      }

      logger.info(`Socket Disconnected | User: ${userId} | Socket: ${socket.id}`);
    });
  });

  return io;
};

export function emitToUser(io, userId, event, payload) {
  const sockets = onlineUsers.get(userId.toString());
  if (!sockets) return false; // user is offline
  sockets.forEach((socketId) => io.to(socketId).emit(event, payload));
  return true;
}
