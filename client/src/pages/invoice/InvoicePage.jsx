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
import CourtList from "../../components/CourtList";
import CourtDetails from "../../components/CourtDetails";
import InvoiceList from "../../components/InvoiceList";
import CustomerSelector from "../../components/CustomerSelector";
import ProductSelector from "../../components/ProductSelector";
import OrderTable from "../../components/OrderTable";
import CheckoutButton from "../../components/CheckoutButton";

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

    if (getTotalAmountForCourt(selectedCourt._id) > 0) {
      message.warning("Vui lòng thanh toán hóa đơn của sân trước khi check-in!");
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
          <div>
            <CourtList courts={courts} onSelectCourt={handleSelectedCourt} />
            <CourtDetails
              selectedCourt={selectedCourt}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
            />
          </div>
        </Col>

        <Col span={12}>
          <Card title="Hóa Đơn">
            <InvoiceList
              orderItemsCourt={orderItemsCourt}
              selectedCourt={selectedCourt}
            />
            <CustomerSelector
              users={users}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              setOrderItemsCourt={setOrderItemsCourt}
              selectedCourt={selectedCourt}
              orderItemsCourt={orderItemsCourt}
            />
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
            <ProductSelector
              products={products}
              setSelectedProduct={setSelectedProduct}
              setQuantity={setQuantity}
              handleAddProduct={handleAddProduct}
            />
            <OrderTable
              orderItemsCourt={orderItemsCourt}
              selectedCourt={selectedCourt}
              handleDeleteProduct={handleDeleteProduct}
            />
            <Title level={4}>
              Tổng tiền:{" "}
              {getTotalAmountForCourt(selectedCourt._id).toLocaleString()} VND
            </Title>
            <CheckoutButton
              getTotalAmountForCourt={getTotalAmountForCourt}
              selectedCourt={selectedCourt}
              orderItemsCourt={orderItemsCourt}
              setOrderItemsCourt={setOrderItemsCourt}
              invoiceTime={invoiceTime}
              setInvoiceTime={setInvoiceTime}
              defaultCourt={defaultCourt}
              setSelectedCourt={setSelectedCourt}
            />
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default InvoicePage;
