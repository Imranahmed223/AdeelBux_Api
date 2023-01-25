const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { adminValidation } = require("../validations");
const { adminController } = require("../controllers");
const { requireSignin, adminMiddleware } = require("./../middlewares/auth");
const router = express.Router();

router
  .route("/")
  .post(
    auth("manageAdmins"),
    validate(adminValidation.createAdmin),
    adminController.createAdmin
  )
  .get(auth("manageAdmins"), adminController.getAdmins);
router
  .route("/:id")
  .get(
    auth("manageAdmins"),
    validate(adminValidation.getAdmin),
    adminController.getAdmin
  )
  .patch(
    auth("manageAdmins"),
    validate(adminValidation.updateAdmin),
    adminController.updateAdmin
  )
  .delete(
    auth("manageAdmins"),
    validate(adminValidation.deleteAdmin),
    adminController.deleteAdmin
  );

router
  .route("/login")
  .post(validate(adminValidation.login), adminController.login);
router.post(
  "/logout",
  auth(),
  validate(adminValidation.logout),
  adminController.logout
);

router.post(
  "/forgot/password",
  validate(adminValidation.forgotPassword),
  adminController.forgotPassword
);

router.post(
  "/verify/token",
  validate(adminValidation.verifyResetPasswordToken),
  adminController.verifyResetPasswordToken
);
router.post(
  "/reset/password",
  validate(adminValidation.resetPassword),
  adminController.resetPassword
);
module.exports = router;
