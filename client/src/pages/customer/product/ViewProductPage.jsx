import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import axios from "axios";
import { Card, Row, Col, Tabs, Tag, Typography, Button, Modal } from "antd";

const { TabPane } = Tabs;
const { Text } = Typography;

const ViewProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Lấy danh sách sản phẩm từ API
  const getAllProduct = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/user/product", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setProducts(res.data.data);
        const uniqueCategories = [
          ...new Set(res.data.data.map((p) => p.category.name)),
        ];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.log("Lỗi khi lấy dữ liệu sản phẩm: ", error);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  // Hiển thị modal chi tiết sản phẩm
  const showModal = (product) => {
    setCurrentProduct(product);
    setIsModalVisible(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setCurrentProduct(null);
  };

  return (
    <Layout>
      <div
        style={{ minHeight: "100vh", background: "#f0f0f0", padding: "20px" }}
      >
        <h2 className="text-center">DANH SÁCH SẢN PHẨM</h2>

        <Tabs defaultActiveKey="0" centered>
          {categories.map((category, index) => (
            <TabPane tab={category} key={index}>
              <Row gutter={[16, 16]}>
                {products
                  .filter((p) => p.category.name === category)
                  .map((product) => (
                    <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        hoverable
                        style={{
                          backgroundColor: "#ffffff",
                          borderRadius: "8px",
                        }}
                        cover={
                          <img
                            src={`http://localhost:8080${product.image}`}
                            alt={product.name}
                            style={{
                              height: "250px",
                              objectFit: "cover",
                              borderTopLeftRadius: "8px",
                              borderTopRightRadius: "8px",
                            }}
                          />
                        }
                      >
                        <Card.Meta
                          title={
                            <Text strong style={{ fontSize: "16px" }}>
                              {product.name}
                            </Text>
                          }
                          description={
                            <Tag color="blue">
                              <strong>Giá:</strong> {product.price} VND
                            </Tag>
                          }
                        />
                        <div style={{ marginTop: "10px" }}>
                          <Button
                            type="primary"
                            onClick={() => showModal(product)}
                          >
                            Xem chi tiết
                          </Button>
                        </div>
                      </Card>
                    </Col>
                  ))}
              </Row>
            </TabPane>
          ))}
        </Tabs>

        {/* Modal hiển thị chi tiết sản phẩm */}
        {currentProduct && (
          <Modal
            title={currentProduct.name}
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
                src={`http://localhost:8080${currentProduct.image}`}
                alt="Product"
                style={{ width: "100%", height: 250, objectFit: "cover" }}
              />
              <p>
                <strong>Giá:</strong> {currentProduct.price} VND
              </p>
              <p>
                <strong>Mô tả:</strong>{" "}
                {currentProduct.description || "Không có mô tả"}
              </p>
            </div>
          </Modal>
        )}
      </div>
    </Layout>
  );
};

export default ViewProductPage;
