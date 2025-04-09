const cron = require("node-cron");
const updateNoShowAndReputation = require("./updateNoShow");

// Lên lịch chạy hàm updateNoShowAndReputation lúc 01:00 mỗi ngày
cron.schedule(
  "0 1 * * *",
  async () => {
    console.log("🔔 Đang kiểm tra và cập nhật trạng thái no-show...");
    await updateNoShowAndReputation();
  },
  {
    timezone: "Asia/Ho_Chi_Minh", // ✅ Thêm timezone Việt Nam
  }
);
updateNoShowAndReputation();
