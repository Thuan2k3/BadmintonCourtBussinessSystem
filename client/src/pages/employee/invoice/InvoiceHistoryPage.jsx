import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Link } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";
import axios from "axios";
import dayjs from "dayjs";
import { DatePicker, Button, Pagination, Select } from "antd";

const InvoiceHistoryPage = () => {
  const [allInvoices, setAllInvoices] = useState([]); // Lưu tất cả hóa đơn
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Mặc định 10 hóa đơn/trang
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Lấy danh sách hóa đơn
  const getInvoices = async () => {
    try {
      let query = "";
      if (startDate && endDate) {
        query = `?startDate=${dayjs(startDate).format("YYYY-MM-DD")}&endDate=${dayjs(endDate).format("YYYY-MM-DD")}`;
      }

      const res = await axios.get(`http://localhost:8080/api/v1/employee/invoice${query}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (res.data.invoices) {
        setAllInvoices(res.data.invoices); // Lưu toàn bộ dữ liệu
        setCurrentPage(1); // Reset về trang đầu khi lọc
      }
    } catch (error) {
      console.error("Lỗi khi lấy hóa đơn:", error);
    }
  };

  useEffect(() => {
    getInvoices();
  }, []);

  // Tính danh sách hóa đơn hiển thị theo trang
  const startIndex = (currentPage - 1) * pageSize;
  const displayedInvoices = allInvoices.slice(startIndex, startIndex + pageSize);

  return (
    <Layout>
      <div className="p-2">
        <h1 className="d-flex justify-content-center">XEM LỊCH SỬ HÓA ĐƠN</h1>

        {/* Bộ lọc ngày */}
        <div className="d-flex gap-3 mb-3 justify-content-center">
          <DatePicker
            value={startDate ? dayjs(startDate) : null}
            onChange={(date) => setStartDate(date)}
            format="YYYY-MM-DD"
            placeholder="Chọn ngày bắt đầu"
          />
          <DatePicker
            value={endDate ? dayjs(endDate) : null}
            onChange={(date) => setEndDate(date)}
            format="YYYY-MM-DD"
            placeholder="Chọn ngày kết thúc"
          />
          <Button type="primary" onClick={getInvoices}>Lọc</Button>
        </div>

        {/* Chọn số lượng hóa đơn/trang */}
        <div className="d-flex justify-content-end mb-2">
          <span className="me-2">Số hóa đơn/trang:</span>
          <Select
            value={pageSize}
            onChange={(value) => {
              setPageSize(value);
              setCurrentPage(1); // Reset về trang đầu
            }}
            options={[
              { value: 5, label: "5" },
              { value: 10, label: "10" },
              { value: 20, label: "20" },
              { value: 50, label: "50" },
              { value: allInvoices.length, label: "Tất cả" },
            ]}
            style={{ width: 100 }}
          />
        </div>

        {/* Bảng hóa đơn */}
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
            {displayedInvoices.length > 0 ? (
              displayedInvoices.map((invoice, index) => (
                <tr key={invoice._id} className="align-middle text-center">
                  <td>{startIndex + index + 1}</td>
                  <td>{invoice._id}</td>
                  <td>{invoice.customer?.full_name || "Khách vãng lai"}</td>
                  <td>{invoice.employee?.full_name || "N/A"}</td>
                  <td>{dayjs(invoice.createdAt).format("HH:mm:ss DD-MM-YYYY")}</td>
                  <td>{invoice.totalAmount?.toLocaleString()} đ</td>
                  <td>
                    <Link to={`/employee/invoice/detail/${invoice._id}`}>
                      <BsInfoCircle size={20} />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">Không có hóa đơn nào!</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Phân trang */}
        <div className="d-flex justify-content-center mt-3">
          <Pagination
            current={currentPage}
            total={allInvoices.length}
            pageSize={pageSize}
            showSizeChanger={false} // Vì đã có Select riêng
            onChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceHistoryPage;
