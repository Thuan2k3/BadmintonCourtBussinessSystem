import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Link } from "react-router-dom";
import { AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import axios from "axios";

const CourtPage = () => {
  const [courts, setCourts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách sân
  const getAllCourts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/employee/court",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setCourts(res.data.data);
      }
    } catch (error) {
      console.log("Lỗi khi tải danh sách sân: ", error);
    }
  };

  useEffect(() => {
    getAllCourts();
  }, []);

  // Hàm loại bỏ dấu tiếng Việt
  const convertToUnsigned = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // Lọc sân theo tên (không phân biệt dấu)
  const filteredCourts = courts.filter((court) =>
    convertToUnsigned(court.name).includes(convertToUnsigned(searchTerm))
  );

  return (
    <Layout>
      <div
        className="p-4"
        style={{
          backgroundColor: "#f9f9f9",
          borderRadius: "12px",
          minHeight: "100vh",
        }}
      >
        {/* Tiêu đề */}
        <h1 className="text-center mb-4">
          🎾 <span>QUẢN LÝ SÂN</span>
        </h1>

        {/* Ô tìm kiếm và nút thêm sân */}
        <div className="d-flex flex-column align-items-center mb-4">
          {/* Ô tìm kiếm (Giống với phần product) */}
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
              placeholder="Tìm kiếm sân..."
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

          {/* Nút thêm sân */}
          <div className="align-self-end mt-3">
            <Link
              to="/employee/court/create"
              className="fs-1 text-success d-flex align-items-center"
              style={{ textDecoration: "none" }}
            >
              <MdOutlineAddBox />
              <span className="ms-2 fs-5">Thêm sân</span>
            </Link>
          </div>
        </div>

        {/* Bảng sân */}
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-primary text-center">
              <tr>
                <th>STT</th>
                <th>Tên sân</th>
                <th>Giá (VNĐ)</th>
                <th>Mô tả</th>
                <th>Hình ảnh</th>
                <th>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredCourts.map((court, index) => (
                <tr key={court._id} className="align-middle text-center">
                  <td>{index + 1}</td>
                  <td className="fw-semibold">{court.name}</td>
                  <td>{court.price.toLocaleString("vi-VN")} ₫</td>
                  <td className="text-start">{court.description}</td>
                  <td>
                    <img
                      src={`http://localhost:8080${court.image}`}
                      alt={court.name}
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
                      {/* Nút sửa */}
                      <Link to={`/employee/court/update/${court._id}`}>
                        <AiOutlineEdit className="fs-4 text-warning" />
                      </Link>

                      {/* Nút xóa */}
                      <Link to={`/employee/court/delete/${court._id}`}>
                        <MdOutlineDelete className="fs-4 text-danger" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCourts.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-danger">
                    Không tìm thấy sân nào.
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

export default CourtPage;
