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
    name: {
      type: String,
    },
    priceAtTime: {
      type: Number,
    },
    quantity: {
      type: Number,
      min: 1,
    },
    totalCost: {
      type: Number,
      default: function () {
        return this.priceAtTime * this.quantity;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("invoicedetails", InvoiceDetailSchema);
