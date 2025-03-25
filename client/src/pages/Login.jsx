import React from "react";
import "../styles/LoginStyle.css";
import { Form, Input, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GuestLayout from "../components/GuestLayout";
import { setUser } from "../redux/features/userSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  //form handler
  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/login",
        values
      );
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Đăng nhập thành công!");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
      dispatch(setUser(user));
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Lỗi đăng nhập!");
    }
  };
  return (
    <GuestLayout>
      <div className="form-container">
        <Form
          layout="vertical"
          onFinish={onFinishHandler}
          className="login-form"
          style={{
            padding: "40px",
            background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
            borderRadius: "20px",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
            animation: "fadeIn 0.8s ease-in-out",
          }}
        >
          <h3 className="text-center text-primary">ĐĂNG NHẬP</h3>
          <Form.Item label="Email" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Mật khẩu" name="password">
            <Input type="password" required />
          </Form.Item>
          <button className="btn btn-primary" type="submit">
            Đăng nhập
          </button>
        </Form>
      </div>
    </GuestLayout>
  );
};

export default Login;
