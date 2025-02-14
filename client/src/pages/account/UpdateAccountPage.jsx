import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Form, Input, message } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import axios from "axios";

const UpdateAccountPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [name, setName] = useState("");

  const handleUpdateProductCategory = async (req, res) => {
    try {
      dispatch(showLoading());
      const res = await axios.put(
        `http://localhost:8080/api/v1/admin/product-categories/${id}`,
        { name }, // Gửi dữ liệu từ state
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success("Cập nhật danh mục thành công!");
        navigate("/admin/product-category");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  const getProductCategoryById = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/v1/admin/product-categories/${id}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      if (res.data.success) {
        setName(res.data.data.name); // Cập nhật state
      }
    } catch (error) {
      message.error("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  useEffect(() => {
    getProductCategoryById();
  }, []);

  return (
    <Layout>
      <div className="p-4">
        <Form layout="vertical" onFinish={handleUpdateProductCategory}>
          <h3 className="text-center">CẬP NHẬT DANH MỤC SẢN PHẨM</h3>
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên loại sản phẩm" },
            ]}
          >
            <div>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <br />
            </div>
          </Form.Item>
          <button className="btn btn-primary">Cập nhật</button>
        </Form>
      </div>
    </Layout>
  );
};

export default UpdateAccountPage;
