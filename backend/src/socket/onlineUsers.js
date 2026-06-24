export const emitToUser = (userId, event, data) => {
  const sockets = onlineUsers.get(userId.toString());

  if (!sockets) return false;

  for (const socketId of sockets) {
    io.to(socketId).emit(event, data);
  }

  return true;
};
