import React, { useState, useEffect } from "react";
import { Row, Col, Spin, message } from "antd";
import GuestLayout from "../../components/GuestLayout";
import axios from "axios";
import GuestBookingCourt from "../../components/GuestBookingCourt";

const GuestCourtBookingStatusPage = () => {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/v1/user/bookings/court"
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
    <GuestLayout>
      {loading ? (
        <Spin size="large" style={{ display: "block", margin: "auto" }} />
      ) : (
        <div>
          <Row gutter={[16, 16]}>
            {courts.map((court) => (
              <Col
                span={12}
                key={court.id}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <GuestBookingCourt court={court} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </GuestLayout>
  );
};

export default GuestCourtBookingStatusPage;
