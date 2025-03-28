import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Form, InputNumber, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../../redux/features/alertSlice";
import axios from "axios";

const UpdateReputationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm(); // Form Ant Design

  // 📌 Lấy thông tin khách hàng
  const getCustomerById = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/admin/customer/${id}`,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );

      if (res.data.success) {
        const customerData = res.data.data;
        form.setFieldsValue({
          full_name: customerData.full_name,
          email: customerData.email,
          reputation_score: customerData.reputation_score, // Set điểm uy tín
        });
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      message.error("Lỗi khi lấy thông tin khách hàng!");
    }
  };

  // 📌 Cập nhật điểm uy tín
  const handleUpdateReputation = async (values) => {
    try {
      dispatch(showLoading());

      const res = await axios.put(
        `http://localhost:8080/api/v1/admin/reputation/${id}`,
        {
          reputation_score: values.reputation_score, // Gửi điểm uy tín mới
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Cập nhật điểm uy tín thành công!");
        navigate("/admin/reputation"); // Điều hướng về trang quản lý điểm uy tín
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("Lỗi khi cập nhật điểm uy tín!");
    }
  };

  useEffect(() => {
    getCustomerById();
  }, []);

  return (
    <Layout>
      <div className="p-4">
        <Form form={form} layout="vertical" onFinish={handleUpdateReputation}>
          <h3 className="text-center">CẬP NHẬT ĐIỂM UY TÍN</h3>

          <Form.Item label="Họ và tên" name="full_name">
            <InputNumber disabled style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <InputNumber disabled style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Điểm uy tín"
            name="reputation_score"
            rules={[{ required: true, message: "Vui lòng nhập điểm uy tín" }]}
          >
            <InputNumber min={0} max={100} style={{ width: "100%" }} />
          </Form.Item>

          <button className="btn btn-primary">Cập nhật</button>
        </Form>
      </div>
    </Layout>
  );
};

export default UpdateReputationPage;
