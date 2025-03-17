import React, { useEffect, useState } from "react";
import GuestLayout from "../../components/GuestLayout";
import axios from "axios";
import { Card, Row, Col, Tabs, Tag, Typography, Button } from "antd";

const { TabPane } = Tabs;
const { Text, Title } = Typography;

const GuestViewProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Lấy danh sách sản phẩm từ API
  const getAllProduct = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/user/product");
      if (res.data.success) {
        setProducts(res.data.data);
        const uniqueCategories = [
          ...new Set(res.data.data.map((p) => p.category.name)),
        ];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm:", error);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

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
          defaultActiveKey="0"
          centered
          tabBarStyle={{
            fontSize: "16px",
            fontWeight: "bold",
            marginBottom: "32px",
          }}
        >
          {categories.map((category, index) => (
            <TabPane
              tab={
                <span
                  style={{
                    background: "linear-gradient(135deg, #1890ff, #85d8ff)",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    color: "#fff",
                    boxShadow: "0 4px 8px rgba(24, 144, 255, 0.4)",
                  }}
                >
                  {category}
                </span>
              }
              key={index}
            >
              <Row gutter={[32, 32]} justify="center">
                {products
                  .filter((p) => p.category.name === category)
                  .map((product) => (
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
                          <Text strong>💰 Giá: </Text> {product.price} VND
                        </Tag>

                        {product.description && (
                          <Tag
                            color="green"
                            style={{
                              fontSize: "14px",
                              marginBottom: "12px",
                              borderRadius: "8px",
                            }}
                          >
                            <Text ellipsis>{product.description}</Text>
                          </Tag>
                        )}

                        {/* Nút Xem Chi Tiết */}
                        <Button
                          type="primary"
                          shape="round"
                          block
                          style={{
                            marginTop: "12px",
                            background:
                              "linear-gradient(135deg, #ff4d4f, #ff7875)",
                            border: "none",
                            fontWeight: "bold",
                            boxShadow: "0 4px 12px rgba(255, 77, 79, 0.5)",
                            transition: "transform 0.3s",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.transform = "scale(1.1)")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.transform = "scale(1)")
                          }
                        >
                          🔍 Xem Chi Tiết
                        </Button>
                      </Card>
                    </Col>
                  ))}
              </Row>

              {/* Nếu không có sản phẩm */}
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
      </div>
    </GuestLayout>
  );
};

export default GuestViewProductPage;
