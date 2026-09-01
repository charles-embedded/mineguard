import sqlite3
from pathlib import Path


DATABASE_PATH = Path(__file__).parent / "mineguard.db"


def create_database():
    connection = sqlite3.connect(DATABASE_PATH)
    cursor = connection.cursor()

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS worker_telemetry (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            worker_id TEXT NOT NULL,
            name TEXT NOT NULL,
            zone TEXT NOT NULL,
            heart_rate_bpm INTEGER,
            temperature_c REAL,
            gas_mq4_ppm REAL,
            gas_mq7_ppm REAL,
            battery_percent INTEGER,
            motion_detected BOOLEAN,
            timestamp TEXT NOT NULL
        )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS safety_alerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            worker_id TEXT NOT NULL,
            name TEXT NOT NULL,
            zone TEXT NOT NULL,
            alert_type TEXT NOT NULL,
            severity TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            acknowledged BOOLEAN DEFAULT 0
        )
    """)

    connection.commit()
    connection.close()

    print(f"Database ready: {DATABASE_PATH}")


if __name__ == "__main__":
    create_database()