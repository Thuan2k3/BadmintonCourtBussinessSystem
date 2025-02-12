import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Form, Input, message, Button, Select, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import axios from "axios";
import TextArea from "antd/es/input/TextArea";
import { PlusOutlined } from "@ant-design/icons";

const CreateProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [productCategories, setProductCategories] = useState([]);
  //getProductCategories
  const getProductCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/admin/product-categories",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setProductCategories(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductCategories();
  }, []);

  // Xử lý form submit
  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/api/v1/admin/product",
        {
          name: values.name,
          category: values.category,
          price: values.price,
          description: values.description,
          image: values.image,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      dispatch(hideLoading());
      setLoading(false);

      if (res.data.success) {
        message.success("Thêm sản phẩm thành công");
        navigate("/admin/product");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      setLoading(false);
      console.error(error);
      message.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <Form layout="vertical" onFinish={onFinishHandler}>
          <h3 className="text-center">Thêm sản phẩm</h3>

          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Loại sản phẩm"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn loại sản phẩm" }]}
          >
            <Select>
              {productCategories.map((productCategory) => (
                <Select.Option
                  key={productCategory._id}
                  value={productCategory._id}
                >
                  {productCategory.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[
              { required: true, message: "Vui lòng nhập giá sản phẩm" },
              { pattern: /^[0-9]+$/, message: "Giá sản phẩm phải là số" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả sản phẩm" },
            ]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            label="Hình ảnh"
            name="image"
            rules={[
              { required: true, message: "Vui lòng nhập đường dẫn hình ảnh" },
            ]}
          >
            <Upload action="/upload.do" listType="picture-card">
              <button
                style={{
                  border: 0,
                  background: "none",
                }}
                type="button"
              >
                <PlusOutlined />
                <div
                  style={{
                    marginTop: 8,
                  }}
                >
                  Upload
                </div>
              </button>
            </Upload>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            Thêm sản phẩm
          </Button>
        </Form>
      </div>
    </Layout>
  );
};

export default CreateProductPage;
