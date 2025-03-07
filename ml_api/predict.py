from datetime import timedelta
import pandas as pd
import numpy as np
import pickle
import os
import pymongo
from sklearn.linear_model import LinearRegression

# Kết nối MongoDB
try:
    client = pymongo.MongoClient("mongodb://localhost:27017/", serverSelectionTimeoutMS=5000)
    db = client["badmintoncourtbussiness"]
    collection = db["invoices"]
except Exception as e:
    print(f"❌ Lỗi kết nối MongoDB: {e}")
    collection = None

def get_invoice_data():
    """Lấy dữ liệu hóa đơn từ MongoDB và xử lý"""
    if collection is None:
        return pd.DataFrame(columns=['day', 'totalAmount'])

    invoices = list(collection.find({}, {"_id": 0, "totalAmount": 1, "createdAt": 1}))
    if not invoices:
        print("⚠️ Không có hóa đơn nào trong cơ sở dữ liệu.")
        return pd.DataFrame(columns=['day', 'totalAmount'])

    df = pd.DataFrame(invoices)

    if df.empty or 'createdAt' not in df:
        return pd.DataFrame(columns=['day', 'totalAmount'])

    df['createdAt'] = pd.to_datetime(df['createdAt'], errors='coerce')  # Chuyển thành datetime
    df = df.dropna(subset=['createdAt'])  # Xóa giá trị NaT nếu có

    df['day'] = df['createdAt'].dt.date  # Lấy ngày (kiểu date)
    df = df.groupby('day')['totalAmount'].sum().reset_index()  # Tổng doanh thu theo ngày

    df['day'] = pd.to_datetime(df['day'])  # Chuyển thành datetime
    df['day_number'] = (df['day'] - df['day'].min()).dt.days  # Số ngày từ ngày đầu tiên
    df['weekday_number'] = df['day'].dt.weekday  # Thứ trong tuần (0-6): 0: thứ hai,..., 6: chủ nhật

    print("\n🔹 Dữ liệu hóa đơn từ MongoDB:")
    print(df)

    return df

# Hàm để train Model với dữ liệu mới
def train_model():
    """Train lại mô hình với dữ liệu mới"""
    df = get_invoice_data()
    if df.empty:
        print("⚠️ Không có dữ liệu hóa đơn để train mô hình!")
        return

    X = df[['day_number', 'weekday_number']]
    y = df['totalAmount']

    model = LinearRegression()
    model.fit(X, y)

    # Lưu model
    with open("Model.pkl", "wb") as file:
        pickle.dump(model, file)

    print("\n✅ Mô hình đã được train lại và lưu thành công!")

# Load model
def load_model():
    """Load mô hình từ file Model.pkl"""
    if not os.path.exists("Model.pkl"):
        print("⚠️ Model chưa được train! Vui lòng train trước khi dự đoán.")
        return None
    with open("Model.pkl", "rb") as file:
        return pickle.load(file)

def predict_revenue(days):
    """Dự đoán doanh thu trong N ngày tiếp theo"""
    model = load_model()
    if model is None:
        return None

    df = get_invoice_data()
    if df.empty:
        print("⚠️ Không có dữ liệu hóa đơn để dự đoán!")
        return None

    last_day = df['day'].max()
    
    # 🔧 Fix lỗi NaN khi không có dữ liệu
    if last_day is pd.NaT:
        print("⚠️ Không có dữ liệu hợp lệ để dự đoán!")
        return None

    day_number_max = df['day_number'].max()
    if pd.isna(day_number_max):
        print("⚠️ Lỗi: Không có giá trị 'day_number' hợp lệ.")
        return None

    future_days = np.array([
        [day_number_max + i, (last_day + timedelta(days=i)).weekday()]
        for i in range(1, days + 1)
    ])

    # ✅ Fix lỗi bằng cách tạo DataFrame có tên cột phù hợp
    future_days_df = pd.DataFrame(future_days, columns=["day_number", 'weekday_number'])

    try:
        # Đảm bảo đúng thứ tự cột trước khi dự đoán
        future_days_df = future_days_df[model.feature_names_in_]
        predicted_revenue = model.predict(future_days_df)
    except Exception as e:
        print(f"❌ Lỗi khi dự đoán: {e}")
        return None

    results = [
        {"date": (last_day + timedelta(days=i+1)).strftime("%Y-%m-%d"), "revenue": round(revenue)}
        for i, revenue in enumerate(predicted_revenue)
    ]

    print("\n🔹 Dự đoán doanh thu:")
    for r in results:
        print(f"Ngày: {r['date']} | Doanh thu dự đoán: {r['revenue']}")

    return results

def predict_next_seven_days():
    """Dự đoán doanh thu 7 ngày tiếp theo"""
    return predict_revenue(7)

# Kiểm tra bằng cách dự đoán 7 ngày tới
if __name__ == "__main__":
    predict_next_seven_days()
