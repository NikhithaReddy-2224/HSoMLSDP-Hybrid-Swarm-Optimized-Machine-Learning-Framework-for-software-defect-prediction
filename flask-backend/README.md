# HSoMLSDP Flask Backend

This is the Python Flask backend for the HSoMLSDP (Hybrid Swarm Optimized Machine Learning Framework for Software Defect Prediction) system.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Prepare Your Dataset

Place your dataset CSV files in the `datasets/` folder. The dataset should have:
- Software metric columns: `loc`, `cyclomatic_complexity`, `coupling`, `cohesion`, `inheritance_depth`, `halstead_volume`, `fan_in`, `fan_out`, `defect_density`
- Target column: `defect` (0 for non-defective, 1 for defective)

Example datasets: CM1, KC1, KC4, PC3, PC5

### 3. Train the Model

```bash
python model_trainer.py
```

This will:
- Load and preprocess the dataset
- Apply SMOTE for class balancing
- Train XGBoost, MLP, and Stacking models with hybrid swarm optimization
- Evaluate models on test set
- Save the best model to `models/stacking_model.pkl`
- Save results to `models/results.json`

### 4. Run the Flask Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## 📡 API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### Single Prediction
```
POST /predict
Content-Type: application/json

{
  "moduleId": "module_123",
  "features": {
    "loc": 100,
    "cyclomatic_complexity": 15,
    "coupling": 8,
    "cohesion": 0.75,
    "inheritance_depth": 2,
    "halstead_volume": 500,
    "fan_in": 5,
    "fan_out": 3,
    "defect_density": 0.02
  }
}
```

Response:
```json
{
  "moduleId": "module_123",
  "label": "Defective",
  "probability": 0.85,
  "limeFeatures": {
    "cyclomatic_complexity": 0.45,
    "coupling": 0.32,
    "loc": 0.18
  }
}
```

### Batch Prediction (CSV Upload)
```
POST /predict-batch
Content-Type: application/json

{
  "modules": [
    {
      "moduleId": "module_1",
      "features": { ... }
    },
    {
      "moduleId": "module_2",
      "features": { ... }
    }
  ]
}
```

Response:
```json
{
  "predictions": [
    {
      "moduleId": "module_1",
      "label": "Non-Defective",
      "probability": 0.23
    },
    {
      "moduleId": "module_2",
      "label": "Defective",
      "probability": 0.78
    }
  ]
}
```

## 🔧 Customization

### Implementing Full Swarm Optimization

The current `HybridSwarmOptimizer` in `model_trainer.py` uses simplified random search. To implement full LFGOABC or GFGOABC algorithms:

1. Research the specific algorithm (e.g., Levy Flight Golden Optimized Artificial Bee Colony)
2. Implement the swarm initialization, exploration, and exploitation phases
3. Replace the `optimize()` method in `HybridSwarmOptimizer` class

### Adding More Models

In `model_trainer.py`, add your model to the `train_models()` function:

```python
from sklearn.svm import SVC

svm_params = {
    'C': [0.1, 1, 10],
    'kernel': ['rbf', 'linear']
}
best_svm_params = optimizer.optimize(SVC, X_train, y_train, X_val, y_val, svm_params)
svm_model = SVC(**best_svm_params)
svm_model.fit(X_train, y_train)

models['svm'] = svm_model
```

## 🌐 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
heroku login
heroku create hsomlsdp-backend
git push heroku main
```

### Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect your GitHub repository
4. Railway will auto-detect Flask and deploy

### Deploy to Render

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect repository
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `python app.py`

## 🔒 Production Considerations

1. **Remove Debug Mode**: Set `debug=False` in `app.run()`
2. **Environment Variables**: Use environment variables for sensitive config
3. **CORS**: Restrict CORS to your frontend domain only
4. **Rate Limiting**: Add rate limiting using `flask-limiter`
5. **Authentication**: Add API key authentication for production
6. **Logging**: Implement proper logging instead of print statements
7. **Model Versioning**: Version your models and track performance

## 📊 Model Performance

After training, check `models/results.json` for:
- Accuracy
- Precision
- Recall
- F1-Score
- Confusion Matrix

## 🐛 Troubleshooting

**Model not loading?**
- Ensure you've run `model_trainer.py` first
- Check that `models/stacking_model.pkl` exists

**Low accuracy?**
- Try different datasets
- Increase swarm optimization iterations
- Adjust SMOTE parameters
- Add more features

**Memory errors?**
- Reduce dataset size
- Use batch processing
- Increase system RAM

## 📝 License

MIT License - feel free to modify and use for your projects.
