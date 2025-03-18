import React, { useState, useEffect } from "react";
import { Row, Col, Spin, message, Typography, Empty } from "antd";
import Layout from "../../../components/Layout";
import EmployeeBookingCourt from "../../../components/EmployeeBookingCourt";
import axios from "axios";
const { Title } = Typography;

const EmployeeCourtBookingStatusPage = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/employee/bookings/court",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ); // Cập nhật URL API của bạn
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
    <Layout>
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

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Spin size="large" />
            </div>
          ) : courts.length === 0 ? (
            <Empty description="Hiện tại không có sân nào khả dụng." />
          ) : (
            <Row gutter={[24, 24]} justify="start">
              {courts.map((court) => (
                <Col
                  key={court.id}
                  xs={24}
                  sm={24}
                  md={12}
                  lg={8}
                  xl={8}
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <EmployeeBookingCourt court={court} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeCourtBookingStatusPage;
