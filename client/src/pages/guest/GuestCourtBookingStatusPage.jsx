import React, { useState, useEffect } from "react";
import { Row, Col, Spin, message, Typography, Empty } from "antd";
import GuestLayout from "../../components/GuestLayout";
import axios from "axios";
import GuestBookingCourt from "../../components/GuestBookingCourt";

const { Title } = Typography;

const GuestCourtBookingStatusPage = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API để lấy dữ liệu sân
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

  return (
    <GuestLayout>
      {/* Nền gradient 3 tầng màu */}
      <div
        style={{
          padding: "40px",
          background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
          borderRadius: "20px",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
          animation: "fadeIn 0.8s ease-in-out",
        }}
      >
        <div style={{ width: "100%", maxWidth: "1400px" }}>
          {/* Tiêu đề */}
          <Title
            level={2}
            className="text-center"
            style={{
              color: "#2c3e50",
              textTransform: "uppercase",
              fontWeight: "bold",
              letterSpacing: "1.5px",
            }}
          >
            📅 XEM TÌNH TRẠNG ĐẶT SÂN
          </Title>

          {/* Hiển thị trạng thái Loading */}
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Spin size="large" />
            </div>
          ) : courts.length === 0 ? (
            <Empty description="Hiện tại không có sân nào khả dụng." />
          ) : (
            <Row gutter={[32, 32]} justify="center">
              {courts.map((court) => (
                <Col key={court.id} xs={24} sm={24} md={12} lg={8} xl={6}>
                  <div
                    style={{
                      minWidth: "320px",
                      borderRadius: "20px",
                      overflow: "hidden",
                      background: "#ffffff",
                      boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)", // Bóng đổ nhẹ
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.03)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    <GuestBookingCourt court={court} />
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </GuestLayout>
  );
};

export default GuestCourtBookingStatusPage;
