import React, { useEffect, useState } from "react";
import { Table, Tag, Typography, Spin, Modal } from "antd";
import {
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title } = Typography;

const BookingHistory = ({ visible, onClose, userId }) => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!visible) return; // Chỉ gọi khi modal mở

    const fetchBookingHistory = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (token && userId) {
          const response = await axios.get(
            `http://localhost:8080/api/v1/user/booking-history`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                customer_id: userId,
              },
            }
          );
          setBookingHistory(response.data);
        }
      } catch (err) {
        console.error("Lỗi lấy lịch sử:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingHistory();
  }, [visible, userId]); // Gọi khi mở modal

  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Sân",
      dataIndex: "courtName",
      key: "courtName",
    },
    {
      title: "Giá sân",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Khung giờ",
      render: (record) => `${record.time}`,
    },
    {
      title: "Trạng thái sau đặt sân",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        switch (status) {
          case "completed":
            return (
              <Tag icon={<CheckCircleOutlined />} color="green">
                Đã đến
              </Tag>
            );
          case "no-show":
            return (
              <Tag icon={<CloseCircleOutlined />} color="red">
                Không đến
              </Tag>
            );
          default:
            return (
              <Tag icon={<ClockCircleOutlined />} color="blue">
                Đang chờ
              </Tag>
            );
        }
      },
    },
  ];

  return (
    <Modal
      title="📜 Lịch sử đặt sân"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {loading ? (
        <Spin tip="Đang tải dữ liệu..." />
      ) : (
        <Table
          columns={columns}
          dataSource={bookingHistory}
          rowKey="_id"
          pagination={{ pageSize: 5, position: ["bottomCenter"] }}
        />
      )}
    </Modal>
  );
};

export default BookingHistory;
