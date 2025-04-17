import React, { useEffect, useState } from "react";
import axios from "axios";
import GuestLayout from "../../components/GuestLayout";
import {
  Row,
  Col,
  Card,
  Tag,
  Typography,
  Button,
  Modal,
  message,
  Space,
  Input,
  Select,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Pagination } from "antd";
import GuestBookingCourt from "../../components/GuestBookingCourt";
import Comment from "../../components/Comment";

const { Text, Title } = Typography;
const { Option } = Select;

const GuestHomePage = () => {
  const [courts, setCourts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentCourt, setCurrentCourt] = useState(null);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [currentBookingCourt, setCurrentBookingCourt] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // Cố định số lượng sân hiển thị mỗi trang
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState(null);

  // Lấy danh sách sân từ API
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

  // Hiện modal Xem tình trang dat san
  const showBookingModal = (court) => {
    setCurrentBookingCourt(court);
    setIsBookingModalVisible(true);
  };

  // Đóng modal
  const handleBookingCancel = () => {
    setIsBookingModalVisible(false);
    setCurrentBookingCourt(null);
  };

  // Hàm loại bỏ dấu tiếng Việt
  const removeAccents = (str) => {
    return str
      .normalize("NFD") // Tách dấu ra khỏi ký tự
      .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu tiếng Việt
      .toLowerCase(); // Chuyển về chữ thường
  };

  // Xử lý khi nhập tìm kiếm
  const handleSearch = (value) => {
    setSearchTerm(removeAccents(value));
  };

  // Lọc sân theo từ khóa tìm kiếm
  const filteredCourts = courts
    .filter((court) => {
      const nameMatch = removeAccents(court.name).includes(searchTerm);
      let priceMatch = true;

      // Nếu không có giá trị lọc giá, mặc định là "Tất cả"
      if (priceRange === "under100k") {
        priceMatch = court.price < 100000;
      } else if (priceRange === "100k-150k") {
        priceMatch = court.price >= 100000 && court.price < 150000;
      } else if (priceRange === "150k-200k") {
        priceMatch = court.price >= 150000 && court.price <= 200000;
      } else if (priceRange === "over200k") {
        priceMatch = court.price > 200000;
      } else if (priceRange === "all") {
        priceMatch = true; // Nếu là "Tất cả", không lọc theo giá
      }

      return nameMatch && priceMatch;
    })
    .slice((currentPage - 1) * pageSize, currentPage * pageSize); // Phân trang

  // Tổng số lượng sân sau khi tìm kiếm và lọc theo giá
  const totalFilteredCourts = courts.filter((court) => {
    const nameMatch = removeAccents(court.name).includes(searchTerm); // Lọc theo tên sân
    let priceMatch = true;

    // Nếu chọn "Tất cả", không lọc theo giá
    if (priceRange === "all") {
      priceMatch = true;
    } else if (priceRange === "under100k") {
      priceMatch = court.price < 100000;
    } else if (priceRange === "100k-150k") {
      priceMatch = court.price >= 100000 && court.price < 150000;
    } else if (priceRange === "150k-200k") {
      priceMatch = court.price >= 150000 && court.price <= 200000;
    } else if (priceRange === "over200k") {
      priceMatch = court.price > 200000;
    }

    // Trả về kết quả nếu cả 2 điều kiện đều thỏa mãn
    return nameMatch && priceMatch;
  }).length;

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

        {/* Ô tìm kiếm */}
        <div style={{ marginBottom: "20px", textAlign: "center" }}>
          <Input
            placeholder="Tìm kiếm sân theo tên..."
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: "70%", borderRadius: "8px", marginRight: "10px" }}
          />
          {/* Dropdown lọc giá */}
          <Select
            placeholder="Chọn phạm vi giá"
            style={{ width: "20%", borderRadius: "8px", marginTop: "12px" }}
            onChange={(value) => setPriceRange(value)} // Lưu lựa chọn của người dùng
          >
            <Option value="all">Tất cả</Option>
            <Option value="under100k">Dưới 100.000</Option>
            <Option value="100k-150k">100.000 - 150.000</Option>
            <Option value="150k-200k">150.000 - 200.000</Option>
            <Option value="over200k">Trên 200.000</Option>
          </Select>
        </div>

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
                {/* Nút "Xem tình trạng đặt sân" */}
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
                  onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                >
                  Xem tình trạng đặt sân
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
              <strong>💰 Giá thuê mỗi giờ:</strong>{" "}
              {currentCourt.price.toLocaleString("vi-VN")} VND
            </p>
            <p>
              <strong>📋 Mô tả:</strong>{" "}
              {currentCourt.description || "Không có mô tả."}
            </p>

            {/* Thêm phần bình luận */}
            <div style={{ marginTop: "24px" }}>
              <Comment courtId={currentCourt._id} />
            </div>
          </Modal>
        )}
        {/* Modal Xem tình trạng đặt sân */}
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
              <GuestBookingCourt court={currentBookingCourt} />
            </>
          </Modal>
        )}
        {/* Phân trang */}
        {totalFilteredCourts > pageSize && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalFilteredCourts}
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
    </GuestLayout>
  );
};

export default GuestHomePage;
