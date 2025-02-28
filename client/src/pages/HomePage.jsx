import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Row, Col, Card } from "antd";

const HomePage = () => {
  const [court, setCourt] = useState([]);
  //getAllCourt
  const getAllCourt = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/admin/court", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setCourt(res.data.data);
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
      <div className="p-2">
        <h1 className="d-flex justify-content-center">Trang chủ</h1>
        <Row gutter={[16, 16]}>
          {court.map((court) => (
            <Col key={court._id} xs={24} sm={12} md={8} lg={6}>
              <Card
                cover={
                  <img
                    src={`http://localhost:8080${court.image}`}
                    alt={court.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                }
                bordered={true}
                style={{ backgroundColor: "#f6ffed"}}
              >
                <Card.Meta
                  title={court.name}
                  description={
                    <>
                      <p>
                        <strong>Giá:</strong> {court.price} VND
                      </p>
                      <p className="text-truncate" title={court.description}>
                        {court.description}
                      </p>
                      <p>
                        <strong>Trạng thái:</strong>{" "}
                        {court.isEmpty ? "Trống" : "Có người"}
                      </p>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </Layout>
  );
};

export default HomePage;
