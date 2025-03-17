import React from "react";
import "../styles/LoginStyle.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GuestLayout from "../components/GuestLayout";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
        message.success("Login successfully");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("Something went wrong");
    }
  };
  return (
    <GuestLayout>
      <div className="form-container">
        <Form
          layout="vertical"
          onFinish={onFinishHandler}
          className="register-form"
          style={{
            padding: "40px",
            background: "linear-gradient(135deg, #fdfbfb, #ebedee)",
            borderRadius: "20px",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
            animation: "fadeIn 0.8s ease-in-out",
          }}
        >
          <h3 className="text-center">Đăng nhập</h3>
          <Form.Item label="Email" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </Form>
      </div>
    </GuestLayout>
  );
};

export default Login;
