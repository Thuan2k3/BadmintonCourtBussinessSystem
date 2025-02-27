import { Button, message } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons";
import { ref, remove } from "firebase/database";
import { database } from "../firebaseConfig"; // Import Firebase Realtime Database

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
  const handleCheckoutBill = async () => {
    // Lấy tổng tiền sau khi cập nhật danh sách hóa đơn
    const newTotal = getTotalAmountForCourt(selectedCourt._id);
    if (!orderItemsCourt || newTotal <= 0) {
      message.warning("Không có hóa đơn nào để thanh toán!");
      return;
    }

    // Kiểm tra sân đã check-out chưa
    if (selectedCourt && !selectedCourt.isEmpty) {
      message.warning(
        `Sân ${selectedCourt.name} vẫn đang được sử dụng! Vui lòng check-out trước khi thanh toán.`
      );
      return;
    }

    let updatedOrderItemsCourt = orderItemsCourt.filter(
      (item) => item.court?._id !== (selectedCourt?._id || defaultCourt._id)
    );

    let updatedInvoiceTime = invoiceTime.filter(
      (item) =>
        String(item.courtId) !== String(selectedCourt?._id || defaultCourt._id)
    );

    setOrderItemsCourt(updatedOrderItemsCourt);
    setInvoiceTime(updatedInvoiceTime);
    setSelectedCourt(defaultCourt);
    try {
      // Xóa hóa đơn trên Firebase
      const courtId = selectedCourt?._id || "guest";
      const orderRef = ref(database, `orders/${courtId}`);
      await remove(orderRef);

      message.success(
        `Thanh toán thành công! Tổng tiền: ${newTotal.toLocaleString()} VND`
      );
    } catch (error) {
      console.error("Lỗi khi xóa hóa đơn từ Firebase:", error);
      message.error("Lỗi khi thanh toán! Vui lòng thử lại.");
    }
  };

  return (
    <Button
      type="primary"
      icon={<DollarCircleOutlined />}
      onClick={handleCheckoutBill}
    >
      Thanh toán
    </Button>
  );
};

export default CheckoutButton;
