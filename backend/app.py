from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

# ✅ Initialize Flask app
app = Flask(__name__)
CORS(app)

# ✅ Load the trained XGBoost model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "xgboost_model.pkl")
model = joblib.load(MODEL_PATH)

# ✅ Extract feature names from the trained model
model_feature_names = model.get_booster().feature_names

# ✅ Define optimized threshold for XGBoost
BEST_THRESHOLD = 0.66  # 0.66

# ✅ Store last prediction for GET requests
last_prediction = {"churn_prediction": None, "churn_probability": None}

@app.route('/')
def home():
    return jsonify({"message": "Churn Prediction API is running!"})

@app.route('/predict', methods=['GET', 'POST'])
def predict():
    global last_prediction

    # ✅ Handle GET request → Return last stored prediction
    if request.method == 'GET':
        if last_prediction["churn_prediction"] is not None:
            return jsonify(last_prediction)
        return jsonify({"message": "No predictions yet. Please submit data first."}), 404

    # ✅ Handle POST request → Make new prediction
    try:
        # ✅ Receive input JSON data
        data = request.get_json()
        print("🔍 Received Data:", data)

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        # ✅ Convert to DataFrame
        input_data = pd.DataFrame([data])

        # ✅ Convert numeric columns
        numeric_cols = ["Monthly Charge", "Tenure in Months", "Avg Monthly GB Download", "Number of Referrals"]
        for col in numeric_cols:
            input_data[col] = pd.to_numeric(input_data[col], errors="coerce").fillna(0)

        # ✅ Convert categorical columns into numeric labels
        categorical_mapping = {
            "Contract": {"Month-to-Month": 0, "One Year": 1, "Two Year": 2},
            "Payment Method": {"Electronic Check": 0, "Mailed Check": 1, "Bank Transfer": 2, "Credit Card": 3},
            "Online Security": {"No": 0, "Yes": 1},
            "Premium Tech Support": {"No": 0, "Yes": 1}
        }

        for col, mapping in categorical_mapping.items():
            if col in input_data.columns:
                input_data[col] = input_data[col].map(mapping).fillna(0)

        # ✅ Reorder Columns to Match Model's Feature Order
        input_data = input_data.reindex(columns=model_feature_names, fill_value=0)

        # ✅ Debug Processed Data Before Prediction
        print("🚀 Processed Data Before Prediction:\n", input_data)

        # ✅ Make Prediction
        probabilities = model.predict_proba(input_data)[0]
        probability = probabilities[1] if len(probabilities) > 1 else 0.0

        # ✅ Apply Optimized Threshold
        prediction = 1 if probability >= BEST_THRESHOLD else 0

        # ✅ Store and Return Prediction Result
        result = {
            "churn_prediction": int(prediction),
            "churn_probability": round(probability * 100, 2)
        }
        last_prediction = result

        print("✅ API Response:", result)
        return jsonify(result)

    except Exception as e:
        print("❌ ERROR:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
