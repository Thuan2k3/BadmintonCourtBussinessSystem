const mongoose = require("mongoose");

const timeSlotBookingSchema = new mongoose.Schema({
  booking_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "bookings", // Tham chiếu đến bảng bookings
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  court: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "courts",
    required: true,
  },
  timeSlot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "timeslots",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    required: true,
    default: true,
  },
  status: {
    type: String,
    enum: ["pending", "no-show", "completed"],
    default: "pending", // Trạng thái đặt sân
  },
});

const TimeSlotBooking = mongoose.model(
  "timeslotbookings",
  timeSlotBookingSchema
);
module.exports = TimeSlotBooking;
