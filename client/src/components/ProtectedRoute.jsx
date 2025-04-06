import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";

import { adminMenu, employeeMenu, customerMenu, guestMenu } from "../data/data";

export const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  // Lấy đường dẫn hiện tại
  const currentPath = location.pathname;

  // Hàm kiểm tra prefix theo role
  const checkPathByRole = (role, path) => {
    const rolePrefix = `/${role}`;
    return path.startsWith(rolePrefix);
  };

  //get user
  //eslint-disable-next-line
  const getUser = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "http://localhost:8080/api/v1/user/getUserData",
        { token: localStorage.getItem("token") },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(setUser(res.data.data));
      } else {
        <Navigate to="/login" />;
        localStorage.clear();
      }
    } catch (error) {
      dispatch(hideLoading());
      localStorage.clear();
      console.log(error);
    }
  };

  useEffect(() => {
    if (!user) {
      getUser();
    }
  }, [user, getUser]);

  // Nếu chưa có token thì không cho vào
  if (!localStorage.getItem("token")) {
    return <Navigate to="/home" />;
  }

  // Nếu đã có user, kiểm tra role và quyền truy cập
  if (user) {
    // Xác định danh sách menu theo vai trò
    let allowedMenu = [];

    switch (user.role) {
      case "admin":
        allowedMenu = adminMenu;
        break;
      case "employee":
        allowedMenu = employeeMenu;
        break;
      case "customer":
        allowedMenu = customerMenu;
        break;
      default:
        allowedMenu = guestMenu;
    }

    // Lấy danh sách path từ menu
    const allowedPaths = allowedMenu.map((item) => item.path);

    // ✅ Bổ sung: nếu path bắt đầu bằng đúng role (vd: /admin, /customer, /employee) thì cho truy cập
    if (
      allowedPaths.includes(currentPath) ||
      checkPathByRole(user.role, currentPath)
    ) {
      return children;
    } else {
      return <Navigate to="/" />;
    }
  }

  // Trường hợp user chưa được load xong
  return null;
};
