const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require("../services");
const { User, Admin, Token } = require("../models");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const { v4: uuidv4 } = require("uuid");

/**
 * Registration Module
 */
const register = catchAsync(async (req, res) => {
  let createUserBody = req.body;
  if (req.file) createUserBody.photoPath = req.file.filename;
  const user = await authService.register(createUserBody);

  const text = `
  <p>Hi ${user.firstName + " " + user.lastName},</p>
  <p>Welcome to AdeelBux!</p>

  <p>Login Here: https://adeelbux.com/app/#/login</p>
  <p>User: ${user.email}</p>
  <p>Password: ${createUserBody.password}</p>


  <p>*Please do not share these details with anyone or your account will be disabled.</p>

  <p>if you have any questions or need support, contact us at support@adeelbux.com</p>

  <p>Adeel Chowdhry</p>
  `;
  emailService.sendEmail(user.email, "Welcome to AdeelBux", text);
  res.status(httpStatus.OK).send(user);
});

/**
 * Login Module
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  user.profilePicture = config.rootPath + user.profilePicture;
  let tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

/*
 * Logout Module
 */
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body);
  res.status(httpStatus.OK).send({ success: true });
});

/**
 * Forgot Password Module
 */
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No user found");
  }
  await Token.updateMany(
    { user: user.id, isResetToken: true },
    { $set: { isResetToken: false, valid: false } }
  );
  const isResetToken = true;
  const tokens = await tokenService.generateAuthTokens(user, isResetToken);
  const refreshToken = tokens.refresh.token;
  const text = `
  <p>Hi,</p>
  <p>To reset your password: <a href="https://adeelbux.com/app#/changePassword/${refreshToken}">Click Here</a></p>
  <p>If you did not request password reset, please ignore this email.</p>

  <p>if you have any questions or need support, contact us at support@adeelbux.com</p>

  <p>Adeel Chowdhry</p>
  `;
  emailService.sendEmail(user.email, "AdeelBux Reset Password", text);
  res.send({ success: true });
});

const verifyResetPasswordToken = catchAsync(async (req, res) => {
  console.log(req.body);
  const token = await Token.findOne({
    token: req.body.token,
    isResetToken: true,
    valid: true,
  });
  if (!token) {
    return res.send({ valid: false });
  }
  return res.send({ valid: true });
});
/**
 * Reset Password Module
 */
const resetPassword = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;
  const user = await authService.resetPassword(token, newPassword);
  res.send({ user });
});

/**
 * Change Password Module
 */
const changePassword = catchAsync(async (req, res) => {
  const user = await authService.changePassword(req.body);
  // const emailMessage = {
  //   to: user.email,
  //   from: {
  //     email: config.email.fromEmail,
  //   },
  //   subject: "Password Change",
  //   html: `
  //   <p>Your password changed successfully.</p>
  //   `,
  // };
  // emailService.sendMail(emailMessage);
  res.status(httpStatus.OK).json({ success: true, user });
});
module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyResetPasswordToken,
};
