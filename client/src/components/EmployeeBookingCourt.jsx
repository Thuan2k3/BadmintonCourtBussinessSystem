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
  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const day = new Date(date).getDay(); // Lấy thứ trong tuần (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)
  return daysOfWeek[day];
};

const formatDate = (date) => {
  const d = new Date(date);
  const dayMonth = `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}`;
  const year = d.getFullYear();
  return { dayMonth, year };
};

const EmployeeBookingCourt = ({ court }) => {
  // Xác định nếu là mobile (dưới 768px)
  const isMobile = window.innerWidth <= 768;
  const { user } = useSelector((state) => state.user);

  const [bookingState, setBookingState] = useState(
    court.bookings.map((day) =>
      day.timeSlots.map((slot) => (slot.isBooked ? "booked" : "unbooked"))
    )
  );

  return (
    <Card
      title={<h2 style={{ color: "#096dd9" }}>{court.name}</h2>}
      bordered={false}
      style={{
        width: "100%",
        borderRadius: "16px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Container cuộn ngang cho mobile */}
      <div style={isMobile ? { overflowX: "auto", whiteSpace: "nowrap" } : {}}>
        {/* Header: Hiển thị 7 ngày */}
        <Row
          style={{
            marginBottom: "12px",
            textAlign: "center",
            flexWrap: isMobile ? "nowrap" : "wrap",
          }}
        >
          <Col span={3} style={{ minWidth: "35px" }}>
            <strong>Giờ</strong>
          </Col>
          {court.bookings.map((day, dayIndex) => {
            const { dayMonth } = formatDate(day.date); // Bỏ year
            return (
              <Col
                key={dayIndex}
                span={3}
                style={{ textAlign: "center", minWidth: "35px" }}
              >
                <div>{getDayOfWeek(day.date)}</div>
                <div style={{ fontSize: "12px", color: "#595959" }}>
                  {dayMonth}
                </div>
              </Col>
            );
          })}
        </Row>

        {/* Body: Hiển thị giờ và trạng thái */}
        {court.bookings[0]?.timeSlots.map((slot, slotIndex) => (
          <Row
            key={slotIndex}
            style={{
              marginBottom: "8px",
              alignItems: "center",
              flexWrap: isMobile ? "nowrap" : "wrap",
            }}
          >
            {/* Cột giờ */}
            <Col
              span={3}
              style={{
                textAlign: "center",
                fontWeight: "500",
                minWidth: "35px",
              }}
            >
              {slot.time}
            </Col>

            {/* Các cột trạng thái */}
            {court.bookings.map((day, dayIndex) => (
              <Col
                key={dayIndex}
                span={3}
                style={{ textAlign: "center", minWidth: "35px" }}
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
                          court.bookings[dayIndex].timeSlots[slotIndex]
                            ?.full_name
                        }{" "}
                        <br />
                        {user.role === "employee" ? (
                          <>
                            Email:{" "}
                            {
                              court.bookings[dayIndex].timeSlots[slotIndex]
                                ?.email
                            }
                          </>
                        ) : null}
                      </>
                    ) : (
                      ""
                    )
                  }
                >
                  {day.timeSlots[slotIndex].isBooked ? (
                    <CheckOutlined
                      style={{ color: "#52c41a", fontSize: "20px" }}
                    />
                  ) : (
                    <CloseOutlined
                      style={{ color: "#f5222d", fontSize: "20px" }}
                    />
                  )}
                </Tooltip>
              </Col>
            ))}
          </Row>
        ))}
      </div>
    </Card>
  );
};

export default EmployeeBookingCourt;
