import React, { useState } from "react";
import {
  Card,
  Select,
  Button,
  InputNumber,
  Table,
  Typography,
  message,
} from "antd";
import { DeleteOutlined, DollarCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const OrderTable = ({
  orderItemsCourt,
  selectedCourt,
  handleDeleteProduct,
}) => {
  const products =
    orderItemsCourt.find((item) => item.court?._id === selectedCourt?._id)
      ?.products || [];
  return (
    <Table
      dataSource={products}
      columns={[
        { title: "Sản phẩm", dataIndex: "name", key: "name" },
        { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
        {
          title: "Đơn giá",
          dataIndex: "price",
          key: "price",
          render: (price) => `${price.toLocaleString()} VND`,
        },
        {
          title: "Thành tiền",
          key: "total",
          render: (_, record) =>
            `${(record.price * record.quantity).toLocaleString()} VND`,
        },
        {
          title: "Hành động",
          key: "action",
          render: (_, record) => (
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteProduct(record._id)}
            >
              Xóa
            </Button>
          ),
        },
      ]}
      rowKey={(record) => record._id || `${record.name}-${record.quantity}`}
    />
  );
};

export default OrderTable;
