import { Button, Layout, Menu, Dropdown, message } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { customerMenu } from "../data/data";
import { guestMenu } from "../data/data";

const { Header, Content } = Layout;

const GuestHomePage = ({ children }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout successfully");
    navigate("/login");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  //rendering menu list
  const SidebarMenu = user?.role === "customer" ? customerMenu : guestMenu;

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Xác định menu item đang active
  const getSelectedKey = () => {
    const currentPath = location.pathname;
    const matchedItem = SidebarMenu.find((item) => item.path === currentPath);
    return matchedItem ? matchedItem.path : "/";
  };

  // Menu cho chế độ mobile
  const mobileMenu = (
    <Menu selectedKeys={[getSelectedKey()]}>
      {SidebarMenu.map((item) => (
        <Menu.Item key={item.path}>
          <Link to={item.path}>
            <i className={item.icon} style={{ marginRight: "8px" }}></i>
            {item.name}
          </Link>
        </Menu.Item>
      ))}
      {user ? (
        <Menu.Item key="logout" onClick={handleLogout}>
          <i
            className="fa-solid fa-sign-out-alt"
            style={{ marginRight: "8px" }}
          ></i>
          Đăng xuất
        </Menu.Item>
      ) : (
        <Menu.Item key="login">
          <Link to="/login">Đăng nhập</Link>
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <Layout>
      {/* Header với gradient đẹp và sticky */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          background: "linear-gradient(135deg, #002766, #1890ff)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Logo */}
        <h1 style={{ margin: 0 }}>
          <Link
            to="/home"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "28px",
              letterSpacing: "1.5px",
            }}
          >
            🏸 BADMINTON APP
          </Link>
        </h1>

        {/* Responsive: Menu cho mobile hoặc desktop */}
        {isMobile ? (
          <Dropdown overlay={mobileMenu} trigger={["click"]}>
            <Button
              icon={<MenuOutlined />}
              style={{
                border: "none",
                fontSize: "24px",
              }}
            />
          </Dropdown>
        ) : (
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[getSelectedKey()]}
            style={{
              flex: 1,
              justifyContent: "center",
              background: "transparent",
              borderBottom: "none",
            }}
          >
            {SidebarMenu.map((item) => (
              <Menu.Item key={item.path} style={{ margin: "0 20px" }}>
                <Link
                  to={item.path}
                  style={{
                    color: location.pathname === item.path ? "#ffeb3b" : "#fff",
                    fontSize: "18px",
                    transition: "color 0.3s",
                    textDecoration: "none",
                  }}
                >
                  <i className={item.icon} style={{ marginRight: "8px" }}></i>
                  {item.name}
                </Link>
              </Menu.Item>
            ))}
          </Menu>
        )}

        {/* Nút Đăng nhập / Đăng xuất */}
        {!isMobile &&
          (user ? (
            <>
              <div
                className="header-content d-flex flex-column align-items-end justify-content-center text-center"
                style={{ cursor: "pointer", height: "100%" }}
              >
                <p
                  className="fw-bold mb-0"
                  style={{ lineHeight: "1.2", color: "#FEFF9F" }}
                >
                  {user?.full_name}
                </p>
                <p
                  className="mb-0"
                  style={{
                    lineHeight: "1.2",
                    color: "#F8ED8C",
                    textTransform: "none",
                    fontSize: "15px",
                  }}
                >
                  {user?.role === "employee"
                    ? "Nhân viên"
                    : user?.role === "customer"
                    ? "Khách hàng"
                    : user?.role}
                </p>
              </div>
              <Button
                type="primary"
                size="large"
                shape="round"
                style={{
                  background: "#ff4d4f",
                  border: "none",
                  fontWeight: "bold",
                  boxShadow: "0 4px 10px rgba(255, 77, 79, 0.5)",
                  transition: "transform 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                onClick={handleLogout} // Hàm xử lý đăng xuất
              >
                Đăng xuất
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              size="large"
              shape="round"
              style={{
                background: "#ff4d4f",
                border: "none",
                fontWeight: "bold",
                boxShadow: "0 4px 10px rgba(255, 77, 79, 0.5)",
                transition: "transform 0.3s",
              }}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            >
              <Link
                to="/login"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                Đăng nhập
              </Link>
            </Button>
          ))}
      </Header>

      {/* Nội dung */}
      <Content
        style={{
          minHeight: "100vh",
          padding: "40px",
          background: "linear-gradient(180deg, #f0f2f5, #e6f7ff)",
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};

export default GuestHomePage;
