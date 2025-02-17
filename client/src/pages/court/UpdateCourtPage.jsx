import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Form, Input, message, Button, Select, Upload } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined } from "@ant-design/icons";
import UploadImage from "../../components/UploadImage";

const UpdateCourtPage = () => {
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [court, setCourt] = useState({});
  const [selectedFile, setSelectedFile] = useState(null); // Lưu file tạm

  //getCourt
  const getCourt = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/admin/court/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setCourt(res.data.data);
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

      const resCourt = await axios.get(
        `http://localhost:8080/api/v1/admin/court/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      //Khong cap nhat anh
      if (
        resCourt.data.data.image.replace("/uploads/", "") === selectedFile.name
      ) {
        form.setFieldsValue({ values });

        const updatedValues = form.getFieldsValue();
        console.log("Giá trị form sau khi cập nhật:", updatedValues);

        const res = await axios.put(
          `http://localhost:8080/api/v1/admin/court/${id}`,
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
          navigate("/admin/court");
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
        `http://localhost:8080/api/v1/admin/court/${id}`,
        updatedValues,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        message.success("Cập nhật sản phẩm thành công!");
        form.resetFields();
        setSelectedFile(null);
        navigate("/admin/court");
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
    getCourt();
  }, []);

  const setImage = async () => {
    if (!court || !court.image) return;

    const url = court.image.startsWith("/")
      ? `http://localhost:8080${court.image}`
      : `http://localhost:8080/${court.image}`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Không thể tải ảnh");

      const blob = await response.blob();
      const nameImage = court.image.replace("/uploads/", "");
      const file = new File([blob], nameImage, { type: blob.type });

      setSelectedFile(file);
    } catch (error) {
      console.error("Lỗi khi tải ảnh:", error);
    }
  };
  // Cập nhật form khi `court` thay đổi
  useEffect(() => {
    if (court && Object.keys(court).length > 0) {
      form.setFieldsValue({
        name: court.name,
        price: court.price,
        description: court.description,
        image: court.image,
        isEmpty: court.isEmpty,
        isActive: court.isActive,
      });

      setImage();
    }
  }, [court]); // Chạy lại khi `product` thay đổi

  return (
    <Layout>
      <div className="p-4">
        <Form form={form} layout="vertical" onFinish={onFinishHandler}>
          <h3 className="text-center">Cập nhật sân</h3>

          <Form.Item
            label="Tên sân"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Giá mỗi giờ"
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
              initImage={`http://localhost:8080${court.image}`} // Dùng backticks để kết hợp biến
            />
          </Form.Item>

          <Form.Item
            label="Trạng thái sử dụng sân"
            name="isEmpty"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn trạng thái sử dụng sân!",
              },
            ]}
          >
            <Select>
              <Select.Option value={true}>Trống</Select.Option>
              <Select.Option value={false}>Có người</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Trạng thái sân"
            name="isActive"
            rules={[
              { required: true, message: "Vui lòng chọn trạng thái sân!" },
            ]}
          >
            <Select>
              <Select.Option value={true}>Hoạt động</Select.Option>
              <Select.Option value={false}>Bảo trì</Select.Option>
            </Select>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            Cập nhật sân
          </Button>
        </Form>
      </div>
    </Layout>
  );
};

export default UpdateCourtPage;
