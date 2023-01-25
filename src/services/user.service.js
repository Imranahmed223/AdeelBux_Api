const httpStatus = require("http-status");
const { default: mongoose } = require("mongoose");
const { User, Profile, Account } = require("../models");
const ApiError = require("../utils/ApiError");
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return await User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody, reqUser) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.id.toString() !== reqUser.id && reqUser.role !== "Admin") {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  Object.assign(user, updateBody);
  await user.save();
  if (updateBody.suspend !== undefined && updateBody.suspend) {
    await Account.updateOne(
      { user: mongoose.Types.ObjectId(user.id) },
      { $set: { suspend: true } }
    );
  }
  if (updateBody.suspend !== undefined && updateBody.suspend == false) {
    await Account.updateOne(
      { user: mongoose.Types.ObjectId(user.id) },
      { $set: { suspend: false } }
    );
  }
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId, id) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No account found for this user!"
    );
  }
  await user.remove();
  const account = await Account.findOne({
    user: mongoose.Types.ObjectId(user.id),
  });
  await account.remove();
  return (response = { msg: "user deleted" });
};

const exportUserData = async () => {
  // return filePath;
};

module.exports = {
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
  exportUserData,
};
