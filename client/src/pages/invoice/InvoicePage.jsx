import React, { useState } from "react";
import { Button, Table, Tag, Select, InputNumber, message, Typography, Row, Col, Card } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Layout from "../../components/Layout";

const { Title, Text } = Typography;
const { Option } = Select;

const BookingCourt = () => {
  const [courts, setCourts] = useState([
    { id: 1, name: "Sân 1", price: 100000, status: "empty", checkInTime: null },
    { id: 2, name: "Sân 2", price: 120000, status: "empty", checkInTime: null },
    { id: 3, name: "Sân 3", price: 90000, status: "empty", checkInTime: null },
    { id: 4, name: "Sân 4", price: 110000, status: "empty", checkInTime: null },
  ]);

  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const products = [
    { name: "Nước suối", price: 10000 },
    { name: "Cầu lông", price: 50000 },
    { name: "Nước tăng lực", price: 20000 },
  ];

  const handleCheckin = (court) => {
    setCourts((prev) =>
      prev.map((c) =>
        c.id === court.id ? { ...c, status: "occupied", checkInTime: dayjs() } : c
      )
    );
    message.success(`Check-in sân ${court.name}`);
  };

  const handleCheckout = (court) => {
    if (!court.checkInTime) {
      message.error("Không tìm thấy thời gian check-in!");
      return;
    }

    const duration = dayjs().diff(court.checkInTime, "hour", true);
    const hours = Math.ceil(duration);
    const courtFee = hours * court.price;

    setCourts((prev) =>
      prev.map((c) => (c.id === court.id ? { ...c, status: "empty", checkInTime: null } : c))
    );

    setOrderItems((prev) => [...prev, { name: `${court.name} (${hours} giờ)`, price: courtFee, quantity: 1 }]);
    setTotalAmount((prev) => prev + courtFee);
    message.success(`Checkout ${court.name}: ${hours} giờ, tổng tiền: ${courtFee.toLocaleString()} VND`);
  };

  const handleAddProduct = () => {
    if (!selectedProduct) {
      message.warning("Vui lòng chọn sản phẩm!");
      return;
    }

    setOrderItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.name === selectedProduct.name);
      if (existingItem) {
        return prevItems.map((item) =>
          item.name === selectedProduct.name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...selectedProduct, quantity }];
      }
    });

    setTotalAmount((prev) => prev + selectedProduct.price * quantity);
    message.success(`Đã thêm ${quantity} ${selectedProduct.name} vào giỏ hàng`);
  };

  const handlePayment = () => {
    message.success("Thanh toán thành công!");
    setOrderItems([]);
    setTotalAmount(0);
  };

  return (
    <Layout className="container mt-4">
      <Title level={3} className="text-center">Hệ Thống Đặt Sân Cầu Lông</Title>

      <Row gutter={16}>
        {/* Danh sách sân */}
        <Col span={12}>
          <Card title="Danh Sách Sân" bordered>
            <div className="d-flex flex-wrap">
              {courts.map((court) => (
                <Button
                  key={court.id}
                  className="m-2"
                  style={{
                    width: 100,
                    height: 100,
                    backgroundColor: court.status === "empty" ? "#52c41a" : "#595959",
                    color: "#fff",
                  }}
                  onClick={() => setSelectedCourt(court)}
                >
                  {court.name} <br />
                  {court.status === "empty" ? <Tag color="green">Trống</Tag> : <Tag color="red">Có người</Tag>}
                </Button>
              ))}
            </div>
          </Card>

          {selectedCourt && (
            <Card className="mt-3" title="Thông Tin Sân">
              <Text strong>Sân: {selectedCourt.name}</Text> <br />
              <Text>Giá: {selectedCourt.price.toLocaleString()} VND / giờ</Text> <br />
              {selectedCourt.status === "empty" ? (
                <Button type="primary" onClick={() => handleCheckin(selectedCourt)}>Check-in</Button>
              ) : (
                <Button type="danger" onClick={() => handleCheckout(selectedCourt)}>Checkout</Button>
              )}
            </Card>
          )}
        </Col>

        {/* Hóa đơn */}
        <Col span={12}>
          <Card title="Hóa Đơn">
            <div className="mb-3">
              <Text strong>Chọn sản phẩm:</Text>
              <div className="d-flex align-items-center">
                <Select
                  placeholder="Chọn sản phẩm"
                  style={{ width: 200 }}
                  className="me-2"
                  onChange={(value) => setSelectedProduct(products.find((p) => p.name === value))}
                >
                  {products.map((product) => (
                    <Option key={product.name} value={product.name}>
                      {product.name} - {product.price.toLocaleString()} VND
                    </Option>
                  ))}
                </Select>
                <InputNumber min={1} defaultValue={1} className="me-2" onChange={setQuantity} />
                <Button onClick={handleAddProduct}>Thêm món</Button>
              </div>
            </div>

            <Table
              dataSource={orderItems}
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
                  render: (_, record) => `${(record.price * record.quantity).toLocaleString()} VND`,
                },
              ]}
              rowKey={(record, index) => index}
              pagination={false}
            />

            <div className="mt-3 d-flex justify-content-between align-items-center">
              <Title level={4}>Tổng tiền: {totalAmount.toLocaleString()} VND</Title>
              <Button type="primary" icon={<DollarCircleOutlined />} onClick={handlePayment}>
                Thanh toán
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default BookingCourt;
