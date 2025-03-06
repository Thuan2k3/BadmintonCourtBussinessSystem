from datetime import timedelta
import pandas as pd
import numpy as np
import pickle
import os
import pymongo
from sklearn.linear_model import LinearRegression

# Kết nối MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["badmintoncourtbussiness"]
collection = db["invoices"]

def get_invoice_data():
    invoices = list(collection.find({}, {"_id": 0, "totalAmount": 1, "createdAt": 1}))
    if not invoices:
        return pd.DataFrame(columns=['day', 'totalAmount'])
    
    df = pd.DataFrame(invoices)
    df['createdAt'] = pd.to_datetime(df['createdAt'])
    df['day'] = df['createdAt'].dt.date
    return df.groupby('day')['totalAmount'].sum().reset_index().copy()

# Load model
def load_model():
    if not os.path.exists("Model.pkl"):
        return None
    with open("Model.pkl", "rb") as file:
        return pickle.load(file)

def predict_revenue(days):
    model = load_model()
    if model is None:
        return None
    
    df = get_invoice_data()
    if df.empty:
        return None

    last_day = df['day'].max()
    first_day = df['day'].min()
    day_offset = (last_day - first_day).days

    future_days = np.array([[day_offset + i] for i in range(1, days + 1)])
    future_days_df = pd.DataFrame(future_days, columns=["day_number"])

    predicted_revenue = model.predict(future_days_df)

    results = []
    for i, revenue in enumerate(predicted_revenue):
        predicted_date = last_day + timedelta(days=i+1)
        results.append({"date": predicted_date.strftime("%Y-%m-%d"), "revenue": round(revenue, 2)})
    
    return results

def predict_next_day():
    predictions = predict_revenue(1)
    return predictions[0] if predictions else None

def predict_next_week():
    return predict_revenue(7)
