import React, { useEffect, useState } from "react";
import axios from "axios";
import GuestLayout from "../../components/GuestLayout";
import { Row, Col, Card, Tag, Typography, Button, Modal } from "antd";

const { Text, Title } = Typography;

const GuestHomePage = () => {
  const [courts, setCourts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCourt, setCurrentCourt] = useState(null);

  // Lấy danh sách sân từ API
  const getAllCourt = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/user/court");
      if (res.data.success) {
        setCourts(res.data.data);
      }
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sân:", error);
    }
  };

  useEffect(() => {
    getAllCourt();
  }, []);

  // Hiện modal chi tiết sân
  const showModal = (court) => {
    setCurrentCourt(court);
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentCourt(null);
  };

  return (
    <GuestLayout>
      <div
        className="container mt-4"
        style={{
          padding: "40px",
          background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
          borderRadius: "20px",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
          animation: "fadeIn 0.8s ease-in-out",
        }}
      >
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
          🏸 Danh Sách Sân Cầu Lông
        </Title>

        {/* Danh sách sân */}
        <Row gutter={[32, 32]} justify="center">
          {courts.map((court) => (
            <Col xs={24} sm={12} md={8} lg={6} key={court.id}>
              <Card
                hoverable
                bordered={false}
                style={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  transition: "transform 0.4s, box-shadow 0.4s",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                }}
                cover={
                  <div
                    style={{
                      overflow: "hidden",
                      borderTopLeftRadius: "20px",
                      borderTopRightRadius: "20px",
                    }}
                  >
                    <img
                      src={`http://localhost:8080${court.image}`}
                      alt={court.name}
                      style={{
                        width: "100%",
                        height: "260px",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.transform = "scale(1.1)")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.transform = "scale(1)")
                      }
                    />
                  </div>
                }
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-8px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <Title level={4} style={{ color: "#1890ff" }}>
                  {court.name}
                </Title>

                <Tag
                  color="blue"
                  style={{
                    fontSize: "14px",
                    marginBottom: "12px",
                    borderRadius: "8px",
                  }}
                >
                  <Text strong>💰 Giá: </Text> {court.price} VNĐ/giờ
                </Tag>

                {/* Nút "Xem chi tiết" */}
                <Button
                  type="primary"
                  shape="round"
                  block
                  style={{
                    marginTop: "12px",
                    background: "linear-gradient(135deg, #ff4d4f, #ff7875)",
                    border: "none",
                    fontWeight: "bold",
                    boxShadow: "0 4px 12px rgba(255, 77, 79, 0.5)",
                    transition: "transform 0.3s",
                  }}
                  onClick={() => showModal(court)}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "scale(1.1)")
                  }
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  🔍 Xem Chi Tiết
                </Button>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Modal chi tiết sân */}
        {currentCourt && (
          <Modal
            title={
              <Title level={3} style={{ marginBottom: 0 }}>
                {currentCourt.name}
              </Title>
            }
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Đóng
              </Button>,
            ]}
            bodyStyle={{
              borderRadius: "16px",
              padding: "24px",
              background: "#fafafa",
            }}
          >
            <img
              src={`http://localhost:8080${currentCourt.image}`}
              alt={currentCourt.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "16px",
                marginBottom: "24px",
              }}
            />
            <p>
              <strong>💰 Giá thuê mỗi giờ:</strong> {currentCourt.price} VND
            </p>
            <p>
              <strong>📋 Mô tả:</strong>{" "}
              {currentCourt.description || "Không có mô tả."}
            </p>
          </Modal>
        )}

        {/* Nếu không có sân */}
        {courts.length === 0 && (
          <Text
            style={{
              display: "block",
              textAlign: "center",
              marginTop: "40px",
              fontSize: "18px",
              color: "#888",
            }}
          >
            🚧 Hiện tại chưa có sân nào.
          </Text>
        )}
      </div>
    </GuestLayout>
  );
};

export default GuestHomePage;
