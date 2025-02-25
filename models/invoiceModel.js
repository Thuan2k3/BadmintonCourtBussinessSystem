const mongoose = require("mongoose");

const InvoiceSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: false,
    },
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "courts",
      required: false,
    },
    invoiceDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "invoicedetails", // Đặt tên tham chiếu rõ ràng
      },
    ],
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0, // Đảm bảo giá trị không âm
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("invoices", InvoiceSchema);