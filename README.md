# Dự án Quản lý Sân Cầu Lông

Ứng dụng giúp quản lý hoạt động kinh doanh sân cầu lông: đặt sân, quản lý hóa đơn, bán sản phẩm tại chỗ, và **dự đoán doanh thu bằng mô hình học máy**. Dự án phát triển với **MERN Stack** (MongoDB, ExpressJS, ReactJS, NodeJS) và tích hợp **Python Flask** cho phần dự đoán.

---

## 🎯 Tính năng chính

- 📅 Đặt sân và xem tình trạng đặt sân theo thời gian thực  
- 💵 Quản lý hóa đơn và bán sản phẩm tại chỗ  
- 📈 Dự đoán doanh thu bằng mô hình học máy (Linear Regression)  
- 🧠 Tích hợp mô hình học máy dựa trên dữ liệu lịch sử  
- ✉️ Gửi mail thông báo khi đặt / hủy sân thành công  

---

## 🖼️ Giao diện demo

### Trang chủ
![Trang chủ](./assets/TrangChu.png)

### Xem tình trạng đặt sân
![Xem tình trạng đặt sân](./assets/XemTinhTrangDatSan.png)

### Quản lý hóa đơn
![Quản lý hóa đơn](./assets/QuanLyHoaDon.png)

### Dự đoán doanh thu
![Dự đoán doanh thu](./assets/DuDoanDoanhThu.png)

---

## Giao diện demo

![Trang chủ](./assets/TrangChu.png)
![Xem tình trạng đặt sân](./assets/XemTinhTrangDatSan.png)
![Quản lý hóa đơn](./assets/QuanLyHoaDon.png)
![Dự đoán doanh thu](./assets/DuDoanDoanhThu.png)

## Cài đặt

```bash
npm install
npm run dev
cd ml_api
python app.py
