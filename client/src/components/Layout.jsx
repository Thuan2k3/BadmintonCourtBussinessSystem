import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu } from "../data/data";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Badge, message } from "antd";
import { customerMenu } from "../data/data";
import { employeeMenu } from "../data/data";
import { setUser } from "../redux/features/userSlice";
const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();

  //logout function
  const handleLogout = () => {
    localStorage.clear();
    dispatch(setUser(null));
    message.success("Đăng xuất thành công!");
  };

  //rendering menu list
  const SidebarMenu =
    user?.role === "admin"
      ? adminMenu
      : user?.role === "employee"
      ? employeeMenu
      : customerMenu;
  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo">
              <h6>BADMINTON WEB</h6>
              <hr />
            </div>
            <div className="menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <>
                    <div className={`menu-item ${isActive && "active"}`}>
                      <i className={menu.icon}></i>
                      <Link to={menu.path}>{menu.name}</Link>
                    </div>
                  </>
                );
              })}
              <div className={`menu-item`} onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <Link to="/login">Logout</Link>
              </div>
            </div>
          </div>
          <div className="content">
            <div className="header">
              <div
                className="header-content d-flex flex-column align-items-end justify-content-center text-center"
                style={{ cursor: "pointer", height: "100%" }}
              >
                <p className="fw-bold mb-0">{user?.full_name}</p>
                <p
                  className="text-secondary mb-0"
                  style={{
                    lineHeight: "1.2",
                    textTransform: "none",
                    fontSize: "15px",
                  }}
                >
                  {user?.role === "employee"
                    ? "Nhân viên"
                    : user?.role === "customer"
                    ? "Khách hàng"
                    : "Admin"}
                </p>
              </div>
            </div>
            <div className="body">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
