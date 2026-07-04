import notificationRepo from '../repos/notification.repo.js';
import { emitToUser } from '../socket/index.js';

const createNotification = async (
  io,
  { receiver, sender = null, type, title, body, metadata = {}, message }
) => {
  if (!receiver) throw new Error('Reciever is required');

  const payload = {
    receiver,
    sender,
    type,
    title,
    body,
    metadata,
    message,
  };

  const notif = await notificationRepo.createNotification(payload);
  emitToUser(io, receiver, 'notification:new', notif);

  return notif;
};

export default {
  createNotification,
};
