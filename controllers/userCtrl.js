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
const moment = require("moment");

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
        .send({ message: "user not found", success: false });
    }
    if (user.isBlocked) {
      return res
        .status(200)
        .send({ message: "Tài khoản của bạn đã bị khóa!", success: false });
    }

    const isMath = await bcrypt.compare(req.body.password, user.password);
    if (!isMath) {
      return res
        .status(200)
        .send({ message: "Invalid Email or Password", success: false });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.status(200).send({ message: "Login Success", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: `Error in Login CTRL ${error.message}` });
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
    const courts = await Court.find().populate("bookings").lean();
    const timeSlots = await TimeSlot.find().lean();
    const timeSlotBookings = await TimeSlotBooking.find()
      .populate("user", "full_name email")
      .lean();

    const getNext7Days = () => {
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date.toISOString().split("T")[0];
      });
    };

    const dates = getNext7Days();

    const courtsWithBookings = courts.map((court) => {
      return {
        ...court,
        bookings: dates.map((date) => {
          const courtBookings = timeSlotBookings.filter(
            (ts) =>
              ts.court.toString() === court._id.toString() &&
              ts.date.toISOString().split("T")[0] === date
          );

          // Nếu có ít nhất một booking cho ngày này, lấy booking_id của booking đầu tiên (hoặc có thể tùy chỉnh logic lấy booking_id khác)
          const booking = court.bookings.find(
            (b) => b.date.toISOString().split("T")[0] === date
          );

          const timeSlotsWithStatus = timeSlots.map((slot) => {
            const bookedSlot = courtBookings.find(
              (booking) => booking.time === slot.time
            );

            return bookedSlot
              ? {
                  timeSlotBooking_id: bookedSlot._id,
                  userId: bookedSlot.user ? bookedSlot.user._id : null,
                  full_name: bookedSlot.user ? bookedSlot.user.full_name : null,
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
          });

          return {
            date,
            court_id: court._id,
            booking_id: booking ? booking._id : null, // Đưa booking_id ra ngoài timeSlots
            timeSlots: timeSlotsWithStatus,
          };
        }),
      };
    });

    res.json(courtsWithBookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

//Product
const getAllProductController = async (req, res) => {
  try {
    const products = await Product.find().populate("category").exec(); // Lấy tất cả sản phẩm từ DB

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
    const courts = await Court.find(); // Lấy tất cả sản phẩm từ DB

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

module.exports = {
  loginController,
  registerController,
  authController,
  getAllCourtController,
  getAllProductController,
  getCourtsWithBookingsController,
};
