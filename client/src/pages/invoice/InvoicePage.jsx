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
import { useSelector } from "react-redux";

const { Title, Text } = Typography;
const { Option } = Select;
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD") // Tách dấu khỏi ký tự
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
    .replace(/đ/g, "d") // Chuyển "đ" thành "d"
    .replace(/Đ/g, "D"); // Chuyển "Đ" thành "D"
};

const BookingCourt = () => {
  const { user } = useSelector((state) => state.user);
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
  const [orderItemsCourt, setOrderItemsCourt] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [courtInvoice, setCourtInvoice] = useState(null);
  const [invoiceTime, setInvoiceTime] = useState(null);

  const products = [
    { name: "Nước suối", price: 10000 },
    { name: "Cầu lông", price: 50000 },
    { name: "Nước tăng lực", price: 20000 },
  ];

  const handleSelectedCourt = (court) => {
    if (selectedCourt != court) {
      setSelectedCourt(court);
    } else {
      setSelectedCourt(null);
    }
  };

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

    // Kiểm tra nếu đã có một sân khác đang check-out
    if (courtInvoice) {
      message.warning(
        "Vui lòng thanh toán hóa đơn trước khi check-out sân khác!"
      );
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

    setCourtInvoice(newCourtInvoice); // Lưu hóa đơn sân này

    setInvoiceTime(dayjs().format("HH:mm:ss DD/MM/YYYY"));

    setCourts((prevCourts) =>
      prevCourts.map((court) =>
        court.id === selectedCourt.id
          ? { ...court, status: "empty", checkInTime: null }
          : court
      )
    );

    message.success(
      `Check-out thành công! Tổng thời gian chơi: ${roundedDuration} giờ`
    );
  };

  const handleAddProduct = () => {
    if (!selectedProduct) {
      message.warning("Vui lòng chọn sản phẩm!");
      return;
    }

    setOrderItemsCourt((prevItems) => {
      let updatedItems = [...prevItems];

      if (selectedCourt) {
        // Nếu có chọn sân, tìm nhóm sân đó
        const courtIndex = updatedItems.findIndex(
          (item) => item.court?.id === selectedCourt.id
        );

        if (courtIndex !== -1) {
          // Nếu sân đã có trong danh sách, cập nhật sản phẩm
          const existingProducts = updatedItems[courtIndex].products;
          const productIndex = existingProducts.findIndex(
            (p) => p.name === selectedProduct.name
          );

          if (productIndex !== -1) {
            existingProducts[productIndex].quantity += quantity;
          } else {
            existingProducts.push({ ...selectedProduct, quantity });
          }

          updatedItems[courtIndex].totalAmount +=
            selectedProduct.price * quantity;
        } else {
          // Nếu sân chưa có, thêm mới
          updatedItems.push({
            court: selectedCourt,
            products: [{ ...selectedProduct, quantity }],
            totalAmount: selectedProduct.price * quantity,
          });
        }
      } else {
        // Nếu KHÔNG chọn sân, gom sản phẩm vào nhóm "Khách vãng lai"
        const guestIndex = updatedItems.findIndex(
          (item) => item.court === null
        );

        if (guestIndex !== -1) {
          // Nếu nhóm "Khách vãng lai" đã tồn tại, cập nhật sản phẩm
          const existingProducts = updatedItems[guestIndex].products;
          const productIndex = existingProducts.findIndex(
            (p) => p.name === selectedProduct.name
          );

          if (productIndex !== -1) {
            existingProducts[productIndex].quantity += quantity;
          } else {
            existingProducts.push({ ...selectedProduct, quantity });
          }

          updatedItems[guestIndex].totalAmount +=
            selectedProduct.price * quantity;
        } else {
          // Nếu chưa có nhóm "Khách vãng lai", thêm mới
          updatedItems.push({
            court: null, // Đánh dấu là khách vãng lai
            products: [{ ...selectedProduct, quantity }],
            totalAmount: selectedProduct.price * quantity,
          });
        }
      }
      setInvoiceTime(dayjs().format("HH:mm:ss DD/MM/YYYY"));

      return updatedItems;
    });

    message.success(
      `Đã thêm ${quantity} ${selectedProduct.name} ${
        selectedCourt ? `vào sân ${selectedCourt.name}` : "cho khách vãng lai"
      }`
    );
  };

  const handleDeleteProduct = (productName) => {
    setOrderItemsCourt(
      (prev) =>
        prev
          .map((item) => {
            if (selectedCourt) {
              // Nếu đã chọn sân, chỉ xóa sản phẩm trong sân đó
              if (item.court?.id === selectedCourt.id) {
                return {
                  ...item,
                  products: item.products.filter((p) => p.name !== productName),
                };
              }
            } else {
              // Nếu không chọn sân (khách vãng lai), chỉ xóa sản phẩm của khách vãng lai
              if (item.court === null) {
                return {
                  ...item,
                  products: item.products.filter((p) => p.name !== productName),
                };
              }
            }
            return item;
          })
          .filter((item) => item.products.length > 0) // Xóa luôn nhóm trống
    );
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
                  onClick={() => handleSelectedCourt(court)}
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
              <div>
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
            {invoiceTime && (
              <div>
                <p>
                  <strong>Thời gian lập hóa đơn:</strong> {invoiceTime}
                </p>
                <p>
                  <strong>Người lập hóa đơn:</strong> {user?.full_name}
                </p>
              </div>
            )}
            <div className="mb-3">
              <Text strong>Chọn sản phẩm:</Text>
              <div className="d-flex align-items-center">
                <Select
                  showSearch
                  placeholder="Chọn sản phẩm"
                  style={{ width: 200 }}
                  className="me-2"
                  optionFilterProp="label"
                  onChange={(value) =>
                    setSelectedProduct(products.find((p) => p.name === value))
                  }
                  filterOption={(input, option) => {
                    const inputNormalized = removeVietnameseTones(
                      input.toLowerCase()
                    );
                    const optionNormalized = removeVietnameseTones(
                      option.label.toLowerCase()
                    );
                    return optionNormalized.includes(inputNormalized);
                  }}
                >
                  {products.map((product) => (
                    <Option
                      key={product.name}
                      value={product.name}
                      label={product.name} // Cần để label để filter hoạt động đúng
                    >
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
              dataSource={
                selectedCourt
                  ? orderItemsCourt.find(
                      (item) => item.court?.id === selectedCourt.id
                    )?.products || []
                  : orderItemsCourt.find((item) => item.court === null)
                      ?.products || []
              }
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
            />

            <div className="mt-3 d-flex justify-content-between align-items-center">
              <Title level={4}>
                Tổng tiền:{" "}
                {(() => {
                  const guestOrder = orderItemsCourt.find(
                    (item) => item.court === null
                  );
                  const guestTotal = guestOrder ? guestOrder.totalAmount : 0;
                  const courtTotal = selectedCourt
                    ? orderItemsCourt.find(
                        (item) => item.court?.id === selectedCourt.id
                      )?.totalAmount || 0
                    : 0;
                  const courtCost = selectedCourt
                    ? courtInvoice?.totalCost || 0
                    : 0;
                  return (
                    selectedCourt ? courtTotal + courtCost : guestTotal
                  ).toLocaleString();
                })()}{" "}
                VND
              </Title>

              <Button
                type="primary"
                icon={<DollarCircleOutlined />}
                onClick={() => {
                  let updatedOrderItemsCourt;

                  if (selectedCourt) {
                    // Nếu có sân đang chọn -> Xóa hóa đơn của sân đó
                    updatedOrderItemsCourt = orderItemsCourt.filter(
                      (item) => item.court?.id !== selectedCourt.id
                    );
                  } else {
                    // Nếu không có sân -> Xóa hóa đơn của khách vãng lai
                    updatedOrderItemsCourt = orderItemsCourt.filter(
                      (item) => item.court !== null
                    );
                  }

                  setOrderItemsCourt(updatedOrderItemsCourt); // Cập nhật danh sách hóa đơn
                  message.success("Thanh toán thành công!");

                  // Reset tổng tiền và sân đang chọn
                  setCourtInvoice(null);
                  setTotalAmount(0);
                  setInvoiceTime(null);
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
