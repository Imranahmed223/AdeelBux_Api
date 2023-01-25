const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");
const adminSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "Admin",
    },
    OTP: {
      key: {
        type: Number,
        default: null,
      },
      validTill: {
        type: Date,
        default: null,
      },
      verified: {
        type: Boolean,
        default: false,
      },
    },
    active: {
      type: Boolean,
      default: true,
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
adminSchema.plugin(toJSON);
adminSchema.plugin(paginate);

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
adminSchema.methods.isPasswordMatch = async function (password) {
  const admin = this;
  return bcrypt.compare(password, admin.password);
};

adminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    admin.password = await bcrypt.hash(admin.password, 10);
  }
  next();
});

/**
 * Check if email is taken
 * @param {string} email - The admin's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
adminSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const admin = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!admin;
};

/**
 * @typedef Admin
 */
const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
