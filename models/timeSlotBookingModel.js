const mongoose = require("mongoose");

const timeSlotBookingSchema = new mongoose.Schema({
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
  time: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  isBooked: {
    type: Boolean,
    required: true,
    default: true,
  },
});

const TimeSlotBooking = mongoose.model(
  "timeslotbookings",
  timeSlotBookingSchema
);
module.exports = TimeSlotBooking;
