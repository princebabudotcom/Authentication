import User from '../models/user.model.js';

const createUser = (userData) => {
  return User.create(userData);
};

const findUserByEmail = (email) => {
  return User.findOne({ email }).lean();
};

const findUserById = (id) => {
  return User.findById(id);
};

const isUserExists = (email, username) => {
  return User.exists({
    $or: [{ email }, { username }],
  });
};

const getUser = (identifier) => {
  return User.findOne({
    $or: [{ email: identifier }, { username: identifier }],
  }).select('+password');
};

const updateUser = (id, updateData) => {
  return User.findByIdAndUpdate(id, updateData, {
    runValidators: true,
    returnDocument: 'after',
  });
};

export default {
  createUser,
  updateUser,
  findUserByEmail,
  findUserById,
  isUserExists,
  getUser,
};
