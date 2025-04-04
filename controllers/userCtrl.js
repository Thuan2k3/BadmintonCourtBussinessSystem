const userModel = require("../models/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const productCategory = require("../models/productCategoryModels");
const Product = require("../models/productModels");
const Court = require("../models/courtModel");
const TimeSlot = require("../models/timeSlotModel");
const TimeSlotBooking = require("../models/timeSlotBookingModel");
const Booking = require("../models/bookingModel");
const fs = require("fs");
const path = require("path");
const Invoice = require("../models/invoiceModel");
const InvoiceDetail = require("../models/invoiceDetailModel");
const Customer = require("../models/customerModel");
const moment = require("moment");
const dayjs = require("dayjs");
const Comment = require("../models/commentModel");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

//register callback
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(200)
        .send({ message: "User Already Exist", success: false });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    req.body.password = hashPassword;
    const newUser = new userModel(req.body);
    await newUser.save();
    res.status(201).send({ message: "Register Successfully", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: `Register Controller ${error.message}`,
    });
  }
};

//Login callback
const loginController = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ message: "Email hoặc mật khẩu không đúng", success: false });
    }
    if (user.isBlocked) {
      return res
        .status(200)
        .send({ message: "Tài khoản của bạn đã bị khóa!", success: false });
    }
    if (user.role === "customer") {
      const customer = await Customer.findOne({ email: req.body.email });
      if (customer.reputation_score < 10) {
        return res.status(200).send({
          message: "Bạn không thể đăng nhập vì điểm uy tín thấp!",
          success: false,
        });
      }
    }

    const isMath = await bcrypt.compare(req.body.password, user.password);
    if (!isMath) {
      return res.status(200).send({
        message: "Email hoặc mật khẩu không đúng!",
        success: false,
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .send({ message: "Đăng nhập thành công", success: true, token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: `Lỗi trong Login Controller ${error.message}` });
  }
};

const authController = async (req, res) => {
  try {
    const user = await userModel.findById({ _id: req.body.userId });
    user.password = undefined;
    if (!user) {
      return res.status(200).send({
        message: "user not found",
        success: false,
      });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "auth error",
      success: false,
      error,
    });
  }
};

//Lay san voi bookings
const getCourtsWithBookingsController = async (req, res) => {
  try {
    const courts = await Court.find()
      .populate("bookings")
      .sort({ name: 1 })
      .collation({ locale: "en", strength: 1 })
      .lean();

    const timeSlots = await TimeSlot.find().lean();
    const timeSlotBookings = await TimeSlotBooking.find()
      .populate("user", "full_name email")
      .lean();

    // Hàm lấy 7 ngày tiếp theo
    const getNext7Days = () => {
      return Array.from({ length: 7 }, (_, i) => {
        return dayjs()
          .tz("Asia/Ho_Chi_Minh")
          .add(i, "day")
          .format("YYYY-MM-DD");
      });
    };

    const dates = getNext7Days();

    const courtsWithBookings = courts.map((court) => {
      return {
        ...court,
        bookings: dates.map((date) => {
          const courtBookings = timeSlotBookings.filter((ts) => {
            const bookingDate = dayjs(ts.date).format("YYYY-MM-DD");
            return (
              ts.court.toString() === court._id.toString() &&
              bookingDate === date
            );
          });

          // Kiểm tra booking của từng sân theo ngày
          const booking = court.bookings.find((b) => {
            const bookingDate = dayjs(b.date).format("YYYY-MM-DD");
            return bookingDate === date;
          });

          // Xử lý trạng thái của từng khung giờ
          const timeSlotsWithStatus = timeSlots
            .map((slot) => {
              const bookedSlot = courtBookings.find(
                (booking) => booking.time === slot.time
              );

              return bookedSlot
                ? {
                    timeSlotBooking_id: bookedSlot._id,
                    userId: bookedSlot.user ? bookedSlot.user._id : null,
                    full_name: bookedSlot.user
                      ? bookedSlot.user.full_name
                      : null,
                    email: bookedSlot.user ? bookedSlot.user.email : null,
                    time: bookedSlot.time,
                    isBooked: true,
                  }
                : {
                    timeSlotBooking_id: null,
                    userId: null,
                    full_name: null,
                    email: null,
                    time: slot.time,
                    isBooked: false,
                  };
            })
            .sort((a, b) => a.time.localeCompare(b.time)); // Sắp xếp theo giờ tăng dần

          return {
            date,
            court_id: court._id,
            booking_id: booking ? booking._id : null,
            timeSlots: timeSlotsWithStatus,
          };
        }),
      };
    });

    res.json(courtsWithBookings);
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

const createBookingWithCourtController = async (req, res) => {
  try {
    const { userId, courtId, date, timeSlot } = req.body;

    if (!userId || !courtId || !date || !timeSlot) {
      return res.status(400).json({ error: "Dữ liệu không hợp lệ!" });
    }

    // Chuyển ngày đặt sân về 00:00:00 UTC+7
    const bookingDate = dayjs(date)
      .tz("Asia/Ho_Chi_Minh")
      .startOf("day")
      .toDate();
    bookingDate.setHours(7, 0, 0, 0);

    // Lấy ngày hiện tại theo giờ Việt Nam (00:00:00)
    const today = dayjs().tz("Asia/Ho_Chi_Minh").startOf("day").toDate();

    if (bookingDate <= today) {
      return res
        .status(400)
        .json({ error: "Bạn chỉ có thể đặt sân trước ít nhất 1 ngày." });
    }

    // Kiểm tra xem khung giờ này đã được đặt chưa
    const existingTimeSlotBooking = await TimeSlotBooking.findOne({
      court: courtId,
      date: bookingDate,
      time: timeSlot,
    });

    if (existingTimeSlotBooking) {
      return res
        .status(400)
        .json({ error: `Khung giờ ${timeSlot} đã được đặt.` });
    }

    // Tìm booking đã tồn tại trong ngày đó
    let booking = await Booking.findOne({ date: bookingDate });

    // Nếu chưa có booking nào trong ngày, tạo mới
    if (!booking) {
      booking = new Booking({
        date: bookingDate,
        timeSlots: [],
      });
      await booking.save();
    }

    const timeSlotId = await TimeSlot.findOne({ time: timeSlot });

    // Tạo TimeSlotBooking mới
    const newTimeSlotBooking = new TimeSlotBooking({
      user: userId,
      court: courtId,
      date: bookingDate,
      time: timeSlot,
      timeSlot: timeSlotId,
      isBooked: true,
      booking_id: booking._id,
    });

    await newTimeSlotBooking.save();

    // Cập nhật timeSlots trong Booking
    await Booking.findByIdAndUpdate(booking._id, {
      $push: { timeSlots: newTimeSlotBooking._id },
    });

    // Thêm booking_id vào Court nếu chưa có
    await Court.findByIdAndUpdate(courtId, {
      $addToSet: { bookings: booking._id }, // Tránh thêm trùng booking_id
    });

    res.status(200).json({ success: true, message: "Đặt sân thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};
const cancelBookingWithCourtController = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { timeSlotId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Không tìm thấy đặt sân." });
    }

    // Chuyển ngày đặt sân về 00:00:00 UTC+7
    const bookingDate = dayjs(booking.date)
      .tz("Asia/Ho_Chi_Minh")
      .startOf("day")
      .toDate();
    bookingDate.setHours(7, 0, 0, 0);

    // Lấy ngày hiện tại theo giờ Việt Nam (00:00:00)
    const today = dayjs().tz("Asia/Ho_Chi_Minh").startOf("day").toDate();
    if (bookingDate <= today) {
      return res
        .status(400)
        .json({ error: "Bạn chỉ có thể hủy sân trước ít nhất 1 ngày." });
    }

    // Xóa TimeSlotBooking
    const deletedBooking = await TimeSlotBooking.findOneAndDelete({
      _id: timeSlotId,
    });

    if (!deletedBooking) {
      return res
        .status(404)
        .json({ error: "Không tìm thấy khung giờ đặt hoặc đã bị hủy." });
    }

    // Cập nhật Booking, xóa timeSlot khỏi danh sách
    await Booking.findByIdAndUpdate(bookingId, {
      $pull: { timeSlots: timeSlotId },
    });

    // Lấy lại danh sách timeSlots sau khi xóa
    const updatedBooking = await Booking.findById(bookingId);

    // Nếu mảng timeSlots trống, thì xóa booking
    if (updatedBooking.timeSlots.length === 0) {
      // Xóa Booking
      await Booking.findByIdAndDelete(bookingId);

      // Xóa booking khỏi danh sách bookings của sân
      await Court.updateOne(
        { bookings: bookingId },
        { $pull: { bookings: bookingId } }
      );

      return res.status(200).json({
        success: true,
        message:
          "Hủy đặt sân thành công! Đã xóa booking vì không còn khung giờ nào.",
      });
    }

    res
      .status(200)
      .json({ success: true, message: "Hủy khung giờ thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

//Product
const getAllProductController = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category")
      .sort({ name: 1 })
      .collation({ locale: "en", strength: 1 })
      .exec(); // Lấy tất cả sản phẩm từ DB

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

//Court
const getAllCourtController = async (req, res) => {
  try {
    const courts = await Court.find()
      .sort({ name: 1 })
      .collation({ locale: "en", strength: 1 }); // Lấy tất cả sản phẩm từ DB

    res.status(200).json({
      success: true,
      count: courts.length,
      data: courts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Controller để lấy bình luận theo court_id
const getCommentByCourtController = async (req, res) => {
  const { court_id } = req.params;

  try {
    // Lấy tất cả bình luận của sân cụ thể
    const comments = await Comment.find({ court_id })
      .populate("customer_id", "full_name email") // Populate thông tin khách hàng
      .populate("court_id", "name"); // Populate thông tin sân

    // Trả về danh sách bình luận
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy bình luận", error });
  }
};

// Controller để thêm bình luận mới
const createCommentController = async (req, res) => {
  const { customer_id, court_id, content } = req.body;

  if (!customer_id || !court_id || !content) {
    return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
  }

  try {
    // Tạo bình luận mới
    const newComment = new Comment({
      customer_id,
      court_id,
      content,
    });

    // Lưu bình luận vào database
    const savedComment = await newComment.save();

    // Trả về bình luận đã lưu
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm bình luận", error });
  }
};

// Controller để cập nhật bình luận
const updateCommentController = async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;

  try {
    // Lấy bình luận theo comment_id
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Bình luận không tồn tại" });
    }

    // Kiểm tra quyền sửa bình luận (chỉ cho phép sửa bình luận của chính người dùng)
    if (comment.customer_id.toString() !== req.body.customer_id) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền sửa bình luận này" });
    }

    // Cập nhật nội dung bình luận và thời gian cập nhật
    comment.content = content;
    comment.updated_at = Date.now(); // Cập nhật thời gian sửa

    // Lưu bình luận đã cập nhật
    const updatedComment = await comment.save();

    // Trả về bình luận đã cập nhật
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi sửa bình luận", error });
  }
};

// Controller để xóa bình luận
const deleteCommentController = async (req, res) => {
  const { id } = req.params;
  const { customer_id } = req.headers; // Lấy customer_id từ header

  try {
    // Lấy bình luận theo comment_id
    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: "Bình luận không tồn tại" });
    }

    // Kiểm tra quyền xóa bình luận (chỉ cho phép xóa bình luận của chính người dùng)
    if (comment.customer_id.toString() !== customer_id) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền xóa bình luận này" });
    }

    await Comment.deleteOne({ _id: id });

    // Trả về phản hồi thành công
    res.status(200).json({ message: "Bình luận đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa bình luận", error });
  }
};

module.exports = {
  loginController,
  registerController,
  authController,
  getAllCourtController,
  getAllProductController,
  getCourtsWithBookingsController,
  createBookingWithCourtController,
  cancelBookingWithCourtController,
  getCommentByCourtController,
  createCommentController,
  updateCommentController,
  deleteCommentController,
};
