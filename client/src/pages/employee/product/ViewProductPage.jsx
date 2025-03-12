import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Link } from "react-router-dom";
import { MdOutlineAddBox } from "react-icons/md";
import axios from "axios";
import { Card, Row, Col, Tabs } from "antd";

const { TabPane } = Tabs;

const ViewProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Lấy danh sách sản phẩm từ API
  const getAllProduct = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/admin/product",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
    <Layout>
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
                        style={{
                          backgroundColor: "#f6ffed",
                        }}
                        cover={
                          <img
                            src={`http://localhost:8080${product.image}`}
                            alt={product.name}
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                        }
                        bordered={false}
                      >
                        <Card.Meta
                          title={product.name}
                          description={
                            <>
                              <p>
                                <strong>Giá:</strong> {product.price} VND
                              </p>
                              <p
                                className="text-truncate"
                                title={product.description}
                              >
                                {product.description}
                              </p>
                            </>
                          }
                        />
                      </Card>
                    </Col>
                  ))}
              </Row>
            </TabPane>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

export default ViewProductPage;
