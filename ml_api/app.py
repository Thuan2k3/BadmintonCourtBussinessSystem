from flask import Flask, jsonify
from flask_cors import CORS
from predict import train_model, predict_next_seven_days  # 🔥 Import train_model

app = Flask(__name__)
CORS(app)  # Cho phép tất cả frontend truy cập API

@app.route("/predict/seven_days", methods=["GET"])
def predict_seven_days():
    print("🔄 Đang train lại model trước khi dự đoán...")
    train_model()  # Train lại model với dữ liệu mới
    print("✅ Model đã được train, bắt đầu dự đoán!")

    predictions = predict_next_seven_days()
    if predictions:
        return jsonify(predictions)
    return jsonify({"error": "Không thể dự đoán doanh thu"}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5001)
