import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Form, Input, message, Button, Select, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined } from "@ant-design/icons";
import UploadImage from "../../components/UploadImage";

const CreateProductPage = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [productCategories, setProductCategories] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // Lưu file tạm
  //getProductCategories
  const getProductCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/admin/product-categories",
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

  useEffect(() => {
    getProductCategories();
  }, []);

  // Xử lý form submit
  const onFinishHandler = async (values) => {
    if (!selectedFile) {
      message.error("Vui lòng chọn ảnh!");
      return;
    }

    try {
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
      form.setFieldsValue({ image: imageUrl });

      // Lấy giá trị form sau khi cập nhật
      const updatedValues = form.getFieldsValue();
      console.log("Giá trị form sau khi cập nhật:", updatedValues);

      // Kiểm tra lại `updatedValues.image` trước khi gửi API
      if (!updatedValues.image) {
        message.error("Lỗi: URL ảnh không tồn tại!");
        return;
      }

      // Gửi API tạo sản phẩm
      const res = await axios.post(
        "http://localhost:8080/api/v1/admin/product",
        {
          ...updatedValues,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      console.log(updatedValues)

      if (res.data.success) {
        message.success("Thêm sản phẩm thành công");
        form.resetFields();
        setSelectedFile(null);
        navigate("/admin/product");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi gửi API:", error.response?.data || error.message);
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <Form form={form} layout="vertical" onFinish={onFinishHandler}>
          <h3 className="text-center">Thêm sản phẩm</h3>

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
            <UploadImage onFileSelect={(file) => {setSelectedFile(file)
              form.setFieldsValue({ image: file.name });
            }} />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            Thêm sản phẩm
          </Button>
        </Form>
      </div>
    </Layout>
  );
};

export default CreateProductPage;
