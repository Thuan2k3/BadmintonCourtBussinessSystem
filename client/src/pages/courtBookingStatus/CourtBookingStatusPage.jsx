import React from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Card, Button, Row, Col } from "antd";
import { useState } from "react";
import Layout from "../../components/Layout";
import BookingCourt from "../../components/BookingCourt";

const CourtBookingStatusPage = () => {
  const courts = [
    {
      id: 1,
      name: "Sân 1",
      bookings: [
        {
          date: "2025-02-17",
          court_id: "court_1", // Thêm court_id vào bookings
          userId: "67a9b6783bce6f55ea0219da", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: true },
          ],
        },
        {
          date: "2025-02-18",
          court_id: "court_1", // Thêm court_id vào bookings
          userId: "user_001", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: false },
          ],
        },
        {
          date: "2025-02-19",
          court_id: "court_1", // Thêm court_id vào bookings
          userId: "67a9b6783bce6f55ea0219da", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: true },
          ],
        },
        {
          date: "2025-02-20",
          court_id: "court_1", // Thêm court_id vào bookings
          userId: "user_001", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: true },
            { time: "09:00", isBooked: false },
          ],
        },
        {
          date: "2025-02-21",
          court_id: "court_1", // Thêm court_id vào bookings
          userId: "user_001", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: false },
          ],
        },
        {
          date: "2025-02-22",
          court_id: "court_1", // Thêm court_id vào bookings
          userId: "user_001", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: true },
            { time: "09:00", isBooked: false },
          ],
        },
        {
          date: "2025-02-23",
          court_id: "court_1", // Thêm court_id vào bookings
          userId: "67a9b6783bce6f55ea0219da", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: true },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Sân 2",
      bookings: [
        {
          date: "2025-02-17",
          court_id: "court_2", // Thêm court_id vào bookings
          userId: "user_002", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: true },
          ],
        },
        {
          date: "2025-02-18",
          court_id: "court_2", // Thêm court_id vào bookings
          userId: "user_002", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: false },
          ],
        },
        {
          date: "2025-02-19",
          court_id: "court_2", // Thêm court_id vào bookings
          userId: "user_002", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: true },
          ],
        },
        {
          date: "2025-02-20",
          court_id: "court_2", // Thêm court_id vào bookings
          userId: "user_002", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: true },
            { time: "09:00", isBooked: false },
          ],
        },
        {
          date: "2025-02-21",
          court_id: "court_2", // Thêm court_id vào bookings
          userId: "user_002", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: false },
          ],
        },
        {
          date: "2025-02-22",
          court_id: "court_2", // Thêm court_id vào bookings
          userId: "user_002", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: true },
            { time: "09:00", isBooked: false },
          ],
        },
        {
          date: "2025-02-23",
          court_id: "court_2", // Thêm court_id vào bookings
          userId: "user_002", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: true },
          ],
        },
      ],
    },
    {
      id: 3,
      name: "Sân 3",
      bookings: [
        {
          date: "2025-02-17",
          court_id: "court_3", // Thêm court_id vào bookings
          userId: "user_003", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: true },
          ],
        },
        {
          date: "2025-02-18",
          court_id: "court_3", // Thêm court_id vào bookings
          userId: "user_003", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: false },
          ],
        },
        {
          date: "2025-02-19",
          court_id: "court_3", // Thêm court_id vào bookings
          userId: "user_003", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: true },
          ],
        },
        {
          date: "2025-02-20",
          court_id: "court_3", // Thêm court_id vào bookings
          userId: "user_003", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: true },
            { time: "09:00", isBooked: false },
          ],
        },
        {
          date: "2025-02-21",
          court_id: "court_3", // Thêm court_id vào bookings
          userId: "user_003", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: false },
          ],
        },
        {
          date: "2025-02-22",
          court_id: "court_3", // Thêm court_id vào bookings
          userId: "user_003", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: true },
            { time: "09:00", isBooked: false },
          ],
        },
        {
          date: "2025-02-23",
          court_id: "court_3", // Thêm court_id vào bookings
          userId: "user_003", // Thêm userId vào bookings
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: true },
          ],
        },
      ],
    },
  ];

  return (
    <Layout style={{ padding: "20px" }}>
      <Row gutter={[16, 16]}>
        {courts.map((court) => (
          <Col span={12} key={court.id}>
            <BookingCourt court={court} />
          </Col>
        ))}
      </Row>
    </Layout>
  );
};

export default CourtBookingStatusPage;
