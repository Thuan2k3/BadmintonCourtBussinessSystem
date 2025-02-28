import { Button, Card, Col, Layout, Menu, Row, Tag } from "antd";
import { Link } from "react-router-dom";

const { Header } = Layout;

const GuestHomePage = ({children}) => {
  return (
    <Layout>
      <Header
        style={{ display: "flex", alignItems: "center", background: "#1890ff" }}
      >
        <h3 style={{ color: "#fff", marginRight: "20px" }}>
            <Link to='/home' style={{ color: "#fff", textDecoration: "none" }}>BADMINTON APP</Link>
        </h3>
        <Menu
          theme="blue"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          style={{ flex: 1 }}
        >
          <Menu.Item key="1">
            <Link
              to="/product"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Xem sản phẩm
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link
              to="/court-booking-status"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Xem tình trạng đặt sân
            </Link>
          </Menu.Item>
        </Menu>
        <Menu theme="blue">
          <Menu.Item key="3">
            <Button className="bg bg-primary">
              <Link
                to="/login"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Đăng nhập
              </Link>
            </Button>
          </Menu.Item>
        </Menu>
      </Header>

      <div>{children}</div>
    </Layout>
  );
};

export default GuestHomePage;
