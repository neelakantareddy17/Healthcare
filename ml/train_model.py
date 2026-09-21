import argparse
import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder


FEATURES = [
    "doctor_id",
    "department",
    "appointment_date",
    "appointment_hour",
    "day_of_week",
    "is_weekend",
    "appointment_type",
    "patients_ahead",
    "queue_length",
    "current_token",
    "patient_token",
    "doctor_status",
    "doctor_avg_consultation_time",
    "check_in_delay_minutes",
]
TARGET = "actual_wait_time_minutes"
CATEGORICAL_FEATURES = [
    "doctor_id",
    "department",
    "appointment_date",
    "day_of_week",
    "appointment_type",
    "doctor_status",
]
NUMERIC_FEATURES = [feature for feature in FEATURES if feature not in CATEGORICAL_FEATURES]


def train(data_path: Path, model_dir: Path) -> dict[str, float]:
    data = pd.read_csv(data_path)
    x = data[FEATURES].copy()
    y = data[TARGET]

    for column in CATEGORICAL_FEATURES:
        x[column] = x[column].astype(str)

    x_train, x_test, y_train, y_test = train_test_split(
        x, y, test_size=0.2, random_state=42
    )

    preprocess = ColumnTransformer(
        transformers=[
            ("categorical", OneHotEncoder(handle_unknown="ignore"), CATEGORICAL_FEATURES),
            ("numeric", "passthrough", NUMERIC_FEATURES),
        ]
    )
    model = Pipeline(
        steps=[
            ("preprocess", preprocess),
            (
                "regressor",
                RandomForestRegressor(
                    n_estimators=120,
                    min_samples_leaf=2,
                    random_state=42,
                    n_jobs=-1,
                ),
            ),
        ]
    )
    model.fit(x_train, y_train)
    predictions = model.predict(x_test)
    metrics = {
        "mae": float(mean_absolute_error(y_test, predictions)),
        "rmse": float(mean_squared_error(y_test, predictions) ** 0.5),
        "r2": float(r2_score(y_test, predictions)),
    }

    model_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, model_dir / "wait_time_model.joblib")
    (model_dir / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    return metrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train the MediQ wait-time model")
    parser.add_argument(
        "--data",
        type=Path,
        default=Path(__file__).resolve().parents[2] / "mediq_wait_time_dataset.csv",
    )
    parser.add_argument("--model-dir", type=Path, default=Path(__file__).parent / "artifacts")
    args = parser.parse_args()

    result = train(args.data, args.model_dir)
    print(f"MAE: {result['mae']:.3f}")
    print(f"RMSE: {result['rmse']:.3f}")
    print(f"R2: {result['r2']:.3f}")