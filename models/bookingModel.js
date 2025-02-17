const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  court_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courts",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
  total_price: {
    type: Number,
  },
  isCancel: {
    type: Boolean,
    default: false,
  },
});

// Middleware tự động tính tổng tiền trước khi lưu
BookingSchema.pre("save", async function (next) {
  try {
    const Court = require("./courtModel"); // Import CourtModel
    const court = await Court.findById(this.court_id);
    if (!court) return next(new Error("Sân không tồn tại"));

    // Tính thời gian thuê sân
    const hours = (this.end_time - this.start_time) / (1000 * 60 * 60);
    this.total_price = Math.ceil(hours) * court.price; // Làm tròn giờ

    next();
  } catch (error) {
    next(error);
  }
});

const Booking = mongoose.model("bookings", BookingSchema);
module.exports = Booking;
