import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Link } from "react-router-dom";
import { AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import axios from "axios";
import { Pagination } from "antd";

const TimeSlotPage = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số khung giờ mỗi trang

  // 📌 Lấy danh sách khung giờ
  const getTimeSlots = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/admin/time-slot",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setTimeSlots(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khung giờ:", error);
    }
  };

  useEffect(() => {
    getTimeSlots();
  }, []);

  // 📌 Loại bỏ dấu tiếng Việt
  const convertToUnsigned = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // 📌 Lọc khung giờ theo từ khóa
  const filteredTimeSlots = timeSlots.filter((timeSlot) =>
    convertToUnsigned(timeSlot.time).includes(convertToUnsigned(searchTerm))
  );

  // 📌 Tính toán dữ liệu theo trang
  const totalItems = filteredTimeSlots.length;
  const currentData = filteredTimeSlots.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 📌 Chuyển trang
  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <Layout>
      <div
        className="p-4"
        style={{
          backgroundColor: "#f9f9f9",
          minHeight: "100vh",
          borderRadius: "12px",
        }}
      >
        <h1 className="text-center mb-4" style={{ color: "#2c3e50" }}>
          🕒 QUẢN LÝ KHUNG GIỜ
        </h1>

        {/* ✅ Thanh tìm kiếm (căn giữa) */}
        <div className="d-flex justify-content-center mb-3">
          <div
            className="d-flex align-items-center"
            style={{
              maxWidth: "600px",
              borderRadius: "30px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              padding: "8px 20px",
              flex: 1,
            }}
          >
            <AiOutlineSearch style={{ fontSize: "22px", color: "#555" }} />
            <input
              type="text"
              className="form-control border-0 shadow-none"
              placeholder="Tìm kiếm khung giờ..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
              }}
              style={{ paddingLeft: "10px", fontSize: "16px" }}
            />
          </div>
        </div>

        {/* ✅ Nút thêm mới (căn giữa dưới thanh tìm kiếm) */}
        <div className="d-flex justify-content-end mt-3" style={{paddingBottom: "20px"}}>
          <Link
            to="/admin/time-slot/create"
            className="fs-1 text-success d-flex align-items-center"
            style={{ textDecoration: "none" }}
          >
            <MdOutlineAddBox />
            <span className="ms-2 fs-5">Thêm khung giờ</span>
          </Link>
        </div>

        {/* ✅ Bảng khung giờ */}
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-primary text-center">
              <tr>
                <th>STT</th>
                <th>Khung Giờ</th>
                <th>Hành Động</th>
              </tr>
            </thead>

            <tbody>
              {currentData.length > 0 ? (
                currentData.map((timeSlot, index) => (
                  <tr key={timeSlot._id} className="align-middle text-center">
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{timeSlot.time}</td>
                    <td>
                      <Link
                        to={`/admin/time-slot/update/${timeSlot._id}`}
                        className="text-warning me-3"
                      >
                        <AiOutlineEdit className="fs-4" />
                      </Link>
                      <Link to={`/admin/time-slot/delete/${timeSlot._id}`}>
                        <MdOutlineDelete className="fs-4 text-danger" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center text-danger fw-bold">
                    ❌ Không tìm thấy khung giờ nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Phân trang với Ant Design */}
        {totalItems > itemsPerPage && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={totalItems}
              onChange={handlePageChange}
              showSizeChanger={false}
              className="mt-4 text-center"
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TimeSlotPage;
