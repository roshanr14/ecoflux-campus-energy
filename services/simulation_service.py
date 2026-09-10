"""
ECOFLUX What-If Simulation Service
Simulates campus-wide energy, financial, and environmental impacts
when administrators adjust occupancy, solar capacity, battery size,
and conservation targets.
"""

from services.data_store import BUILDINGS, SOLAR_STATUS, BATTERY_STATUS, CAMPUS_METADATA

def run_what_if_simulation(
    occupancy_delta_pct: float = 0.0,
    solar_delta_pct: float = 0.0,
    battery_capacity_delta_pct: float = 0.0,
    conservation_target_pct: float = 0.0
):
    """
    Computes baseline vs scenario metrics:
    - Base campus consumption: ~2,351 kW / ~24,580 kWh daily
    - Base solar generation: ~842 kW / ~4,820 kWh daily
    - Base grid cost at blended tariff ~15.5¢/kWh
    """
    # 1. Baseline calculations
    base_daily_consumption_kwh = 24580.0
    base_daily_solar_kwh = 4820.0
    base_blended_tariff = 0.155
    base_daily_cost = (base_daily_consumption_kwh - min(base_daily_solar_kwh, base_daily_consumption_kwh)) * base_blended_tariff

    # 2. Scenario adjustments
    # Occupancy impact: each +10% occupancy increases campus HVAC & plug load by ~3.8%
    occ_multiplier = 1.0 + (occupancy_delta_pct / 100.0) * 0.38
    
    # Conservation target directly reduces consumption
    conservation_multiplier = 1.0 - (conservation_target_pct / 100.0)
    
    simulated_daily_consumption_kwh = round(base_daily_consumption_kwh * occ_multiplier * conservation_multiplier, 1)

    # Solar adjustment
    solar_multiplier = max(0.0, 1.0 + (solar_delta_pct / 100.0))
    simulated_daily_solar_kwh = round(base_daily_solar_kwh * solar_multiplier, 1)

    # Battery adjustment: expands capacity for arbitrage & peak shaving
    base_batt_cap = BATTERY_STATUS["total_capacity_kwh"]
    simulated_batt_cap = round(base_batt_cap * (1.0 + battery_capacity_delta_pct / 100.0), 1)
    peak_shaved_kwh = min(simulated_batt_cap * 0.75, simulated_daily_consumption_kwh * 0.25)

    # Renewable utilization share
    net_grid_consumption_kwh = max(0.0, simulated_daily_consumption_kwh - simulated_daily_solar_kwh - (peak_shaved_kwh * 0.15))
    renewable_share_pct = round(min(100.0, (simulated_daily_solar_kwh / max(1.0, simulated_daily_consumption_kwh)) * 100.0), 1)

    # Financial impact
    simulated_daily_cost = round((net_grid_consumption_kwh * base_blended_tariff), 2)
    daily_cost_delta = round(simulated_daily_cost - base_daily_cost, 2)
    annual_cost_savings = round(-daily_cost_delta * 365.0, 2)

    # Carbon impact (0.82 lbs CO2 / kWh)
    carbon_delta_lbs = round((simulated_daily_consumption_kwh - base_daily_consumption_kwh) * 0.82, 1)

    # Dynamic Green Score change
    green_score_delta = round(
        (renewable_share_pct - 19.6) * 0.5 + 
        (conservation_target_pct * 0.6) - 
        (occupancy_delta_pct * 0.15), 1
    )

    return {
        "status": "success",
        "inputs": {
            "occupancy_delta_pct": occupancy_delta_pct,
            "solar_delta_pct": solar_delta_pct,
            "battery_capacity_delta_pct": battery_capacity_delta_pct,
            "conservation_target_pct": conservation_target_pct
        },
        "baseline": {
            "daily_consumption_kwh": base_daily_consumption_kwh,
            "daily_solar_kwh": base_daily_solar_kwh,
            "daily_cost_usd": round(base_daily_cost, 2),
            "renewable_share_pct": 19.6,
            "green_score_avg": 84.5
        },
        "simulated": {
            "daily_consumption_kwh": simulated_daily_consumption_kwh,
            "daily_solar_kwh": simulated_daily_solar_kwh,
            "daily_cost_usd": simulated_daily_cost,
            "daily_cost_delta_usd": daily_cost_delta,
            "annual_cost_savings_usd": annual_cost_savings,
            "renewable_share_pct": renewable_share_pct,
            "battery_capacity_kwh": simulated_batt_cap,
            "carbon_delta_lbs": carbon_delta_lbs,
            "green_score_projected": round(min(100.0, max(40.0, 84.5 + green_score_delta)), 1)
        },
        "insights": [
            f"Achieves {renewable_share_pct}% renewable self-sufficiency for Apex University campus.",
            f"{'Saves' if annual_cost_savings >= 0 else 'Adds'} approx ${abs(annual_cost_savings):,.0f} annually in campus utility expenses.",
            f"Battery capacity of {simulated_batt_cap:,.0f} kWh provides {round(simulated_batt_cap/380, 1)} hours of critical lab backup runtime."
        ]
    }
