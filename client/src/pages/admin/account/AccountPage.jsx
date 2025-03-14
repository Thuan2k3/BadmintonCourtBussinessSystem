import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import axios from "axios";
import { Tabs, Input } from "antd";

const AccountPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách tài khoản
  const getAccounts = async () => {
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
      console.error("Lỗi khi lấy tài khoản:", error);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  // Hàm loại bỏ dấu tiếng Việt
  const removeAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  };

  // Lọc tài khoản theo vai trò và từ khóa
  const filteredAccounts = (role) =>
    accounts.filter(
      (acc) =>
        acc.role === role &&
        removeAccents(acc.full_name).includes(removeAccents(searchTerm))
    );

  // Render bảng tài khoản
  const renderTable = (role) => {
    const data = filteredAccounts(role);

    return (
      <table className="table table-bordered table-hover">
        <thead className="table-dark text-center">
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
          {data.length > 0 ? (
            data.map((account, index) => (
              <tr key={account._id} className="align-middle text-center">
                <td>{index + 1}</td>
                <td>{account.full_name}</td>
                <td>{account.email}</td>
                <td>{account.phone}</td>
                <td>{account.address}</td>
                {role === "employee" && (
                  <td>{new Date(account?.hire_date).toLocaleDateString()}</td>
                )}
                <td>{account.isBlocked ? "Bị khóa" : "Hoạt động"}</td>
                <td>
                  <div className="d-flex justify-content-center gap-3">
                    <Link to={`/admin/account/update/${account._id}`}>
                      <AiOutlineEdit className="fs-4 text-warning" />
                    </Link>
                    <Link to={`/admin/account/delete/${account._id}`}>
                      <MdOutlineDelete className="fs-4 text-danger" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={role === "employee" ? 8 : 7} className="text-center">
                Không tìm thấy tài khoản nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    );
  };

  return (
    <Layout>
      <div className="p-2">
        <h1 className="d-flex justify-content-center">QUẢN LÝ TÀI KHOẢN</h1>

        {/* Nút thêm tài khoản */}
        <Link
          to="/admin/account/create"
          className="d-flex justify-content-end fs-1"
        >
          <MdOutlineAddBox />
        </Link>

        {/* Ô tìm kiếm */}
        <div className="mb-3">
          <Input
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
          />
        </div>

        {/* Tabs quản lý tài khoản */}
        <Tabs
          defaultActiveKey="admin"
          items={[
            { key: "admin", label: "Admin", children: renderTable("admin") },
            {
              key: "employee",
              label: "Nhân viên",
              children: renderTable("employee"),
            },
            {
              key: "customer",
              label: "Khách hàng",
              children: renderTable("customer"),
            },
          ]}
        />
      </div>
    </Layout>
  );
};

export default AccountPage;
