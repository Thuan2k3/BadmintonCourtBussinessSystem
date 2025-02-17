const mongoose = require("mongoose");

const courtSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  }, // Lưu URL ảnh sân
  isEmpty: {
    type: Boolean,
    default: true, // Mặc định sân đang trống
  },
  isActive: {
    type: Boolean,
    default: true, // Mặc định sân đang hoạt động
  },
});

const courtModel = mongoose.model("courts", courtSchema);

module.exports = courtModel;
