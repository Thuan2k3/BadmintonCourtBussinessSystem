require("dotenv").config(); // thêm dòng này nếu chưa có

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Hàm chuyển đổi định dạng ngày
const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

// Hàm gửi email xác nhận đặt sân
const sendBookingConfirmation = async (toEmail, bookingInfo) => {
  const mailOptions = {
    from: `"Sân cầu lông" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Xác nhận đặt sân",
    html: `
      <h3>Chào bạn,</h3>
      <p>Bạn đã đặt sân thành công với thông tin sau:</p>
      <ul>
        <li><b>Ngày:</b> ${formatDate(bookingInfo.date)}</li>
        <li><b>Khung giờ:</b> ${bookingInfo.timeSlot}</li>
        <li><b>Sân:</b> ${bookingInfo.courtName}</li>
      </ul>
      <p>Xin cảm ơn bạn đã sử dụng dịch vụ!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Hàm gửi email xác nhận hủy đặt sân
const sendCancellationConfirmation = async (toEmail, bookingInfo) => {
  const mailOptions = {
    from: `"Sân cầu lông" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Xác nhận hủy đặt sân",
    html: `
      <h3>Chào bạn,</h3>
      <p>Đặt sân của bạn đã bị hủy thành công với thông tin sau:</p>
      <ul>
        <li><b>Ngày:</b> ${formatDate(bookingInfo.date)}</li>
        <li><b>Khung giờ:</b> ${bookingInfo.timeSlot.time}</li>
        <li><b>Sân:</b> ${bookingInfo.courtName}</li>
      </ul>
      <p>Xin cảm ơn bạn đã sử dụng dịch vụ!</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendBookingConfirmation, sendCancellationConfirmation };
