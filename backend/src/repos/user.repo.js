import User from '../models/user.model.js';

const createUser = async (userData) => {
  return await User.create(userData);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

const findUserById = async (id) => {
  return await User.findById(id);
};

const isUserExists = async (email, username) => {
  return await User.findOne({
    $or: [{ email }, { username }],
  });
};

const getUser = async (identifier) => {
  return await User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select('+password');
};

export default {
  createUser,
  findUserByEmail,
  findUserById,
  isUserExists,
  getUser,
};
