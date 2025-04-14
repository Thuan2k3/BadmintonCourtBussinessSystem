import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../components/Layout";
import axios from "axios";
import { Button } from "antd";
import "../../../styles/InvoiceDetailPage.css"; // Thêm file CSS để xử lý in
import dayjs from "dayjs";
import { useSearchParams } from "react-router-dom";

const InvoiceDetailPage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef(); // Tham chiếu đến nội dung cần in
  const [searchParams] = useSearchParams();
  const autoPrint = searchParams.get("autoPrint");
  const navigate = useNavigate();

  const getInvoiceDetail = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/employee/invoice/${id}`,
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

  useEffect(() => {
    if (autoPrint === "true") {
      setTimeout(() => {
        window.print();
        navigate("/employee/invoice");
      }, 500); // Chờ 0.5s để CSS tải xong
    }
  }, [autoPrint]);

  // Hàm in chỉ in nội dung trong printRef
  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 500); // Chờ 0.5s để CSS tải xong
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
            <strong>Nhân Viên:</strong> {invoice.employee?.full_name || "N/A"}
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
                  {dayjs(invoice.checkInTime).format("HH:mm:ss DD/MM/YYYY")}
                </p>
                <p>
                  <strong>Thời Gian Check-out:</strong>{" "}
                  {dayjs(invoice.checkOutTime).format("HH:mm:ss DD/MM/YYYY")}
                </p>
                <p>
                  <strong>Tổng số giờ thuê:</strong>{" "}
                  {(() => {
                    // ✅ Hàm làm tròn giờ
                    const roundDownHour = (date) => {
                      const d = new Date(date);
                      return `${String(d.getHours()).padStart(2, "0")}:00`;
                    };

                    const roundUpHour = (date) => {
                      const d = new Date(date);
                      return d.getMinutes() > 0
                        ? `${String(d.getHours() + 1).padStart(2, "0")}:00`
                        : `${String(d.getHours()).padStart(2, "0")}:00`;
                    };

                    // Tính tổng số giờ theo TimeSlot (làm tròn theo giờ)
                    const duration = (() => {
                      // Làm tròn giờ check-in xuống, check-out lên
                      const checkInHour = parseInt(
                        roundDownHour(invoice.checkInTime).split(":")[0],
                        10
                      );
                      const checkOutHour = parseInt(
                        roundUpHour(invoice.checkOutTime).split(":")[0],
                        10
                      );

                      const hours = checkOutHour - checkInHour;
                      return Math.max(1, hours); // Tối thiểu 1 giờ
                    })();
                    return duration;
                  })()}{" "}
                  giờ
                </p>

                <p>
                  <strong>Đơn Giá Thuê Sân:</strong>{" "}
                  {(() => {
                    // ✅ Hàm làm tròn giờ
                    const roundDownHour = (date) => {
                      const d = new Date(date);
                      return `${String(d.getHours()).padStart(2, "0")}:00`;
                    };

                    const roundUpHour = (date) => {
                      const d = new Date(date);
                      return d.getMinutes() > 0
                        ? `${String(d.getHours() + 1).padStart(2, "0")}:00`
                        : `${String(d.getHours()).padStart(2, "0")}:00`;
                    };

                    // Tính tổng số giờ theo TimeSlot (làm tròn theo giờ)
                    const totalHours = (() => {
                      // Làm tròn giờ check-in xuống, check-out lên
                      const checkInHour = parseInt(
                        roundDownHour(invoice.checkInTime).split(":")[0],
                        10
                      );
                      const checkOutHour = parseInt(
                        roundUpHour(invoice.checkOutTime).split(":")[0],
                        10
                      );

                      const hours = checkOutHour - checkInHour;
                      return Math.max(1, hours); // Tối thiểu 1 giờ
                    })();

                    // Tính tổng tiền sản phẩm đã mua
                    const totalProductCost =
                      invoice.invoiceDetails?.reduce((sum, detail) => {
                        return (
                          sum +
                          (detail.quantity || 1) * (detail.product?.price || 0)
                        );
                      }, 0) || 0;

                    // Tính đơn giá thuê sân (chia theo tổng số giờ)
                    const rentalPricePerHour =
                      totalHours > 0
                        ? (invoice.totalAmount - totalProductCost) / totalHours
                        : 0;

                    return rentalPricePerHour.toLocaleString();
                  })()}{" "}
                  đ/giờ
                </p>
                <p>
                  <strong>Tổng Tiền Thuê Sân:</strong>{" "}
                  {(() => {
                    // Tính tổng tiền sản phẩm đã mua
                    const totalProductCost =
                      invoice.invoiceDetails?.reduce((sum, detail) => {
                        return (
                          sum +
                          (detail.quantity || 1) * (detail.product?.price || 0)
                        );
                      }, 0) || 0;

                    // Tổng tiền thuê sân = Tổng hóa đơn - tổng tiền sản phẩm
                    const totalRentalCost =
                      invoice.totalAmount - totalProductCost;

                    return totalRentalCost.toLocaleString();
                  })()}{" "}
                  đ
                </p>
              </>
            )}
          {invoice.checkInTime && invoice.checkOutTime && <></>}
          <p>
            <strong>Thời Gian Lập Hóa Đơn:</strong>{" "}
            {dayjs(invoice.createdAt).format("HH:mm:ss DD/MM/YYYY")}
          </p>

          {invoice.invoiceDetails && invoice.invoiceDetails.length > 0 ? (
            <>
              <h4>Chi Tiết Mua Sản Phẩm Tại Chỗ</h4>
              <table className="table table-bordered" style={{ border: '1px solid black' }}>
                <thead>
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
                {/* Dòng tổng tiền sản phẩm */}
                <tfoot>
                  <tr>
                    <td colSpan="8" className="text-end">
                      <strong>Tổng Tiền Mua Sản Phẩm: </strong>
                      {invoice.invoiceDetails
                        .reduce((sum, detail) => {
                          return (
                            sum +
                            (detail.quantity || 1) *
                              (detail.product?.price || 0)
                          );
                        }, 0)
                        .toLocaleString()}{" "}
                      đ
                    </td>
                  </tr>
                </tfoot>
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
