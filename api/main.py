from pathlib import Path
import os
import sqlite3

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


DATABASE_PATH = Path(__file__).parent.parent / "database" / "mineguard.db"

app = FastAPI(title="MineGuard API")


# Frontend URL for CORS
FRONTEND_ORIGIN = os.getenv(
    "FRONTEND_ORIGIN",
    "http://localhost:5173"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


@app.get("/")
def root():
    return {
        "system": "MineGuard",
        "status": "online"
    }


@app.get("/api/workers")
def get_workers():
    connection = get_connection()

    rows = connection.execute("""
        SELECT
            worker_id,
            name,
            zone,
            heart_rate_bpm,
            temperature_c,
            gas_mq4_ppm,
            gas_mq7_ppm,
            battery_percent,
            motion_detected,
            timestamp
        FROM worker_telemetry
        WHERE id IN (
            SELECT MAX(id)
            FROM worker_telemetry
            GROUP BY worker_id
        )
        ORDER BY worker_id
    """).fetchall()

    connection.close()

    return [dict(row) for row in rows]


@app.get("/api/alerts")
def get_alerts():
    connection = get_connection()

    rows = connection.execute("""
        SELECT
            id,
            worker_id,
            name,
            zone,
            alert_type,
            severity,
            message,
            timestamp,
            acknowledged
        FROM safety_alerts
        ORDER BY id DESC
        LIMIT 50
    """).fetchall()

    connection.close()

    return [dict(row) for row in rows]


@app.get("/api/stats")
def get_stats():
    connection = get_connection()

    worker_count = connection.execute("""
        SELECT COUNT(DISTINCT worker_id)
        FROM worker_telemetry
    """).fetchone()[0]

    telemetry_count = connection.execute("""
        SELECT COUNT(*)
        FROM worker_telemetry
    """).fetchone()[0]

    alert_count = connection.execute("""
        SELECT COUNT(*)
        FROM safety_alerts
    """).fetchone()[0]

    connection.close()

    return {
        "workers": worker_count,
        "telemetry_records": telemetry_count,
        "alerts": alert_count
    }