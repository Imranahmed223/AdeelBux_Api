const Joi = require("joi");
const { objectId } = require("./custom.validation");
const queryTranscation = {
  params: Joi.object().keys({
    limit: Joi.number().allow().optional(),
    skip: Joi.number().allow().optional(),
    page: Joi.number().allow().optional(),
  }),
};

const getSingleTranscation = {
  params: Joi.object()
    .keys({
      id: Joi.string().custom(objectId),
    })
    .min(1)
    .max(1),
};

module.exports = {
  queryTranscation,
  getSingleTranscation,
};
