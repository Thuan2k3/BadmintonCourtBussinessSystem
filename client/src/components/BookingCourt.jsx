import React, { useState } from "react";
import {
  CheckOutlined,
  CloseOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { Card, Button, Row, Col } from "antd";
import { useSelector } from "react-redux";

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

const BookingCourt = ({ court }) => {
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
            ? slot === "unbooked" // Nếu là "unbooked", chuyển thành "selected"
              ? "selected"
              : "unbooked" // Nếu là "selected", chuyển lại thành "unbooked"
            : slot
        )
      );
      return newState;
    });
  };

  const handleConfirm = () => {
    // Kiểm tra xem có khung giờ nào được chọn không
    const hasSelectedSlots = bookingState.some((day) =>
      day.some((slot) => slot === "selected")
    );

    if (hasSelectedSlots) {
      // Cập nhật trạng thái các ô đã chọn thành "booked"
      setBookingState((prevState) => {
        const newState = prevState.map((day, dIdx) =>
          day.map((slot, sIdx) => (slot === "selected" ? "booked" : slot))
        );
        return newState;
      });
      // Thông báo thành công
      alert("Đặt sân thành công!");
    } else {
      // Nếu không có giờ nào được chọn, thông báo lỗi
      alert("Vui lòng chọn ít nhất một khung giờ để đặt sân.");
    }
  };

  const handleCancel = () => {
    // Kiểm tra xem có khung giờ nào được chọn không
    const hasSelectedSlots = bookingState.some((day) =>
      day.some((slot) => slot === "selected")
    );

    if (hasSelectedSlots) {
      // Cập nhật trạng thái các ô đã chọn thành "unbooked"
      setBookingState((prevState) => {
        const newState = prevState.map((day, dIdx) =>
          day.map((slot, sIdx) => (slot === "selected" ? "unbooked" : slot))
        );
        return newState;
      });
      // Thông báo thành công
      alert("Hủy đặt sân thành công!");
    } else {
      // Nếu không có giờ nào được chọn, thông báo lỗi
      alert("Không có khung giờ nào được chọn để hủy.");
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
              <Button
                size="small"
                className={`booking-btn ${bookingState[dayIndex][slotIndex]}`}
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
                disabled={
                  bookingState[dayIndex][slotIndex] === "booked" &&
                  user?._id !== court.bookings[dayIndex]?.userId
                }
                style={{
                  width: "100%", // Button chiếm toàn bộ chiều rộng cột
                  height: "40px",
                  fontSize: "14px",
                }}
              >
                {/* Nội dung Button (giờ) */}
              </Button>
            </Col>
          ))}
        </Row>
      ))}

      {/* Thêm 2 nút dưới */}
      <Row
        gutter={8}
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <Col span={10}>
          <Button
            block
            type="primary"
            onClick={handleConfirm}
            style={{
              fontSize: "16px",
              height: "40px",
            }}
          >
            Đặt sân
          </Button>
        </Col>
        <Col span={10}>
          <Button
            block
            type="default"
            onClick={handleCancel}
            style={{
              fontSize: "16px",
              height: "40px",
            }}
          >
            Hủy đặt sân
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default BookingCourt;
