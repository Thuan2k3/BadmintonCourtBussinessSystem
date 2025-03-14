import React, { useEffect } from "react";
import { ref, update } from "firebase/database";
import { Select, Button, Typography, message } from "antd";
import { database } from "../firebaseConfig"; // Import Firebase
import axios from "axios";

const { Text } = Typography;

const removeVietnameseTones = (str) => {
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
  const getCurrentDateTime = () => {
    const now = new Date();
    const date = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const time = now.getHours() + ":00"; // Lấy giờ hiện tại, làm tròn về dạng "HH:00"
    return { date, time };
  };

  const handleConfirm = async () => {
    if (!selectedCourt || !selectedCourt._id) {
      message.error("Vui lòng chọn sân trước khi gán khách hàng!");
      return;
    }

    console.log("🏸 Sân được chọn:", selectedCourt);
    console.log("👤 Khách hàng được chọn:", selectedUser);

    setOrderItemsCourt((prev) => {
      let updatedItems = [...prev];

      const courtKey = selectedCourt._id;
      const index = updatedItems.findIndex(
        (item) => item.court?._id === courtKey
      );

      if (index !== -1) {
        updatedItems[index] = {
          ...updatedItems[index],
          customer: selectedUser || null,
        };
      } else if (selectedUser) {
        updatedItems.push({
          court: selectedCourt,
          customer: selectedUser,
          products: [],
          courtInvoice: null,
        });
      }

      console.log("📝 Cập nhật danh sách orderItemsCourt:", updatedItems);

      // Nếu là sân "guest", lưu vào localStorage
      if (courtKey === "guest") {
        localStorage.setItem("guest_order", JSON.stringify(updatedItems));
      }

      return updatedItems;
    });

    if (selectedCourt._id !== "guest") {
      const orderRef = ref(database, `orders/${selectedCourt._id}/customer`);

      try {
        if (selectedUser) {
          await update(orderRef, {
            id: selectedUser._id,
            full_name: selectedUser.full_name,
            email: selectedUser.email,
          });
          message.success(
            `Khách hàng đã được cập nhật: ${selectedUser.full_name}`
          );
        } else {
          await update(orderRef, null);
          message.success("Đã bỏ chọn khách hàng.");
        }
      } catch (error) {
        message.error("Lỗi khi cập nhật khách hàng: " + error.message);
      }
    }
  };
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
        if (response.data) {
          setSelectedUser(response.data.user);
        }
      } catch (error) {
        console.error("Không tìm thấy khách hàng đặt sân:", error);
        setSelectedUser(null);
      }
    };

    fetchBookedCustomer();
  }, [selectedCourt]);

  return (
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
            setSelectedUser(value ? users.find((u) => u._id === value) : null);
          }}
          options={[
            { value: null, label: "Không chọn khách hàng" },
            ...users.map((user) => ({
              value: user._id,
              label: `${user.full_name} - ${user.email}`,
            })),
          ]}
        />
        <Button onClick={handleConfirm}>Xác nhận</Button>
      </div>
      {selectedUser && (
        <p>
          <strong>Khách hàng đặt sân:</strong> {selectedUser.full_name} -{" "}
          {selectedUser.email}
        </p>
      )}
    </div>
  );
};

export default CustomerSelector;
