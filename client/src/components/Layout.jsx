import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu } from "../data/data";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Badge, message } from "antd";
import { customerMenu } from "../data/data";
import { staffMenu } from "../data/data";
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
              <h6>BADMINTON APP</h6>
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
                <Link to="/profile">{user?.full_name}</Link>
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
