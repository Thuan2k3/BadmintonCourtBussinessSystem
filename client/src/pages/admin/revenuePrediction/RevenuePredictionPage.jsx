import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../../components/Layout";
import { Spin, Alert, Card, Table } from "antd";
import { Column } from "@ant-design/charts";
import dayjs from "dayjs";

const RevenuePredictionPage = () => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mae, setMae] = useState(null);
  const [errorRate, setErrorRate] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5001/predict/seven_days"
        );
        setPredictions(response.data.predictions);
        setMae(response.data.mae);
        setErrorRate(response.data.error_rate); // 📊 Lấy tỷ lệ lỗi
      } catch (error) {
        setError("❌ Lỗi khi lấy dữ liệu dự đoán.");
        console.error(error);
      }
      setLoading(false);
    };

    fetchPrediction();
  }, []);

  const formattedPredictions = predictions
    ? predictions.map((item) => ({
        ...item,
        date: dayjs(item.date).format("DD/MM/YYYY"),
      }))
    : [];

  // ✅ Cấu hình biểu đồ cột dọc
  const config = {
    data: formattedPredictions,
    xField: "date",
    yField: "revenue",
    xAxis: { title: { text: "📅 Ngày" } },
    yAxis: { title: { text: "💰 Doanh thu (VNĐ)" } },
    color: "#3b82f6",
    meta: {
      date: { alias: "Ngày" },
      revenue: { alias: "Doanh thu (VNĐ)" },
    },
    label: {
      position: "top",
      style: { fill: "#2c3e50", fontWeight: "bold" },
    },
  };

  // ✅ Cấu hình cột bảng
  const columns = [
    {
      title: "📅 Ngày",
      dataIndex: "date",
      key: "date",
      align: "center",
      render: (text) => (
        <span style={{ fontWeight: "600" }}>
          {dayjs(text).format("DD/MM/YYYY")}
        </span>
      ),
    },
    {
      title: "💰 Doanh thu dự đoán (VNĐ)",
      dataIndex: "revenue",
      key: "revenue",
      align: "center",
      render: (text) => (
        <span style={{ color: "#16a34a", fontWeight: "bold" }}>
          {text.toLocaleString()} VNĐ
        </span>
      ),
    },
  ];

  return (
    <Layout>
      <div
        className="p-4"
        style={{
          backgroundColor: "#f9f9f9",
          minHeight: "100vh",
          borderRadius: "12px",
        }}
      >
        <h1
          className="text-center mb-5"
          style={{ color: "#2c3e50", fontWeight: "700" }}
        >
          📊 DỰ ĐOÁN DOANH THU 7 NGÀY TỚI
        </h1>

        <Alert
          message={`📊 Sai số trung bình (MAE): ${
            mae
              ? `${Math.round(mae).toLocaleString()} VNĐ`
              : "Đang tính toán..."
          } - Tỷ lệ lỗi: ${
            errorRate
              ? errorRate.toFixed(2).replace(".", ",")
              : "Đang tính toán..."
          }%`}
          type="info"
          showIcon
          style={{ marginBottom: "20px" }}
        />

        {/* ✅ Trạng thái tải dữ liệu */}
        {loading && (
          <div className="d-flex justify-content-center">
            <Spin size="large" />
          </div>
        )}
        {error && <Alert message={error} type="error" showIcon />}

        {/* ✅ Hiển thị bảng và biểu đồ */}
        {predictions && (
          <div>
            <Card
              title={
                <h3 style={{ margin: 0, color: "#2c3e50" }}>
                  📅 Chi tiết dự đoán doanh thu
                </h3>
              }
              bordered={false}
              style={{
                marginBottom: "30px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "12px",
              }}
            >
              <Table
                columns={columns}
                dataSource={predictions.map((prediction, index) => ({
                  key: index,
                  date: prediction.date,
                  revenue: prediction.revenue,
                }))}
                pagination={false}
                bordered
              />
            </Card>

            <Card
              title={
                <h3 style={{ margin: 0, color: "#2c3e50" }}>
                  📊 Biểu đồ dự đoán doanh thu
                </h3>
              }
              bordered={false}
              style={{
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                borderRadius: "12px",
              }}
            >
              <Column {...config} />
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RevenuePredictionPage;
