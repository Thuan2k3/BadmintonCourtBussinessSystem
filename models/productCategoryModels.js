const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

const productCategory = mongoose.model(
  "categories",
  productCategorySchema
);

module.exports = productCategory;
