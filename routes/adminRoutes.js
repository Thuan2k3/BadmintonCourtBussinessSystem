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
} = require("../controllers/adminCtrl");

const router = express.Router();

//GET METHOD || USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

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

//POST METHOD || PRODUCT
router.post("/product", authMiddleware, createProductController);

module.exports = router;
