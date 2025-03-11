const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    full_name: {
      type: String,
      required: true,
    },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("admins", adminSchema);
