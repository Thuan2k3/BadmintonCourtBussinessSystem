import React, { useEffect, useState } from "react";
import GuestLayout from "../../components/GuestLayout";
import { Link } from "react-router-dom";
import { MdOutlineAddBox } from "react-icons/md";
import axios from "axios";
import { Card, Row, Col, Tabs, Tag } from "antd";

const { TabPane } = Tabs;
import { Typography } from "antd";
const { Text } = Typography;

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
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  return (
    <GuestLayout>
      <div className="container py-4">
        <h1 className="text-center">XEM SẢN PHẨM</h1>
        <Tabs defaultActiveKey="0">
          {categories.map((category, index) => (
            <TabPane tab={category} key={index}>
              <Row gutter={[16, 16]}>
                {products
                  .filter((p) => p.category.name === category)
                  .map((product) => (
                    <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
                      <Card
                        title={product.name}
                        bordered
                        hoverable
                        cover={
                          <img
                            src={`http://localhost:8080${product.image}`}
                            alt="Product"
                            style={{ height: 150, objectFit: "cover" }}
                          />
                        }
                      >
                        <Tag color="blue">
                          <Text strong>Giá: </Text>
                          {product.price} VND
                        </Tag>
                        {product.description && (
                          <Tag color="green">
                            <Text ellipsis>{product.description}</Text>
                          </Tag>
                        )}
                      </Card>
                    </Col>
                  ))}
              </Row>
            </TabPane>
          ))}
        </Tabs>
      </div>
    </GuestLayout>
  );
};

export default GuestViewProductPage;
