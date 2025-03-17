import { Button, Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Header, Content } = Layout;

const GuestHomePage = ({ children }) => {
  const location = useLocation();

  // Xác định menu item nào đang active
  const getSelectedKey = () => {
    switch (location.pathname) {
      case "/home":
        return "1";
      case "/product":
        return "2";
      case "/court-booking-status":
        return "3";
      default:
        return "1"; // Mặc định active Trang chủ
    }
  };

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
        {/* Logo nổi bật hơn */}
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

        {/* Menu với trạng thái active */}
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

        {/* Nút đăng nhập đẹp hơn */}
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
          <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>
            Đăng nhập
          </Link>
        </Button>
      </Header>

      {/* Phần nội dung */}
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
