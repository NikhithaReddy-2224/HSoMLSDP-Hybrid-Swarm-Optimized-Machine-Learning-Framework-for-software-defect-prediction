import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier, StackingClassifier
from sklearn.tree import DecisionTreeClassifier
from xgboost import XGBClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from imblearn.over_sampling import SMOTE
import joblib
import os

class HybridSwarmOptimizer:
    """
    Simplified hybrid swarm optimizer for hyperparameter tuning.
    In production, implement LFGOABC or GFGOABC algorithms.
    """
    def __init__(self, n_iterations=10):
        self.n_iterations = n_iterations
    
    def optimize(self, model_class, X_train, y_train, X_val, y_val, param_space):
        """
        Find optimal hyperparameters using swarm optimization.
        This is a simplified version - implement full swarm logic for production.
        """
        best_score = 0
        best_params = None
        
        # Random search simulation (replace with actual swarm optimization)
        for i in range(self.n_iterations):
            # Sample random parameters
            params = {
                key: np.random.choice(values) 
                for key, values in param_space.items()
            }
            
            # Train model
            model = model_class(**params)
            model.fit(X_train, y_train)
            
            # Evaluate
            y_pred = model.predict(X_val)
            score = f1_score(y_val, y_pred)
            
            if score > best_score:
                best_score = score
                best_params = params
            
            print(f"Iteration {i+1}/{self.n_iterations}: F1={score:.4f}")
        
        print(f"\nBest F1 Score: {best_score:.4f}")
        print(f"Best Parameters: {best_params}")
        
        return best_params

def load_dataset(dataset_path):
    """Load and preprocess dataset."""
    df = pd.read_csv(dataset_path)
    
    # Separate features and target
    X = df.drop('defect', axis=1)  # Assuming 'defect' is the target column
    y = df['defect']
    
    # Label encoding if needed
    le = LabelEncoder()
    y = le.fit_transform(y)
    
    return X, y

def train_models(X_train, y_train, X_val, y_val):
    """Train multiple ML models with optimization."""
    
    print("=" * 50)
    print("Training XGBoost Model")
    print("=" * 50)
    
    # XGBoost optimization
    xgb_params = {
        'n_estimators': [50, 100, 200],
        'max_depth': [3, 5, 7],
        'learning_rate': [0.01, 0.1, 0.3]
    }
    optimizer = HybridSwarmOptimizer(n_iterations=5)
    best_xgb_params = optimizer.optimize(XGBClassifier, X_train, y_train, X_val, y_val, xgb_params)
    xgb_model = XGBClassifier(**best_xgb_params)
    xgb_model.fit(X_train, y_train)
    
    print("\n" + "=" * 50)
    print("Training MLP Model")
    print("=" * 50)
    
    # MLP optimization
    mlp_params = {
        'hidden_layer_sizes': [(50,), (100,), (50, 50)],
        'activation': ['relu', 'tanh'],
        'alpha': [0.0001, 0.001, 0.01]
    }
    best_mlp_params = optimizer.optimize(MLPClassifier, X_train, y_train, X_val, y_val, mlp_params)
    mlp_model = MLPClassifier(**best_mlp_params, max_iter=500)
    mlp_model.fit(X_train, y_train)
    
    print("\n" + "=" * 50)
    print("Training Stacking Classifier")
    print("=" * 50)
    
    # Stacking model
    base_models = [
        ('rf', RandomForestClassifier(n_estimators=100)),
        ('xgb', xgb_model),
        ('dt', DecisionTreeClassifier(max_depth=5))
    ]
    
    stacking_model = StackingClassifier(
        estimators=base_models,
        final_estimator=XGBClassifier(**best_xgb_params)
    )
    stacking_model.fit(X_train, y_train)
    
    return {
        'xgboost': xgb_model,
        'mlp': mlp_model,
        'stacking': stacking_model
    }

def evaluate_models(models, X_test, y_test):
    """Evaluate all models and print metrics."""
    results = {}
    
    for name, model in models.items():
        print(f"\n{'=' * 50}")
        print(f"Evaluating {name.upper()} Model")
        print('=' * 50)
        
        y_pred = model.predict(X_test)
        
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred)
        recall = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        cm = confusion_matrix(y_test, y_pred)
        
        results[name] = {
            'accuracy': accuracy,
            'precision': precision,
            'recall': recall,
            'f1_score': f1,
            'confusion_matrix': cm
        }
        
        print(f"Accuracy:  {accuracy:.4f}")
        print(f"Precision: {precision:.4f}")
        print(f"Recall:    {recall:.4f}")
        print(f"F1-Score:  {f1:.4f}")
        print(f"\nConfusion Matrix:")
        print(cm)
    
    return results

def main():
    """Main training pipeline."""
    
    # Load dataset (update path to your dataset)
    print("Loading dataset...")
    dataset_path = 'datasets/CM1.csv'  # Change to your dataset path
    X, y = load_dataset(dataset_path)
    
    print(f"Dataset loaded: {X.shape[0]} samples, {X.shape[1]} features")
    
    # Split data
    X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.3, random_state=42)
    X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)
    
    print(f"Train: {X_train.shape[0]}, Val: {X_val.shape[0]}, Test: {X_test.shape[0]}")
    
    # Apply SMOTE for class balance
    print("\nApplying SMOTE for class balancing...")
    smote = SMOTE(random_state=42)
    X_train_balanced, y_train_balanced = smote.fit_resample(X_train, y_train)
    print(f"After SMOTE: {X_train_balanced.shape[0]} samples")
    
    # Train models
    print("\n" + "=" * 50)
    print("STARTING MODEL TRAINING")
    print("=" * 50)
    models = train_models(X_train_balanced, y_train_balanced, X_val, y_val)
    
    # Evaluate models
    print("\n" + "=" * 50)
    print("EVALUATING MODELS ON TEST SET")
    print("=" * 50)
    results = evaluate_models(models, X_test, y_test)
    
    # Save best model (stacking)
    os.makedirs('models', exist_ok=True)
    joblib.dump(models['stacking'], 'models/stacking_model.pkl')
    print("\n✅ Stacking model saved to 'models/stacking_model.pkl'")
    
    # Save results
    import json
    with open('models/results.json', 'w') as f:
        # Convert numpy types to Python types for JSON serialization
        serializable_results = {
            name: {
                'accuracy': float(metrics['accuracy']),
                'precision': float(metrics['precision']),
                'recall': float(metrics['recall']),
                'f1_score': float(metrics['f1_score']),
                'confusion_matrix': metrics['confusion_matrix'].tolist()
            }
            for name, metrics in results.items()
        }
        json.dump(serializable_results, f, indent=2)
    print("✅ Results saved to 'models/results.json'")

if __name__ == '__main__':
    main()
