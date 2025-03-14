const TimeSlotBooking = require("../models/timeSlotBookingModel");
const Customer = require("../models/customerModel");

const updateNoShowAndReputation = async () => {
  try {
    const now = new Date(); // Khai báo biến now
    const vietnamOffset = 7 * 60 * 60 * 1000; // +7 giờ (theo mili giây)
    const yesterday = new Date(now.getTime() + vietnamOffset);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setUTCHours(0, 0, 0, 0);

    // Tìm tất cả booking "pending" của ngày hôm trước
    const pendingBookings = await TimeSlotBooking.find({
      status: "pending",
      date: yesterday,
    }).populate("user");

    for (const booking of pendingBookings) {
      // Cập nhật trạng thái thành "no-show"
      booking.status = "no-show";
      await booking.save();

      // Trừ 10 điểm uy tín (không dưới 0)      
      if (booking.user && booking.user.reputation_score > 0) {
        const newScore = Math.max(0, booking.user.reputation_score - 10);
        await Customer.findByIdAndUpdate(booking.user._id, {
          reputation_score: newScore,
        });

        console.log(
          `🔴 Đã trừ 10 điểm uy tín cho khách: ${booking.user.full_name}`
        );
      }
    }

    console.log("✅ Cập nhật trạng thái no-show hoàn tất!");
  } catch (error) {
    console.error("❌ Lỗi cập nhật trạng thái no-show:", error);
  }
};

module.exports = updateNoShowAndReputation;
