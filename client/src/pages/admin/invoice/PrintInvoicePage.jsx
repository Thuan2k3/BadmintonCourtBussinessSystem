import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PrintInvoicePage = () => {
  const { id } = useParams(); // Lấy ID hóa đơn từ URL
  const [invoice, setInvoice] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/v1/admin/invoice/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.invoice) {
          setInvoice(res.data.invoice);
          setTimeout(() => window.print(), 500); // In tự động sau khi tải dữ liệu
        }
      } catch (error) {
        console.error("Lỗi lấy hóa đơn:", error);
      }
    };

    fetchInvoice();
  }, [id]);

  if (!invoice) return <p>Đang tải hóa đơn...</p>;

  return (
    <div ref={printRef} className="container mt-4">
      <h2 className="text-center">🧾 HÓA ĐƠN</h2>
      <p>
        <strong>Mã Hóa Đơn:</strong> {invoice._id}
      </p>
      <p>
        <strong>Khách Hàng:</strong> {invoice.customer?.full_name || "N/A"}
      </p>
      <p>
        <strong>Sân:</strong> {invoice.court?.full_name || "N/A"}
      </p>
      <p>
        <strong>Ngày Tạo:</strong>{" "}
        {new Date(invoice.createdAt).toLocaleString()}
      </p>
      <p>
        <strong>Tổng Tiền:</strong> {invoice.totalAmount.toLocaleString()} đ
      </p>

      <h4>🛒 Chi Tiết Hóa Đơn</h4>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Giá</th>
          </tr>
        </thead>
        <tbody>
          {invoice.invoiceDetails.map((item, index) => (
            <tr key={index}>
              <td>{item.product?.name || "N/A"}</td>
              <td>{item.product?.price?.toLocaleString()} đ</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrintInvoicePage;
