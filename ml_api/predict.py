from datetime import date, timedelta
import pandas as pd
import numpy as np
import pickle
import os
import pymongo
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error

# Kết nối MongoDB
try:
    client = pymongo.MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
    db = client["badmintoncourtbussiness"]
    invoices_collection = db["invoices"]
    invoice_details_collection = db["invoicedetails"]
except Exception as e:
    print(f"❌ Lỗi kết nối MongoDB: {e}")
    invoices_collection = None
    invoice_details_collection = None

def get_data():
    """Lấy dữ liệu số lượt thuê sân và số sản phẩm bán ra từ MongoDB, xử lý ngày thiếu"""
    if invoices_collection is None or invoice_details_collection is None:
        print("⚠️ Không thể kết nối MongoDB!")
        return pd.DataFrame(columns=['day', 'court_rentals', 'products_sold', 'totalAmount'])

    # 🔹 Lấy thông tin hóa đơn (bao gồm checkInTime và checkOutTime)
    invoices = list(invoices_collection.find({}, {
        "_id": 1,
        "totalAmount": 1,
        "createdAt": 1,
        "checkInTime": 1,
        "checkOutTime": 1
    }))
    invoice_df = pd.DataFrame(invoices)

    if not invoice_df.empty and 'createdAt' in invoice_df:
        # Chuyển đổi kiểu datetime
        invoice_df['createdAt'] = pd.to_datetime(invoice_df['createdAt'], errors='coerce')
        invoice_df['checkInTime'] = pd.to_datetime(invoice_df['checkInTime'], errors='coerce')
        invoice_df['checkOutTime'] = pd.to_datetime(invoice_df['checkOutTime'], errors='coerce')
        
        # Loại bỏ bản ghi không hợp lệ
        invoice_df = invoice_df.dropna(subset=['createdAt'])
        invoice_df['day'] = invoice_df['createdAt'].dt.date

        # 📌 Xác định số lượt thuê sân (có cả checkInTime và checkOutTime)
        invoice_df['is_court_rental'] = invoice_df['checkInTime'].notnull() & invoice_df['checkOutTime'].notnull()

        # Tính số lượt thuê sân theo ngày
        court_rentals_df = invoice_df.groupby('day')['is_court_rental'].sum().reset_index()
        court_rentals_df.rename(columns={'is_court_rental': 'court_rentals'}, inplace=True)

        # Tính tổng tiền theo ngày
        total_amount_df = invoice_df.groupby('day')['totalAmount'].sum().reset_index()
    else:
        court_rentals_df = pd.DataFrame(columns=['day', 'court_rentals'])
        total_amount_df = pd.DataFrame(columns=['day', 'totalAmount'])

    # 🔹 Lấy số lượng sản phẩm bán ra từ invoiceDetails
    invoice_details = list(invoice_details_collection.find({}, {
        "_id": 0,
        "quantity": 1,
        "createdAt": 1
    }))
    details_df = pd.DataFrame(invoice_details)

    if not details_df.empty and 'createdAt' in details_df:
        details_df['createdAt'] = pd.to_datetime(details_df['createdAt'], errors='coerce')
        details_df = details_df.dropna(subset=['createdAt'])
        details_df['day'] = details_df['createdAt'].dt.date

        # Tính tổng số lượng sản phẩm bán ra theo ngày
        products_df = details_df.groupby('day')['quantity'].sum().reset_index()
        products_df.rename(columns={'quantity': 'products_sold'}, inplace=True)
    else:
        products_df = pd.DataFrame(columns=['day', 'products_sold'])

    # 🔹 Kết hợp tất cả dữ liệu
    df = pd.merge(total_amount_df, court_rentals_df, on='day', how='outer').fillna(0)
    df = pd.merge(df, products_df, on='day', how='outer').fillna(0)

    # 📌 Đảm bảo bao gồm tất cả các ngày (bao gồm ngày không có giao dịch)
    start_date = df['day'].min() if not df.empty else date.today()
    end_date = date.today() - timedelta(days=1)

    # Tạo danh sách ngày đầy đủ
    full_date_range = pd.date_range(start=start_date, end=end_date)
    df = df.set_index('day').reindex(full_date_range).fillna(0).reset_index()
    df.rename(columns={'index': 'day'}, inplace=True)

    # 📊 Tính các thông tin bổ sung
    df['day_number'] = (df['day'] - df['day'].min()).dt.days
    df['weekday_number'] = df['day'].dt.weekday

    print("\n🔹 Dữ liệu huấn luyện (đã sửa số lượt thuê sân và xử lý ngày thiếu):")
    print(df)

    return df

def train_model():
    """Huấn luyện mô hình dự đoán doanh thu dựa trên số lượt thuê sân và số sản phẩm bán ra"""
    df = get_data()
    if df.empty:
        print("⚠️ Không có dữ liệu để train mô hình!")
        return

    X = df[['court_rentals', 'products_sold', 'day_number', 'weekday_number']]
    y = df['totalAmount']

    model = LinearRegression()
    model.fit(X, y)

    # Lưu model
    with open("Model.pkl", "wb") as file:
        pickle.dump(model, file)

    print("\n✅ Mô hình đã được train lại và lưu thành công!")

def evaluate_model():
    """Đánh giá mô hình bằng MAE (Mean Absolute Error) và tỷ lệ lỗi %"""
    df = get_data()
    if df.empty:
        print("⚠️ Không có dữ liệu để đánh giá!")
        return None

    # 📊 Chia tập train (80%) và test (20%)
    train_size = int(0.8 * len(df))
    test_df = df[train_size:]

    # Load mô hình đã huấn luyện
    model = load_model()
    if model is None:
        print("⚠️ Model chưa được train!")
        return None

    # 🔹 Dự đoán trên tập test
    X_test = test_df[['court_rentals', 'products_sold', 'day_number', 'weekday_number']]
    y_test = test_df['totalAmount']
    y_pred = model.predict(X_test)

    # 🔢 Tính MAE (Sai số tuyệt đối trung bình)
    mae = mean_absolute_error(y_test, y_pred)

    # 📈 Tính tỷ lệ lỗi % (MAE / Trung bình doanh thu thật * 100)
    mean_actual = y_test.mean()
    mae_percentage = (mae / mean_actual) * 100 if mean_actual != 0 else 0

    print(f"📊 MAE (Sai số tuyệt đối trung bình): {mae:.2f} VNĐ")
    print(f"📈 Tỷ lệ lỗi MAE: {mae_percentage:.2f}%")

    return mae, mae_percentage

def load_model():
    """Load mô hình từ file Model.pkl"""
    if not os.path.exists("Model.pkl"):
        print("⚠️ Model chưa được train! Vui lòng train trước khi dự đoán.")
        return None
    with open("Model.pkl", "rb") as file:
        return pickle.load(file)

def predict_revenue(future_data):
    """Dự đoán doanh thu với dữ liệu tương lai"""
    model = load_model()
    if model is None:
        return None

    try:
        future_data_df = pd.DataFrame(future_data, columns=['court_rentals', 'products_sold', 'day_number', 'weekday_number'])
        predicted_revenue = model.predict(future_data_df)
    except Exception as e:
        print(f"❌ Lỗi khi dự đoán: {e}")
        return None

    return predicted_revenue

def predict_next_seven_days():
    """Dự đoán doanh thu 7 ngày tiếp theo dựa trên số lượt thuê sân và số sản phẩm bán ra"""
    df = get_data()
    if df.empty:
        return None

    last_day = df['day'].max()
    last_day_number = df['day_number'].max()

    # 🔹 Giả định trung bình số lượt thuê sân và số sản phẩm bán ra
    avg_rentals = df['court_rentals'].mean()
    avg_products_sold = df['products_sold'].mean()

    future_days = [
        [avg_rentals, avg_products_sold, last_day_number + i, (last_day + timedelta(days=i)).weekday()]
        for i in range(1, 8)
    ]

    predicted_revenue = predict_revenue(future_days)
    if predicted_revenue is None:
        return None

    results = [
        {"date": (last_day + timedelta(days=i)).strftime("%Y-%m-%d"), "revenue": round(revenue)}
        for i, revenue in enumerate(predicted_revenue, start=1)
    ]

    print("\n🔹 Dự đoán doanh thu:")
    for r in results:
        print(f"Ngày: {r['date']} | Doanh thu dự đoán: {r['revenue']}")

    return results

# Kiểm tra bằng cách dự đoán 7 ngày tới
if __name__ == "__main__":
    train_model()                  # Huấn luyện mô hình (nếu chưa có)
    mae, mae_percent = evaluate_model() # Đánh giá mô hình
    print(f"Tỷ lệ lỗi MAE: {mae:.2f} VNĐ ({mae_percent:.2f}%)")
    predict_next_seven_days()       # Dự đoán 7 ngày tiếp theo
