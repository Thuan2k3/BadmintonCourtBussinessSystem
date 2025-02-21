const User = require("../models/userModels");
const productCategory = require("../models/productCategoryModels");
const Product = require("../models/productModels");
const Court = require("../models/courtModel");
const TimeSlot = require("../models/timeSlotModel");
const TimeSlotBooking = require("../models/timeSlotBookingModel");
const Booking = require("../models/bookingModel");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

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

//Sân
const createCourtController = async (req, res) => {
  try {
    const { name, price, description, image, isEmpty } = req.body;

    // Tạo sản phẩm mới
    const newCourt = new Court({
      name,
      price,
      description,
      image,
      isEmpty: isEmpty !== undefined ? isEmpty : true, // Mặc định là trống
    });

    await newCourt.save();

    res.status(201).json({ success: true, data: newCourt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

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

const getCourtController = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }
    res.json({ success: true, data: court });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

const updateCourtController = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID sản phẩm
    const updateData = req.body; // Lấy dữ liệu cập nhật'
    const image = req.body.image;

    // Kiểm tra xem sản phẩm có tồn tại không
    const court = await Court.findById(id);
    if (!court) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const oldImageName = court.image.replace("/uploads/", "");
    const newImageName = image.replace("/uploads/", "");

    if (newImageName === oldImageName) {
      const updatedCourt = await Court.findByIdAndUpdate(
        id,
        { ...updateData },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Cập nhật sản phẩm thành công",
        court: updatedCourt,
      });
      return;
    }
    // Nếu có hình ảnh mới, xóa ảnh cũ
    const oldImagePath = path.join(__dirname, "..", "uploads", oldImageName);

    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath); // Xóa ảnh cũ
    }

    // Cập nhật dữ liệu sản phẩm
    const updatedCourt = await Court.findByIdAndUpdate(
      id,
      { ...updateData, image: image },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      court: updatedCourt,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const deleteCourtController = async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }

    // Xây dựng đường dẫn ảnh
    const imagePath = path.join(__dirname, "..", court.image);
    console.log("Đường dẫn ảnh:", imagePath);

    // Kiểm tra file có tồn tại không
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Xóa ảnh
      console.log("Ảnh đã bị xóa thành công.");
    } else {
      console.log("Ảnh không tồn tại hoặc đã bị xóa trước đó.");
    }

    // Xóa sản phẩm khỏi database
    await Court.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Xóa sản phẩm thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server!" });
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
    const { id } = req.params; // Lấy id từ request
    const deletedTimeSlot = await TimeSlot.findByIdAndDelete(id);

    if (!deletedTimeSlot) {
      return res
        .status(404)
        .json({ success: false, message: "Khung giờ không tồn tại!" });
    }

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

//Đặt sân
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

const createBookingWithCourtController = async (req, res) => {
  try {
    const { userId, courtId, date, timeSlot } = req.body;

    if (!userId || !courtId || !date || !timeSlot) {
      return res.status(400).json({ error: "Dữ liệu không hợp lệ!" });
    }

    const bookingDate = new Date(date);
    const today = new Date();
    today.setHours(7, 0, 0, 0);

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

    const today = new Date();
    today.setHours(7, 0, 0, 0);

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: "Không tìm thấy đặt sân." });
    }

    const bookingDate = new Date(booking.date);
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

//Danh muc
const getAllProductCategoryController = async (req, res) => {
  try {
    const productCategories = await productCategory.find();
    res.status(200).json({ success: true, data: productCategories });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

const getProductCategoryByIdController = async (req, res) => {
  try {
    const productCategoryById = await productCategory.findById(req.params.id); // Tìm theo ID

    if (!productCategoryById) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy danh mục" });
    }

    res.status(200).json({ success: true, data: productCategoryById });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

const createProductCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Tên danh mục là bắt buộc!" });
    }

    const existingProductCategory = await productCategory.findOne({ name });
    if (existingProductCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Danh mục đã tồn tại!" });
    }

    const newProductCategory = new productCategory({ name });
    await newProductCategory.save();

    res.status(201).json({
      success: true,
      message: "Thêm danh mục thành công!",
      productCategory: newProductCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

const updateProductCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedProductCategory = await productCategory.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedProductCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Danh mục không tồn tại!" });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật danh mục thành công!",
      productCategory: updatedProductCategory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

const deleteProductCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProductCategory = await productCategory.findByIdAndDelete(id);

    if (!deletedProductCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Danh mục không tồn tại!" });
    }

    res
      .status(200)
      .json({ success: true, message: "Xóa danh mục thành công!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

const createProductController = async (req, res) => {
  try {
    const { name, category, price, description, image } = req.body;

    // Tạo sản phẩm mới
    const newProduct = new Product({
      name,
      category,
      price,
      description,
      image,
    });

    await newProduct.save();

    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

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

const getProductController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error("Lỗi khi lấy sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

const updateProductController = async (req, res) => {
  try {
    const { id } = req.params; // Lấy ID sản phẩm
    const updateData = req.body; // Lấy dữ liệu cập nhật'
    const { name, category, price, description, image } = req.body;

    // Kiểm tra xem sản phẩm có tồn tại không
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    const oldImageName = product.image.replace("/uploads/", "");
    const newImageName = image.replace("/uploads/", "");

    if (newImageName === oldImageName) {
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { ...updateData },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Cập nhật sản phẩm thành công",
        product: updatedProduct,
      });
      return;
    }
    // Nếu có hình ảnh mới, xóa ảnh cũ
    const oldImagePath = path.join(__dirname, "..", "uploads", oldImageName);

    if (fs.existsSync(oldImagePath)) {
      fs.unlinkSync(oldImagePath); // Xóa ảnh cũ
    }

    // Cập nhật dữ liệu sản phẩm
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...updateData, image: image },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Cập nhật sản phẩm thành công",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại!" });
    }

    // Xây dựng đường dẫn ảnh
    const imagePath = path.join(__dirname, "..", product.image);
    console.log("Đường dẫn ảnh:", imagePath);

    // Kiểm tra file có tồn tại không
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath); // Xóa ảnh
      console.log("Ảnh đã bị xóa thành công.");
    } else {
      console.log("Ảnh không tồn tại hoặc đã bị xóa trước đó.");
    }

    // Xóa sản phẩm khỏi database
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Xóa sản phẩm thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

//Tai khoan
const getAllAccountController = async (req, res) => {
  try {
    // Truy vấn danh sách tài khoản, chỉ lấy các trường cần thiết
    const users = await User.find().select("-password"); // Loại bỏ trường mật khẩu để bảo mật

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

const getAccountController = async (req, res) => {
  try {
    const user = await User.findById(req.params.id); // Tìm tài khoản theo ID

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy tài khoản" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

const createAccountController = async (req, res) => {
  try {
    const { full_name, email, password, phone, address, role, isBlocked } =
      req.body;

    // Kiểm tra các trường bắt buộc
    if (!full_name || !email || !password || !phone || !address) {
      return res
        .status(400)
        .json({ success: false, message: "Vui lòng nhập đầy đủ thông tin!" });
    }

    // Kiểm tra tài khoản đã tồn tại chưa
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
      full_name,
      email,
      password: hashedPassword,
      phone,
      address,
      isAdmin: role && role === "admin",
      isStaff: role && role === "staff",
      isCustomer: role && role === "customer",
      isBlocked,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "Tạo tài khoản thành công!",
      user: newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Lỗi server", error });
  }
};

const updateAccountController = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone, address, role, isBlocked, password } =
      req.body;

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Chuẩn bị dữ liệu cập nhật
    const updateData = {
      full_name,
      email,
      phone,
      address,
      isAdmin: role === "admin",
      isStaff: role === "staff",
      isCustomer: role === "customer",
      isBlocked: isBlocked || false,
    };

    // Chỉ thêm password vào updateData nếu có
    if (hashedPassword) {
      updateData.password = hashedPassword;
    }

    // Tìm và cập nhật tài khoản
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật tài khoản thành công!",
      user: updatedUser,
    });
  } catch (error) {
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
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "Tài khoản không tồn tại!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Xóa tài khoản thành công!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error,
    });
  }
};

module.exports = {
  getAllUsersController,
  getAllCourtController,
  getCourtController,
  createCourtController,
  updateCourtController,
  deleteCourtController,
  getAllTimeSlotController,
  getTimeSlotController,
  createTimeSlotController,
  updateTimeSlotController,
  deleteTimeSlotController,
  getCourtsWithBookingsController,
  createBookingWithCourtController,
  cancelBookingWithCourtController,
  getAllProductCategoryController,
  getProductCategoryByIdController,
  createProductCategoryController,
  updateProductCategoryController,
  deleteProductCategoryController,
  getAllProductController,
  getProductController,
  createProductController,
  updateProductController,
  deleteProductController,
  getAllAccountController,
  getAccountController,
  createAccountController,
  updateAccountController,
  deleteAccountController,
};
