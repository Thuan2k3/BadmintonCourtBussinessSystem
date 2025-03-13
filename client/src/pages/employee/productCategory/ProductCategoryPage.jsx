import React, { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { Link } from "react-router-dom";
import { AiOutlineEdit } from "react-icons/ai";
import { BsInfoCircle } from "react-icons/bs";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import axios from "axios";

const ProductCategoryPage = () => {
  const [productCategories, setProductCategories] = useState([]);
  //getProductCategories
  const getProductCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/employee/product-categories",
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

  return (
    <Layout>
      <div className="p-2">
        <h1 className="d-flex justify-content-center">
          QUẢN LÝ DANH MỤC SẢN PHẨM
        </h1>
        <Link
          to="/employee/product-category/create"
          className="d-flex justify-content-end fs-1"
        >
          <MdOutlineAddBox></MdOutlineAddBox>
        </Link>
        <table className="table table-bordered table-hover">
          <thead className="table-dark text-center">
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {productCategories.map((productCategory, index) => (
              <tr
                key={productCategory._id}
                className="align-middle text-center"
              >
                <td>{index + 1}</td>
                <td>{productCategory.name}</td>
                <td>
                  <div className="d-flex justify-content-center gap-3">
                    <Link
                      to={`/employee/product-category/update/${productCategory._id}`}
                    >
                      <AiOutlineEdit className="fs-4 text-warning" />
                    </Link>
                    <Link
                      to={`/employee/product-category/delete/${productCategory._id}`}
                    >
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

export default ProductCategoryPage;
