import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import axios from "axios";

const ReputationPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách chỉ chứa khách hàng
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
      console.log(error);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  // Hàm loại bỏ dấu tiếng Việt
  const convertToUnsigned = (str) => {
    return str
      .normalize("NFD") // Tách ký tự có dấu thành ký tự gốc + dấu
      .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
      .toLowerCase(); // Chuyển thành chữ thường
  };

  // Lọc khách hàng theo tên (không phân biệt dấu)
  const filteredAccounts = accounts.filter((account) =>
    convertToUnsigned(account.full_name).includes(convertToUnsigned(searchTerm))
  );

  return (
    <Layout>
      <div className="p-2">
        <h1 className="d-flex justify-content-center">QUẢN LÝ ĐIỂM UY TÍN</h1>

        {/* Ô tìm kiếm */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên khách hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="table table-bordered table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>STT</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Trạng thái</th>
              <th>Điểm uy tín</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredAccounts.map((account, index) => (
              <tr key={account._id} className="align-middle text-center">
                <td>{index + 1}</td>
                <td>{account.full_name}</td>
                <td>{account.email}</td>
                <td>{account.phone}</td>
                <td>{account.address}</td>
                <td>{account.isBlocked ? "Bị khóa" : "Hoạt động"}</td>
                <td>{account.reputation_score}</td>
                <td>
                  <div className="d-flex justify-content-center gap-3">
                    <Link to={`/admin/reputation/update/${account._id}`}>
                      <AiOutlineEdit className="fs-4 text-warning" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {/* Hiển thị nếu không tìm thấy khách hàng nào */}
            {filteredAccounts.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center text-danger">
                  Không tìm thấy khách hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ReputationPage;
