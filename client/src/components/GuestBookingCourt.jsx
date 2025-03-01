import React, { useState } from "react";
import {
  CheckOutlined,
  CloseOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Card, Button, Row, Col, Modal, message, Tooltip } from "antd";
import { useSelector } from "react-redux";
import axios from "axios";

const { confirm } = Modal;

// Hàm chuyển ngày thành thứ trong tuần
const getDayOfWeek = (date) => {
  const daysOfWeek = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  const day = new Date(date).getDay(); // Lấy thứ trong tuần (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)
  return daysOfWeek[day];
};

const GuestBookingCourt = ({ court }) => {
  const { user } = useSelector((state) => state.user);

  const [bookingState, setBookingState] = useState(
    court.bookings.map((day) =>
      day.timeSlots.map((slot) => (slot.isBooked ? "booked" : "unbooked"))
    )
  );

  const handleBooking = (dayIndex, slotIndex) => {
    setBookingState((prevState) => {
      const newState = prevState.map((day, dIdx) =>
        day.map((slot, sIdx) =>
          dIdx === dayIndex && sIdx === slotIndex
            ? slot === "unbooked"
              ? "selected"
              : slot === "booked"
              ? "selectunbooked"
              : slot === "selectunbooked"
              ? "booked"
              : "unbooked"
            : slot
        )
      );
      return newState;
    });
  };

  return (
    <Card
      title={court.name}
      bordered={true}
      style={{
        width: "38rem",
        backgroundColor: "#f6ffed",
      }}
    >
      {/* Hiển thị thứ trong tuần */}
      <Row
        gutter={8}
        style={{
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Col span={3} style={{ textAlign: "center", fontSize: "14px" }}>
          {/* Cột giờ */}
        </Col>
        {court.bookings.map((day, dayIndex) => (
          <Col
            span={Math.floor(24 / court.bookings.length)}
            key={dayIndex}
            style={{
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {getDayOfWeek(day.date)} {/* Hiển thị thứ trong tuần */}
            {day.date}
          </Col>
        ))}
      </Row>

      {/* Hiển thị giờ và các nút đặt */}
      {court.bookings[0].timeSlots.map((slot, slotIndex) => (
        <Row
          gutter={8}
          key={slotIndex}
          style={{
            display: "flex",
            justifyContent: "flex-start", // Canh các phần tử bên trái
            alignItems: "center", // Căn giữa theo chiều dọc
          }}
        >
          {/* Cột giờ bên trái */}
          <Col
            span={3} // Dành 1 cột cho giờ
            style={{
              padding: "4px",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {slot.time}
          </Col>

          {/* Các cột nút bên phải */}
          {court.bookings.map((day, dayIndex) => (
            <Col
              span={Math.floor(24 / court.bookings.length)}
              key={dayIndex}
              style={{
                padding: "4px",
              }}
            >
              <Tooltip
                title={
                  bookingState[dayIndex][slotIndex] === "booked" ? (
                    <>
                      ID:{" "}
                      {court.bookings[dayIndex].timeSlots[slotIndex]?.userId}{" "}
                      <br />
                      Full name:{" "}
                      {
                        court.bookings[dayIndex].timeSlots[slotIndex]?.full_name
                      }{" "}
                      <br />
                    </>
                  ) : (
                    ""
                  )
                }
              >
                <Button
                  size="small"
                  className={`booking-btn ${bookingState[dayIndex][slotIndex]}`}
                  icon={
                    bookingState[dayIndex][slotIndex] === "booked" ? (
                      <CheckOutlined />
                    ) : bookingState[dayIndex][slotIndex] === "selected" ? (
                      <CheckSquareOutlined />
                    ) : bookingState[dayIndex][slotIndex] ===
                      "selectunbooked" ? (
                      <CloseSquareOutlined />
                    ) : (
                      <CloseOutlined />
                    )
                  }
                  onClick={() => handleBooking(dayIndex, slotIndex)}
                  disabled={true}
                  style={{
                    width: "100%", // Button chiếm toàn bộ chiều rộng cột
                    height: "40px",
                    fontSize: "14px",
                  }}
                >
                  {/* Nội dung Button (giờ) */}
                </Button>
              </Tooltip>
            </Col>
          ))}
        </Row>
      ))}
    </Card>
  );
};

export default GuestBookingCourt;
