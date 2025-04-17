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
const mongoose = require("mongoose");
const updateNoShowAndReputation = require("../utils/updateNoShow");
const dayjs = require("dayjs");

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
    const courts = await Court.find()
      .sort({ name: 1 })
      .collation({ locale: "en", strength: 1 }); // Sắp xếp theo tên sân (A → Z)

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
      return res.status(404).json({ message: "Sân không tồn tại!" });
    }

    // Kiểm tra xem sân có tồn tại trong timeslotbooking hoặc invoice không
    const isUsedInTimeslot = await TimeSlotBooking.exists({
      court: req.params.id,
    });
    const isUsedInInvoice = await Invoice.exists({ court: req.params.id });

    if (isUsedInTimeslot || isUsedInInvoice) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa sân vì đang được sử dụng!",
      });
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

    // Xóa sân khỏi database
    await Court.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Xóa sân thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa sân:", error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

//Đặt sân
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
      const result = [];
      const nowsystem = new Date();
      const now = new Date(nowsystem.getTime() + 7 * 60 * 60 * 1000);
      console.log(now);
      now.setUTCHours(0, 0, 0, 0);

      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() + i);

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");

        result.push(`${yyyy}-${mm}-${dd}`);
      }

      return result;
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

    // Kiểm tra xem danh mục có tồn tại không
    const category = await productCategory.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Danh mục không tồn tại!" });
    }

    // Kiểm tra xem danh mục có sản phẩm nào thuộc về nó không
    const isCategoryUsed = await Product.exists({ category: id });

    if (isCategoryUsed) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa danh mục vì đã có sản phẩm sử dụng!",
      });
    }

    // Nếu không có sản phẩm nào thuộc danh mục này, tiến hành xóa
    await productCategory.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Xóa danh mục thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
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
    const products = await Product.find()
      .populate("category")
      .sort({ name: 1 }) // Sắp xếp theo tên sản phẩm (A → Z)
      .collation({ locale: "en", strength: 1 })
      .exec();

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

    // Kiểm tra xem sản phẩm có trong InvoiceDetail không
    const isProductInInvoice = await InvoiceDetail.exists({
      product: req.params.id,
    });

    if (isProductInInvoice) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa sản phẩm vì đã có hóa đơn sử dụng!",
      });
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

// 📌 Lấy danh sách tất cả tài khoản (có populate thông tin chi tiết)
const getAllCustomerController = async (req, res) => {
  try {
    // Lấy danh sách tất cả tài khoản từ `users`, ẩn mật khẩu
    const users = await User.find().select("-password");

    // Chia danh sách theo role
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

//Hoa don
//Lấy danh sách hóa đơn
const getAllInvoicesController = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let filter = {};

    // Lọc theo khoảng thời gian tạo hóa đơn (timestamps)
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // set tới cuối ngày

      filter.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    // Lấy danh sách hóa đơn kèm thông tin chi tiết
    const invoices = await Invoice.find(filter)
      .populate("customer", "full_name email")
      .populate("employee", "full_name email")
      .populate("court", "full_name price")
      .populate({
        path: "invoiceDetails",
        populate: { path: "product", select: "name price" },
      })
      .sort({ createdAt: -1 }); // Sắp xếp mới nhất lên trước

    res
      .status(200)
      .json({ message: "Lấy danh sách hóa đơn thành công!", invoices });
  } catch (error) {
    console.error("Lỗi lấy danh sách hóa đơn:", error);
    res.status(500).json({ message: "Lỗi server!", error });
  }
};

// Tạo hóa đơn
const createInvoiceController = async (req, res) => {
  try {
    const {
      customer,
      employee,
      court,
      invoiceDetails,
      checkInTime,
      checkOutTime,
      totalAmount,
    } = req.body;

    if (!employee) {
      return res
        .status(400)
        .json({ message: "Nhân viên không được để trống!" });
    }

    const createdDetails = [];

    // Xử lý trường hợp mua sản phẩm
    if (invoiceDetails && invoiceDetails.length > 0) {
      for (const detail of invoiceDetails) {
        const newDetail = new InvoiceDetail({
          invoice: null, // Chưa có invoice ID
          product: detail.product,
          priceAtTime: detail.priceAtTime,
          quantity: detail.quantity,
        });

        await newDetail.save();
        createdDetails.push(newDetail._id);
      }
    }

    // Xử lý trường hợp thuê sân
    if (court) {
      const courtData = await Court.findById(court);
      if (!courtData) {
        return res.status(404).json({ message: "Sân không tồn tại!" });
      }
    }

    // Tạo hóa đơn mới
    const newInvoice = new Invoice({
      customer: customer || null,
      employee,
      court: court || null,
      invoiceDetails: createdDetails,
      checkInTime: checkInTime || null,
      checkOutTime: checkOutTime || null,
      totalAmount,
    });

    const invoice = await newInvoice.save();

    // Cập nhật invoice ID vào invoiceDetails
    await InvoiceDetail.updateMany(
      { _id: { $in: createdDetails } },
      { $set: { invoice: newInvoice._id } }
    );

    // ✅ Hàm làm tròn giờ
    const roundDownHour = (date) =>
      `${String(Math.floor(new Date(date).getHours())).padStart(2, "0")}:00`;
    const roundUpHour = (date) =>
      new Date(date).getMinutes() > 0
        ? `${String(new Date(date).getHours() + 1).padStart(2, "0")}:00`
        : `${String(new Date(date).getHours()).padStart(2, "0")}:00`;

    // ✅ Kiểm tra và cập nhật trạng thái completed
    if (customer && court && checkInTime && checkOutTime) {
      // Làm tròn giờ check-in xuống, check-out lên
      const checkInHour = parseInt(
        roundDownHour(checkInTime).split(":")[0],
        10
      );
      const checkOutHour = parseInt(
        roundUpHour(checkOutTime).split(":")[0],
        10
      );

      console.log(checkInHour);
      console.log(checkOutHour);
      const now = new Date(); // Khai báo biến now
      const vietnamOffset = 7 * 60 * 60 * 1000; // +7 giờ (theo mili giây)
      const bookingDate = new Date(now.getTime() + vietnamOffset);
      bookingDate.setUTCHours(0, 0, 0, 0);
      console.log(bookingDate);

      // Lặp qua từng khung giờ từ check-in đến check-out (đã làm tròn)
      for (let hour = checkInHour; hour < checkOutHour; hour++) {
        const timeSlot = `${String(hour).padStart(2, "0")}:00`;

        const booking = await TimeSlotBooking.findOne({
          user: customer,
          court: court,
          date: bookingDate, // So sánh đúng ngày
          time: timeSlot,
          status: "pending",
        });
        console.log(booking);
        console.log(bookingDate);

        if (booking) {
          // ✅ Cập nhật trạng thái thành completed
          booking.status = "completed";
          await booking.save();

          // ✅ Cộng 5 điểm uy tín cho mỗi khung giờ nếu chưa đạt 100
          const customerData = await Customer.findById(customer);
          if (customerData && customerData.reputation_score < 100) {
            const newReputation = Math.min(
              customerData.reputation_score + 5,
              100
            );
            customerData.reputation_score = newReputation;
            await customerData.save();

            console.log(
              `🎉 Đã cộng 5 điểm uy tín cho khách: ${customerData.full_name} tại khung giờ ${timeSlot}`
            );
          }
        }
      }
    }

    res.status(201).json({
      message: "Hóa đơn được tạo thành công!",
      invoice: {
        ...newInvoice._doc,
        _id: invoice._id,
        createdAt: newInvoice.createdAt,
      },
    });
  } catch (error) {
    console.error("Lỗi tạo hóa đơn:", error);
    res.status(500).json({ message: "Lỗi server!", error });
  }
};

const getInvoiceDetailController = async (req, res) => {
  try {
    const { id } = req.params;

    const invoice = await Invoice.findById(id)
      .populate("customer", "full_name email phone")
      .populate("employee", "full_name email phone")
      .populate("court", "name price")
      .populate({
        path: "invoiceDetails",
        populate: { path: "product", select: "name price" },
      });

    if (!invoice) {
      return res.status(404).json({ message: "Không tìm thấy hóa đơn!" });
    }

    res.status(200).json({ message: "Lấy hóa đơn thành công!", invoice });
  } catch (error) {
    console.error("Lỗi lấy hóa đơn:", error);
    res.status(500).json({ message: "Lỗi server!", error });
  }
};

const formatTime = (time) => {
  const [hours, minutes] = time.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
};

const getTimeSlotBooking = async (req, res) => {
  try {
    const { courtId, date, time } = req.params;
    const selectedDate = new Date(date);
    const normalizedTime = formatTime(time);

    const booking = await TimeSlotBooking.findOne({
      court: courtId,
      date: selectedDate,
      time: normalizedTime, // Lọc theo giờ
      isBooked: true,
    }).populate("user");

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đặt sân" });
    }

    res.json(booking);
  } catch (error) {
    console.error("Lỗi khi lấy timeslot booking:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getAllUsersController,
  getAllCourtController,
  getCourtController,
  createCourtController,
  updateCourtController,
  deleteCourtController,
  getCourtsWithBookingsController,
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
  getAllCustomerController,
  getAccountController,
  getAllInvoicesController,
  createInvoiceController,
  getInvoiceDetailController,
  getTimeSlotBooking,
};
