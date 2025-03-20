import React, { useEffect, useState } from "react";
import GuestLayout from "../../components/GuestLayout";
import axios from "axios";
import { Card, Row, Col, Tabs, Tag, Typography, Button, Modal } from "antd";
import { Pagination } from "antd";

const { TabPane } = Tabs;
const { Text, Title } = Typography;

const GuestViewProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4; // Cố định số lượng sân hiển thị mỗi trang

  // Lấy danh sách sản phẩm từ API
  const getAllProduct = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/user/product");
      if (res.data.success) {
        setProducts(res.data.data);
        // Lấy danh mục duy nhất
        const uniqueCategories = [
          ...new Set(res.data.data.map((p) => p.category.name)),
        ];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  // Hiện Modal chi tiết sản phẩm
  const showProductDetail = (product) => {
    setCurrentProduct(product);
    setIsModalVisible(true);
  };

  // Đóng Modal chi tiết sản phẩm
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setCurrentProduct(null);
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  const getFilteredProducts = () => {
    const categoryProducts =
      activeCategory === "all"
        ? products
        : products.filter((p) => p.category.name === activeCategory);

    return categoryProducts.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  };
  const handleTabChange = (key) => {
    setActiveCategory(key);
    setCurrentPage(1); // Reset lại trang khi đổi tab
  };

  const renderProductCard = (product) => (
    <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
      <Card
        hoverable
        bordered={false}
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          transition: "transform 0.4s, box-shadow 0.4s",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
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
              src={`http://localhost:8080${product.image}`}
              alt={product.name}
              style={{
                width: "100%",
                height: "260px",
                objectFit: "cover",
                transition: "transform 0.5s ease",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
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
        <Title
          level={4}
          style={{
            color: "#1890ff",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {product.name}
        </Title>
        <Tag
          color="blue"
          style={{
            fontSize: "14px",
            marginBottom: "12px",
            borderRadius: "8px",
          }}
        >
          <Text strong>💰 Giá: </Text> {product.price} VNĐ
        </Tag>
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
          onClick={() => showProductDetail(product)}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          🔍 Xem Chi Tiết
        </Button>
      </Card>
    </Col>
  );

  return (
    <GuestLayout>
      <div
        className="container py-4"
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
          🛍️ Xem Sản Phẩm
        </Title>

        {/* Tabs Danh Mục */}
        <Tabs
          defaultActiveKey="all"
          centered
          onChange={handleTabChange}
          tabBarStyle={{
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "32px",
          }}
        >
          {/* Tab "Tất cả" */}
          <TabPane
            tab={
              <span
                style={{
                  background: "linear-gradient(135deg, #52c41a, #73d13d)",
                  padding: "8px 16px",
                  borderRadius: "12px",
                  color: "#fff",
                  boxShadow: "0 4px 8px rgba(82, 196, 26, 0.5)",
                }}
              >
                Tất cả
              </span>
            }
            key="all"
          >
            <Row gutter={[32, 32]} justify="center">
              {getFilteredProducts().map((product) =>
                renderProductCard(product)
              )}
            </Row>
            {products.length === 0 && (
              <Text
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: "40px",
                  fontSize: "18px",
                  color: "#888",
                }}
              >
                Hiện tại chưa có sản phẩm nào.
              </Text>
            )}
          </TabPane>

          {/* Các tab theo danh mục */}
          {categories.map((category) => (
            <TabPane
              tab={
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #1890ff, rgb(29, 167, 231))",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    color: "#fff",
                    boxShadow: "0 4px 8px rgba(24, 144, 255, 0.4)",
                  }}
                >
                  {category}
                </span>
              }
              key={category} // Dùng category thay cho index để đảm bảo key duy nhất
            >
              <Row gutter={[32, 32]} justify="center">
                {getFilteredProducts().map((product) =>
                  renderProductCard(product)
                )}
              </Row>

              {products.filter((p) => p.category.name === category).length ===
                0 && (
                <Text
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: "40px",
                    fontSize: "18px",
                    color: "#888",
                  }}
                >
                  Hiện tại chưa có sản phẩm nào.
                </Text>
              )}
            </TabPane>
          ))}
        </Tabs>

        {/* Modal chi tiết sản phẩm */}
        {currentProduct && (
          <Modal
            title={
              <Title level={3} style={{ marginBottom: 0 }}>
                {currentProduct.name}
              </Title>
            }
            open={isModalVisible}
            onCancel={handleCloseModal}
            footer={[
              <Button key="close" onClick={handleCloseModal}>
                Đóng
              </Button>,
            ]}
            bodyStyle={{
              padding: "24px",
              borderRadius: "16px",
              background: "#fafafa",
            }}
          >
            <img
              src={`http://localhost:8080${currentProduct.image}`}
              alt={currentProduct.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "16px",
                marginBottom: "24px",
              }}
            />
            <p>
              <strong>💰 Giá:</strong> {currentProduct.price} VNĐ
            </p>
            <p>
              <strong>📋 Mô tả:</strong>{" "}
              {currentProduct.description || "Không có mô tả."}
            </p>
          </Modal>
        )}
        {(activeCategory === "all"
          ? products.length
          : products.filter((p) => p.category.name === activeCategory).length) >
          pageSize && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={
                activeCategory === "all"
                  ? products.length
                  : products.filter((p) => p.category.name === activeCategory)
                      .length
              }
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </div>
    </GuestLayout>
  );
};

export default GuestViewProductPage;
