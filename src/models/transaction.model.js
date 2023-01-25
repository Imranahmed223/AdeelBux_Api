const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");

const transcationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    transactionBy: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    transactionType: {
      type: String,
      default: null,
      enum: ["debit", "credit"],
    },
    amount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: true,
    },
    userBalance: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
transcationSchema.plugin(toJSON);
transcationSchema.plugin(paginate);

/**
 * @typedef Transaction
 */
const Transaction = mongoose.model("Transaction", transcationSchema);

module.exports = Transaction;
