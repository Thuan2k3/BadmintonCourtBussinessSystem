import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Form, Input, message, TimePicker } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../../redux/features/alertSlice";
import axios from "axios";
import dayjs from "dayjs"; // Import dayjs

const UpdateTimeSlotPage = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [timeSlot, setTimeSlot] = useState(""); // state cho timeSlot

  // Lấy thông tin khung giờ theo ID
  const getTimeSlotById = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/admin/time-slot/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setTimeSlot(res.data.data.time); // Gán dữ liệu vào state
      }
    } catch (error) {
      message.error("Lỗi khi lấy dữ liệu khung giờ!");
    }
  };

  // Xử lý cập nhật khung giờ
  const handleUpdateTimeSlot = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.put(
        `http://localhost:8080/api/v1/admin/time-slot/${id}`,
        { time: timeSlot }, // Gửi dữ liệu cập nhật
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());

      if (res.data.success) {
        message.success("Cập nhật khung giờ thành công!");
        navigate("/admin/time-slot");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(
        error.response.data.message || "Có lỗi xảy ra. Vui lòng thử lại!"
      );
    }
  };

  // Cập nhật timeSlot khi người dùng chọn một giá trị mới
  const handleTimeChange = (value) => {
    setTimeSlot(value.format("HH:mm")); // Cập nhật lại timeSlot khi người dùng chọn giờ mới
  };

  useEffect(() => {
    getTimeSlotById();
  }, []); // Chỉ gọi 1 lần khi component mount

  useEffect(() => {
    if (timeSlot) {
      form.setFieldsValue({
        time: dayjs(timeSlot, "HH:mm"), // Chuyển đổi timeSlot thành dayjs
      });
    }
  }, [timeSlot]); // Gọi lại khi timeSlot thay đổi

  return (
    <Layout>
      <div className="p-4">
        <Form layout="vertical" onFinish={handleUpdateTimeSlot} form={form}>
          <h3 className="text-center">CẬP NHẬT KHUNG GIỜ</h3>
          <Form.Item
            label="Giờ"
            name="time"
            rules={[{ required: true, message: "Vui lòng nhập khung giờ" }]}
          >
            <TimePicker
              style={{ width: "100%" }}
              format="HH:mm"
              onChange={handleTimeChange} // Gọi khi người dùng chọn giờ mới
            />
          </Form.Item>
          <button className="btn btn-primary">Cập nhật</button>
        </Form>
      </div>
    </Layout>
  );
};

export default UpdateTimeSlotPage;
