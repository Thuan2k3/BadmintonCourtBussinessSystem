const mongoose = require("mongoose");

const InvoiceDetailSchema = new mongoose.Schema(
  {
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "invoices",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    name: {
      type: String,
      required: true,
    }, // Lưu tên sản phẩm tại thời điểm mua
    priceAtTime: {
      type: Number,
      required: true,
    }, // Lưu giá tại thời điểm mua
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("invoicedetails", InvoiceDetailSchema);
