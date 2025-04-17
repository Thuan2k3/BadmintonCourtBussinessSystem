import React, { useEffect, useState } from "react";
import { ref, update, remove, onValue } from "firebase/database";
import { Select, Button, Typography, message, Tooltip } from "antd";
import { database } from "../firebaseConfig";
import axios from "axios";

const { Text } = Typography;

// Hàm loại bỏ dấu tiếng Việt
const removeVietnameseTones = (str) => {
  if (typeof str !== "string") return "";
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
};

const CustomerSelector = ({
  orderItemsCourt,
  users,
  selectedUser,
  setSelectedUser,
  selectedCourt,
  setOrderItemsCourt,
}) => {
  const [tempSelectedUser, setTempSelectedUser] = useState(null); // Khách hàng tạm thời
  const [initialUser, setInitialUser] = useState(null); // Lưu khách hàng từ API

  // Lấy ngày giờ hiện tại (định dạng YYYY-MM-DD và HH:00)
  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toISOString().split("T")[0],
      time: `${now.getHours()}:00`,
    };
  };

  // Lấy thông tin khách hàng từ Firebase
  useEffect(() => {
    if (!selectedCourt?._id || selectedCourt._id === "guest") return;

    const orderRef = ref(database, `orders/${selectedCourt._id}/customer`);

    // Lắng nghe dữ liệu theo thời gian thực
    const unsubscribe = onValue(orderRef, (snapshot) => {
      const customerData = snapshot.val();
      if (customerData) {
        setSelectedUser(customerData); // Cập nhật selectedUser từ Firebase
        setTempSelectedUser(customerData); // Hiển thị sẵn trong Select
      } else {
        setSelectedUser(null);
        setTempSelectedUser(null);
      }
    });

    // Hủy lắng nghe khi component unmount
    return () => unsubscribe();
  }, [selectedCourt, setSelectedUser]);

  // Xử lý khi nhấn "Xác nhận"
  const handleConfirm = async () => {
    if (!selectedCourt || !selectedCourt._id) {
      message.error("Vui lòng chọn sân trước khi gán khách hàng!");
      return;
    }

    // Cập nhật khách hàng chính thức
    setSelectedUser(tempSelectedUser);

    // Cập nhật trạng thái sân và khách trong orderItemsCourt
    setOrderItemsCourt((prev) => {
      const updatedItems = [...prev];
      const courtKey = selectedCourt._id;
      const index = updatedItems.findIndex(
        (item) => item.court?._id === courtKey
      );

      if (index !== -1) {
        updatedItems[index] = {
          ...updatedItems[index],
          customer: tempSelectedUser || null,
        };
      } else if (tempSelectedUser) {
        updatedItems.push({
          court: selectedCourt,
          customer: tempSelectedUser,
          products: [],
          courtInvoice: null,
        });
      }

      if (courtKey === "guest") {
        localStorage.setItem("guest_order", JSON.stringify(updatedItems));
      }

      return updatedItems;
    });

    // Chỉ cập nhật Firebase nếu sân không phải là "guest"
    if (selectedCourt._id !== "guest") {
      const orderRef = ref(database, `orders/${selectedCourt._id}/customer`);

      try {
        if (tempSelectedUser) {
          await update(orderRef, {
            _id: tempSelectedUser._id,
            full_name: tempSelectedUser.full_name,
            email: tempSelectedUser.email,
          });
          message.success(
            `Khách hàng đã được cập nhật: ${tempSelectedUser.full_name}`
          );
        } else {
          await remove(orderRef); // Xóa khách hàng nếu không chọn
          message.success("Đã bỏ chọn khách hàng.");
        }
      } catch (error) {
        message.error("Lỗi khi cập nhật khách hàng: " + error.message);
      }
    }
  };

  // Lấy thông tin khách hàng đã đặt sân từ API
  useEffect(() => {
    const fetchBookedCustomer = async () => {
      if (!selectedCourt?._id) return;

      const { date, time } =
        selectedCourt.date && selectedCourt.time
          ? { date: selectedCourt.date, time: selectedCourt.time }
          : getCurrentDateTime();

      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/employee/court/${selectedCourt._id}/${date}/${time}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const user = response.data?.user;

        // Tìm sân hiện tại trong orderItemsCourt
        const currentCourt = orderItemsCourt.find(
          (item) => item.court?._id === selectedCourt._id
        );

        if (user && user._id) {
          // Nếu user hợp lệ, cập nhật cả state và Firebase
          setInitialUser(user);
          setTempSelectedUser(user);

          // Lưu vào Firebase (nếu không phải sân khách lẻ "guest")
          if (selectedCourt._id !== "guest" && !currentCourt.customer) {
            const orderRef = ref(
              database,
              `orders/${selectedCourt._id}/customer`
            );
            await update(orderRef, {
              _id: user._id,
              full_name: user.full_name,
              email: user.email,
            });
            message.success(`Tự động gán khách: ${user.full_name}`);
          }
        } else {
          // Không có khách đặt, reset trạng thái
          setInitialUser(null);
          setTempSelectedUser(null);
        }
      } catch (error) {
        console.error("Không tìm thấy khách đặt sân:", error);
        setInitialUser(null);
        setTempSelectedUser(null);
      }
    };

    fetchBookedCustomer();
  }, [selectedCourt]);

  return (
    <div className="mb-1">
      <Text strong>Chọn khách hàng:</Text>
      <div className="d-flex align-items-center">
        <Select
          showSearch
          allowClear
          placeholder="Chọn khách hàng"
          style={{ width: "100%", height: 40 }} // Cho nó dài hết khung chứa
          className="me-2"
          optionFilterProp="label"
          value={tempSelectedUser?._id || null}
          onChange={(value) => {
            setTempSelectedUser(
              value ? users.find((u) => u._id === value) : null
            );
          }}
          options={[
            { value: null, label: "Không chọn khách hàng" },
            ...users.map((user) => ({
              value: user._id,
              label: `${user.full_name} - ${user.email}`, // dùng để lọc
              customLabel: (
                <Tooltip title={`${user.full_name} - ${user.email}`}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      lineHeight: "1.5",
                    }}
                  >
                    <strong>{user.full_name}</strong>
                    <span style={{ fontSize: "12px", color: "#888" }}>
                      {user.email}
                    </span>
                  </div>
                </Tooltip>
              ),
            })),
          ]}
          optionLabelProp="customLabel" // dùng cái này để hiển thị custom UI
          filterOption={(input, option) =>
            removeVietnameseTones(option.label).includes(
              removeVietnameseTones(input)
            )
          }
        />
        <Button style={{ height: 40 }} onClick={handleConfirm}>
          Xác nhận
        </Button>
      </div>

      {selectedUser && (
        <div>
          <b>Họ và tên:</b> {selectedUser.full_name} <br />
          <b>Email:</b> {selectedUser.email}
        </div>
      )}
    </div>
  );
};

export default CustomerSelector;
