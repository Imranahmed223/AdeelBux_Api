const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const getUsers = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      firstName: Joi.string().allow().optional(),
      lastName: Joi.string().allow().optional(),
      userName: Joi.string().allow().optional(),
      password: Joi.string().allow().optional(),
      role: Joi.string().allow().optional(),
      profilePicture: Joi.string().allow().optional(),
      phone: Joi.number().allow().optional(),
      address: Joi.string().allow().optional(),
      active: Joi.boolean().allow().optional(),
      suspend: Joi.boolean().allow().optional(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const deviceToken = {
  body: Joi.object()
    .keys({
      deviceToken: Joi.string().required(),
    })
    .min(1)
    .max(1),
};

const inviteUser = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};
module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  deviceToken,
  inviteUser,
};
