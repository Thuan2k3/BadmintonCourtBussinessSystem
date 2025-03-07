import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Form, Input, Select, message, DatePicker } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../../redux/features/alertSlice";
import axios from "axios";
import dayjs from "dayjs";

const UpdateAccountPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm(); // Sử dụng form Ant Design
  const [role, setRole] = useState("");

  const getAccountById = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/admin/account/${id}`,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );

      if (res.data.success) {
        const accountData = res.data.data;

        if (accountData.role === "employee") {
          form.setFieldsValue({
            full_name: accountData.full_name,
            email: accountData.email,
            phone: accountData.phone,
            address: accountData.address,
            role: accountData.role,
            isBlocked: accountData.isBlocked ? "blocked" : "active",
            hire_date: accountData.employee?.hire_date
              ? dayjs(accountData.employee.hire_date)
              : null,
          });
        } else {
          form.setFieldsValue({
            full_name: accountData.full_name,
            email: accountData.email,
            phone: accountData.phone,
            address: accountData.address,
            role: accountData.role,
            isBlocked: accountData.isBlocked ? true : false,
          });
        }

        setRole(accountData.role);
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
      message.error(error.response.data.message);
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
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
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
