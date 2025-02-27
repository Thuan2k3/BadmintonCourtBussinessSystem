import React from "react";
import { ref, update } from "firebase/database";
import { Select, Button, Typography, message } from "antd";
import { database } from "../firebaseConfig"; // Import Firebase

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
      return updatedItems;
    });

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
  };

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
          filterOption={(input, option) => {
            const inputNormalized = removeVietnameseTones(input.toLowerCase());
            const optionNormalized = removeVietnameseTones(
              option.label.toLowerCase()
            );
            return optionNormalized.includes(inputNormalized);
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
      {orderItemsCourt.some(
        (item) => item.court?._id === selectedCourt?._id && item.customer
      ) && (
        <p>
          <strong>Tên khách hàng:</strong>{" "}
          {orderItemsCourt.find(
            (item) => item.court?._id === selectedCourt?._id
          )?.customer?.full_name || "Không xác định"}
        </p>
      )}
    </div>
  );
};

export default CustomerSelector;
