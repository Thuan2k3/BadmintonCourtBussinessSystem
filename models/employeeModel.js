const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, default: "employee" },
    isBlocked: { type: Boolean, default: false },
    hire_date: { type: Date, default: Date.now }, // Thuộc tính riêng
  },
  { timestamps: true }
);

module.exports = mongoose.model("employees", employeeSchema);
