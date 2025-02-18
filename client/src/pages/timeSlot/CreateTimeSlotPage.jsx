import React from "react";
import Layout from "../../components/Layout";
import { Form, Input, message, TimePicker } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import axios from "axios";
import dayjs from "dayjs";

const CreateTimeSlotPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Xử lý submit form
  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8080/api/v1/admin/time-slot", // API đúng
        {
          time: values.time.format("HH:mm"),
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Thêm khung giờ thành công!");
        navigate("/admin/time-slot");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <Form layout="vertical" onFinish={onFinishHandler}>
          <h3 className="text-center">THÊM KHUNG GIỜ</h3>
          <Form.Item
            label="Giờ"
            name="time"
            rules={[{ required: true, message: "Vui lòng chọn giờ" }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm" />
          </Form.Item>
          <button className="btn btn-primary" type="submit">
            Thêm
          </button>
        </Form>
      </div>
    </Layout>
  );
};

export default CreateTimeSlotPage;
