import Session from '../models/session.model.js';

const createSession = async (
  userId,
  refreshToken,
  ip,
  agent,
  lastActiveAt,
  browser,
  device,
  os
) => {
  const session = await Session.create({
    user: userId,
    refreshToken,
    ipAddress: ip,
    userAgent: agent,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    lastActiveAt: new Date(),
    browser,
    device,
    os,
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

const findById = (id) => Session.findById(id);

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

const revokeAllSessions = async (userId, sessionId) => {
  const result = await Session.updateMany(
    {
      user: userId,
      _id: { $ne: sessionId },
      isRevoked: false,
    },
    {
      $set: {
        isRevoked: true,
        revokedAt: new Date(),
        revokeReason: 'Logged out of all devices by user',
      },
    }
  );

  return result;
};

const findAllSessions = (userId) => {
  return Session.find({
    user: userId,
    isRevoked: false,
  });
};

const revokefamily = (UserId) => {
  return Session.updateMany({ user: UserId }, { isRevoked: true });
};

const rotate = ({ sessionId, newhash, ip, userAgent, expiresAt, lastActiveAt, exceptedhash }) => {
  return Session.findOneAndUpdate(
    { _id: sessionId, refreshToken: exceptedhash, isRevoked: false },
    {
      refreshToken: newhash,
      ipAddress: ip,
      userAgent: userAgent,
      expiresAt,
      lastActiveAt: new Date(),
    },
    { new: true }
  );
};

export default {
  createSession,
  findSession,
  findSeesionById,
  deleteAllSessions,
  findAllSessions,
  revokeAllSessions,
  revokefamily,
  rotate,
  findById,
};
