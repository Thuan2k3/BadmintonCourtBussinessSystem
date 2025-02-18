const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    required: true,
  },
});

const TimeSlot = mongoose.model("timeslots", timeSlotSchema);

module.exports = TimeSlot;
