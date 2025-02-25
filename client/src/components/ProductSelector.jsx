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
