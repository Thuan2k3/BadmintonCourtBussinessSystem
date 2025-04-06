const express = require("express");
const {
  loginController,
  registerController,
  authController,
  getAllProductController,
  getAllCourtController,
  getCourtsWithBookingsController,
  createBookingWithCourtController,
  cancelBookingWithCourtController,
  getCommentByCourtController,
  createCommentController,
  updateCommentController,
  deleteCommentController,
  getCustomerController,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

//router onject
const router = express.Router();

//routes
//LOGIN || POST
router.post("/login", loginController);

//REGISTER || POST
router.post("/register", registerController);

//Auth || POST
router.post("/getUserData", authMiddleware(), authController);

//Route lay bookings tu court
router.get("/bookings/court", getCourtsWithBookingsController);

// Route tạo booking mới
router.post(
  "/bookings",
  authMiddleware("customer"),
  createBookingWithCourtController
);
router.delete(
  "/bookings/:bookingId",
  authMiddleware("customer"),
  cancelBookingWithCourtController
);

// Lấy mot khách hàng
router.get("/customer/:id", authMiddleware(["customer"]), getCustomerController);

// Lấy danh sách san
router.get("/court", getAllCourtController);

//Product || GET
// Lấy danh sách san pham
router.get("/product", getAllProductController);

// Lấy danh sách bình luận theo court_id
router.get("/comment/:court_id", getCommentByCourtController);

// Thêm bình luận mới
router.post("/comment", createCommentController);

// Cập nhật bình luận
router.put("/comment/:id", updateCommentController); // Dùng comment_id thay vì court_id

// Xóa bình luận
router.delete("/comment/:id", deleteCommentController); // Dùng comment_id thay vì court_id

module.exports = router;
