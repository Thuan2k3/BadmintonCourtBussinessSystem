import React from "react";
import Layout from "../../../components/Layout";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../../../redux/features/alertSlice";
import { message } from "antd";

const DeleteTimeSlotPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDeleteTimeSlot = async () => {
    dispatch(showLoading()); // Hiển thị loading trước khi gọi API
    try {
      const res = await axios.delete(
        `http://localhost:8080/api/v1/admin/time-slot/${id}`, // Sửa API đúng
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );
      dispatch(hideLoading()); // Ẩn loading sau khi API trả về
      message.success("Xóa khung giờ thành công!");
      setTimeout(() => navigate("/admin/time-slot"), 500); // Chuyển trang
    } catch (error) {
      dispatch(hideLoading());
      console.error("Lỗi khi xóa khung giờ:", error);
      const errorMessage =
        error.response?.data?.message || "Lỗi khi xóa khung giờ!";
      message.error(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate("/admin/time-slot");
  };

  return (
    <Layout>
      <div>
        <h1 className="text-center">Xóa khung giờ</h1>
        <div className="m-2 border border-secondary bg-light rounded">
          <h3 className="text-center">
            Bạn có chắc chắn muốn xóa khung giờ này không?
          </h3>
          <div className="d-flex justify-content-center">
            <button
              className="m-1 btn btn-danger"
              onClick={handleDeleteTimeSlot}
            >
              Đồng ý
            </button>
            <button className="m-1 btn btn-secondary" onClick={handleCancel}>
              Hủy
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DeleteTimeSlotPage;
