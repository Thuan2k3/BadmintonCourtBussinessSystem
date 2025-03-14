const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
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
      default: "customer",
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    reputation_score: {
      type: Number,
      default: 100,
      min: 0,
      max: 100, // Giới hạn tối đa là 100 điểm
    }, // Điểm uy tín
  },
  { timestamps: true }
);

module.exports = mongoose.model("customers", customerSchema);
