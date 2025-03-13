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
router.post("/getUserData", authMiddleware, authController);

//Route lay bookings tu court
router.get("/bookings/court", getCourtsWithBookingsController);

// Route tạo booking mới
router.post("/bookings", authMiddleware, createBookingWithCourtController);
router.delete(
  "/bookings/:bookingId",
  authMiddleware,
  cancelBookingWithCourtController
);

// Lấy danh sách san
router.get("/court", getAllCourtController);

//Product || GET
// Lấy danh sách san pham
router.get("/product", getAllProductController);

module.exports = router;
