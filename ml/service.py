import json
import math
import os
import pickle
import sys
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import joblib
import pandas as pd


MODEL_PATH = Path(__file__).parent / "artifacts" / "wait_time_model.joblib"
FEATURES = (
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
)
NUMERIC_FEATURES = (
    "appointment_hour",
    "is_weekend",
    "patients_ahead",
    "queue_length",
    "current_token",
    "patient_token",
    "doctor_avg_consultation_time",
    "check_in_delay_minutes",
)
CATEGORICAL_FEATURES = (
    "doctor_id",
    "department",
    "appointment_date",
    "day_of_week",
    "appointment_type",
    "doctor_status",
)


def load_model():
    if not MODEL_PATH.is_file():
        raise RuntimeError(f"Model artifact not found: {MODEL_PATH}")

    try:
        return joblib.load(MODEL_PATH)
    except (
        OSError,
        EOFError,
        ValueError,
        ImportError,
        AttributeError,
        KeyError,
        IndexError,
        pickle.PickleError,
    ) as error:
        raise RuntimeError(f"Unable to load model artifact: {MODEL_PATH}") from error


class Handler(BaseHTTPRequestHandler):
    model = None

    def _send(self, status: int, payload: dict) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self) -> None:
        if self.path == "/health":
            self._send(200, {"status": "ok"})
            return
        self._send(404, {"message": "Not found"})

    def do_POST(self) -> None:
        if self.path != "/predict":
            self._send(404, {"message": "Not found"})
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            if length <= 0:
                raise ValueError

            features = json.loads(self.rfile.read(length))
            if not isinstance(features, dict) or any(
                feature not in features for feature in FEATURES
            ):
                raise ValueError
            if any(
                not isinstance(features[feature], str)
                for feature in CATEGORICAL_FEATURES
            ):
                raise ValueError
            if any(
                isinstance(features[feature], bool)
                or not isinstance(features[feature], (int, float))
                or not math.isfinite(float(features[feature]))
                for feature in NUMERIC_FEATURES
            ):
                raise ValueError

            try:
                predicted = float(self.model.predict(pd.DataFrame([features]))[0])
            except (AttributeError, IndexError, KeyError, TypeError, ValueError):
                self._send(500, {"message": "Prediction failed"})
                return

            if not math.isfinite(predicted):
                self._send(500, {"message": "Prediction failed"})
                return

            self._send(200, {"predicted_wait_time_minutes": max(0, round(predicted))})
        except (TypeError, ValueError, json.JSONDecodeError):
            self._send(400, {"message": "Invalid prediction input"})

    def log_message(self, format: str, *args: object) -> None:
        return


if __name__ == "__main__":
    try:
        Handler.model = load_model()
    except RuntimeError as error:
        print(f"MediQ ML service startup failed: {error}", file=sys.stderr)
        raise SystemExit(1)

    try:
        port = int(os.getenv("PORT", "18080"))
    except ValueError:
        print("MediQ ML service startup failed: PORT must be an integer", file=sys.stderr)
        raise SystemExit(1)

    print(f"MediQ ML service running on 0.0.0.0:{port}")
    ThreadingHTTPServer(("0.0.0.0", port), Handler).serve_forever()