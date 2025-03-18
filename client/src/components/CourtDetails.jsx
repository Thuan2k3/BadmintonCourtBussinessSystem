import { Button, Card, Typography, Modal, message } from "antd";
import { useState } from "react";

const { Text } = Typography;

const CourtDetails = ({
  selectedCourt,
  orderItemsCourt,
  onCheckIn,
  onCheckOut,
  getTotalAmountForCourt,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionType, setActionType] = useState(null); // Xác định hành động (check-in/check-out)

  if (!selectedCourt || selectedCourt._id === "guest") return null;

  // Xử lý hiển thị Modal
  const showConfirmModal = (type) => {
    if (type === "checkIn") {
      if (!selectedCourt || selectedCourt._id === "guest") {
        message.warning("Vui lòng chọn sân trước khi check-in!");
        return;
      }

      if (getTotalAmountForCourt(selectedCourt._id) > 0) {
        message.warning(
          "Vui lòng thanh toán hóa đơn của sân trước khi check-in!"
        );
        return;
      }

      if (!selectedCourt?.isEmpty) {
        message.warning("Sân này đã có người!");
        return;
      }
    } else {
      if (!selectedCourt) {
        message.warning("Vui lòng chọn sân trước khi check-out!");
        return;
      }

      if (selectedCourt.isEmpty) {
        message.warning("Sân này chưa được check-in!");
        return;
      }

      const invoice = orderItemsCourt.find(
        (item) => item.court?._id === selectedCourt._id && item.courtInvoice
      );

      if (invoice) {
        message.warning("Vui lòng thanh toán hóa đơn trước khi check-out!");
        return;
      }

      const checkInTime = selectedCourt.checkInTime;

      if (!checkInTime) {
        message.error("Lỗi: Không tìm thấy thời gian check-in!");
        return;
      }
    }

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
