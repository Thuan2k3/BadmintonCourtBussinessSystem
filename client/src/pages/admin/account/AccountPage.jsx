import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import axios from "axios";
import { Tabs, Input, Pagination } from "antd";
import Layout from "../../../components/Layout";

const { TabPane } = Tabs;

const AccountPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const itemsPerPage = 5; // Số tài khoản mỗi trang

  // 📌 Lấy danh sách tài khoản
  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/admin/account",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.data.success) {
        setAccounts(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi tải tài khoản:", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  // 📌 Chuyển đổi không dấu (để tìm kiếm không phân biệt dấu)
  const convertToUnsigned = (str) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  // 📌 Lọc tài khoản theo vai trò và từ khóa
  const filterAccounts = (role) =>
    accounts.filter(
      (acc) =>
        (role === "all" || acc.role === role) &&
        convertToUnsigned(acc.full_name).includes(convertToUnsigned(searchTerm))
    );

  // 📌 Chuyển trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 📌 Hiển thị bảng tài khoản
  const renderAccountTable = (role) => {
    const filteredData = filterAccounts(role);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const displayedData = filteredData.slice(
      startIndex,
      startIndex + itemsPerPage
    );

    return (
      <>
        <div className="table-responsive">
          <table className="table table-hover table-bordered">
            <thead className="table-primary text-center">
              <tr>
                <th>STT</th>
                <th>Họ và tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                {role === "employee" && <th>Ngày nhận việc</th>}
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {displayedData.length > 0 ? (
                displayedData.map((acc, index) => (
                  <tr key={acc._id} className="align-middle text-center">
                    <td>{startIndex + index + 1}</td>
                    <td className="fw-semibold">{acc.full_name}</td>
                    <td>{acc.email}</td>
                    <td>{acc.phone}</td>
                    <td>{acc.address}</td>
                    {role === "employee" && (
                      <td>{new Date(acc.hire_date).toLocaleDateString()}</td>
                    )}
                    <td>{acc.isBlocked ? "Bị khóa" : "Hoạt động"}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-3">
                        <Link to={`/admin/account/update/${acc._id}`}>
                          <AiOutlineEdit className="fs-4 text-warning" />
                        </Link>
                        <Link to={`/admin/account/delete/${acc._id}`}>
                          <MdOutlineDelete className="fs-4 text-danger" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={role === "employee" ? 8 : 7}
                    className="text-center text-danger"
                  >
                    Không tìm thấy tài khoản nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Phân trang với Ant Design */}
        {filteredData.length > itemsPerPage && (
          <div className="d-flex justify-content-center mt-3">
            <Pagination
              current={currentPage}
              pageSize={itemsPerPage}
              total={filteredData.length}
              onChange={handlePageChange}
              showSizeChanger={false} // Không cho phép thay đổi số lượng mỗi trang
            />
          </div>
        )}
      </>
    );
  };

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
        <h1 className="text-center mb-4">👤 QUẢN LÝ TÀI KHOẢN</h1>

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
              placeholder="Tìm kiếm theo tên..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset trang khi tìm kiếm
              }}
              style={{ paddingLeft: "10px", fontSize: "16px" }}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end mt-3">
          <Link
            to="/admin/account/create"
            className="fs-1 text-success d-flex align-items-center"
            style={{ textDecoration: "none" }}
          >
            <MdOutlineAddBox />
            <span className="ms-2 fs-5">Thêm tài khoản</span>
          </Link>
        </div>

        <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
          <TabPane tab="📋 Tất cả" key="all">
            {renderAccountTable("all")}
          </TabPane>
          <TabPane tab="🛡️ Admin" key="admin">
            {renderAccountTable("admin")}
          </TabPane>
          <TabPane tab="👷 Nhân viên" key="employee">
            {renderAccountTable("employee")}
          </TabPane>
          <TabPane tab="👤 Khách hàng" key="customer">
            {renderAccountTable("customer")}
          </TabPane>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AccountPage;
