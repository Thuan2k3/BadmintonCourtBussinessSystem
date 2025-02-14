const User = require("../models/userModels");
const productCategory = require("../models/productCategoryModels");
const Product = require("../models/productModels");
const Court = require("../models/courtModel");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

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

//San pham
const createCourtController = async (req, res) => {
  try {
    const { name, price, description, image } = req.body;

    // Tạo sản phẩm mới
    const newCourt = new Court({
      name,
      price,
      description,
      image,
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
    const { name, price, description, image } = req.body;

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
    const { full_name, email, phone, address, role, isBlocked } = req.body;

    // Tìm và cập nhật tài khoản
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        full_name,
        email,
        phone,
        address,
        isAdmin: role === "admin",
        isStaff: role === "staff",
        isCustomer: role === "customer",
        isBlocked: isBlocked || false, // Thêm trạng thái khóa tài khoản
      },
      { new: true }
    );

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
      error,
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
