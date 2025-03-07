import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../../components/Layout";
import { Spin, Alert } from "antd";
import { Column } from "@ant-design/charts";
import { Table } from "antd";

const RevenuePredictionPage = () => {
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5001/predict/seven_days"
        );
        setPredictions(response.data);
      } catch (error) {
        setError("Lỗi khi lấy dữ liệu dự đoán.");
        console.error(error);
      }
      setLoading(false);
    };

    fetchPrediction();
  }, []);

  // Cấu hình biểu đồ cột dọc
  const config = {
    data: predictions || [],
    xField: "date",
    yField: "revenue",
    label: {
      position: "top",
      style: { fill: "#000", fontSize: 12 },
    },
    xAxis: { title: { text: "Ngày" } },
    yAxis: { title: { text: "Doanh thu (VNĐ)" } },
  };

  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Doanh thu dự đoán (VNĐ)",
      dataIndex: "revenue",
      key: "revenue",
      render: (text) => <strong>{text.toLocaleString()} VNĐ</strong>,
    },
  ];

  return (
    <Layout>
      <h2 className="text-center">Dự đoán doanh thu 7 ngày tới</h2>

      {loading && <Spin size="large" />}
      {error && <Alert message={error} type="error" showIcon />}

      {predictions && (
        <div>
          <Table
            columns={columns}
            dataSource={predictions.map((prediction, index) => ({
              key: index,
              date: prediction.date,
              revenue: prediction.revenue,
            }))}
            pagination={false} // Ẩn phân trang nếu danh sách ngắn
            bordered // Hiển thị viền bảng
          />

          <h3 className="text-center">Biểu đồ doanh thu</h3>
          <Column {...config} />
        </div>
      )}
    </Layout>
  );
};

export default RevenuePredictionPage;
