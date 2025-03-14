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

const EmployeeBookingCourt = ({ court }) => {
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

  // Hàm đặt sân
  const handleConfirm = async () => {
    const selectedSlots = [];
    bookingState.forEach((day, dayIndex) => {
      day.forEach((slot, slotIndex) => {
        if (slot === "selected") {
          selectedSlots.push({
            courtId: court._id,
            date: court.bookings[dayIndex].date,
            timeSlot: court.bookings[dayIndex].timeSlots[slotIndex].time,
          });
        }
      });
    });

    if (selectedSlots.length === 0) {
      message.warning("Vui lòng chọn ít nhất một khung giờ để đặt sân.");
      return;
    }

    try {
      for (const slot of selectedSlots) {
        try {
          const response = await axios.post(
            `http://localhost:8080/api/v1/employee/bookings`,
            {
              userId: user?._id,
              courtId: slot.courtId,
              date: slot.date,
              timeSlot: slot.timeSlot,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.data.success) {
            message.success("Đặt sân thành công!");
          } else {
            message.error(response.data.message || "Đặt sân thất bại!");
          }
        } catch (error) {
          if (error.response) {
            message.error(error.response.data.error || "Đặt sân thất bại!");
          } else {
            message.error("Có lỗi xảy ra khi đặt sân!");
          }
        }
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      message.error("Có lỗi xảy ra khi đặt sân!");
      console.error(error);
    }
  };

  // Hàm hủy đặt sân
  const handleCancel = async () => {
    const selectedSlots = [];
    bookingState.forEach((day, dayIndex) => {
      day.forEach((slot, slotIndex) => {
        if (slot === "selectunbooked") {
          selectedSlots.push({
            bookingId: court.bookings[dayIndex].booking_id,
            timeSlotId:
              court.bookings[dayIndex].timeSlots[slotIndex].timeSlotBooking_id,
          });
        }
      });
    });

    if (selectedSlots.length === 0) {
      message.warning("Không có khung giờ nào được chọn để hủy.");
      return;
    }

    try {
      for (const slot of selectedSlots) {
        try {
          const response = await axios.delete(
            `http://localhost:8080/api/v1/employee/bookings/${slot.bookingId}`,
            {
              data: { timeSlotId: slot.timeSlotId },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          if (response.data.success) {
            message.success("Hủy đặt sân thành công!");
          } else {
            message.error(response.data.message || "Hủy đặt sân thất bại!");
          }
        } catch (error) {
          if (error.response) {
            message.error(error.response.data.error || "Hủy đặt sân thất bại!");
          } else {
            message.error("Có lỗi xảy ra khi hủy đặt sân!");
          }
        }
      }

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      message.error("Có lỗi xảy ra khi hủy đặt sân!");
      console.error(error);
    }
  };

  const showConfirmBooking = () => {
    // Kiểm tra xem có khung giờ nào được chọn không
    const hasSelectedSlots = bookingState.some((day) =>
      day.some((slot) => slot === "selected")
    );
    if (!hasSelectedSlots) {
      message.warning("Vui lòng chọn ít nhất một khung giờ để đặt sân.");
    } else {
      confirm({
        title: "Xác nhận đặt sân",
        icon: <ExclamationCircleOutlined />,
        content: "Bạn có chắc chắn muốn đặt sân không?",
        onOk() {
          handleConfirm();
        },
        onCancel() {
          console.log("Hủy thao tác đặt sân");
        },
      });
    }
  };

  const showConfirmCancel = () => {
    // Kiểm tra xem có khung giờ nào được chọn không
    const hasSelectedSlots = bookingState.some((day) =>
      day.some((slot) => slot === "selectunbooked")
    );

    if (!hasSelectedSlots) {
      message.warning("Không có khung giờ nào được chọn để hủy.");
    } else {
      confirm({
        title: "Xác nhận hủy đặt sân",
        icon: <ExclamationCircleOutlined />,
        content: "Bạn có chắc chắn muốn hủy đặt sân không?",
        onOk() {
          handleCancel();
        },
        onCancel() {
          console.log("Hủy thao tác hủy sân");
        },
      });
    }
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
                      {user.role === "employee" ? (
                        <>
                          Email:{" "}
                          {court.bookings[dayIndex].timeSlots[slotIndex]?.email}
                        </>
                      ) : null}
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

export default EmployeeBookingCourt;
