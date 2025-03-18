import React, { useState } from "react";
import {
  Card,
  Select,
  Button,
  InputNumber,
  Table,
  Typography,
  message,
} from "antd";
import { DeleteOutlined, DollarCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

// Hàm loại bỏ dấu tiếng Việt
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
};

const ProductSelector = ({
  products,
  setSelectedProduct,
  setQuantity,
  handleAddProduct,
}) => {
  return (
    <div className="d-flex align-items-center">
      <Select
        showSearch
        placeholder="Chọn sản phẩm"
        style={{ width: 200 }}
        optionFilterProp="label"
        onChange={(value) =>
          setSelectedProduct(products.find((p) => p._id === value))
        }
        options={products.map((product) => ({
          value: product._id,
          label: `${product.name} - ${product.price.toLocaleString()} VND`,
        }))}
        // Tìm kiếm không phân biệt dấu
        filterOption={(input, option) =>
          removeVietnameseTones(option.label).includes(
            removeVietnameseTones(input)
          )
        }
      />
      <InputNumber
        min={1}
        defaultValue={1}
        className="me-2"
        onChange={setQuantity}
      />
      <Button onClick={handleAddProduct}>Thêm món</Button>
    </div>
  );
};

export default ProductSelector;
