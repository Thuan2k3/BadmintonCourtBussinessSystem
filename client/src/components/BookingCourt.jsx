import React, { useState } from "react";
import {
  CheckOutlined,
  CloseOutlined,
  CheckSquareOutlined,
  CloseSquareOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Card, Button, Row, Col, Modal, message, Tooltip } from "antd";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/features/alertSlice";

const { confirm } = Modal;

// Hàm chuyển ngày thành thứ trong tuần
const getDayOfWeek = (date) => {
  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const day = new Date(date).getDay(); // Lấy thứ trong tuần (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)
  return daysOfWeek[day];
};

// Hàm định dạng ngày thành [dd/MM, yyyy]
const formatDate = (date) => {
  const d = new Date(date);
  const dayMonth = `${String(d.getDate()).padStart(2, "0")}/${String(
    d.getMonth() + 1
  ).padStart(2, "0")}`;
  const year = d.getFullYear();
  return { dayMonth, year };
};

const BookingCourt = ({ court }) => {
  // Xác định nếu là mobile (dưới 768px)
  const isMobile = window.innerWidth <= 768;
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

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
          dispatch(showLoading());
          const response = await axios.post(
            `http://localhost:8080/api/v1/user/bookings`,
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
          dispatch(hideLoading());

          if (response.data.success) {
            message.success("Đặt sân thành công!");
          } else {
            message.error(response.data.message || "Đặt sân thất bại!");
          }
        } catch (error) {
          dispatch(hideLoading());
          if (error.response) {
            message.error(error.response.data.error || "Đặt sân thất bại!");
          } else {
            message.error("Có lỗi xảy ra khi đặt sân!");
          }
        }
      }
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
          dispatch(showLoading());
          const response = await axios.delete(
            `http://localhost:8080/api/v1/user/bookings/${slot.bookingId}`,
            {
              data: { timeSlotId: slot.timeSlotId },
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          dispatch(hideLoading());

          if (response.data.success) {
            message.success("Hủy đặt sân thành công!");
          } else {
            message.error(response.data.message || "Hủy đặt sân thất bại!");
          }
        } catch (error) {
          dispatch(hideLoading());
          if (error.response) {
            message.error(error.response.data.error || "Hủy đặt sân thất bại!");
          } else {
            message.error("Có lỗi xảy ra khi hủy đặt sân!");
          }
        }
      }
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
        {/* Hiển thị thứ trong tuần */}
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

        {/* Hiển thị giờ và các nút đặt */}
        {court.bookings[0].timeSlots.map((slot, slotIndex) => (
          <Row
            key={slotIndex}
            style={{
              marginBottom: "8px",
              alignItems: "center",
              flexWrap: isMobile ? "nowrap" : "wrap",
            }}
          >
            {/* Cột giờ bên trái */}
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

            {/* Các cột nút bên phải */}
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
                  <Button
                    size="small"
                    className={`booking-btn ${bookingState[dayIndex][slotIndex]}`}
                    icon={
                      bookingState[dayIndex][slotIndex] === "booked" ? (
                        <CheckOutlined
                          style={{
                            color:
                              user?._id !==
                              court.bookings[dayIndex].timeSlots[slotIndex]
                                ?.userId
                                ? "rgba(82, 196, 26, 0.3)" // Màu xanh lá rất nhạt
                                : "#52c41a",
                            fontSize: "20px",
                          }}
                        />
                      ) : bookingState[dayIndex][slotIndex] === "selected" ? (
                        <CheckSquareOutlined
                          style={{ fontSize: "20px", color: "#faad14" }}
                        />
                      ) : bookingState[dayIndex][slotIndex] ===
                        "selectunbooked" ? (
                        <CloseSquareOutlined
                          style={{ fontSize: "20px", color: "#8c8c8c" }}
                        />
                      ) : (
                        <CloseOutlined
                          style={{ color: "#f5222d", fontSize: "20px" }}
                        />
                      )
                    }
                    onClick={() => handleBooking(dayIndex, slotIndex)}
                    disabled={
                      bookingState[dayIndex][slotIndex] === "booked" &&
                      user?._id !==
                        court.bookings[dayIndex].timeSlots[slotIndex]?.userId
                    }
                    style={{
                      width: "100%", // Button chiếm toàn bộ chiều rộng cột
                      height: "40px",
                      fontSize: "14px",
                      border: "none",
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
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
          }}
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
      </div>
    </Card>
  );
};

export default BookingCourt;
