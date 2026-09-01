def evaluate_telemetry(data):
    alerts = []

    worker_id = data["worker_id"]
    name = data["name"]
    zone = data["zone"]

    heart_rate = data["heart_rate_bpm"]
    temperature = data["temperature_c"]
    mq4 = data["gas_mq4_ppm"]
    mq7 = data["gas_mq7_ppm"]
    battery = data["battery_percent"]
    motion = data["motion_detected"]

    # Heart-rate warning
    if heart_rate >= 110:
        alerts.append({
            "worker_id": worker_id,
            "name": name,
            "zone": zone,
            "type": "HEART_RATE_HIGH",
            "severity": "HIGH",
            "message": f"{name} has unusually high heart rate: {heart_rate} bpm"
        })

    # Temperature warning
    if temperature >= 37.5:
        alerts.append({
            "worker_id": worker_id,
            "name": name,
            "zone": zone,
            "type": "TEMPERATURE_HIGH",
            "severity": "MEDIUM",
            "message": f"{name} temperature reading is high: {temperature} °C"
        })

    # MQ4 gas warning
    if mq4 >= 7.0:
        alerts.append({
            "worker_id": worker_id,
            "name": name,
            "zone": zone,
            "type": "MQ4_GAS_HIGH",
            "severity": "CRITICAL",
            "message": f"High MQ4 gas reading in {zone}: {mq4} ppm"
        })

    # MQ7 gas warning
    if mq7 >= 5.0:
        alerts.append({
            "worker_id": worker_id,
            "name": name,
            "zone": zone,
            "type": "MQ7_GAS_HIGH",
            "severity": "CRITICAL",
            "message": f"High MQ7 gas reading in {zone}: {mq7} ppm"
        })

    # Battery warning
    if battery <= 20:
        alerts.append({
            "worker_id": worker_id,
            "name": name,
            "zone": zone,
            "type": "LOW_BATTERY",
            "severity": "LOW",
            "message": f"{name} device battery is low: {battery}%"
        })

    # Motion warning
    if not motion:
        alerts.append({
            "worker_id": worker_id,
            "name": name,
            "zone": zone,
            "type": "NO_MOTION",
            "severity": "HIGH",
            "message": f"No motion detected from {name} in {zone}"
        })

    return alerts