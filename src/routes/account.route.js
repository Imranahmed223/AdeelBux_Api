const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { accountValidation } = require("../validations");
const { accountController } = require("../controllers");
const router = express.Router();

router
  .route("/debit/:id")
  .post(
    auth("manageAccounts"),
    validate(accountValidation.debitAccount),
    accountController.debitAccount
  );

router
  .route("/credit/:id")
  .post(
    auth("manageAccounts"),
    validate(accountValidation.creditAccount),
    accountController.creditAccount
  );

router
  .route("/fetch")
  .get(
    auth("manageAccounts"),
    validate(accountValidation.queryAccounts),
    accountController.queryAccounts
  );

router
  .route("/fetch/:id")
  .get(
    auth(),
    validate(accountValidation.getSingleAccount),
    accountController.getSingleAccount
  );

module.exports = router;
