import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import axios from "axios";
import { Tabs, Input } from "antd";
import Layout from "../../../components/Layout";

const { TabPane } = Tabs;

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy sản phẩm và danh mục từ API
  const fetchData = async () => {
    try {
      const [productRes, categoryRes] = await Promise.all([
        axios.get("http://localhost:8080/api/v1/employee/product", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
        axios.get("http://localhost:8080/api/v1/employee/product-categories", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }),
      ]);
      if (productRes.data.success && categoryRes.data.success) {
        setProducts(productRes.data.data);
        setCategories(categoryRes.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Loại bỏ dấu tiếng Việt và chuyển thành chữ thường
  const convertToUnsigned = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // ✅ Lọc sản phẩm theo danh mục và từ khóa tìm kiếm
  const filterProducts = (categoryId) =>
    products.filter(
      (product) =>
        (categoryId === "all" || product.category._id === categoryId) &&
        convertToUnsigned(product.name).includes(convertToUnsigned(searchTerm))
    );

  return (
    <Layout>
      <div
        className="p-3"
        style={{
          backgroundColor: "#f0f0f0",
          minHeight: "100vh",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h1 className="text-center mb-4">🎾 QUẢN LÝ SẢN PHẨM</h1>

        {/* Ô tìm kiếm và nút thêm sản phẩm */}
        <div className="d-flex flex-column align-items-center mb-4">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              maxWidth: "600px",
              width: "100%",
              borderRadius: "30px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              padding: "10px 20px",
            }}
          >
            <AiOutlineSearch style={{ fontSize: "20px", color: "#555" }} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                paddingLeft: "10px",
                flex: 1,
                fontSize: "16px",
                color: "#555",
                backgroundColor: "transparent",
              }}
            />
          </div>

          {/* Nút thêm sản phẩm */}
          <div className="align-self-end mt-3">
            <Link
              to="/employee/product/create"
              className="fs-1 text-success d-flex align-items-center"
              style={{ textDecoration: "none" }}
            >
              <MdOutlineAddBox />
              <span className="ms-2 fs-5">Thêm sản phẩm</span>
            </Link>
          </div>
        </div>

        {/* Tabs chia theo danh mục */}
        <Tabs defaultActiveKey="all" type="card">
          <TabPane tab="📋 Tất cả" key="all">
            {renderProductTable(filterProducts("all"))}
          </TabPane>

          {categories.map((category) => (
            <TabPane tab={category.name} key={category._id}>
              {renderProductTable(filterProducts(category._id))}
            </TabPane>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

// ✅ Hiển thị bảng sản phẩm (cải tiến giao diện)
const renderProductTable = (products) => (
  <div className="table-responsive">
    <table className="table table-hover table-bordered">
      <thead className="table-primary text-center">
        <tr>
          <th>STT</th>
          <th>Tên sản phẩm</th>
          <th>Danh mục</th>
          <th>Giá (VNĐ)</th>
          <th>Mô tả</th>
          <th>Hình ảnh</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product, index) => (
          <tr key={product._id} className="align-middle text-center">
            <td>{index + 1}</td>
            <td className="fw-semibold">{product.name}</td>
            <td>{product.category.name}</td>
            <td>{product.price.toLocaleString("vi-VN")}</td>
            <td className="text-start">{product.description}</td>
            <td>
              <img
                src={`http://localhost:8080${product.image}`}
                alt={product.name}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                }}
              />
            </td>
            <td>
              <div className="d-flex justify-content-center gap-3">
                <Link to={`/employee/product/update/${product._id}`}>
                  <AiOutlineEdit className="fs-4 text-warning" />
                </Link>
                <Link to={`/employee/product/delete/${product._id}`}>
                  <MdOutlineDelete className="fs-4 text-danger" />
                </Link>
              </div>
            </td>
          </tr>
        ))}
        {products.length === 0 && (
          <tr>
            <td colSpan="7" className="text-center text-danger">
              Không có sản phẩm nào.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default ProductPage;
