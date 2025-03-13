import { Button, Card, Typography, Modal } from "antd";
import { useState } from "react";

const { Text } = Typography;

const CourtDetails = ({ selectedCourt, onCheckIn, onCheckOut }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null); // Xác định hành động (check-in/check-out)

  if (!selectedCourt || selectedCourt._id === "guest") return null;

  // Xử lý hiển thị Modal
  const showConfirmModal = (type) => {
    setActionType(type);
    setIsModalOpen(true);
  };

  // Xử lý khi xác nhận trong Modal
  const handleConfirm = () => {
    if (actionType === "checkIn") {
      onCheckIn(); // Gọi hàm Check-in
    } else if (actionType === "checkOut") {
      onCheckOut(); // Gọi hàm Check-out
    }
    setIsModalOpen(false); // Đóng Modal
  };

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
        onClick={() => showConfirmModal("checkIn")}
        disabled={!selectedCourt.isEmpty}
      >
        Check-in
      </Button>
      <Button
        type="danger"
        className="ml-2"
        onClick={() => showConfirmModal("checkOut")}
        disabled={selectedCourt.isEmpty}
      >
        Check-out
      </Button>
      {/* Modal xác nhận */}
      <Modal
        title="Xác nhận thao tác"
        open={isModalOpen}
        onOk={handleConfirm}
        onCancel={() => setIsModalOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>
          Bạn có chắc chắn muốn{" "}
          {actionType === "checkIn" ? "Check-in" : "Check-out"} cho sân{" "}
          <strong>{selectedCourt.name}</strong> không?
        </p>
      </Modal>
    </Card>
  );
};

export default CourtDetails;
