import Session from '../models/session.model.js';

const createSession = async (userId, refreshToken, ip, agent) => {
  const session = await Session.create({
    user: userId,
    refreshToken,
    ipAddress: ip,
    userAgent: agent,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return session;
};

const findSession = (refreshTokenHash) => {
  return Session.findOne({
    refreshToken: refreshTokenHash,
    expiresAt: { $gt: new Date() }, // Check if session is still valid
    isRevoked: false,
  });
};

const findSeesionById = (sessionid) => {
  return Session.findOne({
    isRevoked: false,
    _id: sessionid,
  });
};

const deleteAllSessions = (currentSeesionId, userId) => {
  return Session.deleteMany({
    user: userId,
    _id: { $ne: currentSeesionId },
  });
};

export default {
  createSession,
  findSession,
  findSeesionById,
  deleteAllSessions,
};
