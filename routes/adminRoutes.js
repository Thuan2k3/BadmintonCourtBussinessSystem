const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getAllUsersController,
  getAllProductCategoryController,
  deleteProductCategoryController,
  updateProductCategoryController,
  getProductCategoryByIdController,
  createProductController,
  createProductCategoryController,
  getAllProductController,
  deleteProductController,
  getProductController,
  updateProductController,
  getAllCourtController,
  getCourtController,
  createCourtController,
  updateCourtController,
  deleteCourtController,
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
  getCourtsWithBookingsController,
  createBookingWithCourtController,
  cancelBookingWithCourtController,
  getAllInvoicesController,
  createInvoiceController,
  updateInvoiceController,
  checkOutInvoiceController,
  payInvoiceController,
} = require("../controllers/adminCtrl");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

// Lấy danh sách san
router.get("/court", authMiddleware, getAllCourtController);

// Lấy mot san
router.get("/court/:id", authMiddleware, getCourtController);

//Them san
router.post("/court", authMiddleware, createCourtController);

//cap nhat san
router.put("/court/:id", authMiddleware, updateCourtController);

//Xoa san
router.delete("/court/:id", authMiddleware, deleteCourtController);

// Lấy danh sách khung gio
router.get("/time-slot", authMiddleware, getAllTimeSlotController);

// Lấy mot khung gio
router.get("/time-slot/:id", authMiddleware, getTimeSlotController);

//Them khung gio
router.post("/time-slot", authMiddleware, createTimeSlotController);

//cap nhat khung gio
router.put("/time-slot/:id", authMiddleware, updateTimeSlotController);

//Xoa khung gio
router.delete("/time-slot/:id", authMiddleware, deleteTimeSlotController);

//Route lay bookings tu court
router.get("/bookings/court", authMiddleware, getCourtsWithBookingsController);

// Route tạo booking mới
router.post("/bookings", authMiddleware, createBookingWithCourtController);

router.delete(
  "/bookings/:bookingId",
  authMiddleware,
  cancelBookingWithCourtController
);

// Lấy danh sách danh mục
router.get(
  "/product-categories",
  authMiddleware,
  getAllProductCategoryController
);
// Lấy một danh mục
router.get(
  "/product-categories/:id",
  authMiddleware,
  getProductCategoryByIdController
);

// Thêm danh mục mới
router.post(
  "/product-categories",
  authMiddleware,
  createProductCategoryController
);

router.put(
  "/product-categories/:id",
  authMiddleware,
  updateProductCategoryController
);

// Xóa danh mục
router.delete(
  "/product-categories/:id",
  authMiddleware,
  deleteProductCategoryController
);

// Lấy danh sách san pham
router.get("/product", authMiddleware, getAllProductController);

// Lấy mot san pham
router.get("/product/:id", authMiddleware, getProductController);

//Them san pham
router.post("/product", authMiddleware, createProductController);

//cap nhat san pham
router.put("/product/:id", authMiddleware, updateProductController);

//Xoa san pham
router.delete("/product/:id", authMiddleware, deleteProductController);

// Lấy danh sách tai khoan
router.get("/account", authMiddleware, getAllAccountController);

// Lấy mot tai khoan
router.get("/account/:id", authMiddleware, getAccountController);

//Them tai khoan
router.post("/account", authMiddleware, createAccountController);

//cap nhat tai khoan
router.put("/account/:id", authMiddleware, updateAccountController);

//Xoa tai khoan
router.delete("/account/:id", authMiddleware, deleteAccountController);

// Lấy danh sách hóa đơn
router.get("/invoice", authMiddleware, getAllInvoicesController);

// Tạo hóa đơn
router.post("/invoice", authMiddleware, createInvoiceController);

module.exports = router;
