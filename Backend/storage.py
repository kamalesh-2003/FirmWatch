"""Thread-safe JSON file storage for dashboard data."""

import json
import threading
from pathlib import Path

DATA_FILE = Path(__file__).parent / "data.json"

_lock = threading.Lock()

_DEFAULT_DATA = {
    "summary": {
        "totalInvoices": 0,
        "highRiskAlerts": 0,
        "flaggedAmount": 0,
        "casesResolved": 0,
    },
    "alerts": [],
    "processed_email_ids": [],
}


def _recompute_summary(data: dict) -> dict:
    """Recompute summary counters from the alerts list."""
    alerts = data.get("alerts", [])
    data["summary"] = {
        "totalInvoices": len(alerts),
        "highRiskAlerts": sum(1 for a in alerts if a.get("riskLevel") == "HIGH"),
        "flaggedAmount": sum(
            a.get("amount", 0) or 0 for a in alerts if a.get("riskLevel") == "HIGH"
        ),
        "casesResolved": sum(1 for a in alerts if a.get("status") == "Resolved"),
    }
    return data


def load_data() -> dict:
    """Read data.json, returning defaults if missing."""
    with _lock:
        if not DATA_FILE.exists():
            return json.loads(json.dumps(_DEFAULT_DATA))
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)


def save_data(data: dict) -> None:
    """Recompute summary then write data.json atomically."""
    with _lock:
        _recompute_summary(data)
        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
