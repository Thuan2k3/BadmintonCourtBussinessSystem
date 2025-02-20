import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import axios from "axios";

const CourtPage = () => {
  const [court, setCourt] = useState([]);
  //getAllCourt
  const getAllCourt = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/admin/court", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setCourt(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCourt();
  }, []);

  return (
    <Layout>
      <div className="p-2">
        <h1 className="d-flex justify-content-center">QUẢN LÝ SÂN</h1>
        <Link
          to="/admin/court/create"
          className="d-flex justify-content-end fs-1"
        >
          <MdOutlineAddBox></MdOutlineAddBox>
        </Link>
        <table className="table table-bordered table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Mô tả</th>
              <th>Hình ảnh</th>
              <th>Trạng thái sử dụng sân</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {court.map((court, index) => (
              <tr key={court._id} className="align-middle text-center">
                <td>{index + 1}</td>
                <td>{court.name}</td>
                <td>{court.price}</td>
                <td>{court.description}</td>
                <td>
                  <img
                    src={`http://localhost:8080${court.image}`}
                    alt="Court"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{court.isEmpty ? "Trống" : "Có người"}</td>
                <td>
                  <div className="d-flex justify-content-center gap-3">
                    <Link to={`/admin/court/update/${court._id}`}>
                      <AiOutlineEdit className="fs-4 text-warning" />
                    </Link>
                    <Link to={`/admin/court/delete/${court._id}`}>
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

export default CourtPage;
