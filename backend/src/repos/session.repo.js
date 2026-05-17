import Session from '../models/session.model.js';

const createSession = async (userId, refreshToken, ip, agent) => {
  const session = await Session.create({
    user: userId,
    refreshToken,
    ipAddress: ip,
    userAgent: agent,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });
};

const findSession = async (refreshTokenHash) => {
  return await Session.findOne({
    refreshToken: refreshTokenHash,
    expiresAt: { $gt: new Date() }, // Check if session is still valid
    isRevoked: false,
  });
};

export default {
  createSession,
  findSession,
};
