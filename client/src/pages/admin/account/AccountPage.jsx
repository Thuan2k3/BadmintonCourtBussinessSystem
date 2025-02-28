import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import axios from "axios";

const AccountPage = () => {
  const [accounts, setAccounts] = useState([]);
  //getAccounts
  const getAccounts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/admin/account",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setAccounts(res.data.data);
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
        <h1 className="d-flex justify-content-center">QUẢN LÝ TÀI KHOẢN</h1>
        <Link
          to="/admin/account/create"
          className="d-flex justify-content-end fs-1"
        >
          <MdOutlineAddBox></MdOutlineAddBox>
        </Link>
        <table className="table table-bordered table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>STT</th>
              <th>Họ và tên</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th></th>
              <th></th>
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
                <td>
                  {account.isAdmin
                    ? "Admin"
                    : account.isStaff
                    ? "Nhân viên"
                    : "Khách hàng"}
                </td>
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
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AccountPage;
