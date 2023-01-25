const httpStatus = require("http-status");
const { default: mongoose } = require("mongoose");
const config = require("../config/config");
const { tokenTypes } = require("../config/tokens");
const { Account, Transaction } = require("../models");
const ApiError = require("../utils/ApiError");
const { sendEmail } = require("./email.service");
// const { sendEmail } = require("./email.service");
/**
 *
 * @param {*} userId
 * @param {*} amount
 * @param {*} adminId
 * @returns
 */
const debitAccount = async (accountId, amount, adminId, description) => {
  const account = await Account.findById(accountId).populate("user");
  if (!account) throw new ApiError(httpStatus.BAD_REQUEST, "No account found!");
  if (account.suspend)
    throw new ApiError(httpStatus.BAD_REQUEST, "Account is suspended!");
  if (account.amount < amount)
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Insuffienct amount in account!"
    );
  const updateBody = account;
  updateBody.amount = account.amount - amount;
  updateBody.lastDebited = new Date();
  Object.assign(updateBody, account);
  await account.save();
  const transction = {
    user: account.user,
    transactionBy: adminId,
    transactionType: "debit",
    amount: amount,
    description,
    userBalance: updateBody.amount,
    date: new Date(),
  };
  await Transaction.create(transction);
  // sendEmail(account, amount, transction);
  const text = `
  <p>Hi ${account.user.firstName + " " + account.user.lastName},</p>
  <p>${amount} ADEELBUX has been subtracted from your account.</p>

  <p><a href="https://adeelbux.com/app/#/login">Click Here </a>to login and see your balance.</p>

  <p>if you have any questions or need support, contact us at support@adeelbux.com</p>
  <p>Adeel Chowdhry</p>
  `;
  sendEmail(
    account.user.email,
    "AdeelBux Amount Subtracted",
    text,
    config.email.cc
  );
  return account;
};

const creditAccount = async (accountId, amount, adminId, description) => {
  const account = await Account.findById(accountId).populate("user");
  if (!account) throw new ApiError(httpStatus.BAD_REQUEST, "No account found!");
  if (account.suspend)
    throw new ApiError(httpStatus.BAD_REQUEST, "Account is suspended!");
  const updateBody = account;
  updateBody.amount = account.amount + amount;
  updateBody.lastDebited = new Date();
  Object.assign(updateBody, account);
  await account.save();
  const transction = {
    user: account.user,
    transactionBy: adminId,
    transactionType: "credit",
    amount: amount,
    description,
    userBalance: updateBody.amount,
    date: new Date(),
  };
  await Transaction.create(transction);
  // sendEmail(account, amount, transction);
  const text = `
  <p>Hi ${account.user.firstName + " " + account.user.lastName},</p>
  <p>${amount} ADEELBUX has been added to your account.</p>

  <p><a href="https://adeelbux.com/app/#/login">Click Here </a>to login and see your balance.</p>
  
  <p>if you have any questions or need support, contact us at support@adeelbux.com</p>
  <p>Adeel Chowdhry</p>
  `;
  sendEmail(account.user.email, "AdeelBux Amount Added", text, config.email.cc);
  return account;
};
const queryAccounts = async (filter, options) => {
  return await Account.paginate(filter, options);
};

const getSingleAccount = async (accountId) => {
  return await Account.findOne({
    user: mongoose.Types.ObjectId(accountId),
  }).populate("user");
};
module.exports = {
  debitAccount,
  creditAccount,
  queryAccounts,
  getSingleAccount,
};
