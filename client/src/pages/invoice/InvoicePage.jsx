import React, { useState } from "react";
import {
  Button,
  Table,
  Tag,
  Select,
  InputNumber,
  message,
  Typography,
  Row,
  Col,
  Card,
} from "antd";
import { DollarCircleOutlined, DeleteOutlined } from "@ant-design/icons";
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
  const [courtInvoice, setCourtInvoice] = useState(null);
  const [invoiceTime, setInvoiceTime] = useState(null);

  const products = [
    { name: "Nước suối", price: 10000 },
    { name: "Cầu lông", price: 50000 },
    { name: "Nước tăng lực", price: 20000 },
  ];

  const handleCheckIn = () => {
    if (selectedCourt.status === "occupied") {
      message.warning("Sân này đã có người!");
      return;
    }

    setCourts((prevCourts) =>
      prevCourts.map((court) =>
        court.id === selectedCourt.id
          ? { ...court, status: "occupied", checkInTime: dayjs() }
          : court
      )
    );

    setSelectedCourt({
      ...selectedCourt,
      status: "occupied",
      checkInTime: dayjs(),
    });
    message.success(`Check-in thành công cho ${selectedCourt.name}`);
  };

  const handleCheckOut = () => {
    if (!selectedCourt) {
      message.warning("Vui lòng chọn sân trước khi check-out!");
      return;
    }

    if (selectedCourt.status !== "occupied") {
      message.warning("Sân này chưa được check-in!");
      return;
    }

    const checkOutTime = dayjs();
    const checkInTime = selectedCourt.checkInTime;
    const duration = checkOutTime.diff(checkInTime, "hour", true);
    const roundedDuration = Math.ceil(duration);
    const courtCost = roundedDuration * selectedCourt.price;

    const newCourtInvoice = {
      courtName: selectedCourt.name,
      duration: roundedDuration,
      cost: selectedCourt.price,
      totalCost: courtCost,
      checkInTime: checkInTime.format("HH:mm:ss DD/MM/YYYY"),
      checkOutTime: checkOutTime.format("HH:mm:ss DD/MM/YYYY"),
    };

    setCourtInvoice(newCourtInvoice); // Ghi đè dữ liệu cũ bằng hóa đơn mới

    setInvoiceTime(dayjs().format("HH:mm:ss DD/MM/YYYY"));

    setCourts((prevCourts) =>
      prevCourts.map((court) =>
        court.id === selectedCourt.id
          ? { ...court, status: "empty", checkInTime: null }
          : court
      )
    );

    setOrderItems([]);
    setTotalAmount(0);
    setSelectedCourt(null);

    message.success(
      `Check-out thành công! Tổng thời gian chơi: ${roundedDuration} giờ`
    );
  };

  const handleAddProduct = () => {
    if (!selectedProduct) {
      message.warning("Vui lòng chọn sản phẩm!");
      return;
    }

    setOrderItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.name === selectedProduct.name
      );
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
    if (!invoiceTime) {
      setInvoiceTime(dayjs().format("HH:mm:ss DD/MM/YYYY"));
    }
    message.success(`Đã thêm ${quantity} ${selectedProduct.name} vào giỏ hàng`);
  };

  const handleDeleteProduct = (productName) => {
    setOrderItems((prevItems) => {
      const updatedItems = prevItems.filter(
        (item) => item.name !== productName
      );
      const deletedItem = prevItems.find((item) => item.name === productName);

      if (deletedItem) {
        setTotalAmount(
          (prevTotal) => prevTotal - deletedItem.price * deletedItem.quantity
        );
      }

      return updatedItems;
    });

    message.success(`Đã xóa ${productName} khỏi giỏ hàng`);
  };
  const handleDeleteInvoice = (index) => {
    setCourtInvoice((prevInvoice) => prevInvoice.filter((_, i) => i !== index));
    message.success("Đã xóa hóa đơn thuê sân!");
  };

  return (
    <Layout className="container mt-4">
      <Title level={3} className="text-center">
        Hệ Thống Đặt Sân Cầu Lông
      </Title>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Danh Sách Sân" bordered>
            <div className="d-flex flex-wrap">
              {courts.map((court) => (
                <Button
                  key={court.id}
                  className="m-2"
                  style={{
                    width: 120,
                    height: 120,
                    backgroundColor:
                      court.status === "empty" ? "#52c41a" : "#595959",
                    color: "#fff",
                  }}
                  onClick={() => setSelectedCourt(court)}
                >
                  {court.name} <br />
                  {court.status === "empty" ? (
                    <Tag color="green">Trống</Tag>
                  ) : (
                    <Tag color="red">Có người</Tag>
                  )}
                </Button>
              ))}
            </div>
          </Card>

          {selectedCourt && (
            <Card className="mt-3" title="Thông Tin Sân">
              <Text strong>Sân: {selectedCourt.name}</Text> <br />
              <Text>
                Giá: {selectedCourt.price.toLocaleString()} VND / giờ
              </Text>{" "}
              <br />
              <Button
                type="primary"
                onClick={handleCheckIn}
                disabled={selectedCourt.status === "occupied"}
              >
                Check-in
              </Button>
              <Button
                type="danger"
                className="ml-2"
                onClick={handleCheckOut}
                disabled={selectedCourt.status === "empty"}
              >
                Check-out
              </Button>
            </Card>
          )}
        </Col>

        <Col span={12}>
          <Card title="Hóa Đơn">
            {courtInvoice && (
              <div title="Hóa Đơn Thuê Sân">
                <p>
                  <strong>Sân:</strong> {courtInvoice.courtName}
                </p>
                <p>
                  <strong>Giá thuê 1 giờ:</strong>{" "}
                  {courtInvoice?.cost?.toLocaleString() || 0} VND
                </p>
                <p>
                  <strong>Thời gian chơi:</strong> {courtInvoice?.duration || 0}{" "}
                  giờ
                </p>
                <p>
                  <strong>Tổng tiền:</strong>{" "}
                  {courtInvoice?.totalCost?.toLocaleString() || 0} VND
                </p>
                <p>
                  <strong>Check-in:</strong>{" "}
                  {courtInvoice?.checkInTime || "N/A"}
                </p>
                <p>
                  <strong>Check-out:</strong>{" "}
                  {courtInvoice?.checkOutTime || "N/A"}
                </p>
              </div>
            )}
            <p>
              <strong>Thời gian lập hóa đơn:</strong> {invoiceTime || "Chưa có"}
            </p>
            <div className="mb-3">
              <Text strong>Chọn sản phẩm:</Text>
              <div className="d-flex align-items-center">
                <Select
                  placeholder="Chọn sản phẩm"
                  style={{ width: 200 }}
                  className="me-2"
                  onChange={(value) =>
                    setSelectedProduct(products.find((p) => p.name === value))
                  }
                >
                  {products.map((product) => (
                    <Option key={product.name} value={product.name}>
                      {product.name} - {product.price.toLocaleString()} VND
                    </Option>
                  ))}
                </Select>
                <InputNumber
                  min={1}
                  defaultValue={1}
                  className="me-2"
                  onChange={setQuantity}
                />
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
                      onClick={() => handleDeleteProduct(record.name)}
                    >
                      Xóa
                    </Button>
                  ),
                },
              ]}
              rowKey={(record, index) => index}
              pagination={false}
            />

            <div className="mt-3 d-flex justify-content-between align-items-center">
              <Title level={4}>
                Tổng tiền:{" "}
                {(
                  totalAmount + (courtInvoice?.totalCost || 0)
                ).toLocaleString()}{" "}
                VND
              </Title>
              <Button
                type="primary"
                icon={<DollarCircleOutlined />}
                onClick={() => {
                  message.success("Thanh toán thành công!");
                  setOrderItems([]); // Xóa giỏ hàng
                  setTotalAmount(0); // Reset tổng tiền
                  setCourtInvoice(null); // Xóa bảng sân (danh sách hóa đơn)
                }}
              >
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
