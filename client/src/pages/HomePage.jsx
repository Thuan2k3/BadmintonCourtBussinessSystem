import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import GuestLayout from "../components/GuestLayout";
import {
  Row,
  Col,
  Card,
  Tag,
  Modal,
  Button,
  message,
  Typography,
  Space,
} from "antd";
import {
  CheckOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Pagination } from "antd";
import { useSelector } from "react-redux";
import BookingCourt from "../components/BookingCourt";
import EmployeeBookingCourt from "../components/EmployeeBookingCourt";

const { Text, Title } = Typography;

const HomePage = () => {
  const [courts, setCourts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCourt, setCurrentCourt] = useState(null);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [currentBookingCourt, setCurrentBookingCourt] = useState(null);
  const [customer, setCustomer] = useState();
  const { user } = useSelector((state) => state.user);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // Cố định số lượng sân hiển thị mỗi trang

  // Xác định Layout dựa trên vai trò người dùng
  const CurrentLayout = user?.role === "customer" ? GuestLayout : Layout;

  // Lấy thông tin khách hàng
  const getCustomerById = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/admin/customer/${user._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.data.success) {
        setCustomer(res.data.data);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      message.error("Lỗi khi lấy thông tin khách hàng!");
    }
  };

  // Lấy danh sách sân
  const getAllCourt = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/user/bookings/court",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      ); // Cập nhật URL API của bạn
      setCourts(response.data);
    } catch (error) {
      message.error("Không thể tải dữ liệu sân.");
    }
  };

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

  // Hiện modal dat san
  const showBookingModal = (court) => {
    setCurrentBookingCourt(court);
    setIsBookingModalVisible(true);
  };

  // Đóng modal
  const handleBookingCancel = () => {
    setIsBookingModalVisible(false);
    setCurrentBookingCourt(null);
  };

  useEffect(() => {
    getAllCourt();
    if (user?.role === "customer") {
      getCustomerById();
    }
  }, [user]);

  // Tính toán danh sách sân hiển thị theo trang hiện tại
  const filteredCourts = courts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <CurrentLayout>
      {user?.role === "customer" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#FFD700",
              padding: "4px 8px",
              borderRadius: "20px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <span style={{ marginLeft: "4px" }}>Điểm Uy Tín: </span>
            <span style={{ fontWeight: "bold", marginLeft: "4px" }}>
              {customer?.reputation_score}
            </span>
          </div>
        </div>
      )}

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
          {filteredCourts.map((court) => (
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
                  <Text strong>💰 Giá: </Text>{" "}
                  {court.price.toLocaleString("vi-VN")} VNĐ/giờ
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
                {/* Nút "Đặt sân" */}
                {(user.role === "customer" || user.role === "employee") && (
                  <Button
                    type="primary"
                    shape="round"
                    block
                    style={{
                      marginTop: "12px",
                      background: "linear-gradient(135deg, #1890ff, #40a9ff)", // ✅ Xanh gradient nổi bật
                      border: "none",
                      fontWeight: "bold",
                      color: "#fff",
                      letterSpacing: "0.5px",
                      textTransform: "uppercase", // ✅ Chữ in hoa cho chuyên nghiệp
                      boxShadow: "0 4px 12px rgba(24, 144, 255, 0.5)", // ✅ Bóng màu xanh
                      transition: "all 0.3s ease-in-out",
                    }}
                    onClick={() => showBookingModal(court)}
                    onMouseEnter={(e) =>
                      (e.target.style.transform = "scale(1.1)")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.transform = "scale(1)")
                    }
                  >
                    {user.role === "customer"
                      ? "Đặt sân"
                      : "Xem tình trạng đặt sân"}
                  </Button>
                )}
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
              <strong>💰 Giá thuê mỗi giờ:</strong>{" "}
              {currentCourt.price.toLocaleString("vi-VN")} VND
            </p>
            <p>
              <strong>📋 Mô tả:</strong>{" "}
              {currentCourt.description || "Không có mô tả."}
            </p>
          </Modal>
        )}
        {/* Modal Đặt sân */}
        {currentBookingCourt && (
          <Modal
            visible={isBookingModalVisible}
            onCancel={handleBookingCancel}
            footer={[
              <Button key="back" onClick={handleBookingCancel}>
                Đóng
              </Button>,
            ]}
            bodyStyle={{
              borderRadius: "16px",
              padding: "24px",
              background: "#fafafa",
            }}
          >
            {user.role === "customer" ? (
              <>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ padding: "10px" }}
                >
                  <Space
                    size="middle"
                    wrap
                    style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                  >
                    <h6>Chú thích:</h6>
                    <Tag>
                      <CheckOutlined
                        style={{ fontSize: "20px", color: "#52c41a" }}
                      />{" "}
                      Đã đặt (của bạn)
                    </Tag>
                    <Tag>
                      <CheckOutlined
                        style={{
                          fontSize: "20px",
                          color: "rgba(82, 196, 26, 0.3)",
                        }}
                      />{" "}
                      Đã có người đặt
                    </Tag>
                    <Tag>
                      <CheckSquareOutlined
                        style={{ fontSize: "20px", color: "#faad14" }}
                      />{" "}
                      Đang chọn để đặt
                    </Tag>
                    <Tag>
                      <CloseSquareOutlined
                        style={{ fontSize: "20px", color: "#8c8c8c" }}
                      />{" "}
                      Đang chọn để hủy
                    </Tag>
                    <Tag>
                      <CloseOutlined
                        style={{ color: "#f5222d", fontSize: "20px" }}
                      />{" "}
                      Chưa đặt
                    </Tag>
                  </Space>
                </Space>
                <BookingCourt court={currentBookingCourt} />
              </>
            ) : (
              <>
                <Space
                  direction="vertical"
                  size="small"
                  style={{ padding: "10px" }}
                >
                  <Space
                    size="middle"
                    wrap
                    style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
                  >
                    <h6>Chú thích:</h6>
                    <Tag>
                      <CheckOutlined
                        style={{ fontSize: "20px", color: "#52c41a" }}
                      />{" "}
                      Đã đặt
                    </Tag>
                    <Tag>
                      <CloseOutlined
                        style={{ color: "#f5222d", fontSize: "20px" }}
                      />{" "}
                      Chưa đặt
                    </Tag>
                  </Space>
                </Space>
                <EmployeeBookingCourt court={currentBookingCourt} />
              </>
            )}
          </Modal>
        )}
        {/* Phân trang */}
        {courts.length > pageSize && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={courts.length}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
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
    </CurrentLayout>
  );
};

export default HomePage;
