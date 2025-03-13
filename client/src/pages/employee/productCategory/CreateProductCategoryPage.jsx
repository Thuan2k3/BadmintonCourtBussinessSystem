import React from "react";
import Layout from "../../../components/Layout";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../../redux/features/alertSlice";
import axios from "axios";
const CreateProductCategoryPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //form handler
  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8080/api/v1/employee/product-categories",
        { name: values.name }, // Lấy giá trị từ form
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Thêm danh mục sản phẩm thành công");
        navigate("/employee/product-category");
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
          <h3 className="text-center">THÊM DANH MỤC SẢN PHẨM</h3>
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên loại sản phẩm" },
            ]}
          >
            <Input />
          </Form.Item>
          <button className="btn btn-primary" type="submit">
            Thêm
          </button>
        </Form>
      </div>
    </Layout>
  );
};

export default CreateProductCategoryPage;
