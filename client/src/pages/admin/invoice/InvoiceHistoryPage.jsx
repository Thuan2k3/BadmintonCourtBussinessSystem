import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Link } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";
import axios from "axios";
import { Input } from "antd";

const InvoiceHistoryPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Hàm lấy danh sách hóa đơn (có lọc theo ngày)
  const getInvoices = async () => {
    try {
      let query = "";
      if (startDate && endDate) {
        query = `?startDate=${startDate}&endDate=${endDate}`;
      }

      const res = await axios.get(
        `http://localhost:8080/api/v1/admin/invoice${query}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.invoices) {
        setInvoices(res.data.invoices);
      }
    } catch (error) {
      console.error("Lỗi khi lấy hóa đơn:", error);
    }
  };

  useEffect(() => {
    getInvoices();
    console.log(invoices)
  }, []); // Chỉ chạy lần đầu

  return (
    <Layout>
      <div className="p-2">
        <h1 className="d-flex justify-content-center">XEM LỊCH SỬ HÓA ĐƠN</h1>

        {/* Bộ lọc ngày */}
        <div className="d-flex gap-3 mb-3">
          <Input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button className="btn btn-primary" onClick={getInvoices}>
            Lọc
          </button>
        </div>

        <table className="table table-bordered table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>STT</th>
              <th>Mã Hóa Đơn</th>
              <th>Khách Hàng</th>
              <th>Nhân Viên</th>
              <th>Ngày Tạo</th>
              <th>Tổng Tiền</th>
              <th>Chi Tiết</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length > 0 ? (
              invoices.map((invoice, index) => (
                <tr key={invoice._id} className="align-middle text-center">
                  <td>{index + 1}</td>
                  <td>{invoice._id}</td>
                  <td>{invoice.customer?.full_name || "Khách vãng lai"}</td>
                  <td>{invoice.employee?.full_name || "N/A"}</td>
                  <td>{new Date(invoice.createdAt).toLocaleString()}</td>
                  <td>{invoice.totalAmount?.toLocaleString()} đ</td>
                  <td>
                    <Link
                      to={`/admin/invoice/detail/${invoice._id}`}
                    >
                      <BsInfoCircle size={20} />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Không có hóa đơn nào!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default InvoiceHistoryPage;
