import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Form, Input, Select, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import axios from "axios";

const UpdateAccountPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm(); // Sử dụng form Ant Design

  const getAccountById = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/admin/account/${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        form.setFieldsValue({
          full_name: res.data.data.full_name,
          email: res.data.data.email,
          phone: res.data.data.phone,
          address: res.data.data.address,
          role: res.data.data.isAdmin
            ? "admin"
            : res.data.data.isStaff
            ? "staff"
            : "customer",
          isBlocked: res.data.data.isBlocked ? "blocked" : "active",
        });
      }
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  const handleUpdateAccount = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.put(
        `http://localhost:8080/api/v1/admin/account/${id}`,
        {
          ...values,
          isBlocked: values.isBlocked === "blocked", // Chuyển đổi trạng thái
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Cập nhật tài khoản thành công!");
        navigate("/admin/account");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    getAccountById();
  }, []);

  return (
    <Layout>
      <div className="p-4">
        <Form form={form} layout="vertical" onFinish={handleUpdateAccount}>
          <h3 className="text-center">CẬP NHẬT TÀI KHOẢN</h3>

          <Form.Item
            label="Họ và tên"
            name="full_name"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập email" }]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input type="tel" />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
            <Select placeholder="Chọn vai trò">
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="staff">Nhân viên</Select.Option>
              <Select.Option value="customer">Khách hàng</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Trạng thái"
            name="isBlocked"
            rules={[
              { required: true, message: "Vui lòng chọn trạng thái tài khoản" },
            ]}
          >
            <Select placeholder="Chọn trạng thái">
              <Select.Option value={false}>Hoạt động</Select.Option>
              <Select.Option value={true}>Bị khóa</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Mật khẩu" name="password">
            <Input type="password" autoComplete="new-password" />
          </Form.Item>

          <button className="btn btn-primary">Cập nhật</button>
        </Form>
      </div>
    </Layout>
  );
};

export default UpdateAccountPage;
