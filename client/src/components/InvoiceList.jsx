import React, { useState } from "react";
import {
  Card,
  Select,
  InputNumber,
  Button,
  Table,
  message,
  Typography,
} from "antd";
import { DollarCircleOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const InvoiceList = ({ orderItemsCourt, selectedCourt }) => {
  return orderItemsCourt
    .filter(
      (item) => item.courtInvoice && item.court?._id === selectedCourt?._id
    )
    .map((item) => (
      <div key={item.court._id} className="court-invoice">
        <p>
          <strong>Sân:</strong> {item.courtInvoice.courtName}
        </p>
        <p>
          <strong>Giá thuê 1 giờ:</strong>{" "}
          {item.courtInvoice.cost.toLocaleString()} VND
        </p>
        <p>
          <strong>Thời gian chơi:</strong> {item.courtInvoice.duration} giờ
        </p>
        <p>
          <strong>Tổng tiền:</strong>{" "}
          {item.courtInvoice.totalCost.toLocaleString()} VND
        </p>
        <p>
          <strong>Check-in:</strong> {item.courtInvoice.checkInTime}
        </p>
        <p>
          <strong>Check-out:</strong> {item.courtInvoice.checkOutTime}
        </p>
      </div>
    ));
};

export default InvoiceList;
