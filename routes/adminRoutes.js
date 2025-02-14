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

module.exports = router;
