const Joi = require("joi");
const { objectId } = require("./custom.validation");

const debitAccount = {
  params: Joi.object()
    .keys({
      id: Joi.custom(objectId),
    })
    .min(1)
    .max(1),
  body: Joi.object()
    .keys({
      amount: Joi.number().required(),
      description: Joi.string().required(),
    })
    .min(2)
    .max(2),
};

const creditAccount = {
  params: Joi.object()
    .keys({
      id: Joi.custom(objectId),
    })
    .min(1)
    .max(1),
  body: Joi.object()
    .keys({
      amount: Joi.number().required(),
      description: Joi.string().required(),
    })
    .min(2)
    .max(2),
};

const queryAccounts = {
  params: Joi.object().keys({
    limit: Joi.number().allow().optional(),
    skip: Joi.number().allow().optional(),
    page: Joi.number().allow().optional(),
  }),
};
const getSingleAccount = {
  params: Joi.object()
    .keys({
      id: Joi.custom(objectId),
    })
    .min(1)
    .max(1),
};
module.exports = {
  debitAccount,
  creditAccount,
  queryAccounts,
  getSingleAccount,
};
