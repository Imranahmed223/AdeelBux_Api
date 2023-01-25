const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { transactionValidation } = require("../validations");
const { transcationController } = require("../controllers");
const router = express.Router();

router
  .route("/")
  .get(
    auth("manageTransaction"),
    validate(transactionValidation.queryTranscation),
    transcationController.queryTranscation
  );

router
  .route("/:id")
  .get(
    auth("manageTransaction"),
    validate(transactionValidation.getSingleTranscation),
    transcationController.getSingleTranscation
  );

router.get("/user/details", auth(), transcationController.getUserTransaction);
router.get("/admin/details", auth(), transcationController.getAdminTransaction);

module.exports = router;
