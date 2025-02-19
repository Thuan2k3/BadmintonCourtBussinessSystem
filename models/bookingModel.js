const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true,
  },
  timeSlots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "timeslotbookings",
    },
  ],
});

const Booking = mongoose.model("bookings", bookingSchema);
module.exports = Booking;
