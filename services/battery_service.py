"""
ECOFLUX Battery Optimization Service
Calculates real-time battery dispatch strategy based on:
- Real-time campus load
- Solar PV generation
- Time-of-Use electricity tariffs
- State of Charge (SOC) bounds & battery health protection
"""

from datetime import datetime
from services.data_store import BATTERY_STATUS, SOLAR_STATUS, CAMPUS_METADATA

def get_battery_telemetry():
    """Returns current BESS status and calculated runtime."""
    return BATTERY_STATUS

def calculate_dispatch_decision(current_demand_kw: float, current_solar_kw: float, soc_percent: float):
    """
    Antigravity agent / logic to determine whether battery should charge,
    discharge, or hold in standby.
    """
    now = datetime.now()
    hour = now.hour
    
    net_demand_kw = current_demand_kw - current_solar_kw
    is_peak_tariff = (16 <= hour <= 20)
    is_off_peak = (hour <= 6 or hour >= 22)

    # 1. Solar Surplus condition -> CHARGE
    if current_solar_kw > current_demand_kw and soc_percent < 95.0:
        surplus_kw = current_solar_kw - current_demand_kw
        charge_power = min(surplus_kw, BATTERY_STATUS["max_charge_rate_kw"])
        return {
            "decision": "charge",
            "mode": "solar_absorption",
            "power_kw": round(charge_power, 1),
            "reason": f"Solar generation ({current_solar_kw} kW) exceeds campus demand ({current_demand_kw} kW). Absorbing clean surplus into battery storage.",
            "confidence": 0.94,
            "target_soc": 90.0,
            "cost_benefit": "Zero-cost renewable charging; prevents curtailment."
        }

    # 2. Peak Tariff Period -> DISCHARGE to shave expensive grid peak
    elif is_peak_tariff and soc_percent > 25.0:
        discharge_power = min(net_demand_kw, BATTERY_STATUS["max_discharge_rate_kw"])
        return {
            "decision": "discharge",
            "mode": "peak_shaving",
            "power_kw": round(discharge_power, 1),
            "reason": f"Active Peak Tariff window (28.6¢/kWh). Discharging battery at {discharge_power:.1f} kW to eliminate expensive utility grid demand charges.",
            "confidence": 0.96,
            "target_soc": 30.0,
            "cost_benefit": f"Saving approx ${(discharge_power * 0.286):.2f}/hour in avoided grid charges."
        }

    # 3. Off-peak grid charging if battery is critically low
    elif is_off_peak and soc_percent < 35.0:
        charge_power = 180.0
        return {
            "decision": "charge",
            "mode": "off_peak_grid_arbitrage",
            "power_kw": charge_power,
            "reason": f"Off-peak utility tariff window (8.5¢/kWh). Charging battery to maintain 50% baseline emergency reserve.",
            "confidence": 0.91,
            "target_soc": 60.0,
            "cost_benefit": "Economic arbitrage prior to morning classroom surge."
        }

    # 4. Standard operation -> STANDBY / PRESERVE
    else:
        return {
            "decision": "standby",
            "mode": "reserve_preservation",
            "power_kw": 0.0,
            "reason": f"Grid tariff is standard (14.2¢/kWh) and solar is balanced with demand. Preserving {soc_percent}% battery state-of-health for scheduled 16:00 peak dispatch.",
            "confidence": 0.88,
            "target_soc": soc_percent,
            "cost_benefit": "Minimizes cycle degradation while retaining peak buffer."
        }
