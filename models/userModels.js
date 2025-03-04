const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
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
      enum: ["admin", "employee", "customer"],
      required: true,
      default: "customer",
    },
    isBlocked: { type: Boolean, default: false },

    // 🔗 Tham chiếu đến bảng cụ thể theo vai trò
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customers",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
