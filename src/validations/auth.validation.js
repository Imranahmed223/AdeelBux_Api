const Joi = require("joi");
const { objectId } = require("./custom.validation");
// const { password, objectId } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(32).required(),
    address: Joi.string().allow(null, "").optional(),
    phone: Joi.number().allow(null, "").optional(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(32).required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};
const verifyResetPasswordToken = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};
module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  verifyResetPasswordToken,
  resetPassword,
};
