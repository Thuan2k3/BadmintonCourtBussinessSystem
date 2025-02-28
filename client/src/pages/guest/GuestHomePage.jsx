import { Button, Card, Col, Layout, Menu, Row, Tag } from "antd";
import { Link } from "react-router-dom";
import GuestLayout from "../../components/GuestLayout";

const { Header } = Layout;

const products = [
  { id: 1, name: "Vợt Cầu Lông", price: "500,000 VND" },
  { id: 2, name: "Giày Cầu Lông", price: "1,200,000 VND" },
  { id: 3, name: "Quả Cầu Lông", price: "100,000 VND" },
];

const courts = [
  { id: 1, name: "Sân 1", status: "Trống" },
  { id: 2, name: "Sân 2", status: "Đã đặt" },
  { id: 3, name: "Sân 3", status: "Trống" },
];

const GuestHomePage = () => {
  return (
    <GuestLayout>
      {/* Nội dung trang */}
      <div className="container mt-4">
        <h2 id="products">Sản Phẩm</h2>
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col xs={24} sm={12} md={8} key={product.id}>
              <Card title={product.name} bordered>
                <p>Giá: {product.price}</p>
              </Card>
            </Col>
          ))}
        </Row>

        <h2 id="courts" className="mt-4">
          Tình Trạng Sân
        </h2>
        <Row gutter={[16, 16]}>
          {courts.map((court) => (
            <Col xs={24} sm={12} md={8} key={court.id}>
              <Card title={court.name} bordered>
                <Tag color={court.status === "Trống" ? "green" : "red"}>
                  {court.status}
                </Tag>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </GuestLayout>
  );
};

export default GuestHomePage;
