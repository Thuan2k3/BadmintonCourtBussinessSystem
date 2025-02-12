import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu } from "../data/data";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";
import { customerMenu } from "../data/data";

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  //logout function
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout successfully");
    navigate("/login");
  };

  // =================Doctor Menu================
  const staffMenu = [
    {
      name: "Home",
      path: "/",
      icon: "fa-solid fa-house",
    },
    {
      name: "Quản lý sân",
      path: "/admin/doctors",
      icon: "fa-solid fa-user-doctor",
    },
    {
      name: "Xem tình trạng sân",
      path: "/admin/users",
      icon: "fa-solid fa-user",
    },
    {
      name: "Quản lý sản phẩm",
      path: "/staff/product",
      icon: "fa-brands fa-product-hunt",
    },
    {
      name: "Quản lý hóa đơn",
      path: "/profile",
      icon: "fa-solid fa-user",
    },
  ];
  // =================Doctor Menu================

  //rendering menu list
  const SidebarMenu = user?.isAdmin
    ? adminMenu
    : user?.isStaff
    ? staffMenu
    : customerMenu;
  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar">
            <div className="logo">
              <h6>DOC APP</h6>
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
              <div className="header-content" style={{ cursor: "pointer" }}>
                <Link to="/profile">{user?.name}</Link>
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
