import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import axios from "axios";

const CourtPage = () => {
  const [courts, setCourts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Lấy danh sách sân
  const getAllCourts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/employee/court",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        setCourts(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCourts();
  }, []);

  // Hàm loại bỏ dấu tiếng Việt
  const convertToUnsigned = (str) => {
    return str
      .normalize("NFD") // Tách ký tự có dấu thành ký tự gốc + dấu
      .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
      .toLowerCase(); // Chuyển thành chữ thường
  };

  // Lọc sân theo tên (không phân biệt dấu)
  const filteredCourts = courts.filter((court) =>
    convertToUnsigned(court.name).includes(convertToUnsigned(searchTerm))
  );

  return (
    <Layout>
      <div className="p-2">
        <h1 className="d-flex justify-content-center">QUẢN LÝ SÂN</h1>

        {/* Ô tìm kiếm */}
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nhập tên sân..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Link
          to="/employee/court/create"
          className="d-flex justify-content-end fs-1"
        >
          <MdOutlineAddBox />
        </Link>

        <table className="table table-bordered table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Giá</th>
              <th>Mô tả</th>
              <th>Hình ảnh</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourts.map((court, index) => (
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
                <td>
                  <div className="d-flex justify-content-center gap-3">
                    <Link to={`/employee/court/update/${court._id}`}>
                      <AiOutlineEdit className="fs-4 text-warning" />
                    </Link>
                    <Link to={`/employee/court/delete/${court._id}`}>
                      <MdOutlineDelete className="fs-4 text-danger" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCourts.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-danger">
                  Không tìm thấy sân nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default CourtPage;
