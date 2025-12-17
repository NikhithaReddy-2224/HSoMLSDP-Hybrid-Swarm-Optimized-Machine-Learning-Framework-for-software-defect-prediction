from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from lime.lime_tabular import LimeTabularExplainer
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load trained model
MODEL_PATH = 'models/stacking_model.pkl'
FEATURE_NAMES = ['loc', 'cyclomatic_complexity', 'coupling', 'cohesion', 
                 'inheritance_depth', 'halstead_volume', 'fan_in', 'fan_out', 'defect_density']

# Load model at startup
model = None
explainer = None

def load_model():
    global model, explainer
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        # Initialize LIME explainer
        training_data = np.random.rand(100, 9)  # Placeholder - load actual training data
        explainer = LimeTabularExplainer(
            training_data,
            feature_names=FEATURE_NAMES,
            class_names=['Non-Defective', 'Defective'],
            mode='classification'
        )
        print("Model loaded successfully")
    else:
        print("Model not found. Please train the model first.")

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "model_loaded": model is not None})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        features = data.get('features', {})
        module_id = data.get('moduleId', 'unknown')
        
        # Extract features in correct order
        feature_values = [
            float(features.get('loc', 0)),
            float(features.get('cyclomatic_complexity', 0)),
            float(features.get('coupling', 0)),
            float(features.get('cohesion', 0)),
            float(features.get('inheritance_depth', 0)),
            float(features.get('halstead_volume', 0)),
            float(features.get('fan_in', 0)),
            float(features.get('fan_out', 0)),
            float(features.get('defect_density', 0))
        ]
        
        # Convert to numpy array
        X = np.array([feature_values])
        
        # Make prediction
        if model is None:
            return jsonify({"error": "Model not loaded"}), 500
            
        prediction = model.predict(X)[0]
        probability = model.predict_proba(X)[0]
        
        # Get LIME explanation
        lime_features = {}
        if explainer:
            explanation = explainer.explain_instance(
                X[0], 
                model.predict_proba,
                num_features=5
            )
            lime_features = {
                feature: float(weight) 
                for feature, weight in explanation.as_list()
            }
        
        # Prepare response
        response = {
            "moduleId": module_id,
            "label": "Defective" if prediction == 1 else "Non-Defective",
            "probability": float(probability[1]),  # Probability of being defective
            "limeFeatures": lime_features
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict-batch', methods=['POST'])
def predict_batch():
    try:
        data = request.json
        modules = data.get('modules', [])
        
        results = []
        for module in modules:
            features = module.get('features', {})
            module_id = module.get('moduleId', 'unknown')
            
            # Extract features
            feature_values = [
                float(features.get('loc', 0)),
                float(features.get('cyclomatic_complexity', 0)),
                float(features.get('coupling', 0)),
                float(features.get('cohesion', 0)),
                float(features.get('inheritance_depth', 0)),
                float(features.get('halstead_volume', 0)),
                float(features.get('fan_in', 0)),
                float(features.get('fan_out', 0)),
                float(features.get('defect_density', 0))
            ]
            
            X = np.array([feature_values])
            
            if model is None:
                return jsonify({"error": "Model not loaded"}), 500
            
            prediction = model.predict(X)[0]
            probability = model.predict_proba(X)[0]
            
            results.append({
                "moduleId": module_id,
                "label": "Defective" if prediction == 1 else "Non-Defective",
                "probability": float(probability[1])
            })
        
        return jsonify({"predictions": results})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    load_model()
    app.run(host='0.0.0.0', port=5000, debug=True)