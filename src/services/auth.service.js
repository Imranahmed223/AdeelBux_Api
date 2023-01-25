const httpStatus = require("http-status");
const config = require("../config/config");
const { User, Account, Token } = require("../models");
const ApiError = require("../utils/ApiError");
const generateJwtToken = require("../config/generateToken");
const { sendEmail } = require("./email.service");
const { tokenTypes } = require("../config/tokens");
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const register = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "An account with this email already exists"
    );
  }
  const saveUser = await User.create(userBody);
  // Create new account of user
  await Account.create({
    user: saveUser.id,
    amount: 0,
  });
  saveUser.profilePicture = config.rootPath + saveUser.profilePicture;
  return saveUser;
};

const login = async (email, password) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect email or password!");
  }
  const checkPassword = await user.isPasswordMatch(password);
  if (!checkPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect email or password!");
  }
  if (user.suspend) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Account is suspended, please contact administration!"
    );
  }
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
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  const userId = refreshTokenDoc.user;
  await User.updateOne({ _id: userId }, { $set: { active: false } });
  await refreshTokenDoc.remove();
};
const updateUser = async (query, body) => {
  const updateUser = await User.findByIdAndUpdate(query, body, { new: true });
  if (!updateUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No User Found");
  }
  return updateUser;
};

const deleteUser = async (query, body) => {
  const deleteUser = await User.findByIdAndRemove(query, body);
  if (!deleteUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No User Found");
  }
  return "User Deleted Successfully";
};

const resetPassword = async (token, password) => {
  const validToken = await Token.findOne({ token });
  if (!validToken || !validToken.valid) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Link is not valid");
  }
  const user = await User.findById(validToken.user);
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
  <p><a href="https://adeelbux.com/app/#/login">Click Here</a> to login with your new password.</p>
  <p>if you have any questions or need support, contact us at support@adeelbux.com</p>
  <p>Adeel Chowdhry<p>
  `;
  sendEmail(user.email, "AdeelBux Change Password Confirmation", text);
  return user;
};
module.exports = {
  register,
  login,
  updateUser,
  deleteUser,
  logout,
  resetPassword,
};
