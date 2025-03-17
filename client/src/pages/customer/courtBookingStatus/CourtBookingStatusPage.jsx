import React, { useState, useEffect } from "react";
import { Row, Col, Spin, message } from "antd";
import GuestLayout from "../../../components/GuestLayout";
import BookingCourt from "../../../components/BookingCourt";
import axios from "axios";

const CourtBookingStatusPage = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/user/bookings/court",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ); // Cập nhật URL API của bạn
        setCourts(response.data);
      } catch (error) {
        message.error("Không thể tải dữ liệu sân.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  return (
    <GuestLayout style={{ padding: "20px" }}>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      ) : (
        <Row gutter={[16, 16]}>
          {courts.map((court) => (
            <Col span={12} key={court.id}>
              <BookingCourt court={court} />
            </Col>
          ))}
        </Row>
      )}
    </GuestLayout>
  );
};

export default CourtBookingStatusPage;
