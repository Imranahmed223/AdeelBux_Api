const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { accountService } = require("../services");

const debitAccount = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { amount, description } = req.body;
  const adminId = req.user.id;
  const account = await accountService.debitAccount(
    id,
    amount,
    adminId,
    description
  );
  res.status(httpStatus.CREATED).send(account);
});

const creditAccount = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { amount, description } = req.body;
  const adminId = req.user.id;
  const account = await accountService.creditAccount(
    id,
    amount,
    adminId,
    description
  );
  res.status(httpStatus.CREATED).send(account);
});

const queryAccounts = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  options.populate = "user";
  const result = await accountService.queryAccounts(filter, options);
  res.send(result);
});

const getSingleAccount = catchAsync(async (req, res) => {
  const { id } = req.params;
  const account = await accountService.getSingleAccount(id);
  res.send(account);
});
module.exports = {
  debitAccount,
  creditAccount,
  queryAccounts,
  getSingleAccount,
};
