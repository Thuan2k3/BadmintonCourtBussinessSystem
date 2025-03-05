import React, { useEffect, useState } from "react";
import { Table, DatePicker, Button, Card, Select, Col, Row } from "antd";
import { Column, Line } from "@ant-design/charts";
import axios from "axios";
import dayjs from "dayjs";
import Layout from "../../../components/Layout";

const { RangePicker } = DatePicker;
const { Option } = Select;

const RevenueStatisticPage = () => {
  const [dates, setDates] = useState([dayjs().startOf("month"), dayjs()]);
  const [type, setType] = useState("day");
  const [chartType, setChartType] = useState("column");
  const [revenueData, setRevenueData] = useState([]);
  const [totalProductsSold, setTotalProductsSold] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCourtsRented, setTotalCourtsRented] = useState(0);

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

      setRevenueData(res.data.revenueData);
      setTotalProductsSold(res.data.totalProductsSold);
      setTotalCourtsRented(
        res.data.revenueData.reduce(
          (sum, item) => sum + item.totalCourtsRented,
          0
        )
      );
    } catch (error) {
      console.error("Lỗi lấy dữ liệu doanh thu:", error);
      setError("Không thể lấy dữ liệu doanh thu!");
    } finally {
      setLoading(false);
    }
  };

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
            onChange={(newDates) => {
              if (newDates) {
                let [start, end] = newDates;

                if (type === "month") {
                  start = start.startOf("month");
                  end = end.endOf("month");
                } else if (type === "year") {
                  start = start.startOf("year");
                  end = end.endOf("year");
                }

                setDates([start, end]);
              } else {
                setDates([dayjs(), dayjs()]);
              }
            }}
            picker={type}
            format={
              type === "day"
                ? "DD/MM/YYYY"
                : type === "month"
                ? "MM/YYYY"
                : "YYYY"
            }
          />

          <Select
            value={type}
            onChange={(newType) => {
              setType(newType);
              setRevenueData([]);
              setTotalProductsSold(0);
              setTotalCourtsRented(0);

              let newStart, newEnd;
              if (newType === "day") {
                newStart = dayjs().startOf("month");
                newEnd = dayjs();
              } else if (newType === "month") {
                newStart = dayjs().startOf("year");
                newEnd = dayjs().endOf("year");
              } else if (newType === "year") {
                newStart = dayjs().subtract(4, "year").startOf("year"); // Lấy 5 năm gần nhất
                newEnd = dayjs().endOf("year");
              }

              setDates([newStart, newEnd]);
            }}
            style={{ width: 120 }}
          >
            <Option value="day">Theo Ngày</Option>
            <Option value="month">Theo Tháng</Option>
            <Option value="year">Theo Năm</Option>
          </Select>
          <Button type="primary" onClick={fetchRevenue} loading={loading}>
            Lọc
          </Button>
        </div>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {/* Hiển thị tổng số lượng sản phẩm đã bán và tổng số lượt thuê sân */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Card>
              <h5 className="text-center">
                Tổng số sản phẩm đã bán: {totalProductsSold}
              </h5>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <h5 className="text-center">
                Tổng số lượt thuê sân: {totalCourtsRented}
              </h5>
            </Card>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={revenueData}
          pagination={{ pageSize: 5 }}
          loading={loading}
        />

        <Card title="Biểu Đồ Doanh Thu">
          <div className="d-flex justify-content-center mb-3">
            <Select
              value={chartType}
              onChange={setChartType}
              style={{ width: 150 }}
            >
              <Option value="column">Biểu đồ Cột</Option>
              <Option value="line">Biểu đồ Đường</Option>
            </Select>
          </div>
          {chartType === "column" ? (
            <Column {...columnConfig} height={300} />
          ) : (
            <Line {...lineConfig} height={300} />
          )}
        </Card>
      </Card>
    </Layout>
  );
};

export default RevenueStatisticPage;
