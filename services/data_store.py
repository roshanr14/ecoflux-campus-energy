"""
ECOFLUX Campus Energy Data Store
Comprehensive campus dataset representing a realistic university smart microgrid:
- 6 Key campus buildings with distinct occupancy & power profiles
- Solar generation arrays (Rooftop + Canopy arrays: 1,450 kWp total)
- Battery Energy Storage System (LiFePO4 1,200 kWh capacity)
- Smart sub-meters, IoT occupancy sensors, weather telemetry
"""

from datetime import datetime, timedelta
import math
import random

CAMPUS_METADATA = {
    "id": "campus_apex_univ",
    "name": "Apex University Smart Campus",
    "location": "North Campus District, Innovation Valley",
    "grid_tariff_cents_kwh": {
        "off_peak": 8.5,
        "standard": 14.2,
        "peak": 28.6
    },
    "microgrid_status": "grid_tied_optimal",
    "grid_frequency_hz": 60.02,
    "carbon_intensity_lbs_kwh": 0.82
}

BUILDINGS = [
    {
        "id": "bldg_eng_a",
        "name": "Academic Block A (Engineering)",
        "code": "ENG-A",
        "type": "Classrooms & Labs",
        "sqft": 145000,
        "max_capacity": 1800,
        "current_occupancy": 1240,
        "base_load_kw": 180,
        "peak_load_kw": 620,
        "current_consumption_kw": 485.4,
        "today_kwh": 6420,
        "efficiency_rating": "A-",
        "green_score": 88,
        "has_solar": True,
        "solar_capacity_kw": 380,
        "primary_loads": ["HVAC Chillers", "Robotics Labs", "Lecture Hall Lighting", "Server Closets"],
        "anomaly_flag": False
    },
    {
        "id": "bldg_sci_labs",
        "name": "Science & Bio-Tech Complex",
        "code": "SCI-BIO",
        "type": "High-Demand Research",
        "sqft": 198000,
        "max_capacity": 1200,
        "current_occupancy": 640,
        "base_load_kw": 320,
        "peak_load_kw": 880,
        "current_consumption_kw": 742.8,
        "today_kwh": 9180,
        "efficiency_rating": "B",
        "green_score": 76,
        "has_solar": True,
        "solar_capacity_kw": 420,
        "primary_loads": ["Cryogenic Freezers", "Fume Hoods", "Clean Rooms", "Centrifuges"],
        "anomaly_flag": True, # High energy relative to lower occupancy
        "anomaly_reason": "Clean room air handlers operating at 100% capacity during off-peak research hours"
    },
    {
        "id": "bldg_cent_lib",
        "name": "Memorial Central Library",
        "code": "LIB-01",
        "type": "Study & Media",
        "sqft": 112000,
        "max_capacity": 1500,
        "current_occupancy": 820,
        "base_load_kw": 90,
        "peak_load_kw": 340,
        "current_consumption_kw": 235.1,
        "today_kwh": 3140,
        "efficiency_rating": "A+",
        "green_score": 94,
        "has_solar": True,
        "solar_capacity_kw": 250,
        "primary_loads": ["Zoned LED Lighting", "Automated Louver Blinds", "Digital Archives", "Variable Air Volume"],
        "anomaly_flag": False
    },
    {
        "id": "bldg_res_quad",
        "name": "Evergreen Student Residences",
        "code": "RES-QUAD",
        "type": "Hostel & Living",
        "sqft": 240000,
        "max_capacity": 2200,
        "current_occupancy": 1420,
        "base_load_kw": 140,
        "peak_load_kw": 580,
        "current_consumption_kw": 390.6,
        "today_kwh": 4890,
        "efficiency_rating": "B+",
        "green_score": 82,
        "has_solar": False,
        "solar_capacity_kw": 0,
        "primary_loads": ["Heat Pump Water Heaters", "Common Rooms", "Laundry Facility", "Lighting"],
        "anomaly_flag": False
    },
    {
        "id": "bldg_inno_hub",
        "name": "NextGen Innovation Center & Admin",
        "code": "INNO-ADM",
        "type": "Offices & Data Center",
        "sqft": 88000,
        "max_capacity": 750,
        "current_occupancy": 480,
        "base_load_kw": 210,
        "peak_load_kw": 460,
        "current_consumption_kw": 312.0,
        "today_kwh": 3820,
        "efficiency_rating": "A",
        "green_score": 90,
        "has_solar": True,
        "solar_capacity_kw": 400,
        "primary_loads": ["Tier-2 Data Center", "Executive Suites", "VR Design Studio", "Direct Air Cooling"],
        "anomaly_flag": False
    },
    {
        "id": "bldg_athl_arena",
        "name": "Pioneer Arena & Auditorium",
        "code": "ATHL-AUD",
        "type": "Athletics & Events",
        "sqft": 165000,
        "max_capacity": 3500,
        "current_occupancy": 320,
        "base_load_kw": 70,
        "peak_load_kw": 720,
        "current_consumption_kw": 185.2,
        "today_kwh": 2240,
        "efficiency_rating": "B-",
        "green_score": 73,
        "has_solar": False,
        "solar_capacity_kw": 0,
        "primary_loads": ["High-Bay Arena Lighting", "Pool Heating Pumps", "Ventilation Blowers"],
        "anomaly_flag": False
    }
]

BATTERY_STATUS = {
    "system_name": "Tesla Megapack 2XL LiFePO4",
    "total_capacity_kwh": 1200,
    "current_stored_kwh": 936,
    "soc_percent": 78,
    "state": "charging",  # charging | discharging | standby
    "power_flow_kw": 142.5, # positive = charging, negative = discharging
    "health_percent": 98.4,
    "temperature_celsius": 23.8,
    "cycle_count": 412,
    "estimated_runtime_hours": 6.8,
    "recommended_action": "Charge from surplus solar (185 kW available) until 85% SOC prior to 17:00 peak tariff.",
    "efficiency_roundtrip": 93.5,
    "max_charge_rate_kw": 350,
    "max_discharge_rate_kw": 400
}

SOLAR_STATUS = {
    "total_installed_kwp": 1450,
    "current_generation_kw": 842.0,
    "today_generation_kwh": 4820,
    "efficiency_ratio": 94.2,
    "irradiance_w_m2": 785,
    "panel_temp_celsius": 38.2,
    "arrays": [
        {"name": "Engineering Rooftop Array", "kwp": 380, "current_kw": 224.2, "status": "optimal"},
        {"name": "Bio-Tech Research Solar Pergola", "kwp": 420, "current_kw": 251.0, "status": "optimal"},
        {"name": "Central Library Dual-Tilt Array", "kwp": 250, "current_kw": 148.5, "status": "optimal"},
        {"name": "Innovation Center Solar Canopy", "kwp": 400, "current_kw": 218.3, "status": "optimal"}
    ],
    "forecast_tomorrow_kwh": 6100,
    "weather_condition": "Partly Sunny, High UV index"
}

RECOMMENDATIONS = [
    {
        "id": "rec_01",
        "building_id": "bldg_sci_labs",
        "building_name": "Science & Bio-Tech Complex",
        "title": "Optimize Clean Room VAV Air Handler Flow",
        "category": "HVAC Optimization",
        "priority": "high",
        "reason": "Air handler operating at 100% despite occupancy being 53% below peak design capacity.",
        "action": "Engage dynamic setback to modulate ventilation fan speed by 22% during off-peak research hours.",
        "estimated_savings_kwh": 340,
        "estimated_savings_usd": 74.80,
        "co2_saved_kg": 126,
        "confidence": 0.94,
        "applied": False
    },
    {
        "id": "rec_02",
        "building_id": "bldg_res_quad",
        "building_name": "Evergreen Student Residences",
        "title": "Shift Heat-Pump Water Heating to Peak Solar Window",
        "category": "Load Shifting",
        "priority": "high",
        "reason": "Water heaters currently cycle during evening grid peak (28.6¢/kWh) instead of midday solar surplus.",
        "action": "Pre-heat central thermal buffer tanks between 12:00 and 15:00 using onsite solar generation.",
        "estimated_savings_kwh": 280,
        "estimated_savings_usd": 68.20,
        "co2_saved_kg": 104,
        "confidence": 0.91,
        "applied": False
    },
    {
        "id": "rec_03",
        "building_id": "bldg_athl_arena",
        "building_name": "Pioneer Arena & Auditorium",
        "title": "Dim Arena Perimeter High-Bay Lighting",
        "category": "Lighting Automation",
        "priority": "medium",
        "reason": "High natural daylighting through skylights (lux level > 850) renders high-bays redundant.",
        "action": "Apply automated 40% daylight harvesting dimming to perimeter fixture banks.",
        "estimated_savings_kwh": 145,
        "estimated_savings_usd": 20.60,
        "co2_saved_kg": 54,
        "confidence": 0.88,
        "applied": False
    },
    {
        "id": "rec_04",
        "building_id": "bldg_eng_a",
        "building_name": "Academic Block A (Engineering)",
        "title": "Pre-Cool Lecture Halls Prior to Peak Tariff",
        "category": "Thermal Pre-Cooling",
        "priority": "medium",
        "reason": "Grid tariffs spike at 16:00. Chillers can pre-cool thermal mass between 13:30 - 15:30.",
        "action": "Lower temperature setpoints by 1.5°C before peak window, then coast until 19:00.",
        "estimated_savings_kwh": 210,
        "estimated_savings_usd": 48.30,
        "co2_saved_kg": 78,
        "confidence": 0.89,
        "applied": True
    },
    {
        "id": "rec_05",
        "building_id": "bldg_cent_lib",
        "building_name": "Memorial Central Library",
        "title": "Activate Smart Plug Load Sleep Modes in 4th Floor Study Pods",
        "category": "Standby Elimination",
        "priority": "low",
        "reason": "Idle workstation monitors and charging stations drawing 14.2 kW baseline phantom load.",
        "action": "Deploy automated power-strip cut-off when study pod PIR motion sensors report empty > 20 mins.",
        "estimated_savings_kwh": 65,
        "estimated_savings_usd": 9.20,
        "co2_saved_kg": 24,
        "confidence": 0.96,
        "applied": False
    }
]

def generate_hourly_telemetry(hours_back=24):
    """
    Generates realistic 24-hour hourly history with campus demand,
    solar generation, battery state, and occupancy curves.
    """
    history = []
    now = datetime.now()
    base_time = now - timedelta(hours=hours_back)

    for i in range(hours_back + 1):
        t = base_time + timedelta(hours=i)
        hour = t.hour

        # Diurnal Solar curve (peaks around 13:00)
        if 6 <= hour <= 19:
            solar_pct = math.sin((hour - 6) / 13.0 * math.pi)
            solar_kw = round(solar_pct * 1250 * (0.85 + 0.15 * math.sin(i * 0.7)), 1)
        else:
            solar_kw = 0.0

        # Campus occupancy curve (peaks during 10:00 - 16:00)
        if 8 <= hour <= 18:
            occ_factor = math.sin((hour - 7) / 11.0 * math.pi)
            campus_occ = int(1200 + occ_factor * 2800 + random.randint(-80, 80))
        elif 19 <= hour <= 23:
            campus_occ = int(1400 - (hour - 19) * 250 + random.randint(-40, 40))
        else:
            campus_occ = int(350 + random.randint(-30, 30))

        # Campus Energy Consumption curve
        base_kw = 850
        occupancy_kw = (campus_occ / 4000.0) * 1150
        weather_cooling_kw = 350 * math.sin((hour / 24.0) * math.pi) if 11 <= hour <= 18 else 100
        total_demand_kw = round(base_kw + occupancy_kw + weather_cooling_kw + random.randint(-25, 25), 1)

        # Net grid power (Demand - Solar - Battery)
        net_grid_kw = round(max(0, total_demand_kw - solar_kw), 1)

        # Battery state
        if solar_kw > total_demand_kw * 0.7 and 10 <= hour <= 15:
            battery_mode = "charging"
            batt_kw = round(min(300, solar_kw - total_demand_kw * 0.5), 1)
        elif hour >= 16 and hour <= 20: # Peak tariff hours -> discharge
            battery_mode = "discharging"
            batt_kw = round(-220.0, 1)
        else:
            battery_mode = "standby"
            batt_kw = 0.0

        history.append({
            "timestamp": t.strftime("%Y-%m-%d %H:00"),
            "hour": hour,
            "hour_label": f"{hour:02d}:00",
            "demand_kw": total_demand_kw,
            "solar_kw": solar_kw,
            "net_grid_kw": net_grid_kw,
            "occupancy": campus_occ,
            "battery_kw": batt_kw,
            "battery_mode": battery_mode,
            "tariff_cents": 28.6 if 16 <= hour <= 20 else (8.5 if hour <= 6 or hour >= 22 else 14.2)
        })

    return history
