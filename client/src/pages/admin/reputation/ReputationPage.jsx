import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Link } from "react-router-dom";
import { AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import axios from "axios";
import { Pagination } from "antd";

const ReputationPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số khách hàng mỗi trang

  // 📌 Lấy danh sách khách hàng
  const getAccounts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/admin/customer",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.data.success) {
        const customers = res.data.data.filter(
          (acc) => acc.role === "customer"
        );
        setAccounts(customers);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách khách hàng:", error);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  // 📌 Loại bỏ dấu tiếng Việt
  const convertToUnsigned = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // 📌 Lọc khách hàng theo tên
  const filteredAccounts = accounts.filter((account) =>
    convertToUnsigned(account.full_name).includes(convertToUnsigned(searchTerm))
  );

  // 📌 Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 📌 Lấy dữ liệu của trang hiện tại
  const currentData = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          📊 QUẢN LÝ ĐIỂM UY TÍN KHÁCH HÀNG
        </h1>

        {/* ✅ Thanh tìm kiếm */}
        <div
          className="d-flex align-items-center mb-4"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            borderRadius: "30px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            padding: "8px 20px",
          }}
        >
          <AiOutlineSearch style={{ fontSize: "22px", color: "#555" }} />
          <input
            type="text"
            className="form-control border-0 shadow-none"
            placeholder="Tìm kiếm theo tên khách hàng..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset về trang đầu khi tìm kiếm
            }}
            style={{ paddingLeft: "10px", fontSize: "16px" }}
          />
        </div>

        {/* ✅ Bảng khách hàng */}
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-primary text-center">
              <tr>
                <th>#</th>
                <th>Họ và Tên</th>
                <th>Email</th>
                <th>Số Điện Thoại</th>
                <th>Điểm Uy Tín</th>
                <th>Hành Động</th>
              </tr>
            </thead>

            <tbody>
              {currentData.length > 0 ? (
                currentData.map((account, index) => (
                  <tr key={account._id} className="align-middle text-center">
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{account.full_name}</td>
                    <td>{account.email}</td>
                    <td>{account.phone}</td>
                    <td>
                      <span
                        className={`badge ${
                          account.reputation_score < 50
                            ? "bg-warning"
                            : "bg-primary"
                        }`}
                      >
                        {account.reputation_score}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/reputation/update/${account._id}`}>
                        <AiOutlineEdit className="fs-4 text-warning" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-danger fw-bold">
                    ❌ Không tìm thấy khách hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Phân trang với Ant Design */}
        {filteredAccounts.length > itemsPerPage && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              current={currentPage}
              total={filteredAccounts.length}
              pageSize={itemsPerPage}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReputationPage;
