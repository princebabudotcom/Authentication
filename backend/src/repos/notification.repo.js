import Notification from '../models/notification.model.js';

const createNotification = (payload) => {
  return Notification.create(payload);
};

export default {
  createNotification,
};
