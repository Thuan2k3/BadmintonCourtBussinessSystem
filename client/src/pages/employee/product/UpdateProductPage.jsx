import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Form, Input, message, Button, Select, Upload } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../../redux/features/alertSlice";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined } from "@ant-design/icons";
import UploadImage from "../../../components/UploadImage";

const UpdateProductPage = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [productCategories, setProductCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // Lưu file tạm

  //getProductCategories
  const getProductCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/employee/product-categories",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setProductCategories(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //getProduct
  const getProduct = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/employee/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setProduct(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Xử lý form submit
  const onFinishHandler = async (values) => {
    try {
      if (!selectedFile) {
        message.error("Vui lòng chọn ảnh!");
        return;
      }

      const resProduct = await axios.get(
        `http://localhost:8080/api/v1/employee/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      //Khong cap nhat anh
      if (
        resProduct.data.data.image.replace("/uploads/", "") ===
        selectedFile.name
      ) {
        form.setFieldsValue({ values });

        const updatedValues = form.getFieldsValue();
        console.log("Giá trị form sau khi cập nhật:", updatedValues);

        const res = await axios.put(
          `http://localhost:8080/api/v1/employee/product/${id}`,
          updatedValues,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.success) {
          message.success("Cập nhật sản phẩm thành công!");
          form.resetFields();
          setSelectedFile(null);
          navigate("/employee/product");
        } else {
          message.error(res.data.message);
        }
        return;
      }

      // 1. Upload ảnh trước
      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadRes = await axios.post(
        "http://localhost:8080/api/v1/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!uploadRes.data.success) {
        message.error("Tải ảnh lên thất bại!");
        return;
      }

      const imageUrl = uploadRes.data.url;
      console.log("URL ảnh sau khi upload:", imageUrl);

      // Cập nhật giá trị ảnh vào form
      form.setFieldsValue({ ...values, image: imageUrl });

      // Lấy giá trị form sau khi cập nhật
      const updatedValues = form.getFieldsValue();
      console.log("Giá trị form sau khi cập nhật:", updatedValues);

      // Kiểm tra lại `updatedValues.image` trước khi gửi API
      if (!updatedValues.image) {
        message.error("Lỗi: URL ảnh không tồn tại!");
        return;
      }

      const res = await axios.put(
        `http://localhost:8080/api/v1/employee/product/${id}`,
        updatedValues,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        message.success("Cập nhật sản phẩm thành công!");
        form.resetFields();
        setSelectedFile(null);
        navigate("/employee/product");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(
        "Lỗi khi cập nhật sản phẩm:",
        error.response?.data || error.message
      );
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  useEffect(() => {
    getProduct();
    getProductCategories();
  }, []);

  const setImage = async () => {
    if (!product || !product.image) return;

    const url = product.image.startsWith("/")
      ? `http://localhost:8080${product.image}`
      : `http://localhost:8080/${product.image}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Không thể tải ảnh");

      const blob = await response.blob();
      const nameImage = product.image.replace("/uploads/", "");
      const file = new File([blob], nameImage, { type: blob.type });

      setSelectedFile(file);
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
    }
  };
  // Cập nhật form khi `product` thay đổi
  useEffect(() => {
    if (product && Object.keys(product).length > 0) {
      form.setFieldsValue({
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        image: product.image,
      });

      setImage();
    }
  }, [product]); // Chạy lại khi `product` thay đổi

  return (
    <Layout>
      <div className="p-4">
        <Form form={form} layout="vertical" onFinish={onFinishHandler}>
          <h3 className="text-center">Cập nhật sản phẩm</h3>

          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Loại sản phẩm"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn loại sản phẩm" }]}
          >
            <Select>
              {productCategories.map((productCategory) => (
                <Select.Option
                  key={productCategory._id}
                  value={productCategory._id}
                >
                  {productCategory.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: "Vui lòng nhập giá sản phẩm" },
              { pattern: /^[0-9]+$/, message: "Giá sản phẩm phải là số" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Hình ảnh"
            name="image"
            rules={[{ required: true, message: "Vui lòng tải ảnh lên" }]}
          >
            <UploadImage
              onFileSelect={(file) => {
                setSelectedFile(file);
                form.setFieldsValue({ image: file.name });
              }}
              initImage={`http://localhost:8080${product.image}`} // Dùng backticks để kết hợp biến
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            Cập nhật sản phẩm
          </Button>
        </Form>
      </div>
    </Layout>
  );
};

export default UpdateProductPage;
