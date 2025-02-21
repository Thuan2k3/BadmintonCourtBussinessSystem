const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
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
