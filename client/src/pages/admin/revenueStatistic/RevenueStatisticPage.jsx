import React, { useEffect, useState } from "react";
import { Table, DatePicker, Button, Card, Select } from "antd";
import { Column, Line } from "@ant-design/charts";
import axios from "axios";
import dayjs from "dayjs";
import Layout from "../../../components/Layout";

const { RangePicker } = DatePicker;
const { Option } = Select;

const RevenueStatisticPage = () => {
  const [dates, setDates] = useState([dayjs(), dayjs()]);
  const [type, setType] = useState("day");
  const [revenueData, setRevenueData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRevenue = async () => {
    if (!dates) return;
    setLoading(true);
    setError(null);

    const [start, end] = dates;
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/admin/revenue",
        {
          params: {
            type,
            startDate: start.format("YYYY-MM-DD"),
            endDate: end.format("YYYY-MM-DD"),
          },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setRevenueData(res.data);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu doanh thu:", error);
      setError("Không thể lấy dữ liệu doanh thu!");
    } finally {
      setLoading(false);
    }
  };
  // Gọi API tự động khi component mount
  useEffect(() => {
    fetchRevenue();
  }, []);

  const columns = [
    {
      title: type === "day" ? "Ngày" : type === "month" ? "Tháng" : "Năm",
      dataIndex: "_id",
      key: "date",
      render: (record) => {
        if (!record) return "N/A";
        if (type === "day" && record.day && record.month && record.year)
          return `${record.day}/${record.month}/${record.year}`;
        if (type === "month" && record.month && record.year)
          return `${record.month}/${record.year}`;
        if (type === "year" && record.year) return record.year;
        return "N/A";
      },
    },
    {
      title: "Tổng Doanh Thu (VND)",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      render: (text) => text.toLocaleString() + " VND",
    },
  ];

  const chartData = revenueData.map((item) => ({
    date:
      type === "day"
        ? `${item._id.day}/${item._id.month}`
        : type === "month"
        ? `${item._id.month}/${item._id.year}`
        : item._id.year,
    revenue: item.totalRevenue,
  }));

  const columnConfig = {
    data: chartData,
    xField: "date",
    yField: "revenue",
    label: { position: "middle" },
    color: "#1890ff",
  };

  const lineConfig = {
    data: chartData,
    xField: "date",
    yField: "revenue",
    point: { size: 5, shape: "circle" },
    color: "#fa541c",
  };

  return (
    <Layout>
      <Card>
        <h1 className="text-center">Thống Kê Doanh Thu</h1>
        <div className="mb-3 d-flex justify-content-center align-items-center gap-3">
          <RangePicker
            value={dates}
            onChange={(newDates) =>
              setDates(newDates ? newDates : [dayjs(), dayjs()])
            }
          />

          <Select value={type} onChange={setType} style={{ width: 120 }}>
            <Option value="day">Theo Ngày</Option>
            <Option value="month">Theo Tháng</Option>
            <Option value="year">Theo Năm</Option>
          </Select>
          <Button type="primary" onClick={fetchRevenue} loading={loading}>
            Lọc
          </Button>
        </div>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <Table
          columns={columns}
          dataSource={revenueData}
          pagination={{ pageSize: 5 }}
          loading={loading}
        />

        <Card title="Biểu Đồ Doanh Thu">
          <h5 className="text-center">Biểu đồ Cột</h5>
          <Column {...columnConfig} height={300} />
          <h5 className="text-center">Biểu đồ Đường</h5>
          <Line {...lineConfig} height={300} />
        </Card>
      </Card>
    </Layout>
  );
};

export default RevenueStatisticPage;
