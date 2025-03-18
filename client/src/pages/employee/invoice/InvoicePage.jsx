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
  Radio,
  Checkbox,
} from "antd";
import { DollarCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Layout from "../../../components/Layout";
import { useSelector } from "react-redux";
import axios from "axios";
import CourtList from "../../../components/CourtList";
import CourtDetails from "../../../components/CourtDetails";
import InvoiceList from "../../../components/InvoiceList";
import CustomerSelector from "../../../components/CustomerSelector";
import ProductSelector from "../../../components/ProductSelector";
import OrderTable from "../../../components/OrderTable";
import CheckoutButton from "../../../components/CheckoutButton";
import { ref, get, set, update, onValue, off, remove } from "firebase/database";
import { database } from "../../../firebaseConfig"; // Import Firebase Realtime Database
import isEqual from "lodash/isEqual";
import { Link } from "react-router-dom";

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
  const [type, setType] = useState("both"); // Mặc định hiển thị cả 2

  const [users, setUsers] = useState([]);
  const getAllCourt = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/employee/court",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
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
        "http://localhost:8080/api/v1/employee/customer",
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
        "http://localhost:8080/api/v1/employee/product",
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

  const handleSelectedCourt = async (court) => {
    const courtId = court._id; // Lưu ID sân ngay từ đầu

    // Cập nhật state trước
    setSelectedCourt((prevCourt) =>
      prevCourt?._id === courtId ? defaultCourt : court
    );

    // Tham chiếu đúng order trong Firebase
    const orderItemRef = ref(database, `orders/${courtId}`);

    try {
      const snapshot = await get(orderItemRef); // Kiểm tra dữ liệu cũ trong Firebase
      if (snapshot.exists()) {
        console.log("✅ Dữ liệu sân đã tồn tại, giữ nguyên:", snapshot.val());
        return; // Nếu đã có dữ liệu, không cập nhật lại
      }

      // Nếu chưa có dữ liệu thì tạo mới
      const newOrderItem = {
        court,
        products: [],
        courtInvoice: null,
        customer: {
          id: selectedUser?.id || "unknown",
          name: selectedUser?.full_name || "Không xác định",
        },
      };

      await set(orderItemRef, newOrderItem);
      setSelectedUser(null);
      console.log("✅ Cập nhật sân thành công:", court);
    } catch (error) {
      console.error("❌ Lỗi khi kiểm tra/cập nhật sân:", error);
      message.error("Không thể kiểm tra/cập nhật sân trong Firebase!");
    }
  };

  const handleCheckIn = async () => {
    if (!selectedCourt || selectedCourt._id === "guest") {
      message.warning("Vui lòng chọn sân trước khi check-in!");
      return;
    }

    if (getTotalAmountForCourt(selectedCourt._id) > 0) {
      message.warning(
        "Vui lòng thanh toán hóa đơn của sân trước khi check-in!"
      );
      return;
    }

    if (!selectedCourt?.isEmpty) {
      message.warning("Sân này đã có người!");
      return;
    }

    try {
      const checkInTime = Date.now();

      // ✅ Cập nhật state `courts`
      const updatedCourt = { ...selectedCourt, isEmpty: false, checkInTime };
      setCourts((prevCourts) =>
        prevCourts.map((court) =>
          court._id === selectedCourt._id ? updatedCourt : court
        )
      );

      // ✅ Cập nhật sân đã chọn
      setSelectedCourt(updatedCourt);

      // ✅ Lưu thông tin check-in vào Firebase
      const orderItemRef = ref(database, `orders/${selectedCourt._id}`);
      const snapshot = await get(orderItemRef);
      const existingOrder = snapshot.exists() ? snapshot.val() : {};
      const newOrderItem = {
        court: updatedCourt,
        products: [],
        courtInvoice: null,
        customer: existingOrder.customer || null, // Giữ thông tin khách hàng
      };

      await set(orderItemRef, newOrderItem);

      // ✅ Cập nhật state `orderItemsCourt`
      setOrderItemsCourt((prev) => {
        const existingCourt = prev.find(
          (item) => item.court._id === selectedCourt._id
        );

        if (existingCourt) {
          return prev.map((item) =>
            item.court._id === selectedCourt._id
              ? {
                  ...item,
                  court: updatedCourt,
                  customer: newOrderItem.customer,
                }
              : item
          );
        }

        return [...prev, newOrderItem];
      });

      message.success(`Check-in thành công cho ${selectedCourt.name}`);
    } catch (error) {
      console.error("Lỗi khi check-in sân:", error);
      message.error("Lỗi khi check-in sân. Vui lòng thử lại!");
    }
  };

  const handleCheckOut = async () => {
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

    const checkOutTime = Date.now();
    const checkInTime = selectedCourt.checkInTime;

    if (!checkInTime) {
      message.error("Lỗi: Không tìm thấy thời gian check-in!");
      return;
    }

    //Tính tổng số giờ (ít nhất là 1 giờ) và cho phép khách ra trễ không quá 5 phút
    const duration = (() => {
      const durationMinutes = (checkOutTime - checkInTime) / (1000 * 60);
      const fullHours = Math.floor(durationMinutes / 60);
      const extraMinutes = durationMinutes % 60;

      return Math.max(1, extraMinutes <= 5 ? fullHours : fullHours + 1);
    })();

    const totalCost = duration * selectedCourt.price;

    const newInvoice = {
      courtName: selectedCourt.name,
      duration,
      cost: selectedCourt.price,
      totalCost,
      checkInTime: new Date(checkInTime).toLocaleString("vi-VN"),
      checkOutTime: new Date(checkOutTime).toLocaleString("vi-VN"),
      products:
        orderItemsCourt.find((item) => item.court._id === selectedCourt._id)
          ?.products || [],
    };

    try {
      setCourts((prev) =>
        prev.map((court) =>
          court._id === selectedCourt._id
            ? {
                ...court,
              }
            : court
        )
      );

      // ✅ Lưu hóa đơn vào Firebase
      const orderItemRef = ref(database, `orders/${selectedCourt._id}`);
      await update(orderItemRef, { courtInvoice: newInvoice });
      const courtRef = ref(database, `orders/${selectedCourt._id}/court`);
      const snapshot = await get(courtRef);

      if (snapshot.exists()) {
        const courtData = snapshot.val();
        await update(courtRef, { ...courtData, isEmpty: true }); // ✅ Giữ nguyên dữ liệu khác, chỉ cập nhật isEmpty
      } else {
        console.error("Không tìm thấy dữ liệu sân!");
      }

      // ✅ Cập nhật state `orderItemsCourt`
      setOrderItemsCourt((prev) =>
        prev.map((item) =>
          item.court?._id === selectedCourt._id
            ? {
                ...item,
                isEmpty: true,
                courtInvoice: newInvoice,
              }
            : item
        )
      );

      setInvoiceTime((prev) => [
        ...prev.filter((item) => item._id !== selectedCourt._id),
        {
          _id: selectedCourt._id,
          time: new Date().toLocaleString("vi-VN"),
        },
      ]);

      setSelectedCourt((prev) => ({
        ...prev,
        isEmpty: true,
      }));

      message.success(
        `Check-out thành công! Tổng thời gian chơi: ${duration} giờ`
      );
    } catch (error) {
      console.error("Lỗi khi check-out:", error);
      message.error("Lỗi khi check-out sân. Vui lòng thử lại!");
    }
  };

  const handleAddProduct = async () => {
    if (type === "both" && selectedCourt._id === "guest") {
      message.warning("Vui lòng chọn sân");
      return;
    }
    if (!selectedProduct || quantity <= 0) {
      message.warning("Vui lòng chọn sản phẩm và số lượng hợp lệ!");
      return;
    }
    if (
      type === "both" &&
      selectedCourt.isEmpty === true &&
      getTotalAmountForCourt(selectedCourt._id) === 0
    ) {
      message.warning("Vui lòng chọn check in trước khi thêm sản phẩm");
      return;
    }

    const courtId = selectedCourt?._id || "guest";
    const orderRef = ref(database, `orders/${courtId}`);

    setOrderItemsCourt((prevItems) => {
      const updatedItems = [...prevItems];
      const index = updatedItems.findIndex(
        (item) => item.court?._id === courtId
      );

      if (index !== -1) {
        let updatedProducts = [...updatedItems[index].products];
        const productIndex = updatedProducts.findIndex(
          (p) => p._id === selectedProduct._id
        );

        if (productIndex !== -1) {
          updatedProducts[productIndex] = {
            ...updatedProducts[productIndex],
            quantity: updatedProducts[productIndex].quantity + quantity, // ✅ Chắc chắn chỉ cộng đúng số lượng
          };
        } else {
          updatedProducts.push({ ...selectedProduct, quantity });
        }

        updatedItems[index] = {
          ...updatedItems[index],
          products: updatedProducts,
          totalAmount: updatedProducts.reduce(
            (sum, p) => sum + p.price * p.quantity,
            0
          ),
        };
      } else {
        updatedItems.push({
          court: selectedCourt,
          products: [{ ...selectedProduct, quantity }],
          totalAmount: selectedProduct.price * quantity,
        });
      }

      // ✅ Lưu vào localStorage nếu là sân "guest"
      if (courtId === "guest") {
        localStorage.setItem("guest_order", JSON.stringify(updatedItems));
      }

      return updatedItems;
    });

    if (selectedCourt._id !== "guest") {
      try {
        const orderSnap = await get(orderRef);
        const existingProducts = orderSnap.exists()
          ? orderSnap.val().products || []
          : [];

        const productIndex = existingProducts.findIndex(
          (p) => p._id === selectedProduct._id
        );
        if (productIndex !== -1) {
          existingProducts[productIndex].quantity += quantity;
        } else {
          existingProducts.push({ ...selectedProduct, quantity });
        }

        await update(orderRef, {
          products: existingProducts,
          totalAmount: existingProducts.reduce(
            (sum, p) => sum + p.price * p.quantity,
            0
          ),
        });

        message.success(
          `Đã thêm ${quantity} ${selectedProduct.name} vào sân ${selectedCourt.name}`
        );
      } catch (error) {
        console.error("Lỗi khi thêm sản phẩm vào Firebase:", error);
        message.error("Lỗi khi thêm sản phẩm vào Firebase!");
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!productId) {
      message.warning("Sản phẩm không hợp lệ!");
      return;
    }

    if (!selectedCourt || !selectedCourt._id) {
      message.error("Không thể xác định sân để xóa sản phẩm!");
      return;
    }

    const courtId = selectedCourt._id;
    if (courtId !== "guest") {
      const orderRef = ref(database, `orders/${courtId}`);

      console.log("🛒 Đang xóa sản phẩm:", productId);
      console.log("🏸 Sân đang chọn:", selectedCourt);

      try {
        // Lấy đơn hàng hiện tại từ Firebase
        const orderSnap = await get(orderRef);
        if (!orderSnap.exists()) {
          message.warning("Không tìm thấy đơn hàng để cập nhật!");
          return;
        }

        let { products, totalAmount } = orderSnap.val();

        // Kiểm tra dữ liệu hợp lệ
        if (!Array.isArray(products)) {
          console.error(
            "❌ Lỗi dữ liệu: `products` không phải là mảng",
            products
          );
          message.error("Dữ liệu đơn hàng không hợp lệ!");
          return;
        }

        // Lọc sản phẩm cần xóa
        const updatedProducts = products.filter((p) => p._id !== productId);
        const newTotalAmount = updatedProducts.reduce(
          (sum, p) => sum + p.price * p.quantity,
          0
        );

        // Cập nhật state trước khi lưu Firebase
        setOrderItemsCourt((prev) => {
          const updatedOrders = prev
            .map((item) => {
              if (item.court?._id === courtId) {
                return updatedProducts.length
                  ? {
                      ...item,
                      products: updatedProducts,
                      totalAmount: newTotalAmount,
                    }
                  : null;
              }
              return item;
            })
            .filter(Boolean);

          console.log(
            "📝 Danh sách orderItemsCourt sau khi xóa:",
            updatedOrders
          );
          return updatedOrders;
        });

        // Cập nhật Firebase
        if (updatedProducts.length > 0) {
          await update(orderRef, {
            products: updatedProducts,
            totalAmount: newTotalAmount,
          });
        } else {
          await update(orderRef, { products: [], totalAmount: 0 });
        }

        message.success("Xóa sản phẩm thành công!");
      } catch (error) {
        console.error("❌ Lỗi khi xóa sản phẩm từ Firebase:", error);
        message.error("Lỗi khi xóa sản phẩm từ Firebase!");
      }
    } else {
      setOrderItemsCourt((prev) => {
        const updatedOrders = prev
          .map((item) => {
            if (item.court?._id === courtId) {
              const updatedProducts = item.products.filter(
                (p) => p._id !== productId
              );
              const newTotalAmount = updatedProducts.reduce(
                (sum, p) => sum + p.price * p.quantity,
                0
              );

              return updatedProducts.length
                ? {
                    ...item,
                    products: updatedProducts,
                    totalAmount: newTotalAmount,
                  }
                : {
                    ...item,
                    products: [],
                    totalAmount: 0,
                  }; // ✅ Giữ nguyên thông tin khách hàng (`customer`)
            }
            return item;
          })
          .filter(Boolean);

        // ✅ Lưu danh sách mới vào localStorage nếu là sân "guest"
        if (courtId === "guest") {
          localStorage.setItem("guest_order", JSON.stringify(updatedOrders));
        }

        return updatedOrders;
      });

      message.success("Xóa sản phẩm thành công!");
    }
  };

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

  useEffect(() => {
    const orderRef = ref(database, `orders`);

    // Lắng nghe dữ liệu từ Firebase theo thời gian thực
    const unsubscribe = onValue(orderRef, (orderSnap) => {
      if (orderSnap.exists()) {
        const ordersData = orderSnap.val();
        const updatedOrders = Object.keys(ordersData).map((courtId) => ({
          court: ordersData[courtId].court || {
            _id: "guest",
            name: "Khách vãng lai",
          },
          courtInvoice: ordersData[courtId].courtInvoice || null,
          products: ordersData[courtId].products || [],
          totalAmount: ordersData[courtId].totalAmount || 0,
          customer: ordersData[courtId].customer || null,
        }));

        setOrderItemsCourt(updatedOrders);
      } else {
        setOrderItemsCourt([]);
      }
    });

    // Cleanup listener khi unmount
    return () => off(orderRef, "value", unsubscribe);
  }, []); // Chỉ chạy 1 lần khi component mounted
  // Khi orderItemsCourt thay đổi, cập nhật courts và products
  useEffect(() => {
    // Cập nhật danh sách sân
    const allCourts = courts.map((court) => {
      const existingOrder = orderItemsCourt.find(
        (order) => order.court._id === court._id
      );

      return existingOrder
        ? existingOrder.court // Nếu sân có đơn hàng, cập nhật thông tin
        : { ...court, isEmpty: true }; // Nếu sân không có đơn hàng, giữ mặc định
    });

    setCourts(allCourts);
  }, [orderItemsCourt]); // Chạy mỗi khi orderItemsCourt thay đổi
  useEffect(() => {
    if (selectedCourt._id == "guest") {
      const guestOrder = localStorage.getItem("guest_order");
      if (guestOrder) {
        setOrderItemsCourt(JSON.parse(guestOrder));
      }
    }
  }, [orderItemsCourt]);
  // Khi thay đổi loại hóa đơn
  const handleTypeChange = (checkedValue) => {
    if (type === checkedValue) {
      setType("both"); // Nếu bấm vào cái đang chọn thì chuyển lại "both"
    } else {
      setType(checkedValue); // Chọn 1 cái thì thành cái đó
    }
  };

  return (
    <Layout className="container mt-4">
      <Title level={3} className="text-center">
        HÓA ĐƠN SÂN CẦU LÔNG
      </Title>
      <div
        style={{ marginLeft: "4vh", display: "flex", justifyContent: "center" }}
      >
        <label style={{ paddingRight: "10px" }}>
          <strong>Chọn loại hóa đơn:</strong>
        </label>
        <Checkbox
          checked={type === "rent"}
          onChange={() => handleTypeChange("rent")}
        >
          Thuê sân
        </Checkbox>
        <Checkbox
          checked={type === "product"}
          onChange={() => handleTypeChange("product")}
        >
          Mua sản phẩm
        </Checkbox>
        <span style={{ marginLeft: "10px", fontWeight: "bold" }}>
          Loại:{" "}
          {type === "rent"
            ? "Thuê sân"
            : type === "product"
            ? "Mua sản phẩm"
            : "Thuê sân và mua sản phẩm"}
        </span>
      </div>

      <Row gutter={16} style={{ display: "flex", justifyContent: "center" }}>
        {(type === "rent" || type === "both") && (
          <Col span={12}>
            <div>
              <CourtList courts={courts} onSelectCourt={handleSelectedCourt} />
              <CourtDetails
                selectedCourt={selectedCourt}
                orderItemsCourt={orderItemsCourt}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                getTotalAmountForCourt={getTotalAmountForCourt}
              />
            </div>
          </Col>
        )}

        <Col span={12}>
          <Card title="Hóa Đơn">
            <InvoiceList
              orderItemsCourt={orderItemsCourt}
              selectedCourt={selectedCourt}
            />
            {(type === "rent" || type === "both") &&
              selectedCourt._id !== "guest" && (
                <CustomerSelector
                  users={users}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  setOrderItemsCourt={setOrderItemsCourt}
                  selectedCourt={selectedCourt}
                  orderItemsCourt={orderItemsCourt}
                />
              )}
            {(type === "product" ||
              (type === "both" && selectedCourt._id !== "guest")) && (
              <>
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
              </>
            )}
            <Title level={4}>
              Tổng tiền:{" "}
              {getTotalAmountForCourt(selectedCourt._id).toLocaleString()} VND
            </Title>
            <CheckoutButton
              getTotalAmountForCourt={getTotalAmountForCourt}
              selectedCourt={selectedCourt}
              selectedUser={selectedUser}
              orderItemsCourt={orderItemsCourt}
              setOrderItemsCourt={setOrderItemsCourt}
              invoiceTime={invoiceTime}
              setInvoiceTime={setInvoiceTime}
              defaultCourt={defaultCourt}
              setSelectedCourt={setSelectedCourt}
              type={type}
            />
            <Button type="primary" className="m-2">
              <Link
                to="/employee/invoice/history"
                style={{ textDecoration: "none" }}
              >
                Xem lịch sử hóa đơn
              </Link>
            </Button>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default InvoicePage;
