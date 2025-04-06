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
  getAccountController,
  getCourtsWithBookingsController,
  getAllInvoicesController,
  createInvoiceController,
  getInvoiceDetailController,
  getTimeSlotBooking,
  getAllCustomerController,
} = require("../controllers/employeeCtrl");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleware(["employee"]), getAllUsersController);

// Lấy danh sách san
router.get("/court", authMiddleware(["employee"]), getAllCourtController);

// Lấy mot san
router.get("/court/:id", authMiddleware(["employee"]), getCourtController);

//Them san
router.post("/court", authMiddleware(["employee"]), createCourtController);

//cap nhat san
router.put("/court/:id", authMiddleware(["employee"]), updateCourtController);

//Xoa san
router.delete(
  "/court/:id",
  authMiddleware(["employee"]),
  deleteCourtController
);

//Route lay bookings tu court
router.get(
  "/bookings/court",
  authMiddleware(["employee"]),
  getCourtsWithBookingsController
);

// Lấy danh sách danh mục
router.get(
  "/product-categories",
  authMiddleware(["employee"]),
  getAllProductCategoryController
);
// Lấy một danh mục
router.get(
  "/product-categories/:id",
  authMiddleware(["employee"]),
  getProductCategoryByIdController
);

// Thêm danh mục mới
router.post(
  "/product-categories",
  authMiddleware(["employee"]),
  createProductCategoryController
);

router.put(
  "/product-categories/:id",
  authMiddleware(["employee"]),
  updateProductCategoryController
);

// Xóa danh mục
router.delete(
  "/product-categories/:id",
  authMiddleware(["employee"]),
  deleteProductCategoryController
);

// Lấy danh sách san pham
router.get("/product", authMiddleware(["employee"]), getAllProductController);

// Lấy mot san pham
router.get("/product/:id", authMiddleware(["employee"]), getProductController);

//Them san pham
router.post("/product", authMiddleware(["employee"]), createProductController);

//cap nhat san pham
router.put(
  "/product/:id",
  authMiddleware(["employee"]),
  updateProductController
);

//Xoa san pham
router.delete(
  "/product/:id",
  authMiddleware(["employee"]),
  deleteProductController
);

// Lấy danh sách khach hang
router.get("/customer", authMiddleware(["employee"]), getAllCustomerController);

// Lấy mot tai khoan
router.get("/account/:id", authMiddleware(["employee"]), getAccountController);

// Lấy danh sách hóa đơn
router.get("/invoice", authMiddleware(["employee"]), getAllInvoicesController);

// Tạo hóa đơn
router.post("/invoice", authMiddleware(["employee"]), createInvoiceController);

//Lấy hóa đơn theo id
router.get(
  "/invoice/:id",
  authMiddleware(["employee"]),
  getInvoiceDetailController
);

router.get(
  "/court/:courtId/:date/:time",
  authMiddleware(["employee"]),
  getTimeSlotBooking
);

module.exports = router;
