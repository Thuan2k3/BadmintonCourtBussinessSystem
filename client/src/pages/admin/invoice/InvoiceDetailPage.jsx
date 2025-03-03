import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../components/Layout";
import axios from "axios";
import { Button } from "antd";
import "../../../styles/InvoiceDetailPage.css"; // Thêm file CSS để xử lý in

const InvoiceDetailPage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef(); // Tham chiếu đến nội dung cần in

  const getInvoiceDetail = async () => {
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
      }
    } catch (error) {
      console.error("Lỗi lấy chi tiết hóa đơn:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInvoiceDetail();
  }, [id]);

  // Hàm in chỉ in nội dung trong printRef
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Layout>
        <p className="text-center">Đang tải...</p>
      </Layout>
    );
  }

  if (!invoice) {
    return (
      <Layout>
        <p className="text-center text-danger">Không tìm thấy hóa đơn!</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mt-4">
        <h2 className="text-center print-hide">Chi Tiết Hóa Đơn</h2>

        {/* Nội dung cần in */}
        <div className="card p-3 print-content" ref={printRef}>
          <h3 className="text-center">🧾 HÓA ĐƠN</h3>
          <p>
            <strong>Mã Hóa Đơn:</strong> {invoice._id}
          </p>
          <p>
            <strong>Khách Hàng:</strong>{" "}
            {invoice.customer?.full_name || "Khách vãng lai"}
          </p>
          <p>
            <strong>Nhân Viên:</strong> {invoice.staff?.full_name || "N/A"}
          </p>
          <p>
            <strong>Sân Đã Thuê:</strong>{" "}
            {invoice.court?.name || "Mua sản phẩm"}
          </p>
          {invoice.court?.price &&
            invoice.checkInTime &&
            invoice.checkOutTime && (
              <>
                <p>
                  <strong>Thời Gian Check-in:</strong>{" "}
                  {new Date(invoice.checkInTime).toLocaleString()}
                </p>
                <p>
                  <strong>Thời Gian Check-out:</strong>{" "}
                  {new Date(invoice.checkOutTime).toLocaleString()}
                </p>
                <p>
                  <strong>Tổng số giờ thuê:</strong>{" "}
                  {(() => {
                    const checkInTime = new Date(invoice.checkInTime).getTime();
                    const checkOutTime = new Date(
                      invoice.checkOutTime
                    ).getTime();
                    const durationMinutes =
                      (checkOutTime - checkInTime) / (1000 * 60);
                    const fullHours = Math.floor(durationMinutes / 60);
                    const extraMinutes = durationMinutes % 60;
                    return Math.max(
                      1,
                      extraMinutes <= 5 ? fullHours : fullHours + 1
                    );
                  })()}{" "}
                  giờ
                </p>
                <p>
                  <strong>Đơn Giá Thuê Sân:</strong>{" "}
                  {invoice.court.price.toLocaleString()} đ/giờ
                </p>
                <p>
                  <strong>Tổng Tiền Thuê Sân:</strong>{" "}
                  {(() => {
                    const checkInTime = new Date(invoice.checkInTime).getTime();
                    const checkOutTime = new Date(
                      invoice.checkOutTime
                    ).getTime();
                    const durationMinutes =
                      (checkOutTime - checkInTime) / (1000 * 60);
                    const fullHours = Math.floor(durationMinutes / 60);
                    const extraMinutes = durationMinutes % 60;
                    const totalHours = Math.max(
                      1,
                      extraMinutes <= 5 ? fullHours : fullHours + 1
                    );
                    return (
                      totalHours * (invoice.court?.price || 0)
                    ).toLocaleString();
                  })()}{" "}
                  đ
                </p>
              </>
            )}
          {invoice.checkInTime && invoice.checkOutTime && <></>}
          <p>
            <strong>Thời Gian Lập Hóa Đơn:</strong>{" "}
            {new Date(invoice.createdAt).toLocaleString()}
          </p>

          {invoice.invoiceDetails && invoice.invoiceDetails.length > 0 ? (
            <>
              <h4>Chi Tiết Mua Sản Phẩm Tại Chỗ</h4>
              <table className="table table-bordered">
                <thead className="table-dark">
                  <tr>
                    <th>STT</th>
                    <th>Tên Sản Phẩm</th>
                    <th>Giá</th>
                    <th>Số Lượng</th>
                    <th>Thành Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.invoiceDetails.map((detail, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{detail.product?.name || "N/A"}</td>
                      <td>{detail.product?.price?.toLocaleString()} đ</td>
                      <td>{detail.quantity || 1}</td>
                      <td>
                        {(
                          (detail.quantity || 1) * (detail.product?.price || 0)
                        ).toLocaleString()}{" "}
                        đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <span></span>
          )}
          <p>
            <strong>Tổng Tiền:</strong> {invoice.totalAmount?.toLocaleString()}{" "}
            đ
          </p>
        </div>

        {/* Nút In Hóa Đơn */}
        <div className="text-center mt-3 print-hide">
          <Button type="primary" onClick={handlePrint}>
            🖨 In Hóa Đơn
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceDetailPage;
