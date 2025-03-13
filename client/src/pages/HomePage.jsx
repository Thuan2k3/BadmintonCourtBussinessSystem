import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Row, Col, Card, Tag, Modal, Button } from "antd";
import { Typography } from "antd";
const { Text } = Typography;

const HomePage = () => {
  const [courts, setCourts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); // Trạng thái hiển thị modal
  const [currentCourt, setCurrentCourt] = useState(null); // Lưu thông tin sân hiện tại

  // Hàm lấy tất cả các sân
  const getAllCourt = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/admin/court", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setCourts(res.data.data); // Cập nhật danh sách sân
      }
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu sân: ", error);
    }
  };

  // Mở modal và hiển thị thông tin chi tiết sân
  const showModal = (court) => {
    setCurrentCourt(court);
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentCourt(null);
  };

  // Gọi API lấy danh sách sân khi component được render
  useEffect(() => {
    getAllCourt();
  }, []);

  return (
    <Layout>
      <div className="container mt-4">
        <div className="container-fluid bg-light min-vh-100 p-4">
          <h2 id="courts" className="mt-4 text-center">
            DANH SÁCH CÁC SÂN
          </h2>
          <Row gutter={[16, 16]}>
            {courts.map((court) => (
              <Col xs={24} sm={12} md={8} key={court.id}>
                <Card
                  title={court.name}
                  bordered
                  hoverable
                  cover={
                    <img
                      src={`http://localhost:8080${court.image}`}
                      alt="Court"
                      style={{ height: 250, objectFit: "cover" }}
                    />
                  }
                >
                  <Tag color="blue">
                    <Text strong>Giá thuê mỗi giờ: </Text>
                    {court.price} VND
                  </Tag>
                  <div style={{ marginTop: "10px" }}>
                    <Button type="primary" onClick={() => showModal(court)}>
                      Xem chi tiết
                    </Button>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Modal hiển thị chi tiết sân */}
          {currentCourt && (
            <Modal
              title={currentCourt.name}
              visible={isModalVisible}
              onCancel={handleCancel}
              footer={[
                <Button key="back" onClick={handleCancel}>
                  Đóng
                </Button>,
              ]}
            >
              <div>
                <img
                  src={`http://localhost:8080${currentCourt.image}`}
                  alt="Court"
                  style={{ width: "100%", height: 250, objectFit: "cover" }}
                />
                <p>
                  <strong>Giá thuê mỗi giờ:</strong> {currentCourt.price} VND
                </p>
                <p>
                  <strong>Mô tả:</strong>{" "}
                  {currentCourt.description || "Không có mô tả"}
                </p>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
