import React from "react";
import { Select, Button, Typography, message } from "antd";

const { Text } = Typography;

const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
};

const CustomerSelector = ({
  users,
  selectedUser,
  setSelectedUser,
  selectedCourt,
  setOrderItemsCourt,
}) => {
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
            { value: null, label: "Không chọn khách hàng" },
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

              const courtKey = selectedCourt ? selectedCourt._id : "guest";
              const index = updatedItems.findIndex(
                (item) => item.court?._id === courtKey
              );

              if (index !== -1) {
                if (!selectedUser) {
                  updatedItems[index] = {
                    ...updatedItems[index],
                    user: null,
                  };
                  message.success("Đã bỏ chọn khách hàng.");
                } else {
                  updatedItems[index] = {
                    ...updatedItems[index],
                    user: selectedUser,
                  };
                  message.success(
                    `Khách hàng đã được cập nhật thành: ${selectedUser.full_name}`
                  );
                }
              } else if (selectedUser) {
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
    </div>
  );
};

export default CustomerSelector;
