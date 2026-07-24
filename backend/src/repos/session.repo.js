import Session from '../models/session.model.js';

const createSession = async (userId, refreshToken, ip, agent, browser, device, os, familyId) => {
  const session = await Session.create({
    user: userId, // ✅ user._id
    refreshToken, // ✅ hashedRefreshToken
    ipAddress: ip, // ✅ ip
    userAgent: agent, // ✅ agent
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    lastActiveAt: new Date(),
    browser, // ✅ browser
    device, // ✅ device
    os, // ✅ os
    familyId, // ✅ familyId
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
  }).sort({ createdAt: -1 });
};

const revokefamily = async (familyId) => {
  return Session.updateMany({ familyId }, { isRevoked: true, revokedReason: 'Reuse detected' });
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

const checkSameDevice = ({ userId, browser, os, device }) => {
  return Session.findOne({
    user: userId,
    browser,
    os,
    device,
    isRevoked: false, // important — don't match against an old revoked session
  });
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
