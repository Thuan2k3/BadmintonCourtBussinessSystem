const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true,
  },
  timeSlots: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "timeslots",
    },
  ],
});

const Booking = mongoose.model("bookings", bookingSchema);

module.exports = Booking;
