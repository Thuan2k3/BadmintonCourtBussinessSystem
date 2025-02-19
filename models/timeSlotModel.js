const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: false,
  },
  time: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const TimeSlot = mongoose.model("timeslots", timeSlotSchema);

module.exports = TimeSlot;
