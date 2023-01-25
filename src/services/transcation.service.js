const { default: mongoose } = require("mongoose");
const { Transaction, Account } = require("../models");

const queryTranscation = async (filter, options) => {
  return await Transaction.paginate(filter, options);
};

const getSingleTranscation = async (id) => {
  return await Transaction.findById(id)
    .populate("user")
    .populate("transactionBy");
};
const getUserTransaction = async (filter, options, accountId) => {
  const transaction = await Transaction.paginate(filter, options);
  const account = await Account.findOne({
    user: mongoose.Types.ObjectId(accountId),
  }).populate("user");
  return { account, transaction };
};
const getAdminTransaction = async (filter, options) => {
  return await Transaction.paginate(filter, options);
};
module.exports = {
  queryTranscation,
  getSingleTranscation,
  getUserTransaction,
  getAdminTransaction,
};
