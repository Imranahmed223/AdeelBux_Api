const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const logSchema = mongoose.Schema(
  {
    admin: {
      type: mongoose.Types.ObjectId,
      ref: "Admin",
    },
    logType: {
      type: String,
      default: null,
      enum: ["debit", "credit", "invite"],
    },
    description: {
      type: Number,
      default: 0,
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
logSchema.plugin(toJSON);
logSchema.plugin(paginate);

/**
 * @typedef Log
 */
const Log = mongoose.model("Log", logSchema);

module.exports = Log;
