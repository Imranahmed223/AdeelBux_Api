const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { adminService, tokenService, emailService } = require("../services");
const { Admin, Token } = require("../models");

const createAdmin = catchAsync(async (req, res) => {
  let body = req.body;
  const user = await adminService.createAdmin(body);
  res.status(httpStatus.CREATED).send(user);
});

const getAdmins = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["firstName", "lastName", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await adminService.queryAdmins(filter, options);
  res.send(result);
});

const getAdmin = catchAsync(async (req, res) => {
  const user = await adminService.getAdminById(req.params.id);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Admin not found");
  }
  res.send(user);
});

const updateAdmin = catchAsync(async (req, res) => {
  let updateUserBody = req.body;
  const user = await adminService.updateAdminById(
    req.params.id,
    updateUserBody
  );
  res.send(user);
});

const deleteAdmin = catchAsync(async (req, res) => {
  const response = await adminService.deleteAdminById(req.params.id);
  res.status(httpStatus.OK).send(response);
});

/**
 * Login Module
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await adminService.login(email, password);
  let tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

/**
 * Logout Module
 */
const logout = catchAsync(async (req, res) => {
  await adminService.logout(req.body);
  res.status(httpStatus.NO_CONTENT).send();
});
/**
 *
 */
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await Admin.findOne({ email });
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
  <p>To reset your password: <a href="https://adeelbux.com/admin#/changePassword/${refreshToken}">Click Here</a></p>
  <p>If you did not request password reset, please ignore this email.</p>

  <p>if you have any questions or need support, contact us at support@adeelbux.com</p>

  <p>Adeel Chowdhry</p>
  `;
  emailService.sendEmail(user.email, "AdeelBux Reset Password", text);
  res.send({ success: true });
});

const verifyResetPasswordToken = catchAsync(async (req, res) => {
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
  const admin = await adminService.resetPassword(token, newPassword);
  res.send({ admin });
});
module.exports = {
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  login,
  logout,
  forgotPassword,
  verifyResetPasswordToken,
  resetPassword,
};
