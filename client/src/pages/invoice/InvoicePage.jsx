import React, { useEffect, useState } from "react";
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
import axios from "axios";

const { Title, Text } = Typography;
const { Option } = Select;
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD") // Tách dấu khỏi ký tự
    .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
    .replace(/đ/g, "d") // Chuyển "đ" thành "d"
    .replace(/Đ/g, "D"); // Chuyển "Đ" thành "D"
};

const InvoicePage = () => {
  const { user } = useSelector((state) => state.user);
  const [courts, setCourts] = useState([]);
  const defaultCourt = { _id: "guest", name: "guest", isEmpty: true };
  const [selectedCourt, setSelectedCourt] = useState(defaultCourt);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderItemsCourt, setOrderItemsCourt] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [courtInvoice, setCourtInvoice] = useState(null);
  const [invoiceTime, setInvoiceTime] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [products, setProducts] = useState([]);

  const [users, setUsers] = useState([]);
  const getAllCourt = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/admin/court", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setCourts(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCourt();
  }, []);
  const getUsers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/admin/account",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setUsers(res.data.data); // Thêm "Khách vãng lai" vào đầu danh sách
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const getAllProduct = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/admin/product",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setProducts(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  const handleSelectedCourt = (court) => {
    setSelectedCourt((prevCourt) =>
      prevCourt?._id === court._id ? defaultCourt : court
    );

    setSelectedUser(null);
  };

  const handleCheckIn = () => {
    if (!selectedCourt || selectedCourt._id === "guest") {
      message.warning("Vui lòng chọn sân trước khi check-in!");
      return;
    }

    if (!selectedCourt?.isEmpty) {
      message.warning("Sân này đã có người!");
      return;
    }

    const checkInTime = dayjs();
    const updatedCourt = { ...selectedCourt, isEmpty: false, checkInTime };

    // Cập nhật danh sách sân
    setCourts((prevCourts) =>
      prevCourts.map((court) =>
        court._id === selectedCourt._id ? updatedCourt : court
      )
    );

    // Cập nhật sân đã chọn
    setSelectedCourt(updatedCourt);

    // Cập nhật orderItemsCourt
    setOrderItemsCourt((prev) => {
      if (!selectedCourt || !selectedCourt._id) return prev;

      const exists = prev.find((item) => item.court._id === selectedCourt._id);
      if (exists) {
        return prev.map((item) =>
          item.court._id === selectedCourt._id
            ? { ...item, court: updatedCourt } // ✅ Cập nhật với sân mới nhất
            : item
        );
      }

      return [
        ...prev,
        { court: updatedCourt, products: [], courtInvoice: null },
      ];
    });

    message.success(`Check-in thành công cho ${selectedCourt.name}`);
  };

  const handleCheckOut = () => {
    if (!selectedCourt) {
      message.warning("Vui lòng chọn sân trước khi check-out!");
      return;
    }

    if (selectedCourt.isEmpty) {
      message.warning("Sân này chưa được check-in!");
      return;
    }

    const invoice = orderItemsCourt.find(
      (item) => item.court?._id === selectedCourt._id && item.courtInvoice
    );

    if (invoice) {
      message.warning("Vui lòng thanh toán hóa đơn trước khi check-out!");
      return;
    }

    const checkOutTime = dayjs();
    const checkInTime = selectedCourt.checkInTime;

    if (!checkInTime) {
      message.error("Lỗi: Không tìm thấy thời gian check-in!");
      return;
    }

    const duration = Math.ceil(checkOutTime.diff(checkInTime, "hour", true));
    const totalCost = duration * selectedCourt.price;

    const newInvoice = {
      courtName: selectedCourt.name,
      duration,
      cost: selectedCourt.price,
      totalCost,
      checkInTime: checkInTime.format("HH:mm:ss DD/MM/YYYY"),
      checkOutTime: checkOutTime.format("HH:mm:ss DD/MM/YYYY"),
    };

    setOrderItemsCourt((prev) =>
      prev.map((item) =>
        item.court?._id === selectedCourt._id
          ? { ...item, courtInvoice: newInvoice }
          : item
      )
    );

    setCourts((prev) =>
      prev.map((court) =>
        court._id === selectedCourt._id
          ? { ...court, isEmpty: true, checkInTime: null }
          : court
      )
    );

    setInvoiceTime((prev) => [
      ...prev.filter(
        (item) => item._id !== (selectedCourt?._id || "default_court_id")
      ), // Xóa dữ liệu cũ của sân nếu có
      {
        _id: selectedCourt?._id || "default_court_id", // ID sân (hoặc sân mặc định)
        time: dayjs().format("DD-MM-YYYY HH:mm:ss"), // Thời gian hiện tại
        user: user?.full_name || "Không xác định", // Tên người lập hóa đơn
      },
    ]);

    setSelectedCourt((prev) => ({ ...prev, isEmpty: true, checkInTime: null }));

    message.success(
      `Check-out thành công! Tổng thời gian chơi: ${duration} giờ`
    );
  };

  const handleAddProduct = () => {
    if (!selectedProduct) {
      message.warning("Vui lòng chọn sản phẩm!");
      return;
    }

    setOrderItemsCourt((prevItems) => {
      let updatedItems = [...prevItems];

      const courtKey = selectedCourt ? selectedCourt._id : "guest";
      const index = updatedItems.findIndex(
        (item) => item.court?._id === courtKey
      );

      if (index !== -1) {
        // Nếu sân đã tồn tại trong orderItemsCourt
        let updatedProducts = [...updatedItems[index].products];

        // Tìm sản phẩm trong danh sách hiện có
        const productIndex = updatedProducts.findIndex(
          (p) => p._id === selectedProduct._id
        );

        if (productIndex !== -1) {
          // Nếu sản phẩm đã tồn tại, tăng số lượng
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            quantity: updatedProducts[productIndex].quantity + quantity,
          };
        } else {
          // Nếu sản phẩm chưa tồn tại, thêm mới vào danh sách
          updatedProducts.push({ ...selectedProduct, quantity });
        }

        updatedItems[index] = {
          ...updatedItems[index],
          products: updatedProducts, // ✅ Cập nhật lại products
          totalAmount:
            updatedItems[index].totalAmount + selectedProduct.price * quantity,
        };
      } else {
        // Nếu sân chưa tồn tại, thêm mới
        updatedItems.push({
          court: selectedCourt || {
            _id: "guest",
            name: "guest",
            isEmpty: true,
          },
          products: [{ ...selectedProduct, quantity }],
          totalAmount: selectedProduct.price * quantity,
        });
      }

      return updatedItems;
    });

    setInvoiceTime((prev) => {
      const courtId = selectedCourt?._id || "guest";

      return [
        ...prev.filter((item) => item._id !== courtId), // Xóa dữ liệu cũ nếu có
        {
          _id: courtId,
          time: dayjs().format("DD-MM-YYYY HH:mm:ss"),
          user: user?.full_name || "Không xác định",
        },
      ];
    });

    message.success(
      `Đã thêm ${quantity} ${selectedProduct.name} ${
        selectedCourt ? `vào sân ${selectedCourt.name}` : "cho khách vãng lai"
      }`
    );
  };

  const handleDeleteProduct = (productName) => {
    setOrderItemsCourt((prev) =>
      prev
        .map((item) => {
          if (selectedCourt && item.court?._id === selectedCourt._id) {
            const updatedProducts = item.products.filter(
              (p) => p.name !== productName
            );
            return updatedProducts.length
              ? { ...item, products: updatedProducts }
              : null;
          }

          if (!selectedCourt && item.court === "guest") {
            const updatedProducts = item.products.filter(
              (p) => p.name !== productName
            );
            return updatedProducts.length
              ? { ...item, products: updatedProducts }
              : null;
          }

          return item;
        })
        .filter(Boolean)
    );
  };
  const invoiceData = invoiceTime.find(
    (item) => item._id === (selectedCourt?._id || "default_court_id")
  );
  const getTotalAmountForCourt = (courtId) => {
    const courtOrder = orderItemsCourt.find(
      (item) => item.court?._id === courtId
    );
    let totalAmount = 0;

    if (courtOrder) {
      totalAmount = courtOrder.products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0
      );

      if (courtOrder.courtInvoice) {
        totalAmount += courtOrder.courtInvoice.totalCost; // Thêm tiền thuê sân nếu đã check-out
      }
    }
    return totalAmount;
  };

  return (
    <Layout className="container mt-4">
      <Title level={3} className="text-center">
        HÓA ĐƠN SÂN CẦU LÔNG
      </Title>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Danh Sách Sân" bordered>
            <div className="d-flex flex-wrap">
              {courts.map((court) => (
                <Button
                  key={court._id}
                  className="m-2"
                  style={{
                    width: 120,
                    height: 120,
                    backgroundColor: court.isEmpty ? "#52c41a" : "#595959",
                    color: "#fff",
                  }}
                  onClick={() => {
                    handleSelectedCourt(court);
                  }}
                >
                  {court.name} <br />
                  {court.isEmpty ? (
                    <Tag color="green">Trống</Tag>
                  ) : (
                    <Tag color="red">Có người</Tag>
                  )}
                </Button>
              ))}
            </div>
          </Card>

          {selectedCourt && selectedCourt._id != "guest" && (
            <Card className="mt-3" title="Thông Tin Sân">
              <Text strong>Sân: {selectedCourt.name}</Text> <br />
              <Text>
                Giá:{" "}
                {selectedCourt?.price
                  ? selectedCourt.price.toLocaleString()
                  : "0"}{" "}
                VND / giờ
              </Text>
              <br />
              <Button
                type="primary"
                onClick={handleCheckIn}
                disabled={!selectedCourt.isEmpty}
              >
                Check-in
              </Button>
              <Button
                type="danger"
                className="ml-2"
                onClick={handleCheckOut}
                disabled={selectedCourt.isEmpty}
              >
                Check-out
              </Button>
            </Card>
          )}
        </Col>

        <Col span={12}>
          <Card title="Hóa Đơn">
            {orderItemsCourt
              .filter(
                (item) =>
                  item.courtInvoice && item.court?._id === selectedCourt?._id
              ) // Chỉ lấy hóa đơn của sân đang chọn
              .map((item) => (
                <div key={item.court._id} className="court-invoice">
                  <p>
                    <strong>Sân:</strong> {item.courtInvoice.courtName}
                  </p>
                  <p>
                    <strong>Giá thuê 1 giờ:</strong>{" "}
                    {item.courtInvoice.cost.toLocaleString()} VND
                  </p>
                  <p>
                    <strong>Thời gian chơi:</strong>{" "}
                    {item.courtInvoice.duration} giờ
                  </p>
                  <p>
                    <strong>Tổng tiền:</strong>{" "}
                    {item.courtInvoice.totalCost.toLocaleString()} VND
                  </p>
                  <p>
                    <strong>Check-in:</strong> {item.courtInvoice.checkInTime}
                  </p>
                  <p>
                    <strong>Check-out:</strong> {item.courtInvoice.checkOutTime}
                  </p>
                </div>
              ))}
            {invoiceTime && invoiceTime.length > 0 ? (
              invoiceData ? (
                <div>
                  {selectedCourt._id === defaultCourt._id ? (
                    <p>
                      <strong>Sân:</strong>{" "}
                      {selectedCourt?.name || "Khách vãng lai"}
                    </p>
                  ) : (
                    <span></span>
                  )}
                  <p>
                    <strong>Thời gian lập hóa đơn:</strong>{" "}
                    {invoiceData.time || "Không có dữ liệu"}
                  </p>
                  <p>
                    <strong>Người lập hóa đơn:</strong>{" "}
                    {invoiceData.user || "Không xác định"}
                  </p>
                </div>
              ) : (
                <span></span>
              )
            ) : null}

            <div className="mb-3">
              <Text strong>Chọn khách hàng:</Text>
              <div className="d-flex align-items-center">
                <Select
                  showSearch
                  allowClear
                  placeholder="Chọn khách hàng:"
                  style={{ width: 250 }}
                  className="me-2"
                  optionFilterProp="label"
                  value={selectedUser?._id || null}
                  onChange={(value) => {
                    setSelectedUser(
                      value ? users.find((u) => u._id === value) : null
                    );
                  }}
                  filterOption={(input, option) => {
                    const inputNormalized = removeVietnameseTones(
                      input.toLowerCase()
                    );
                    const optionNormalized = removeVietnameseTones(
                      option.label.toLowerCase()
                    );
                    return optionNormalized.includes(inputNormalized);
                  }}
                  options={[
                    { value: null, label: "Không chọn khách hàng" }, // ✅ Thêm tùy chọn này
                    ...users.map((user) => ({
                      value: user._id,
                      label: `${user.full_name} - ${user.email}`,
                    })),
                  ]}
                />
                <Button
                  onClick={() => {
                    setOrderItemsCourt((prev) => {
                      let updatedItems = [...prev];

                      const courtKey = selectedCourt
                        ? selectedCourt._id
                        : "guest";
                      const index = updatedItems.findIndex(
                        (item) => item.court?._id === courtKey
                      );

                      if (index !== -1) {
                        if (!selectedUser) {
                          // Nếu không có người dùng, xóa user khỏi danh sách
                          updatedItems[index] = {
                            ...updatedItems[index],
                            user: null, // Xóa thông tin người chơi
                          };
                          message.success("Đã bỏ chọn khách hàng.");
                        } else {
                          // Nếu có người dùng, cập nhật lại
                          updatedItems[index] = {
                            ...updatedItems[index],
                            user: selectedUser,
                          };
                          message.success(
                            `Khách hàng đã được cập nhật thành: ${selectedUser.full_name}`
                          );
                        }
                      } else if (selectedUser) {
                        // Nếu sân chưa có trong danh sách và có người chơi, thêm mới
                        updatedItems.push({
                          court: selectedCourt || {
                            _id: "guest",
                            name: "Khách vãng lai",
                          },
                          user: selectedUser,
                          products: [],
                          courtInvoice: null,
                        });
                        message.success(
                          `Khách hàng đã được cập nhật thành: ${selectedUser.full_name}`
                        );
                      }

                      return updatedItems;
                    });
                  }}
                >
                  Xác nhận
                </Button>
              </div>
              {orderItemsCourt.some(
                (item) => item.court?._id === selectedCourt?._id && item.user
              ) && (
                <p>
                  <strong>Tên khách hàng:</strong>{" "}
                  {orderItemsCourt.find(
                    (item) => item.court?._id === selectedCourt?._id
                  )?.user?.full_name || "Không xác định"}
                </p>
              )}

              <Text strong>Chọn sản phẩm:</Text>
              <div className="d-flex align-items-center">
                <Select
                  showSearch
                  placeholder="Chọn sản phẩm"
                  style={{ width: 200 }}
                  className="me-2"
                  optionFilterProp="label"
                  onChange={(value, option) => {
                    setSelectedProduct(products.find((p) => p._id === value));
                  }}
                  filterOption={(input, option) => {
                    const inputNormalized = removeVietnameseTones(
                      input.toLowerCase()
                    );
                    const optionNormalized = removeVietnameseTones(
                      option.label.toLowerCase()
                    );
                    return optionNormalized.includes(inputNormalized);
                  }}
                  options={products.map((product) => ({
                    value: product._id, // Đảm bảo value là _id
                    label: `${
                      product.name
                    } - ${product.price.toLocaleString()} VND`, // Đảm bảo label hiển thị đúng
                  }))}
                />
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
                orderItemsCourt.find(
                  (item) => item.court?._id === selectedCourt?._id
                )?.products ||
                orderItemsCourt.find((item) => item.court === null)?.products ||
                []
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
              rowKey={(record) =>
                record._id || `${record.name}-${record.quantity}`
              }
            />

            <div className="mt-3 d-flex justify-content-between align-items-center">
              <Title level={4}>
                Tổng tiền:{" "}
                {getTotalAmountForCourt(selectedCourt._id).toLocaleString()} VND
              </Title>
              <Button
                type="primary"
                icon={<DollarCircleOutlined />}
                onClick={() => {
                  if (!orderItemsCourt || orderItemsCourt.length === 0) {
                    message.warning("Không có hóa đơn nào để thanh toán!");
                    return;
                  }

                  // Nếu sân đã check-in mà chưa check-out, cảnh báo trước
                  if (selectedCourt && !selectedCourt.isEmpty) {
                    message.warning(
                      `Sân ${selectedCourt.name} vẫn đang được sử dụng! Vui lòng check-out trước khi thanh toán.`
                    );
                    return;
                  }

                  let updatedOrderItemsCourt;
                  let updatedInvoiceTime = invoiceTime.filter(
                    (item) => String(item._id) !== String(defaultCourt._id)
                  );

                  if (selectedCourt && selectedCourt._id !== defaultCourt._id) {
                    // Nếu chọn sân cụ thể -> Xóa hóa đơn của sân đó
                    updatedOrderItemsCourt = orderItemsCourt.filter(
                      (item) => item.court?._id !== selectedCourt._id
                    );

                    updatedInvoiceTime = updatedInvoiceTime.filter(
                      (item) =>
                        String(item.courtId) !== String(selectedCourt._id)
                    );
                  } else {
                    // Nếu là khách vãng lai (guest - defaultCourt) -> Xóa hóa đơn của guest
                    updatedOrderItemsCourt = orderItemsCourt.filter(
                      (item) => item.court?._id !== defaultCourt._id
                    );

                    updatedInvoiceTime = updatedInvoiceTime.filter(
                      (item) =>
                        String(item.courtId) !== String(defaultCourt._id)
                    );
                  }

                  setOrderItemsCourt(updatedOrderItemsCourt); // Cập nhật danh sách hóa đơn
                  setInvoiceTime(updatedInvoiceTime); // Cập nhật invoiceTime
                  message.success("Thanh toán thành công!");

                  // Reset sân đang chọn về guest (defaultCourt)
                  setSelectedCourt(defaultCourt);
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

export default InvoicePage;
