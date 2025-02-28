import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import axios from "axios";

const TimeSlotPage = () => {
  const [timeSlots, setTimeSlots] = useState([]);

  // Lấy danh sách khung giờ
  const getTimeSlots = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/admin/time-slot",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setTimeSlots(res.data.data);
      }
    } catch (error) {
      console.log("Lỗi khi lấy danh sách khung giờ:", error);
    }
  };

  useEffect(() => {
    getTimeSlots();
  }, []);

  return (
    <Layout>
      <div className="p-2">
        <h1 className="d-flex justify-content-center">QUẢN LÝ KHUNG GIỜ</h1>
        <Link
          to="/admin/time-slot/create"
          className="d-flex justify-content-end fs-1"
        >
          <MdOutlineAddBox />
        </Link>
        <table className="table table-bordered table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>STT</th>
              <th>Giờ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot, index) => (
              <tr key={timeSlot._id} className="align-middle text-center">
                <td>{index + 1}</td>
                <td>{timeSlot.time}</td>
                <td>
                  <div className="d-flex justify-content-center gap-3">
                    <Link to={`/admin/time-slot/update/${timeSlot._id}`}>
                      <AiOutlineEdit className="fs-4 text-warning" />
                    </Link>
                    <Link to={`/admin/time-slot/delete/${timeSlot._id}`}>
                      <MdOutlineDelete className="fs-4 text-danger" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default TimeSlotPage;
