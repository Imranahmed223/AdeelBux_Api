const Joi = require("joi");
const { objectId, password } = require("./custom.validation");

const createAdmin = {
  body: Joi.object()
    .keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string()
        .custom(password)
        .description("Password is required"),
      phone: Joi.string().allow(null, "").optional(),
      address: Joi.string().allow(null, "").optional(),
      role: Joi.string().allow().optional(),
      active: Joi.boolean().allow().optional(),
      suspend: Joi.boolean().allow().optional(),
    })
    .min(4)
    .max(9),
};

const getAdmin = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateAdmin = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      firstName: Joi.string().allow().optional(),
      lastName: Joi.string().allow().optional(),
      email: Joi.string().email().allow().optional(),
      password: Joi.string().allow().optional(),
      phone: Joi.string().allow().optional(),
      address: Joi.string().allow().optional(),
      role: Joi.string().allow().optional(),
      active: Joi.boolean().allow().optional(),
      suspend: Joi.boolean().allow().optional(),
    })
    .min(1)
    .max(9),
};

const deleteAdmin = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
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
  createAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  login,
  logout,
  forgotPassword,
  verifyResetPasswordToken,
  resetPassword,
};
