const express = require("express");
// const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { authValidation } = require("../validations");
const { authController } = require("../controllers");
const { fileUpload } = require("../utils/fileUpload");
const auth = require("../middlewares/auth");

const router = express.Router();

///validate(userValidation.register),
router
  .route("/register")
  .post(
    fileUpload.single("profilePicture"),
    validate(authValidation.register),
    authController.register
  );
router
  .route("/login")
  .post(validate(authValidation.login), authController.login);
router
  .route("/logout")
  .post(auth(), validate(authValidation.logout), authController.logout);

router
  .route("/forgot/password")
  .post(validate(authValidation.forgotPassword), authController.forgotPassword);

router
  .route("/verify/token")
  .post(
    validate(authValidation.verifyResetPasswordToken),
    authController.verifyResetPasswordToken
  );

router
  .route("/reset/password")
  .post(validate(authValidation.resetPassword), authController.resetPassword);
module.exports = router;
