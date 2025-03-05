import React, { useState } from "react";
import Layout from "../../../components/Layout";
import { Form, Input, message, Select, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../../redux/features/alertSlice";
import axios from "axios";

const CreateAccountPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [role, setRole] = useState(null);

  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8080/api/v1/admin/account",
        values,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Thêm tài khoản thành công");
        navigate("/admin/account");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <Form layout="vertical" onFinish={onFinishHandler}>
          <h3 className="text-center">THÊM TÀI KHOẢN</h3>
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
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
          >
            <Input type="password" autoComplete="new-password" />
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
            <Select
              placeholder="Chọn vai trò"
              onChange={(value) => setRole(value)}
            >
              <Select.Option value="admin">Admin</Select.Option>
              <Select.Option value="employee">Nhân viên</Select.Option>
              <Select.Option value="customer">Khách hàng</Select.Option>
            </Select>
          </Form.Item>
          {role === "employee" && (
            <Form.Item label="Ngày nhận việc" name="hire_date">
              <DatePicker className="w-100" format="DD/MM/YYYY" />
            </Form.Item>
          )}
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
          <button className="btn btn-primary" type="submit">
            Thêm
          </button>
        </Form>
      </div>
    </Layout>
  );
};

export default CreateAccountPage;
