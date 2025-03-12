import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Row, Col, Card, Tag } from "antd";
import { Typography } from "antd";
const { Text } = Typography;

const HomePage = () => {
  const [courts, setCourts] = useState([]);
  //getAllCourt
  const getAllCourt = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/admin/court", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setCourts(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCourt();
  }, []);

  return (
    <Layout>
      <div className="container mt-4">
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
                {court.description && (
                  <Tag color="green">
                    <Text ellipsis>{court.description}</Text>
                  </Tag>
                )}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Layout>
  );
};

export default HomePage;
