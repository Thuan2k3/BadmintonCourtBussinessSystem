import { Button, message } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";

const CheckoutButton = ({
  getTotalAmountForCourt,
  selectedCourt,
  orderItemsCourt,
  setOrderItemsCourt,
  invoiceTime,
  setInvoiceTime,
  defaultCourt,
  setSelectedCourt,
}) => {
  const handleCheckout = () => {
    if (!orderItemsCourt || orderItemsCourt.length === 0) {
      message.warning("Không có hóa đơn nào để thanh toán!");
      return;
    }

    // Nếu sân đã check-in mà chưa check-out, cảnh báo trước
    if (selectedCourt && !selectedCourt.isEmpty) {
      message.warning(
        `Sân ${selectedCourt.name} vẫn đang được sử dụng! Vui lòng check-out trước khi thanh toán.`
      );
      return;
    }

    let updatedOrderItemsCourt;
    let updatedInvoiceTime = invoiceTime.filter(
      (item) => String(item._id) !== String(defaultCourt._id)
    );

    if (selectedCourt && selectedCourt._id !== defaultCourt._id) {
      updatedOrderItemsCourt = orderItemsCourt.filter(
        (item) => item.court?._id !== selectedCourt._id
      );

      updatedInvoiceTime = updatedInvoiceTime.filter(
        (item) => String(item.courtId) !== String(selectedCourt._id)
      );
    } else {
      updatedOrderItemsCourt = orderItemsCourt.filter(
        (item) => item.court?._id !== defaultCourt._id
      );

      updatedInvoiceTime = updatedInvoiceTime.filter(
        (item) => String(item.courtId) !== String(defaultCourt._id)
      );
    }

    setOrderItemsCourt(updatedOrderItemsCourt);
    setInvoiceTime(updatedInvoiceTime);
    setSelectedCourt(defaultCourt);

    // Lấy tổng tiền sau khi cập nhật danh sách hóa đơn
    const newTotal = getTotalAmountForCourt(updatedOrderItemsCourt);
    message.success(
      `Thanh toán thành công! Tổng tiền: ${newTotal.toLocaleString()} VND`
    );
  };

  return (
    <Button
      type="primary"
      icon={<DollarCircleOutlined />}
      onClick={handleCheckout}
    >
      Thanh toán
    </Button>
  );
};

export default CheckoutButton;
