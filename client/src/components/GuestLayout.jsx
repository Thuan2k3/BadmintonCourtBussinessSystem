import { Button, Layout, Menu, Dropdown } from "antd";
import { Link, useLocation } from "react-router-dom";
import { MenuOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

const { Header, Content } = Layout;

const GuestHomePage = ({ children }) => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
    switch (location.pathname) {
      case "/home":
        return "1";
      case "/product":
        return "2";
      case "/court-booking-status":
        return "3";
      default:
        return "1";
    }
  };

  // Menu cho chế độ mobile
  const mobileMenu = (
    <Menu selectedKeys={[getSelectedKey()]}>
      <Menu.Item key="1">
        <Link to="/home">🏠 Trang chủ</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/product">🛍️ Xem sản phẩm</Link>
      </Menu.Item>
      <Menu.Item key="3">
        <Link to="/court-booking-status">🏸 Tình trạng đặt sân</Link>
      </Menu.Item>
      <Menu.Item key="4">
        <Link to="/login">🔑 Đăng nhập</Link>
      </Menu.Item>
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
            <Menu.Item key="1" style={{ margin: "0 20px" }}>
              <Link
                to="/home"
                style={{
                  color: location.pathname === "/home" ? "#ffeb3b" : "#fff",
                  fontSize: "18px",
                  transition: "color 0.3s",
                  textDecoration: "none",
                }}
              >
                Trang chủ
              </Link>
            </Menu.Item>

            <Menu.Item key="2" style={{ margin: "0 20px" }}>
              <Link
                to="/product"
                style={{
                  color: location.pathname === "/product" ? "#ffeb3b" : "#fff",
                  fontSize: "18px",
                  transition: "color 0.3s",
                  textDecoration: "none",
                }}
              >
                Xem sản phẩm
              </Link>
            </Menu.Item>

            <Menu.Item key="3" style={{ margin: "0 20px" }}>
              <Link
                to="/court-booking-status"
                style={{
                  color:
                    location.pathname === "/court-booking-status"
                      ? "#ffeb3b"
                      : "#fff",
                  fontSize: "18px",
                  transition: "color 0.3s",
                  textDecoration: "none",
                }}
              >
                Tình trạng đặt sân
              </Link>
            </Menu.Item>
          </Menu>
        )}

        {/* Nút đăng nhập */}
        {!isMobile && (
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
        )}
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
