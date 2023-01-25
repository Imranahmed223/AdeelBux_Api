const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");
dotenv.config({ path: path.join(__dirname, "../../.env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string()
      .valid("production", "development", "test")
      .required(),
    MONGODB_URL: Joi.string().required().description("Mongo DB url"),
    PORT: Joi.number(),
    HTTPS_PORT: Joi.number().required(),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_DAYS: Joi.number()
      .default(92)
      .description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number()
      .default(182)
      .description("days after which refresh tokens expire"),
    POST_MARK_API_TOKEN: Joi.string()
      .required()
      .description("Send Grid Api Key"),
    EMAIL_FROM: Joi.string()
      .required()
      .description("the from field in the emails sent by the app"),
    CC_EMAIL: Joi.string()
      .required()
      .description("Cc Email address is required"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema
  .prefs({ errors: { label: "key" } })
  .validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  rootPath: envVars.ROOT_PATH,
  port: envVars.HTTP_PORT,
  httpsPort: envVars.HTTPS_PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === "test" ? "-test" : ""),
    options: {
      // useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationDays: envVars.JWT_ACCESS_EXPIRATION_DAYS,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 10,
  },
  // email: {
  //   sendGridApiKey: envVars.SENDGRID_API_KEY,
  //   fromEmail: envVars.FROM_MAIL,
  // },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      token: envVars.POST_MARK_API_TOKEN,
    },
    from: envVars.EMAIL_FROM,
    cc: envVars.CC_EMAIL,
  },
};
