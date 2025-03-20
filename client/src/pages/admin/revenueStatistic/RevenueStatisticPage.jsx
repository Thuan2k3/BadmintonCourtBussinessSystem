import React, { useEffect, useState } from "react";
import { Table, DatePicker, Button, Card, Select, Row, Col } from "antd";
import { Column, Line } from "@ant-design/charts";
import axios from "axios";
import dayjs from "dayjs";
import {
  BarChartOutlined,
  LineChartOutlined,
  FilterOutlined,
} from "@ant-design/icons";
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
      title:
        type === "day" ? "📅 Ngày" : type === "month" ? "📅 Tháng" : "📅 Năm",
      dataIndex: "_id",
      key: "date",
      align: "center",
      render: (record) => {
        if (!record) return "N/A";

        const { day, month, year } = record;
        const date = dayjs(`${year}-${month || 1}-${day || 1}`);

        if (type === "day")
          return (
            <span style={{ fontWeight: "600" }}>
              {date.format("DD/MM/YYYY")}
            </span>
          );
        if (type === "month")
          return (
            <span style={{ fontWeight: "600" }}>{date.format("MM/YYYY")}</span>
          );
        if (type === "year")
          return (
            <span style={{ fontWeight: "600" }}>{date.format("YYYY")}</span>
          );

        return "N/A";
      },
    },
    {
      title: "💰 Tổng Doanh Thu (VNĐ)",
      dataIndex: "totalRevenue",
      key: "totalRevenue",
      align: "center",
      render: (text) => (
        <span style={{ color: "#16a34a", fontWeight: "bold" }}>
          {text.toLocaleString()} VNĐ
        </span>
      ),
    },
  ];

  const chartData = revenueData.map((item) => {
    const { day, month, year } = item._id;
    const date = dayjs(`${year}-${month || 1}-${day || 1}`);

    return {
      date:
        type === "day"
          ? date.format("DD/MM/YYYY")
          : type === "month"
          ? date.format("MM/YYYY")
          : date.format("YYYY"),
      revenue: item.totalRevenue,
    };
  });

  const columnConfig = {
    data: chartData,
    xField: "date",
    yField: "revenue",
    color: "#1890ff",
    xAxis: {
      label: {
        rotate: type === "day" ? -45 : 0,
        style: { fontSize: 12 },
      },
    },
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
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          📊 Thống Kê Doanh Thu
        </h1>

        {/* Bộ lọc */}
        <Row
          gutter={[16, 16]}
          justify="center"
          align="middle"
          style={{ marginBottom: "20px" }}
        >
          <Col>
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
          </Col>

          <Col>
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
                  newStart = dayjs().subtract(4, "year").startOf("year");
                  newEnd = dayjs().endOf("year");
                }
                setDates([newStart, newEnd]);
              }}
              style={{ width: 150 }}
            >
              <Option value="day">Theo Ngày</Option>
              <Option value="month">Theo Tháng</Option>
              <Option value="year">Theo Năm</Option>
            </Select>
          </Col>

          <Col>
            <Button
              type="primary"
              icon={<FilterOutlined />}
              onClick={fetchRevenue}
              loading={loading}
            >
              Lọc
            </Button>
          </Col>
        </Row>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {/* Bảng thống kê */}
        <Table
          columns={columns}
          dataSource={revenueData}
          pagination={{
            pageSize: 5,
            position: ["bottomCenter"], // Căn giữa phân trang ở phía dưới
          }}
          loading={loading}
        />

        {/* Biểu đồ */}
        <Card
          title={
            <h3 style={{ margin: 0, color: "#2c3e50" }}>
              📈 Biểu Đồ Doanh Thu
            </h3>
          }
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Select
              value={chartType}
              onChange={setChartType}
              style={{ width: 200, marginBottom: 20 }}
            >
              <Option value="column">
                <BarChartOutlined /> Biểu đồ Cột
              </Option>
              <Option value="line">
                <LineChartOutlined /> Biểu đồ Đường
              </Option>
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
