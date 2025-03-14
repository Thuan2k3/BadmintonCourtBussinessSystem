import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import axios from "axios";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách sản phẩm từ API
  const getAllProducts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/employee/product",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // Hàm loại bỏ dấu tiếng Việt
  const convertToUnsigned = (str) => {
    return str
      .normalize("NFD") // Tách các ký tự có dấu thành ký tự gốc + dấu
      .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
      .toLowerCase(); // Chuyển thành chữ thường
  };

  // Lọc sản phẩm theo tên (không phân biệt dấu)
  const filteredProducts = products.filter((product) =>
    convertToUnsigned(product.name).includes(convertToUnsigned(searchTerm))
  );

  return (
    <Layout>
      <div className="p-2">
        <h1 className="d-flex justify-content-center">QUẢN LÝ SẢN PHẨM</h1>

        {/* Ô tìm kiếm */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Link
          to="/employee/product/create"
          className="d-flex justify-content-end fs-1"
        >
          <MdOutlineAddBox />
        </Link>

        <table className="table table-bordered table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Danh mục</th>
              <th>Giá</th>
              <th>Mô tả</th>
              <th>Hình ảnh</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr key={product._id} className="align-middle text-center">
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>{product.category.name}</td>
                <td>{product.price}</td>
                <td>{product.description}</td>
                <td>
                  <img
                    src={`http://localhost:8080${product.image}`}
                    alt="Product"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
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

            {/* Hiển thị nếu không có sản phẩm nào */}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-danger">
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ProductPage;
