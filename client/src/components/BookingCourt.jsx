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

  const canBookingReservation = (reservationTime) => {
    const currentTime = new Date();
    currentTime.setHours(7, 0, 0, 0);
    console.log(currentTime);
    const reservationDate = new Date(reservationTime);
    console.log(reservationDate);

    const timeDiff = reservationDate - currentTime; // Time difference in milliseconds
    const oneDayInMillis = 24 * 60 * 60 * 1000; // 1 day in milliseconds

    return timeDiff >= oneDayInMillis; // Return true if can cancel, false otherwise
  };

  const handleConfirm = () => {
    // Kiểm tra xem có khung giờ nào được chọn không
    const hasSelectedSlots = bookingState.some((day) =>
      day.some((slot) => slot === "selected")
    );

    if (hasSelectedSlots) {
      const canBookingAll = bookingState.every((day, index) => {
        // Kiểm tra nếu ngày này có ít nhất một khung giờ được chọn
        const hasSelectedSlot = day.some((slot) => slot === "selected");

        // Nếu ngày này có slot được chọn nhưng không hợp lệ, thì không cho đặt
        return (
          !hasSelectedSlot || canBookingReservation(court.bookings[index].date)
        );
      });

      if (canBookingAll) {
        // Cập nhật trạng thái các ô đã chọn thành "booked"
        setBookingState((prevState) => {
          const newState = prevState.map((day, dIdx) =>
            day.map((slot, sIdx) => (slot === "selected" ? "booked" : slot))
          );
          return newState;
        });
        // Thông báo thành công
        message.success("Đặt sân thành công!");
      } else {
        message.warning("Vui lòng đặt trước 1 ngày");
      }
    } else {
      // Nếu không có giờ nào được chọn, thông báo lỗi
      message.warning("Vui lòng chọn ít nhất một khung giờ để đặt sân.");
    }
  };

  const canCancelReservation = (reservationTime) => {
    const currentTime = new Date();
    currentTime.setHours(7, 0, 0, 0);
    console.log(currentTime);
    const reservationDate = new Date(reservationTime);
    console.log(reservationDate);

    const timeDiff = reservationDate - currentTime; // Time difference in milliseconds
    const oneDayInMillis = 24 * 60 * 60 * 1000; // 1 day in milliseconds

    return timeDiff >= oneDayInMillis; // Return true if can cancel, false otherwise
  };

  const handleCancel = () => {
    // Kiểm tra xem có khung giờ nào được chọn không
    const hasSelectedSlots = bookingState.some((day) =>
      day.some((slot) => slot === "selectunbooked")
    );

    if (hasSelectedSlots) {
      // Kiểm tra xem có khung giờ nào không thể hủy
      const canCancelAll = bookingState.every((day, index) => {
        // Kiểm tra nếu ngày này có ít nhất một khung giờ 'selectunbooked'
        const hasUnbookedSlot = day.some((slot) => slot === "selectunbooked");

        // Nếu có slot 'selectunbooked' nhưng không thể hủy, thì không cho hủy
        return (
          !hasUnbookedSlot || canCancelReservation(court.bookings[index].date)
        );
      });

      if (canCancelAll) {
        // Cập nhật trạng thái các ô đã chọn thành "unbooked"
        setBookingState((prevState) => {
          const newState = prevState.map((day, dIdx) =>
            day.map((slot, sIdx) =>
              slot === "selectunbooked" ? "unbooked" : slot
            )
          );
          return newState;
        });
        // Thông báo thành công
        message.success("Hủy đặt sân thành công!");
      } else {
        // Nếu không thể hủy do quá thời gian, thông báo lỗi
        message.warning("Đã quá thời gian hủy đặt sân cho một số khung giờ.");
      }
    } else {
      // Nếu không có giờ nào được chọn, thông báo lỗi
      message.warning("Không có khung giờ nào được chọn để hủy.");
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
                  bookingState[dayIndex][slotIndex] === "booked"
                    ? `ID: ${court.bookings[dayIndex]?.userId}`
                    : ""
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
                    ) : bookingState[dayIndex][slotIndex] === "unbooked" ? (
                      <CloseOutlined />
                    ) : (
                      <CloseSquareOutlined />
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
              </Tooltip>
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
            onClick={showConfirmBooking}
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
            onClick={showConfirmCancel}
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
