const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");

const accountSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    lastDebited: {
      type: Date,
      default: null,
    },
    lastCredited: {
      type: Date,
      default: null,
    },
    suspend: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
accountSchema.plugin(toJSON);
accountSchema.plugin(paginate);

/**
 * Check if user exists
 * @param {string} email - The admin's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
accountSchema.statics.isUserAccountExists = async function (user) {
  const account = await this.findOne({ user: mongoose.Types.ObjectId(user) });
  return !!account;
};
/**
 * @typedef Account
 */
const Account = mongoose.model("Account", accountSchema);

module.exports = Account;
