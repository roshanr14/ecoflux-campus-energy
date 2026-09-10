# ECOFLUX — Intelligent Campus Energy Management & AI Optimization Platform

> **Powering Smarter Campuses Through Intelligent Energy Decisions.**  
> *Monitor. Predict. Optimize. Build a sustainable campus.*

ECOFLUX is a production-quality enterprise SaaS platform designed for universities and smart campuses. It unifies electricity consumption, solar generation, battery intelligence, IoT occupancy telemetry, and machine-learning recommendations into a single, high-performance microgrid management platform.

---

## ⚡ Key Capabilities

1. **Interactive 3D Campus Microgrid Visualization**:
   - Canvas-based isometric rendering of campus buildings with live animated electrical flows, solar absorption particles, and interactive telemetry tooltips.
2. **Central Energy Flow Routing**:
   - Real-time power balance: Utility Grid ⇄ Campus Load ⇆ Solar Arrays ⇆ Battery Storage.
3. **Scikit-Learn ML Demand Forecasting**:
   - 24-hour and 7-day predictive demand regression models with upper/lower 95% confidence intervals and peak surge warnings.
4. **Dynamic Battery Dispatch Optimizer**:
   - Automated economic dispatch algorithm calculating when to store surplus rooftop solar and when to discharge BESS to avoid expensive utility peak demand tariffs (28.6¢/kWh).
5. **Occupancy vs. Energy Intensity Correlation**:
   - Headcount density analysis (Watts/person and Watts/sqft) flagging empty buildings operating at peak HVAC airflow.
6. **Interactive What-If Scenario Sandbox**:
   - Real-time sliders adjusting campus attendance, solar capacity, storage size, and conservation targets with instant recalculation from the Python backend.
7. **AI Energy Copilot**:
   - Conversational AI assistant with natural language understanding, prompt chips, and structured recommendation outputs.
8. **Green Building Sustainability Score**:
   - 100-point sustainability index and leaderboard aligning campus facilities with LEED Platinum benchmarks.

---

## 🛠️ Architecture & Tech Stack

```
ecoflux/
├── api/                          # FastAPI Central Backend
│   └── index.py                  # API routes & Vercel serverless entrypoint
├── services/                     # Python AI & Analytical Services
│   ├── data_store.py             # High-fidelity campus microgrid telemetry
│   ├── prediction_service.py     # Scikit-learn ML regression forecasting
│   ├── battery_service.py        # Dynamic BESS dispatch optimizer
│   ├── simulation_service.py     # What-If scenario calculation engine
│   ├── recommendation_service.py # Rule-based anomaly detection engine
│   └── agent_service.py          # Antigravity Copilot natural reasoning
├── src/                          # React + Vite Frontend
│   ├── components/
│   │   ├── canvas/               # 3D Campus & Energy Flow Canvas visualizers
│   │   ├── navigation/           # Collapsible Sidebar, TopNav, Navbar
│   │   └── ui/                   # MetricCard, Badges, Modals
│   ├── pages/                    # Landing, How It Works, Features, Auth, Onboarding, Dashboard
│   ├── context/                  # ThemeContext (Dark/Light), AuthContext (Supabase)
│   └── lib/                      # Unified API client & Supabase adapter
├── vercel.json                   # Single-repository unified Vercel deployment
├── requirements.txt              # Python dependencies
└── package.json                  # React dependencies
```

* **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Recharts, Canvas 5 graphics.
* **Backend**: Python 3.13, FastAPI, Uvicorn, Scikit-learn, Pandas, NumPy, Pydantic.
* **Database & Auth**: Supabase Auth + OAuth with offline demo fallback.
* **Deployment**: Single Vercel deployment (`vercel.json`) serving Vite frontend and FastAPI serverless functions under one domain.

---

## 🚀 Running Locally

### 1. Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 2. Start FastAPI Backend
```bash
py -m uvicorn api.index:app --host 127.0.0.1 --port 8000
```

### 3. Start Vite Frontend
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your web browser.

---

## 🌐 Deploying to Vercel (1-Click)

1. Push this project to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of ECOFLUX"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Click **Deploy**. Vercel will automatically build the React frontend and deploy the FastAPI backend serverless functions.
