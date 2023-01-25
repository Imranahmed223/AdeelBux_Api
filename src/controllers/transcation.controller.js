const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { accountService, transcationService } = require("../services");
const { default: mongoose } = require("mongoose");

const queryTranscation = catchAsync(async (req, res) => {
  const filter = pick(req.query, []);
  const options = pick(req.query, ["page", "limit", "skip"]);
  options.populate = "user,transactionBy";
  const result = await transcationService.queryTranscation(filter, options);
  res.send(result);
});

const getSingleTranscation = catchAsync(async (req, res) => {
  const { id } = req.params;
  const transcation = await transcationService.getSingleTranscation(id);
  res.send(transcation);
});

const getAdminTransaction = catchAsync(async (req, res) => {
  const { id } = req.user;
  const filter = { admin: mongoose.Types.ObjectId(id) };
  const options = pick(req.query, ["page", "limit", "skip"]);
  options.populate = "user,transactionBy";
  const from = new Date(new Date().setHours(0));
  const to = new Date(new Date().setHours(23));
  filter.createdAt = { $gte: from, $lte: to };
  const transactions = await transcationService.getAdminTransaction(
    filter,
    options
  );
  res.send(transactions);
});
const getUserTransaction = catchAsync(async (req, res) => {
  const { id } = req.user;
  const filter = { user: mongoose.Types.ObjectId(id) };
  const options = pick(req.query, ["page", "limit", "skip"]);
  options.populate = "user,transactionBy";
  const transactions = await transcationService.getUserTransaction(
    filter,
    options,
    id
  );
  res.send(transactions);
});
module.exports = {
  queryTranscation,
  getSingleTranscation,
  getUserTransaction,
  getAdminTransaction,
};
