const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersController,
  getAllAccountController,
  getAccountController,
  createAccountController,
  updateAccountController,
  deleteAccountController,
  getAllTimeSlotController,
  getTimeSlotController,
  createTimeSlotController,
  updateTimeSlotController,
  deleteTimeSlotController,
  getRevenueController,
  getAllCustomerController,
  getCustomerController,
  updateReputationController,
} = require("../controllers/adminCtrl");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleware(["admin"]), getAllUsersController);

// Lấy danh sách khung gio
router.get("/time-slot", authMiddleware(["admin"]), getAllTimeSlotController);

// Lấy mot khung gio
router.get("/time-slot/:id", authMiddleware(["admin"]), getTimeSlotController);

//Them khung gio
router.post("/time-slot", authMiddleware(["admin"]), createTimeSlotController);

//cap nhat khung gio
router.put("/time-slot/:id", authMiddleware(["admin"]), updateTimeSlotController);

//Xoa khung gio
router.delete("/time-slot/:id", authMiddleware(["admin"]), deleteTimeSlotController);

// Lấy danh sách tai khoan
router.get("/account", authMiddleware(["admin"]), getAllAccountController);

// Lấy mot tai khoan
router.get("/account/:id", authMiddleware(["admin"]), getAccountController);

//Them tai khoan
router.post("/account", authMiddleware(["admin"]), createAccountController);

//cap nhat tai khoan
router.put("/account/:id", authMiddleware(["admin"]), updateAccountController);

//Xoa tai khoan
router.delete("/account/:id", authMiddleware(["admin"]), deleteAccountController);
// Lấy danh sách khách hàng
router.get("/customer", authMiddleware(["admin"]), getAllCustomerController);

// Lấy mot khách hàng
router.get("/customer/:id", authMiddleware(["admin"]), getCustomerController);

// Cập nhật điểm uy tin khách hàng
router.put("/reputation/:id", authMiddleware(["admin"]), updateReputationController);

// API: Thống kê tổng doanh thu theo ngày, tháng, năm
router.get("/revenue", authMiddleware(["admin"]), getRevenueController);

module.exports = router;
