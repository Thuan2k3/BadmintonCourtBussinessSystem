import React, { useState } from "react";
import {
  Card,
  Select,
  Button,
  InputNumber,
  Table,
  Typography,
  message,
  Tooltip,
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
    <div className="mb-1">
      <Text strong>Chọn sản phẩm:</Text>
      <div className="d-flex align-items-center">
        <Select
          showSearch
          placeholder="Chọn sản phẩm"
          style={{ width: "100%", height: 40 }} // Cho nó dài hết khung chứa
          optionFilterProp="label"
          onChange={(value) =>
            setSelectedProduct(products.find((p) => p._id === value))
          }
          options={products.map((product) => ({
            value: product._id,
            label: (
              <Tooltip
                title={`${
                  product.name
                } - ${product.price.toLocaleString()} VND`}
              >
                <div style={{ lineHeight: "1.5" }}>
                  <strong>{product.name}</strong>
                  <div style={{ color: "gray", fontSize: "12px" }}>
                    {product.price.toLocaleString()} VND
                  </div>
                </div>
              </Tooltip>
            ),
          }))}
          // Tìm kiếm không phân biệt dấu
          filterOption={(input, option) =>
            removeVietnameseTones(option.label).includes(
              removeVietnameseTones(input)
            )
          }
        />
        <InputNumber
          style={{ height: 40, display: "flex", alignItems: "center" }}
          min={1}
          defaultValue={1}
          className="me-2"
          onChange={setQuantity}
        />
        <Button style={{ height: 40 }} onClick={handleAddProduct}>
          Thêm món
        </Button>
      </div>
    </div>
  );
};

export default ProductSelector;
