import React, { useState } from "react";
import {
  CheckOutlined,
  CloseOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { Card, Button, Row, Col } from "antd";

const BookingCourt = ({ court }) => {
  const [bookingState, setBookingState] = useState(
    court.availability.map((day) =>
      day.timeSlots.map((slot) => (slot.isBooked ? "booked" : "unbooked"))
    )
  );

  const handleBooking = (dayIndex, slotIndex) => {
    const newState = [...bookingState];

    if (newState[dayIndex][slotIndex] === "unbooked") {
      newState[dayIndex][slotIndex] = "selected"; // Nếu chưa đặt, đánh dấu là đã chọn
    } else if (newState[dayIndex][slotIndex] === "selected") {
      newState[dayIndex][slotIndex] = "booked"; // Nếu đã chọn, đánh dấu là đã đặt
    } else {
      newState[dayIndex][slotIndex] = "unbooked"; // Nếu đã đặt, quay lại trạng thái chưa đặt
    }

    setBookingState(newState);
  };

  return (
    <Card
      title={court.name}
      bordered={false}
      className="text-bg-light p-3"
      style={{ width: "50rem" }}
    >
      {/* Row cho ngày trong tuần */}
      <Row gutter={16}>
        {court.availability.map((day, dayIndex) => (
          <Col
            span={Math.floor(24 / court.availability.length)} // Căn chỉnh số cột cho các ngày
            key={dayIndex}
          >
            <h6 style={{ margin: 0, fontSize: 14, textAlign: "center" }}>
              {day.date}
            </h6>
          </Col>
        ))}
      </Row>

      {/* Hiển thị các giờ */}
      {court.availability[0].timeSlots.map((slot, slotIndex) => (
        <Row gutter={16} key={slotIndex}>
          {/* Hiển thị các nút đặt sân cho từng ngày của mỗi giờ */}
          {court.availability.map((day, dayIndex) => (
            <Col
              span={Math.floor(24 / court.availability.length)} // Căn chỉnh các cột cho các ngày
              key={dayIndex}
              style={{ padding: "8px" }}
            >
              <Button
                type={
                  bookingState[dayIndex][slotIndex] === "booked"
                    ? "primary"
                    : bookingState[dayIndex][slotIndex] === "selected"
                    ? "dashed"
                    : "default"
                }
                icon={
                  bookingState[dayIndex][slotIndex] === "booked" ? (
                    <CheckOutlined />
                  ) : bookingState[dayIndex][slotIndex] === "selected" ? (
                    <AppstoreAddOutlined />
                  ) : (
                    <CloseOutlined />
                  )
                }
                onClick={() => handleBooking(dayIndex, slotIndex)}
                disabled={bookingState[dayIndex][slotIndex] === "booked"}
              >
                {slot.time}
              </Button>
            </Col>
          ))}
        </Row>
      ))}
    </Card>
  );
};

export default BookingCourt;
