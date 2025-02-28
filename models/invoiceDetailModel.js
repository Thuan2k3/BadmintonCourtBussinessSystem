const mongoose = require("mongoose");

const InvoiceDetailSchema = new mongoose.Schema(
  {
    invoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "invoices",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    priceAtTime: {
      type: Number,
    },
    quantity: {
      type: Number,
      min: 1,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("invoicedetails", InvoiceDetailSchema);
