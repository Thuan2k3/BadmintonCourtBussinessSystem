from flask import Flask, jsonify
from flask_cors import CORS
from predict import predict_next_day, predict_next_week

app = Flask(__name__)
CORS(app)  # 🔥 Cho phép tất cả frontend truy cập API

@app.route("/predict/week", methods=["GET"])
def predict_week():
    predictions = predict_next_week()
    if predictions:
        return jsonify(predictions)
    return jsonify({"error": "Không thể dự đoán doanh thu"}), 400

if __name__ == "__main__":
    app.run(debug=True, port=5001)
