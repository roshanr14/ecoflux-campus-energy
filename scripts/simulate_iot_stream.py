"""
ECOFLUX IoT Hardware Telemetry Streamer
Simulates physical IoT microcontrollers (e.g. ESP32, Raspberry Pi, Modbus Gateway)
streaming live smart-meter packets to the Ecoflux FastAPI endpoint.
Run this script to simulate live sensor fluctuations in the web dashboard!
"""

import time
import random
import urllib.request
import json

SERVER_URL = "http://127.0.0.1:8000/api/iot/telemetry"

IOT_NODES = [
    {"device_id": "IOT-MTR-ENG-01", "building_id": "bldg_eng_a", "base_kw": 485.0, "protocol": "Modbus-TCP"},
    {"device_id": "IOT-MTR-SCI-02", "building_id": "bldg_sci_labs", "base_kw": 740.0, "protocol": "BACnet/IP"},
    {"device_id": "IOT-MTR-LIB-03", "building_id": "bldg_cent_lib", "base_kw": 235.0, "protocol": "MQTT"},
    {"device_id": "IOT-OCC-OPTIC-04", "building_id": "bldg_sci_labs", "base_occ": 640, "protocol": "MQTT-LoRaWAN"}
]

def stream_iot():
    print("=" * 65)
    print("📡 ECOFLUX IoT Hardware Sensor Stream Initialized")
    print(f"Target Gateway: {SERVER_URL}")
    print("Transmitting Modbus-TCP, BACnet/IP, and MQTT sensor packets...")
    print("=" * 65)

    packet_id = 1
    while True:
        node = random.choice(IOT_NODES)
        payload = {
            "device_id": node["device_id"],
            "building_id": node["building_id"],
            "protocol": node["protocol"],
            "voltage_v": round(480.0 + random.uniform(-2.5, 2.5), 1)
        }

        if "base_kw" in node:
            payload["power_kw"] = round(node["base_kw"] + random.uniform(-15.0, 20.0), 1)
        if "base_occ" in node:
            payload["occupancy_count"] = int(node["base_occ"] + random.randint(-15, 20))

        try:
            req = urllib.request.Request(
                SERVER_URL,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=2) as res:
                status = json.loads(res.read().decode())
                print(f"[{time.strftime('%H:%M:%S')}] Packet #{packet_id:04d} ⚡ {node['device_id']} ({node['protocol']}) -> {payload.get('power_kw', payload.get('occupancy_count'))} -> ACK: {status['applied_to_building']}")
        except Exception as e:
            print(f"⚠️ Gateway unavailable: {e}. Ensure FastAPI is running on port 8000.")

        packet_id += 1
        time.sleep(2)

if __name__ == "__main__":
    stream_iot()
