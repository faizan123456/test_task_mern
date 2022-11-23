const { ObjectId } = require('mongoose').Types;
const User = require('../../models/user.model');
const Activity = require('../../models/activity.model');
const axios = require('axios');

const getUserById = async (_id, selectedOpts = {}) => {
  return User.findById(_id).select(selectedOpts);
};

const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

const getUserByUsername = async (username) => {
  return User.findOne({ username });
};

const addUser = async (user) => {
  const newUser = new User(user);
  return newUser.save();
};

const addActivity = async (activity) => {
  const newActivity = new Activity(activity);
  return newActivity.save();
};

const getAllUsers = async () => {
    return User.find();
};
const getActivities = async () => {
  return Activity.find()
    .populate('user')
    .sort({ lastLoginTime: -1 });
};

const verifyEmail = async (_id) => {
  return User.updateOne({ _id }, { verified: true, verificationCode: '' });
};

const updateUser = (_id, user) => {
  return User.findOneAndUpdate({ _id }, user);
};

const deleteUserById = async (userId) => {
  await User.deleteOne({ _id: userId });
  return true
}

const getRecentUsers = () => {
  return User.find()
    .sort({ createdAt: -1 })
    .limit(10);
};

module.exports = {
  addUser,
  getUserByEmail,
  getUserByUsername,
  getUserById,
  getAllUsers,
  verifyEmail,
  updateUser,
  getRecentUsers,
  deleteUserById,
  getActivities,
  addActivity
};
