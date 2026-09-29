import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

import joblib
import pandas as pd


MODEL_PATH = Path(__file__).parent / "artifacts" / "wait_time_model.joblib"
model = joblib.load(MODEL_PATH)


class Handler(BaseHTTPRequestHandler):
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
            features = json.loads(self.rfile.read(length))
            predicted = float(model.predict(pd.DataFrame([features]))[0])
            self._send(200, {"predicted_wait_time_minutes": max(0, round(predicted))})
        except (ValueError, TypeError, KeyError, json.JSONDecodeError) as error:
            self._send(400, {"message": f"Invalid prediction input: {error}"})

    def log_message(self, format: str, *args: object) -> None:
        return


if __name__ == "__main__":
    port = int(os.getenv("ML_PORT", "18080"))
    print(f"MediQ ML service running on http://127.0.0.1:{port}")
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()