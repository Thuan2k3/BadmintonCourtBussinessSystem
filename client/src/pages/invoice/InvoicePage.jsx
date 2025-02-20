import React, { useState } from "react";
import { Table, Button, Typography, Tag, message } from "antd";
import { PrinterOutlined, DeleteOutlined } from "@ant-design/icons";

import Layout from "../../components/Layout";

const InvoicePage = () => {
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("Chưa thanh toán");
  const [checkinTimes, setCheckinTimes] = useState({});
  const [checkoutTimes, setCheckoutTimes] = useState({});
  const [usageDurations, setUsageDurations] = useState({});

  const [courts, setCourts] = useState([
    { name: "Sân 1", isEmpty: true, price: 100000 },
    { name: "Sân 2", isEmpty: true, price: 120000 },
    { name: "Sân 3", isEmpty: true, price: 90000 },
    { name: "Sân 4", isEmpty: true, price: 110000 },
  ]);

  const products = [
    { name: "Nước suối", price: 10000 },
    { name: "Cầu lông", price: 50000 },
    { name: "Nước tăng lực", price: 20000 },
  ];

  const handleAddProduct = (product) => {
    setSelectedProducts([...selectedProducts, product]);
    setTotalAmount(totalAmount + product.price);
  };

  const handleRemoveProduct = (index) => {
    const newProducts = selectedProducts.filter((_, i) => i !== index);
    const removedProduct = selectedProducts[index];
    setSelectedProducts(newProducts);
    setTotalAmount(totalAmount - removedProduct.price);
  };

  const handlePayment = () => {
    setPaymentStatus("Đã thanh toán");
  };

  const handleCheckin = (court) => {
    if (checkinTimes[court.name]) {
      message.info("Sân này đã được check-in trước đó!");
      return;
    }
    const now = new Date();
    setCheckinTimes((prev) => ({ ...prev, [court.name]: now }));
    setCourts((prev) => prev.map(c => c.name === court.name ? { ...c, isEmpty: false } : c));
  };

  const handleCheckout = (court) => {
    if (!checkinTimes[court.name]) {
      message.error("Sân này chưa được check-in!");
      return;
    }
    const now = new Date();
    setCheckoutTimes((prev) => ({ ...prev, [court.name]: now }));
    const checkinTime = checkinTimes[court.name];
    if (checkinTime) {
      let duration = (now - new Date(checkinTime)) / 3600000;
      duration = Math.max(1, Math.round(duration));
      setUsageDurations((prev) => ({ ...prev, [court.name]: duration }));
      setTotalAmount((prev) => prev + (duration * court.price));
    }
    setCourts((prev) => prev.map(c => c.name === court.name ? { ...c, isEmpty: true } : c));
  };

  return (
    <Layout className="container mt-4">
      <Typography.Title level={4}>Lập Hóa Đơn</Typography.Title>

      <Typography.Text>Chọn sân:</Typography.Text>
      <div className="mb-3">
        {courts.map((court) => (
          <div key={court.name} style={{ display: 'inline-block', margin: '5px' }}>
            <Button
              type={selectedCourt?.name === court.name ? "primary" : "default"}
              onClick={() => setSelectedCourt(court)}
            >
              {court.name} - {court.price.toLocaleString()} VND - <Tag color={court.isEmpty ? "green" : "red"}>{court.isEmpty ? "Trống" : "Có người"}</Tag>
            </Button>
            <Button type="default" onClick={() => handleCheckin(court)} disabled={!court.isEmpty}>Check-in</Button>
          </div>
        ))}
      </div>

      {selectedCourt && checkinTimes[selectedCourt.name] && (
        <div>
          <Typography.Text strong>Sân thanh toán: {selectedCourt.name}</Typography.Text><br/>
          <Typography.Text>Thời gian Check-in: {checkinTimes[selectedCourt.name]?.toLocaleString()}</Typography.Text><br/>
          {checkoutTimes[selectedCourt.name] && <Typography.Text>Thời gian Check-out: {checkoutTimes[selectedCourt.name]?.toLocaleString()}</Typography.Text>}<br/>
          {usageDurations[selectedCourt.name] !== undefined && <Typography.Text>Tổng thời gian sử dụng: {usageDurations[selectedCourt.name]} giờ</Typography.Text>}<br/>
          <Button type="danger" onClick={() => handleCheckout(selectedCourt)}>Checkout {selectedCourt.name}</Button>
          <br/><br/>
        </div>
      )}

      <Typography.Text>Chọn sản phẩm:</Typography.Text>
      <div className="mb-3">
        {products.map((product) => (
          <Button key={product.name} onClick={() => handleAddProduct(product)} className="m-1">
            {product.name} - {product.price.toLocaleString()} VND
          </Button>
        ))}
      </div>

      <Table dataSource={selectedProducts} columns={[
        { title: "Sản phẩm", dataIndex: "name", key: "name" },
        { title: "Giá", dataIndex: "price", key: "price", render: (price) => `${price.toLocaleString()} VND` },
        {
          title: "Hành động",
          key: "action",
          render: (_, record, index) => (
            <Button danger icon={<DeleteOutlined />} onClick={() => handleRemoveProduct(index)} />
          ),
        },
      ]} rowKey={(record, index) => index} pagination={false} />
      <Typography.Text strong>Tổng tiền: {totalAmount.toLocaleString()} VND</Typography.Text>

      <Typography.Text block className="mt-3">
        Trạng thái thanh toán: <strong>{paymentStatus}</strong>
      </Typography.Text>

      <div className="mt-3">
        <Button type="primary" onClick={handlePayment} disabled={paymentStatus === "Đã thanh toán"}>
          Xác nhận thanh toán
        </Button>
        <Button type="default" icon={<PrinterOutlined />} className="ms-2">
          In hóa đơn
        </Button>
      </div>
    </Layout>
  );
};

export default InvoicePage;
