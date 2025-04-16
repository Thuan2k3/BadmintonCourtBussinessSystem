const User = require("../models/userModels");
const Admin = require("../models/adminModel");
const Employee = require("../models/employeeModel");
const Customer = require("../models/customerModel");
const productCategory = require("../models/productCategoryModels");
const Product = require("../models/productModels");
const Court = require("../models/courtModel");
const TimeSlot = require("../models/timeSlotModel");
const TimeSlotBooking = require("../models/timeSlotBookingModel");
const Booking = require("../models/bookingModel");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const Invoice = require("../models/invoiceModel");
const InvoiceDetail = require("../models/invoiceDetailModel");
const moment = require("moment");
const dayjs = require("dayjs");
const mongoose = require("mongoose");

const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).send({
      success: true,
      message: "users data list",
      data: users,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error while fetching users",
      error,
    });
  }
};

//Khung giờ
const getAllTimeSlotController = async (req, res) => {
  try {
    const timeSlots = await TimeSlot.find().sort({ time: 1 }); // Lấy tất cả khung giờ và sắp xếp theo thời gian
    res.status(200).json({
      success: true,
      message: "Lấy danh sách khung giờ thành công",
      data: timeSlots,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy danh sách khung giờ",
    });
  }
};

const getTimeSlotController = async (req, res) => {
  try {
    const { id } = req.params; // Lấy id từ tham số URL

    // Tìm khung giờ theo ID
    const timeSlot = await TimeSlot.findById(id);

    if (!timeSlot) {
      return res.status(404).json({
        success: false,
        message: "Khung giờ không tồn tại.",
      });
    }

    // Trả về kết quả cho client
    res.status(200).json({
      success: true,
      data: timeSlot,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy khung giờ.",
    });
  }
};

const createTimeSlotController = async (req, res) => {
  try {
    const { time } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!time) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập đầy đủ giờ." });
    }

    // Kiểm tra xem khung giờ đã tồn tại chưa
    const existingSlot = await TimeSlot.findOne({ time });
    if (existingSlot) {
      return res
        .status(400)
        .json({ success: false, message: "Khung giờ này đã tồn tại." });
    }

    // Tạo khung giờ mới
    const newTimeSlot = new TimeSlot({ time });
    await newTimeSlot.save();

    res.status(201).json({
      success: true,
      message: "Tạo khung giờ thành công!",
      data: newTimeSlot,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server!" });
  }
};
const updateTimeSlotController = async (req, res) => {
  try {
    const { id } = req.params; // Lấy id từ tham số URL
    const updateData = req.body; // Lấy dữ liệu cập nhật từ body của yêu cầu

    // Kiểm tra khung giờ có đang được sử dụng không
    const isBooked = await TimeSlotBooking.exists({ timeSlot: id });
    if (isBooked) {
      return res.status(400).json({
        success: false,
        message: "Không thể sửa khung giờ đã có đặt sân.",
      });
    }

    // Cập nhật khung giờ theo ID
    const updatedTimeSlot = await TimeSlot.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedTimeSlot) {
      return res.status(404).json({
        success: false,
        message: "Khung giờ không tồn tại.",
      });
    }

    // Trả về kết quả cho client
    res.status(200).json({
      success: true,
      data: updatedTimeSlot,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật khung giờ.",
    });
  }
};

const deleteTimeSlotController = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem khung giờ có tồn tại không
    const timeSlot = await TimeSlot.findById(id);
    if (!timeSlot) {
      return res
        .status(404)
        .json({ success: false, message: "Khung giờ không tồn tại!" });
    }

    // Kiểm tra xem khung giờ có đang được sử dụng trong TimeSlotBooking không
    const isBooked = await TimeSlotBooking.exists({ timeSlot: id });

    if (isBooked) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa khung giờ vì đang có người đặt!",
      });
    }

    // Xóa khung giờ nếu không có ai đặt
    await TimeSlot.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Xóa khung giờ thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa khung giờ:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi server khi xóa khung giờ!" });
  }
};

//Tai khoan
// 📌 Lấy danh sách tất cả tài khoản (có populate thông tin chi tiết)
const getAllAccountController = async (req, res) => {
  try {
    // Lấy danh sách tất cả tài khoản từ `users`, ẩn mật khẩu
    const users = await User.find().select("-password");

    // Chia danh sách theo role
    const admins = await Admin.find().select("-password");
    const employees = await Employee.find().select("-password");
    const customers = await Customer.find().select("-password");

    // Kết hợp tất cả vào một danh sách duy nhất
    const allAccounts = [...admins, ...employees, ...customers];

    res.status(200).json({
      success: true,
      data: allAccounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// 📌 Lấy thông tin một tài khoản (có populate thông tin chi tiết)
const getAccountController = async (req, res) => {
  try {
    // Tìm user theo ID (ẩn mật khẩu)
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy tài khoản",
      });
    }

    let userDetails = null;

    // Tìm thông tin chi tiết dựa trên vai trò
    if (user.role === "admin") {
      userDetails = await Admin.findById(req.params.id).select("-password");
    } else if (user.role === "employee") {
      userDetails = await Employee.findById(req.params.id).select("-password");
    } else if (user.role === "customer") {
      userDetails = await Customer.findById(req.params.id).select("-password");
    }

    // Nếu không có thông tin chi tiết trong bảng tương ứng
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: `Không tìm thấy thông tin chi tiết cho ${user.role}`,
      });
    }

    res.status(200).json({
      success: true,
      data: userDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const createAccountController = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      phone,
      address,
      role,
      isBlocked,
      hire_date,
    } = req.body;
    if (!role) role = "customer";

    if (!full_name || !email || !password || !phone || !address || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email đã tồn tại!" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      full_name,
      email,
      password: hashedPassword,
      phone,
      address,
      role,
      isBlocked: isBlocked || false,
    });

    let reference;
    if (role === "admin") {
      reference = new Admin({ _id: newUser._id, ...newUser.toObject() });
    } else if (role === "employee") {
      reference = new Employee({
        _id: newUser._id,
        ...newUser.toObject(),
        hire_date: hire_date || Date.now(),
      });
    } else {
      reference = new Customer({ _id: newUser._id, ...newUser.toObject() });
    }

    // Lưu dữ liệu
    await newUser.save();
    await reference.save();

    res.status(201).json({
      success: true,
      message: "Tạo tài khoản thành công!",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

const updateAccountController = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, address, role, isBlocked, hire_date } =
      req.body;
    let { password } = req.body;

    let updateData = { full_name, email, phone, address, isBlocked };

    // Kiểm tra user có tồn tại không
    let existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại!",
      });
    }

    const oldRole = existingUser.role;

    // Nếu có email mới, kiểm tra xem có bị trùng không
    if (email && email !== existingUser.email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail && existingEmail._id.toString() !== id) {
        return res.status(400).json({
          success: false,
          message: "Email đã tồn tại!",
        });
      }
      updateData.email = email;
    }

    // Nếu có mật khẩu mới, mã hóa trước khi cập nhật
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    } else {
      updateData.password = existingUser.password;
    }

    // Kiểm tra xem user có liên kết với hóa đơn hoặc lịch đặt sân không
    const hasLinkedRecords =
      (await Invoice.exists({
        $or: [{ customer: id }, { employee: id }],
      })) || (await TimeSlotBooking.exists({ customer: id }));

    if (oldRole !== role) {
      if (hasLinkedRecords) {
        return res.status(400).json({
          success: false,
          message:
            "Không thể cập nhật vai trò vì tài khoản đã tồn tại trong hóa đơn hoặc lịch đặt sân!",
        });
      }

      // Xóa vai trò cũ trước khi tạo mới
      await Promise.all([
        oldRole === "employee" && Employee.findByIdAndDelete(id),
        oldRole === "admin" && Admin.findByIdAndDelete(id),
        oldRole === "customer" && Customer.findByIdAndDelete(id),
      ]);

      // Đợi xóa xong rồi mới tạo mới
      const roleModelMap = {
        employee: Employee,
        admin: Admin,
        customer: Customer,
      };

      if (!roleModelMap[role]) {
        return res.status(400).json({
          success: false,
          message: "Vai trò không hợp lệ!",
        });
      }

      const newRoleData = {
        _id: id,
        ...updateData,
        ...(role === "employee" && { hire_date: hire_date || Date.now() }),
      };

      await roleModelMap[role].create(newRoleData);
    } else {
      // Nếu role không đổi, cập nhật dữ liệu theo bảng tương ứng
      const roleModelMap = {
        admin: Admin,
        employee: Employee,
        customer: Customer,
      };

      if (!roleModelMap[role]) {
        return res.status(400).json({
          success: false,
          message: "Vai trò không hợp lệ!",
        });
      }

      const updatedData =
        role === "employee"
          ? { ...updateData, hire_date: hire_date || existingUser.hire_date }
          : updateData;

      await roleModelMap[role].findByIdAndUpdate(id, updatedData, {
        new: true,
      });
    }

    // Cập nhật thông tin trong bảng User
    await User.findByIdAndUpdate(id, { ...updateData, role }, { new: true });

    res.status(200).json({
      success: true,
      message: "Cập nhật tài khoản thành công!",
    });
  } catch (error) {
    console.error(error); // Log lỗi chi tiết
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const deleteAccountController = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem tài khoản có tồn tại không trong tất cả bảng
    let existingUser = await User.findById(id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại!",
      });
    }

    const role = existingUser.role;

    // Kiểm tra xem tài khoản có trong TimeSlotBooking hoặc Invoice không
    const isInTimeSlotBooking = await TimeSlotBooking.exists({ user: id });
    const isInInvoice = await Invoice.exists({
      $or: [{ customer: id }, { employee: id }],
    });

    if (isInTimeSlotBooking || isInInvoice) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa tài khoản vì đã có lịch đặt sân hoặc hóa đơn!",
      });
    }

    // Xóa tài khoản từ bảng tương ứng với role
    if (role === "admin") {
      await Admin.findByIdAndDelete(id);
    } else if (role === "employee") {
      await Employee.findByIdAndDelete(id);
    } else if (role === "customer") {
      await Customer.findByIdAndDelete(id);
    }

    // Xóa tài khoản trong bảng users
    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Xóa tài khoản thành công!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

//Lấy khách hàng
//Tai khoan
// 📌 Lấy danh sách tất cả tài khoản (có populate thông tin chi tiết)
const getAllCustomerController = async (req, res) => {
  try {
    const customers = await Customer.find().select("-password");

    res.status(200).json({
      success: true,
      data: customers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const getCustomerController = async (req, res) => {
  try {
    // Tìm khách hàng theo ID (ẩn mật khẩu)
    const customer = await Customer.findById(req.params.id).select("-password");

    // Kiểm tra nếu không tìm thấy khách hàng
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khách hàng",
      });
    }

    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error("Lỗi khi lấy thông tin khách hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

const updateReputationController = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID khách hàng từ URL
    const { reputation_score } = req.body; // Lấy điểm uy tín từ request body

    // Kiểm tra dữ liệu đầu vào
    if (reputation_score === undefined || isNaN(reputation_score)) {
      return res.status(400).json({
        success: false,
        message: "Điểm uy tín không hợp lệ.",
      });
    }

    // Tìm khách hàng theo ID
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy khách hàng.",
      });
    }

    // Cập nhật điểm uy tín (đảm bảo không nhỏ hơn 0)
    customer.reputation_score = Math.max(0, reputation_score);
    await customer.save();

    res.status(200).json({
      success: true,
      message: "Cập nhật điểm uy tín thành công.",
      data: customer,
    });
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật điểm uy tín:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server.",
      error: error.message,
    });
  }
};

//Lấy tổng doanh thu
const getRevenueController = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    // Chuyển đổi ngày từ string sang object Date
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    let groupBy = {};
    if (type === "day") {
      groupBy = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
        day: { $dayOfMonth: "$createdAt" },
      };
    } else if (type === "month") {
      groupBy = {
        year: { $year: "$createdAt" },
        month: { $month: "$createdAt" },
      };
    } else if (type === "year") {
      groupBy = { year: { $year: "$createdAt" } };
    } else {
      return res.status(400).json({ message: "Loại thống kê không hợp lệ" });
    }

    // Truy vấn hóa đơn để tính tổng doanh thu
    const revenueData = await Invoice.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      {
        $group: {
          _id: groupBy,
          totalRevenue: { $sum: "$totalAmount" }, // Tổng doanh thu
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    res.json({ revenueData });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getAllUsersController,
  getAllTimeSlotController,
  getTimeSlotController,
  createTimeSlotController,
  updateTimeSlotController,
  deleteTimeSlotController,
  getAllAccountController,
  getAccountController,
  createAccountController,
  updateAccountController,
  deleteAccountController,
  getAllCustomerController,
  getCustomerController,
  updateReputationController,
  getRevenueController,
};
