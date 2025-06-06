import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Spin,
  message,
  Typography,
  Empty,
  Pagination,
  Space,
  Tag,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import GuestLayout from "../../components/GuestLayout";
import axios from "axios";
import GuestBookingCourt from "../../components/GuestBookingCourt";

const { Title } = Typography;

const GuestCourtBookingStatusPage = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // Số sân trên mỗi trang

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/user/bookings/court"
        );
        setCourts(response.data);
      } catch (error) {
        message.error("Không thể tải dữ liệu sân.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourts();
  }, []);

  const paginatedCourts = courts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <GuestLayout>
      <div
        style={{
          padding: "20px",
          background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
          borderRadius: "20px",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
          animation: "fadeIn 0.8s ease-in-out",
          maxWidth: "100%",
        }}
      >
        <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
          <Title
            level={2}
            style={{
              color: "#2c3e50",
              textTransform: "uppercase",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            📅 XEM TÌNH TRẠNG ĐẶT SÂN
          </Title>
          <Space direction="vertical" size="small" style={{ padding: "10px" }}>
            <Space
              size="middle"
              wrap
              style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
            >
              <h6>Chú thích:</h6>
              <Tag>
                <CheckOutlined style={{ fontSize: "20px", color: "#52c41a" }} />{" "}
                Đã đặt
              </Tag>
              <Tag>
                <CloseOutlined style={{ color: "#f5222d", fontSize: "20px" }} />{" "}
                Chưa đặt
              </Tag>
            </Space>
          </Space>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Spin size="large" />
            </div>
          ) : courts.length === 0 ? (
            <Empty description="Hiện tại không có sân nào khả dụng." />
          ) : (
            <>
              <Row gutter={[24, 24]} justify="start">
                {paginatedCourts.map((court) => (
                  <Col
                    key={court._id}
                    xs={24}
                    sm={24}
                    md={12}
                    lg={8}
                    xl={8}
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <GuestBookingCourt court={court} />
                  </Col>
                ))}
              </Row>

              {/* Thêm Pagination */}
              {courts.length > pageSize && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "20px",
                  }}
                >
                  <Pagination
                    current={currentPage}
                    pageSize={pageSize}
                    total={courts.length}
                    onChange={(page) => setCurrentPage(page)}
                    showQuickJumper
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </GuestLayout>
  );
};

export default GuestCourtBookingStatusPage;
