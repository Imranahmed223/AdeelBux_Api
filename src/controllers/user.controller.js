const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { userService, emailService } = require("../services");
const config = require("../config/config");
const { Account, User } = require("../models");
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const { default: mongoose } = require("mongoose");

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["firstName", "lastName"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filter, options, req.user.id);
  for (let i = 0; i < result.results.length; i++) {
    result.results[
      i
    ].profilePicture = `${config.rootPath}${result.results[i].profilePicture}`;
    result.results[i] = result.results[i].toObject();
    const account = await Account.findOne({
      user: mongoose.Types.ObjectId(result.results[i]._id),
    });
    result.results[i].account = account;
  }
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  user.profilePicture = `${config.rootPath}${user.profilePicture}`;
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  let updateUserBody = req.body;
  if (req.file) updateUserBody.profilePicture = req.file.filename;
  const user = await userService.updateUserById(
    req.params.userId,
    updateUserBody,
    req.user
  );
  user.profilePicture = config.resetRoute + user.profilePicture;
  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  const response = await userService.deleteUserById(
    req.params.userId,
    req.user.id
  );
  res.status(httpStatus.OK).send(response);
});

const addUserDeviceToken = catchAsync(async (req, res) => {
  console.log(String(req.user.id));
  const user = await userService.getUserById(String(req.user.id));
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  user.deviceToken.push(req.body.deviceToken);
  user.deviceToken = [...new Set([...user.deviceToken])];
  await user.save();
  return res.status(httpStatus.NO_CONTENT).send();
});

const removeUserDeviceToken = catchAsync(async (req, res) => {
  console.log(req.user);
  const user = await userService.getUserById(req.user.id);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found");
  }
  const index = user.deviceToken.indexOf(req.body.deviceToken);
  if (index == -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No device token found");
  }
  user.deviceToken.splice(index, 1);
  await user.save();
  return res.status(httpStatus.NO_CONTENT).send();
});

const inviteUser = catchAsync(async (req, res) => {
  const { email } = req.body;
  const text = `
  <p>Hi,</p>
  <p>Adeel Chowdhry has invited you to join AdeelBux.</p>
  <p><a href="https://adeelbux.com/app">Click Here</a> to create your confidential reward account.</p>
  <p>*Please do not share these details with anyone or your account will be disabled.</p>
  <p>If you have any questions or need support, contact us at support@adeelbux.com</p>
  <p>Adeel Chowdhry</p>
  `;
  emailService.sendEmail(email, "Confidential Invitation To AdeelBux", text);
  res.json({ success: true });
});

const exportUserData = catchAsync(async (req, res) => {
  const csvFields = [
    {
      label: "First Name",
      value: `firstName`,
    },
    {
      label: "Last Name",
      value: `lastName`,
    },
    {
      label: "Phone",
      value: `phone`,
    },
    {
      label: "Email",
      value: `email`,
    },
  ];
  const json2csvParser = new Json2csvParser({
    fields: csvFields,
  });
  const data = await User.find(
    {},
    { _id: 0, firstName: 1, lastName: 1, phone: 1, email: 1 }
  ).lean();
  const csvData = json2csvParser.parse(data);
  const filePath = `user_export_${new Date()}.csv`;
  fs.writeFile(`public/uploads/${filePath}`, csvData, function (error) {
    if (error)
      throw new ApiError(httpStatus.BAD_REQUEST, "Internal server error!");
    res.download(`public/uploads/${filePath}`);
  });
});
module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  addUserDeviceToken,
  removeUserDeviceToken,
  inviteUser,
  exportUserData,
};
