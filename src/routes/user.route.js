const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const userValidation = require("../validations/user.validation");
const userController = require("../controllers/user.controller");
const { fileUpload } = require("../utils/fileUpload");
const router = express.Router();

router
  .route("/")
  .get(
    auth("manageUsers"),
    validate(userValidation.getUsers),
    userController.getUsers
  );

router
  .route("/:userId")
  .get(auth(), validate(userValidation.getUser), userController.getUser)
  .patch(
    auth(),
    fileUpload.single("profilePicture"),
    validate(userValidation.updateUser),
    userController.updateUser
  )
  .delete(
    auth("manageUsers"),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

router
  .route("/add/token")
  .post(
    auth(),
    validate(userValidation.deviceToken),
    userController.addUserDeviceToken
  );

router
  .route("/remove/token")
  .post(
    auth(),
    validate(userValidation.deviceToken),
    userController.removeUserDeviceToken
  );

router.post(
  "/invite/user",
  auth(),
  validate(userValidation.inviteUser),
  userController.inviteUser
);
router.get(
  "/export/user/info",
  auth("manageUsers"),
  userController.exportUserData
);
module.exports = router;
