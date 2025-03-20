import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import axios from "axios";

const ProductCategoryPage = () => {
  const [productCategories, setProductCategories] = useState([]);

  // ✅ Lấy danh mục sản phẩm
  const getProductCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/employee/product-categories",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setProductCategories(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh mục sản phẩm:", error);
    }
  };

  useEffect(() => {
    getProductCategories();
  }, []);

  return (
    <Layout>
      <div
        className="p-4"
        style={{
          backgroundColor: "#f0f0f0",
          minHeight: "100vh",
          borderRadius: "10px",
        }}
      >
        <h1 className="text-center mb-4">📦 QUẢN LÝ DANH MỤC SẢN PHẨM</h1>

        {/* Nút thêm danh mục */}
        <div className="d-flex justify-content-end mb-4">
          <Link
            to="/employee/product-category/create"
            className="fs-1 text-success d-flex align-items-center"
            style={{ textDecoration: "none" }}
          >
            <MdOutlineAddBox />
            <span className="ms-2 fs-5">Thêm danh mục</span>
          </Link>
        </div>

        {/* Bảng hiển thị danh mục sản phẩm */}
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-primary text-center">
              <tr>
                <th>STT</th>
                <th>Tên danh mục</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {productCategories.map((category, index) => (
                <tr key={category._id} className="align-middle text-center">
                  <td>{index + 1}</td>
                  <td className="fw-semibold">{category.name}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-3">
                      <Link
                        to={`/employee/product-category/update/${category._id}`}
                      >
                        <AiOutlineEdit className="fs-4 text-warning" />
                      </Link>
                      <Link
                        to={`/employee/product-category/delete/${category._id}`}
                      >
                        <MdOutlineDelete className="fs-4 text-danger" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {productCategories.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center text-danger">
                    Không có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default ProductCategoryPage;
