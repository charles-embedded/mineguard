import json
import random
import time
from datetime import datetime, timezone

import paho.mqtt.client as mqtt


# -----------------------------
# MQTT Configuration
# -----------------------------
MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC = "mine/worker/{worker_id}/data"


# -----------------------------
# Simulated Mine Workers
# -----------------------------
workers = [
    {
        "worker_id": "W001",
        "name": "Worker 01",
        "zone": "Zone A",
    },
    {
        "worker_id": "W002",
        "name": "Worker 02",
        "zone": "Zone B",
    },
    {
        "worker_id": "W003",
        "name": "Worker 03",
        "zone": "Zone C",
    },
    {
        "worker_id": "W004",
        "name": "Worker 04",
        "zone": "Zone D",
    },
    {
        "worker_id": "W005",
        "name": "Worker 05",
        "zone": "Zone E",
    },
    {
        "worker_id": "W006",
        "name": "Worker 06",
        "zone": "Zone F",
    },
]


def generate_telemetry(worker):
    """Generate realistic simulated worker sensor data."""

    return {
        "worker_id": worker["worker_id"],
        "name": worker["name"],
        "zone": worker["zone"],
        "heart_rate_bpm": random.randint(65, 105),
        "temperature_c": round(random.uniform(30.0, 37.5), 1),
        "gas_mq4_ppm": round(random.uniform(0.5, 8.0), 2),
        "gas_mq7_ppm": round(random.uniform(0.5, 6.0), 2),
        "battery_percent": random.randint(70, 100),
        "motion_detected": random.choice([True, True, True, False]),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


def on_connect(client, userdata, flags, reason_code, properties):
    if reason_code == 0:
        print("Connected to MQTT broker.")
    else:
        print(f"MQTT connection failed. Reason code: {reason_code}")


def on_disconnect(client, userdata, disconnect_flags, reason_code, properties):
    print("Disconnected from MQTT broker.")


def main():
    client = mqtt.Client(
        mqtt.CallbackAPIVersion.VERSION2,
        client_id="mineguard-worker-simulator",
    )

    client.on_connect = on_connect
    client.on_disconnect = on_disconnect

    print(f"Connecting to MQTT broker at {MQTT_BROKER}:{MQTT_PORT}...")

    client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
    client.loop_start()

    try:
        while True:
            for worker in workers:
                telemetry = generate_telemetry(worker)

                topic = MQTT_TOPIC.format(
                    worker_id=worker["worker_id"]
                )

                payload = json.dumps(telemetry)

                result = client.publish(
                    topic,
                    payload,
                    qos=1,
                )

                if result.rc == mqtt.MQTT_ERR_SUCCESS:
                    print(f"Published → {topic}")
                    print(payload)
                else:
                    print(f"Failed to publish → {topic}")

            print("-" * 60)

            # Send telemetry every 5 seconds
            time.sleep(5)

    except KeyboardInterrupt:
        print("\nStopping worker simulator...")

    finally:
        client.loop_stop()
        client.disconnect()
        print("MQTT simulator stopped.")


if __name__ == "__main__":
    main()