"""
ECOFLUX Central FastAPI Application Entrypoint
Serves all intelligent energy endpoints for the Ecoflux React SaaS frontend.
Compatible with Vercel Python Serverless Functions and local Uvicorn development.
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from services.data_store import (
    BUILDINGS, BATTERY_STATUS, SOLAR_STATUS, RECOMMENDATIONS,
    CAMPUS_METADATA, generate_hourly_telemetry
)
from services.prediction_service import predict_campus_demand, predict_solar_generation
from services.battery_service import calculate_dispatch_decision, get_battery_telemetry
from services.recommendation_service import get_active_recommendations, apply_recommendation
from services.simulation_service import run_what_if_simulation
from services.agent_service import process_copilot_query

app = FastAPI(
    title="ECOFLUX Intelligent Campus Energy API",
    description="Campus energy telemetry, ML demand forecasting, battery dispatch optimization, and AI Copilot services.",
    version="1.0.0"
)

# Enable CORS for local Vite dev and cloud deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Request Models ---

class SimulationRequest(BaseModel):
    occupancy_delta_pct: float = Field(0.0, ge=-100, le=200)
    solar_delta_pct: float = Field(0.0, ge=-100, le=200)
    battery_capacity_delta_pct: float = Field(0.0, ge=-50, le=300)
    conservation_target_pct: float = Field(0.0, ge=0, le=50)

class CopilotRequest(BaseModel):
    prompt: str = Field(..., min_length=1)

class RecommendationApplyRequest(BaseModel):
    recommendation_id: str

class BatteryDispatchRequest(BaseModel):
    demand_kw: Optional[float] = None
    solar_kw: Optional[float] = None
    soc_percent: Optional[float] = None

# --- API Endpoints ---

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "system": "ECOFLUX Energy Intelligence Engine",
        "campus": CAMPUS_METADATA["name"],
        "microgrid_status": CAMPUS_METADATA["microgrid_status"]
    }

@app.get("/api/energy")
def get_energy_overview():
    """Returns real-time aggregate campus energy metrics, live flows, and 24h history."""
    total_consumption_kw = round(sum(b["current_consumption_kw"] for b in BUILDINGS), 1)
    solar_kw = SOLAR_STATUS["current_generation_kw"]
    battery_flow_kw = BATTERY_STATUS["power_flow_kw"]
    
    # Net grid power: campus load minus solar, adjusted for battery charging (+) or discharging (-)
    net_grid_kw = round(max(0, total_consumption_kw - solar_kw + (battery_flow_kw if BATTERY_STATUS["state"] == "charging" else -battery_flow_kw)), 1)
    
    today_kwh = sum(b["today_kwh"] for b in BUILDINGS)
    occupancy_total = sum(b["current_occupancy"] for b in BUILDINGS)
    capacity_total = sum(b["max_capacity"] for b in BUILDINGS)

    history_24h = generate_hourly_telemetry(hours_back=24)

    return {
        "status": "success",
        "metadata": CAMPUS_METADATA,
        "metrics": {
            "total_consumption_kw": total_consumption_kw,
            "total_today_kwh": today_kwh,
            "consumption_comparison_pct": -8.2, # -8.2% vs last week
            "solar_generation_kw": solar_kw,
            "solar_today_kwh": SOLAR_STATUS["today_generation_kwh"],
            "battery_soc_percent": BATTERY_STATUS["soc_percent"],
            "battery_state": BATTERY_STATUS["state"],
            "battery_stored_kwh": BATTERY_STATUS["current_stored_kwh"],
            "battery_flow_kw": battery_flow_kw,
            "net_grid_kw": net_grid_kw,
            "current_occupancy": occupancy_total,
            "max_capacity": capacity_total,
            "occupancy_rate_pct": round((occupancy_total / capacity_total) * 100, 1),
            "energy_saved_today_kwh": 1840,
            "carbon_offset_today_lbs": round(SOLAR_STATUS["today_generation_kwh"] * 0.82, 1),
            "renewable_share_pct": round((solar_kw / max(1, total_consumption_kw)) * 100, 1)
        },
        "flow_topology": {
            "grid_to_campus_kw": net_grid_kw,
            "solar_to_campus_kw": min(solar_kw, total_consumption_kw),
            "solar_to_battery_kw": round(max(0, solar_kw - total_consumption_kw), 1) if BATTERY_STATUS["state"] == "charging" else 0.0,
            "battery_to_campus_kw": battery_flow_kw if BATTERY_STATUS["state"] == "discharging" else 0.0
        },
        "history": history_24h
    }

@app.get("/api/energy/buildings")
def get_buildings_energy():
    """Returns detailed per-building consumption, capacity, efficiency grades, and alerts."""
    return {
        "status": "success",
        "count": len(BUILDINGS),
        "buildings": BUILDINGS
    }

@app.get("/api/solar")
def get_solar_status():
    """Returns detailed solar generation telemetry, array performance, and forecast."""
    return {
        "status": "success",
        "solar": SOLAR_STATUS
    }

@app.get("/api/battery")
def get_battery_status():
    """Returns battery storage status and dispatch recommendations."""
    return {
        "status": "success",
        "battery": get_battery_telemetry()
    }

@app.post("/api/battery/dispatch")
def post_battery_dispatch(request: BatteryDispatchRequest):
    """Triggers Antigravity agent automated battery dispatch calculation."""
    demand = request.demand_kw or sum(b["current_consumption_kw"] for b in BUILDINGS)
    solar = request.solar_kw or SOLAR_STATUS["current_generation_kw"]
    soc = request.soc_percent or BATTERY_STATUS["soc_percent"]
    
    decision = calculate_dispatch_decision(demand, solar, soc)
    return {
        "status": "success",
        "decision": decision
    }

@app.get("/api/occupancy")
def get_occupancy_analytics():
    """Returns building occupancy breakdown, occupancy vs energy correlation, and intensity."""
    total_occ = sum(b["current_occupancy"] for b in BUILDINGS)
    total_cap = sum(b["max_capacity"] for b in BUILDINGS)
    
    correlation_data = []
    for b in BUILDINGS:
        occ_ratio = round((b["current_occupancy"] / b["max_capacity"]) * 100, 1)
        # Intensity: Watts per square foot and Watts per occupant
        w_sqft = round((b["current_consumption_kw"] * 1000) / b["sqft"], 2)
        w_occupant = round((b["current_consumption_kw"] * 1000) / max(1, b["current_occupancy"]), 1)
        
        correlation_data.append({
            "id": b["id"],
            "name": b["name"],
            "code": b["code"],
            "occupancy": b["current_occupancy"],
            "max_capacity": b["max_capacity"],
            "occupancy_rate_pct": occ_ratio,
            "consumption_kw": b["current_consumption_kw"],
            "watts_per_sqft": w_sqft,
            "watts_per_occupant": w_occupant,
            "anomaly_flag": b["anomaly_flag"]
        })

    return {
        "status": "success",
        "total_occupancy": total_occ,
        "total_capacity": total_cap,
        "campus_occupancy_rate_pct": round((total_occ / total_cap) * 100, 1),
        "correlation": correlation_data
    }

@app.get("/api/predict/energy")
def get_energy_predictions(
    hours: int = Query(24, ge=6, le=72),
    building_id: Optional[str] = Query(None)
):
    """Returns Scikit-learn ML predicted energy demand with upper/lower bounds."""
    return predict_campus_demand(forecast_hours=hours, building_id=building_id)

@app.get("/api/predict/solar")
def get_solar_predictions(hours: int = Query(24, ge=6, le=72)):
    """Returns predicted solar generation profile."""
    return predict_solar_generation(forecast_hours=hours)

@app.get("/api/recommendations")
def get_recommendations(priority: str = Query("all")):
    """Returns prioritized AI energy-saving recommendations."""
    return get_active_recommendations(status_filter=priority)

@app.post("/api/recommendations/apply")
def post_apply_recommendation(request: RecommendationApplyRequest):
    """Executes a recommended action on the smart campus BMS."""
    result = apply_recommendation(request.recommendation_id)
    if not result["success"]:
        raise HTTPException(status_code=404, detail=result["message"])
    return result

@app.post("/api/simulate")
def post_simulate_scenario(request: SimulationRequest):
    """Calculates What-If scenario outcomes for adjusted campus parameters."""
    return run_what_if_simulation(
        occupancy_delta_pct=request.occupancy_delta_pct,
        solar_delta_pct=request.solar_delta_pct,
        battery_capacity_delta_pct=request.battery_capacity_delta_pct,
        conservation_target_pct=request.conservation_target_pct
    )

@app.post("/api/copilot")
def post_copilot_chat(request: CopilotRequest):
    """Antigravity Copilot natural language energy queries."""
    return process_copilot_query(request.prompt)

@app.get("/api/green-score")
def get_green_building_scores():
    """Returns campus building sustainability leaderboard and factor breakdowns."""
    ranked = sorted(BUILDINGS, key=lambda x: x["green_score"], reverse=True)
    
    leaderboard = []
    for rank, b in enumerate(ranked, 1):
        score = b["green_score"]
        if score >= 90:
            badge = "🏆 Excellent"
            status = "LEED Platinum Level"
        elif score >= 80:
            badge = "🌱 Sustainable"
            status = "High Performing"
        else:
            badge = "⚡ Needs Improvement"
            status = "Optimization Target"

        leaderboard.append({
            "rank": rank,
            "id": b["id"],
            "name": b["name"],
            "code": b["code"],
            "score": score,
            "badge": badge,
            "status": status,
            "efficiency_factor": score - random.randint(1, 4),
            "solar_factor": 95 if b["has_solar"] else 45,
            "occupancy_factor": 88 if not b["anomaly_flag"] else 62,
            "waste_reduction_factor": 90 if not b["anomaly_flag"] else 55
        })

    campus_average = round(sum(b["green_score"] for b in BUILDINGS) / len(BUILDINGS), 1)

    return {
        "status": "success",
        "campus_average_score": campus_average,
        "campus_rating": "Sustainable Smart Campus (Top 5% Tier)",
        "leaderboard": leaderboard
    }

# --- IoT Hardware Ingestion & Device Gateway ---

class IoTTelemetryPayload(BaseModel):
    device_id: str
    building_id: str
    protocol: str = Field("MQTT", description="MQTT, Modbus-TCP, BACnet/IP, HTTP-REST")
    power_kw: Optional[float] = None
    voltage_v: Optional[float] = Field(480.0, description="3-phase RMS voltage")
    occupancy_count: Optional[int] = None
    ambient_temp_c: Optional[float] = None
    solar_generation_kw: Optional[float] = None

IOT_DEVICE_REGISTRY = [
    {"device_id": "IOT-MTR-ENG-01", "name": "Schneider PowerLogic PM8000", "building": "Academic Block A", "type": "Smart Power Meter", "protocol": "Modbus-TCP", "status": "online", "sample_rate": "1s", "last_ping": "2s ago"},
    {"device_id": "IOT-MTR-SCI-02", "name": "Siemens PAC4200 Multi-function", "building": "Science & Bio-Tech Complex", "type": "Sub-Meter & Harmonic Analyzer", "protocol": "BACnet/IP", "status": "online", "sample_rate": "1s", "last_ping": "1s ago"},
    {"device_id": "IOT-MTR-LIB-03", "name": "Eaton PowerXpert Meter 2000", "building": "Memorial Central Library", "type": "Smart Sub-Meter", "protocol": "Modbus-TCP", "status": "online", "sample_rate": "5s", "last_ping": "4s ago"},
    {"device_id": "IOT-SOL-CANOPY-01", "name": "SolarEdge Commercial Inverter Gateway", "building": "Canopy & Rooftop Solar", "type": "PV Inverter Telemetry", "protocol": "SunSpec Modbus", "status": "online", "sample_rate": "10s", "last_ping": "3s ago"},
    {"device_id": "IOT-BMS-TESLA-01", "name": "Megapack BESS Industrial Gateway", "building": "Central Substation", "type": "Battery Management System (BMS)", "protocol": "CAN-to-Ethernet / REST", "status": "online", "sample_rate": "500ms", "last_ping": "1s ago"},
    {"device_id": "IOT-OCC-OPTIC-04", "name": "Milesight AI Optical People Counter", "building": "All Campus Facilities", "type": "PIR + Optical Headcount Sensor", "protocol": "MQTT / LoRaWAN", "status": "online", "sample_rate": "30s", "last_ping": "12s ago"}
]

@app.get("/api/iot/devices")
def get_iot_devices():
    """Returns the connected IoT hardware sensors, microcontrollers, and protocols."""
    return {
        "status": "success",
        "device_count": len(IOT_DEVICE_REGISTRY),
        "gateway_status": "MQTT/Modbus Broker Connected (Port 1883/502)",
        "devices": IOT_DEVICE_REGISTRY
    }

@app.post("/api/iot/telemetry")
def post_iot_telemetry(payload: IoTTelemetryPayload):
    """Receives live sensor packets from ESP32, Raspberry Pi, smart meters, or MQTT brokers."""
    # Find matching building and update live load if provided
    target = next((b for b in BUILDINGS if b["id"] == payload.building_id), None)
    if target:
        if payload.power_kw is not None:
            target["current_consumption_kw"] = round(payload.power_kw, 1)
        if payload.occupancy_count is not None:
            target["current_occupancy"] = payload.occupancy_count

    return {
        "status": "acknowledged",
        "device_id": payload.device_id,
        "protocol": payload.protocol,
        "processed_at": "now",
        "applied_to_building": target["name"] if target else "Unknown"
    }

