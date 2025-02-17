import React from "react";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Card, Button } from "antd";
import { useState } from "react";
import Layout from "../../components/Layout";
import BookingCourt from "../../components/BookingCourt";

const CourtBookingStatusPage = () => {
  const courts = [
    {
      id: 1,
      name: "Sân 1",
      availability: [
        {
          date: "2025-02-17",
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: true },
          ],
        },
        {
          date: "2025-02-18",
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: false },
          ],
        },
        {
          date: "2025-02-19",
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: true },
          ],
        },
        {
          date: "2025-02-20",
          timeSlots: [
            { time: "08:00", isBooked: true },
            { time: "09:00", isBooked: false },
          ],
        },
        {
          date: "2025-02-21",
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: false },
          ],
        },
        {
          date: "2025-02-22",
          timeSlots: [
            { time: "08:00", isBooked: true },
            { time: "09:00", isBooked: false },
          ],
        },
        {
          date: "2025-02-23",
          timeSlots: [
            { time: "08:00", isBooked: false },
            { time: "09:00", isBooked: true },
          ],
        },
      ],
    },
    // Add more courts as needed
  ];

  return (
    <Layout>
      <div style={{ display: "flex", gap: 16 }}>
        {courts.map((court) => (
          <BookingCourt key={court.id} court={court} />
        ))}
      </div>
    </Layout>
  );
};

export default CourtBookingStatusPage;
