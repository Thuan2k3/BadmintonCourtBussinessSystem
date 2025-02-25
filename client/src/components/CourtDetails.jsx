import { Button, Card, Typography } from "antd";

const { Text } = Typography;

const CourtDetails = ({ selectedCourt, onCheckIn, onCheckOut }) => {
  if (!selectedCourt || selectedCourt._id === "guest") return null;

  return (
    <Card className="mt-3" title="Thông Tin Sân">
      <Text strong>Sân: {selectedCourt.name}</Text> <br />
      <Text>
        Giá: {selectedCourt?.price ? selectedCourt.price.toLocaleString() : "0"}{" "}
        VND / giờ
      </Text>
      <br />
      <Button
        type="primary"
        onClick={onCheckIn}
        disabled={!selectedCourt.isEmpty}
      >
        Check-in
      </Button>
      <Button
        type="danger"
        className="ml-2"
        onClick={onCheckOut}
        disabled={selectedCourt.isEmpty}
      >
        Check-out
      </Button>
    </Card>
  );
};

export default CourtDetails;
