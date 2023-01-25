const httpStatus = require("http-status");
const { tokenTypes } = require("../config/tokens");
const { Admin, Token } = require("../models");
const ApiError = require("../utils/ApiError");
const { sendEmail } = require("./email.service");
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<Admin>}
 */
const createAdmin = async (userBody) => {
  if (await Admin.isEmailTaken(userBody.email)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "An account with this email already exists"
    );
  }
  const user = await Admin.create(userBody);
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAdmins = async (filter, options) => {
  const users = await Admin.paginate(filter, options);
  return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Admin>}
 */
const getAdminById = async (id) => {
  console.log(id);
  return await Admin.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Admin>}
 */
const getAdminByEmail = async (email) => {
  return Admin.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<Admin>}
 */
const updateAdminById = async (userId, updateBody) => {
  const user = await getAdminById(userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Admin>}
 */
const deleteAdminById = async (userId) => {
  const user = await getAdminById(userId);
  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No account found for this user!"
    );
  }
  await user.remove();
  return (response = { msg: "Admin Deleted" });
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Admin>}
 */
const login = async (email, password) => {
  const user = await Admin.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  if (user.suspend) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Your account has been suspended! Please contact your adminstrator"
    );
  }
  const updateBody = user;
  updateBody.active = true;
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (data) => {
  let refreshToken = data.refreshToken;
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Not found");
  }
  const userId = refreshTokenDoc.user;
  await Admin.updateOne({ _id: userId }, { $set: { active: false } });
  await refreshTokenDoc.remove();
};

const resetPassword = async (token, password) => {
  const validToken = await Token.findOne({ token });
  console.log(validToken);
  if (!validToken || !validToken.valid) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Link is not valid");
  }
  const user = await Admin.findById(validToken.user);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Link is not valid");
  }
  const updatedUser = user;
  updatedUser.password = password;
  Object.assign(user, updatedUser);
  await user.save();
  const updatedToken = validToken;
  updatedToken.isResetToken = false;
  updatedToken.valid = false;
  Object.assign(validToken, updatedToken);
  await validToken.save();
  const text = `
  <p>Hi,</p>
  <p>Your password has been changed.</p>
  <p><a href="https://adeelbux.com/admin">Click Here</a> to login with your new password</p>
  <p>if you have any questions or need support, contact us at support@adeelbux.com</p>
  <p>Adeel Chowdhry<p>
  `;
  sendEmail(user.email, "AdeelBux Change Password Confirmation", text);
  return user;
};
module.exports = {
  createAdmin,
  queryAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  login,
  logout,
  resetPassword,
};
