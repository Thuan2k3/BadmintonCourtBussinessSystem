const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courts",
      required: false,
    },
    invoiceDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "invoicedetails",
      },
    ],
    checkInTime: {
      type: Date,
      default: null,
    },
    checkOutTime: {
      type: Date,
      default: null, // Tránh lỗi nếu chưa check-out
    },
    totalAmount: {
      type: Number,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("invoices", InvoiceSchema);
