import React, { useState } from "react";
import { Table, DatePicker, Button, Card } from "antd";
import { Column, Line } from "@ant-design/charts";
import dayjs from "dayjs";
import Layout from "../../components/Layout";

const { RangePicker } = DatePicker;

const RevenueStatisticPage = () => {
  const [dates, setDates] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  // Dữ liệu giả lập (có thể thay bằng API thực tế)
  const revenueData = [
    { key: "1", date: "2025-02-10", total: 5000000 },
    { key: "2", date: "2025-02-12", total: 6000000 },
    { key: "3", date: "2025-02-15", total: 7500000 },
    { key: "4", date: "2025-02-18", total: 4200000 },
    { key: "5", date: "2025-02-20", total: 6900000 },
    { key: "6", date: "2025-02-25", total: 8000000 },
  ];

  // Xử lý lọc theo khoảng thời gian
  const handleFilter = () => {
    if (!dates) return;
    const [start, end] = dates;
    const filtered = revenueData.filter((item) =>
      dayjs(item.date).isBetween(start, end, "day", "[]")
    );
    setFilteredData(filtered);
  };

  // Cấu hình cột cho bảng doanh thu
  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (text) => dayjs(text).format("DD/MM/YYYY"),
    },
    {
      title: "Tổng Doanh Thu (VND)",
      dataIndex: "total",
      key: "total",
      render: (text) => text.toLocaleString() + " VND",
    },
  ];

  // Dữ liệu biểu đồ (chuyển đổi từ revenueData)
  const chartData = (filteredData.length > 0 ? filteredData : revenueData).map(
    (item) => ({
      date: dayjs(item.date).format("DD/MM"),
      revenue: item.total,
    })
  );

  // Cấu hình biểu đồ cột (Column Chart)
  const columnConfig = {
    data: chartData,
    xField: "date",
    yField: "revenue",
    label: { position: "middle" },
    color: "#1890ff",
  };

  // Cấu hình biểu đồ đường (Line Chart)
  const lineConfig = {
    data: chartData,
    xField: "date",
    yField: "revenue",
    point: { size: 5, shape: "circle" },
    color: "#fa541c",
  };

  return (
    <Layout className="container mt-4">
      <Card title="Thống Kê Doanh Thu" className="shadow p-4">
        {/* Bộ lọc thời gian */}
        <div className="d-flex align-items-center gap-3 mb-3">
          <RangePicker onChange={(dates) => setDates(dates)} />
          <Button type="primary" onClick={handleFilter}>
            Lọc
          </Button>
        </div>

        {/* Bảng thống kê doanh thu */}
        <Table
          columns={columns}
          dataSource={filteredData.length > 0 ? filteredData : revenueData}
          pagination={{ pageSize: 5 }}
          className="mb-4"
        />

        {/* Biểu đồ thống kê doanh thu */}
        <Card title="Biểu Đồ Doanh Thu" className="mt-3 p-3">
          <h5 className="text-center">Biểu đồ Cột</h5>
          <Column {...columnConfig} height={300} className="mb-4" />
          <h5 className="text-center">Biểu đồ Đường</h5>
          <Line {...lineConfig} height={300} />
        </Card>
      </Card>
    </Layout>
  );
};

export default RevenueStatisticPage;
