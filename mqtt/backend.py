import json
import sqlite3

import paho.mqtt.client as mqtt


MQTT_BROKER = "localhost"
MQTT_PORT = 1883
MQTT_TOPIC = "mine/worker/+/data"

DATABASE_PATH = "database/mineguard.db"


def save_telemetry(data):
    connection = sqlite3.connect(DATABASE_PATH)
    cursor = connection.cursor()

    cursor.execute("""
        INSERT INTO worker_telemetry (
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
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        data["worker_id"],
        data["name"],
        data["zone"],
        data["heart_rate_bpm"],
        data["temperature_c"],
        data["gas_mq4_ppm"],
        data["gas_mq7_ppm"],
        data["battery_percent"],
        data["motion_detected"],
        data["timestamp"],
    ))

    connection.commit()
    connection.close()


def on_connect(client, userdata, flags, reason_code, properties):
    if reason_code == 0:
        print("Connected to MQTT broker.")
        client.subscribe(MQTT_TOPIC, qos=1)
        print(f"Subscribed to: {MQTT_TOPIC}")
    else:
        print(f"MQTT connection failed. Reason code: {reason_code}")


def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload.decode())

        save_telemetry(data)

        print(
            f"Saved → {data['worker_id']} | "
            f"{data['zone']} | "
            f"HR: {data['heart_rate_bpm']} bpm | "
            f"Battery: {data['battery_percent']}%"
        )

    except json.JSONDecodeError:
        print("Received invalid JSON data.")

    except KeyError as error:
        print(f"Missing telemetry field: {error}")

    except sqlite3.Error as error:
        print(f"Database error: {error}")


def on_disconnect(client, userdata, disconnect_flags, reason_code, properties):
    print("Disconnected from MQTT broker.")


def main():
    client = mqtt.Client(
        mqtt.CallbackAPIVersion.VERSION2,
        client_id="mineguard-backend",
    )

    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect

    print(f"Connecting to MQTT broker at {MQTT_BROKER}:{MQTT_PORT}...")

    client.connect(
        MQTT_BROKER,
        MQTT_PORT,
        keepalive=60,
    )

    client.loop_forever()


if __name__ == "__main__":
    main()