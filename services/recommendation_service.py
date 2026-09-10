"""
ECOFLUX AI Recommendation Service
Generates continuous prioritized energy conservation measures
by analyzing real-time building telemetry, occupancy variance,
and weather conditions.
"""

from services.data_store import RECOMMENDATIONS, BUILDINGS

def get_active_recommendations(status_filter: str = "all"):
    """Returns active recommendations filtered by priority or status."""
    recs = RECOMMENDATIONS
    if status_filter != "all":
        recs = [r for r in recs if r["priority"] == status_filter]
    
    total_potential_kwh = sum(r["estimated_savings_kwh"] for r in recs if not r["applied"])
    total_potential_usd = sum(r["estimated_savings_usd"] for r in recs if not r["applied"])
    total_co2_kg = sum(r["co2_saved_kg"] for r in recs if not r["applied"])

    return {
        "count": len(recs),
        "total_potential_savings_kwh": total_potential_kwh,
        "total_potential_savings_usd": round(total_potential_usd, 2),
        "total_potential_co2_kg": total_co2_kg,
        "recommendations": recs
    }

def apply_recommendation(rec_id: str):
    """Simulates applying a recommendation and updating building telemetry."""
    for rec in RECOMMENDATIONS:
        if rec["id"] == rec_id:
            rec["applied"] = True
            # Find associated building and reduce current consumption
            for bldg in BUILDINGS:
                if bldg["id"] == rec["building_id"]:
                    bldg["current_consumption_kw"] = max(
                        bldg["base_load_kw"],
                        round(bldg["current_consumption_kw"] - (rec["estimated_savings_kwh"] / 10.0), 1)
                    )
                    bldg["anomaly_flag"] = False
            return {
                "success": True,
                "message": f"Successfully applied: '{rec['title']}'",
                "updated_recommendation": rec
            }
    return {"success": False, "message": "Recommendation ID not found"}
