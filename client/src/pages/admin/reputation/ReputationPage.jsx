import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import axios from "axios";

const ReputationPage = () => {
  const [accounts, setAccounts] = useState([]);

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
        // Lọc chỉ lấy khách hàng
        const customers = res.data.data.filter(
          (acc) => acc.role === "customer"
        );
        setAccounts(customers);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAccounts();
  }, []);

  return (
    <Layout>
      <div className="p-2">
        <h1 className="d-flex justify-content-center">QUẢN LÝ ĐIỂM UY TÍN</h1>
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
            {accounts.map((account, index) => (
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
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default ReputationPage;
