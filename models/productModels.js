const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
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
  }, // Lưu URL ảnh sản phẩm
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },
});

const productModel = mongoose.model("products", productSchema);

module.exports = productModel;
