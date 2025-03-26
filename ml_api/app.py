from flask import Flask, jsonify
from flask_cors import CORS
from predict import train_model, predict_next_seven_days, evaluate_model

app = Flask(__name__)
CORS(app)  # Cho phép tất cả frontend truy cập API

@app.route("/predict/seven_days", methods=["GET"])
def predict_seven_days():
    print("🔄 Đang train lại model trước khi dự đoán...")
    train_model()  # ✅ Huấn luyện lại mô hình

    print("📊 Đang đánh giá mô hình...")
    
    # 🟢 Giải nén nếu evaluate_model trả về nhiều giá trị
    result = evaluate_model()
    mae = result if isinstance(result, (int, float)) else result[0]  

    print(f"✅ Model đã được train. MAE: {mae:.2f} VNĐ")

    predictions = predict_next_seven_days()  # 🔮 Dự đoán 7 ngày
    if predictions:
        # 📊 Tính doanh thu trung bình
        avg_revenue = sum(p["revenue"] for p in predictions) / len(predictions)

        # 📈 Tính tỷ lệ lỗi
        error_rate = (mae / avg_revenue) * 100 if avg_revenue != 0 else 0

        return jsonify({
            "mae": mae,
            "error_rate": round(error_rate, 2),
            "predictions": predictions
        })

    return jsonify({"error": "Không thể dự đoán doanh thu"}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5001)
