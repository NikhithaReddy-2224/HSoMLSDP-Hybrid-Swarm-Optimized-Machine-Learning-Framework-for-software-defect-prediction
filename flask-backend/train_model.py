import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, StackingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# ==============================
# Configuration
# ==============================
DATASET_FOLDER = "dataset"  # Folder containing all NASA CSVs
MODEL_FOLDER = "models"      # Folder to save trained model

# Features available in your dataset
FEATURE_NAMES = [
    'loc', 'v(g)', 'ev(g)', 'lOCode', 'lOComment', 'lOBlank',
    'locCodeAndComment', 'uniq_Op', 'uniq_Opnd', 'total_Op', 'total_Opnd', 'branchCount'
]
TARGET = 'defects'

all_data = []

# ==============================
# Load and combine all datasets
# ==============================
for file_name in os.listdir(DATASET_FOLDER):
    if file_name.endswith(".csv"):
        path = os.path.join(DATASET_FOLDER, file_name)
        print(f"Loading {file_name}")
        df = pd.read_csv(path)

        # Check required columns
        missing = [f for f in FEATURE_NAMES + [TARGET] if f not in df.columns]
        if missing:
            print(f"⚠ Skipping {file_name}, missing columns: {missing}")
            continue

        all_data.append(df)

if not all_data:
    raise ValueError("No valid datasets found. Check column names in CSV files.")

# Combine all datasets
data = pd.concat(all_data, ignore_index=True)
print(f"✅ Total modules loaded: {len(data)}")

# ==============================
# Prepare features and target
# ==============================
X = data[FEATURE_NAMES]
y = data[TARGET]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ==============================
# Create stacking classifier
# ==============================
rf = RandomForestClassifier(n_estimators=100, random_state=42)
lr = LogisticRegression(max_iter=1000)

stacking_model = StackingClassifier(
    estimators=[('rf', rf), ('lr', lr)],
    final_estimator=LogisticRegression()
)

# Train model
stacking_model.fit(X_train, y_train)

# Evaluate model
y_pred = stacking_model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"✅ Accuracy on test set: {accuracy*100:.2f}%")

# ==============================
# Save trained model
# ==============================
os.makedirs(MODEL_FOLDER, exist_ok=True)
joblib.dump(stacking_model, os.path.join(MODEL_FOLDER, "stacking_model.pkl"))
print(f"✅ Model saved to {os.path.join(MODEL_FOLDER, 'stacking_model.pkl')}")
