const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    hire_date: {
      type: Date,
      default: Date.now,
    },
    salary: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("employees", employeeSchema);
