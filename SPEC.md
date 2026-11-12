# Project Specification: Fleet Logistics Fuel Optimization & Audit System (MVP)

## 1. System Overview & Existing Assets
We are building a full-stack web SaaS platform for a US trucking company (Fleet Logistics, Inc.) that:
1. Calculates optimal diesel refueling stops along a highway corridor using Dynamic Programming.
2. Audits driver fuel card transactions (WEX / EFS CSV statements) against nearby station prices to detect financial losses ("Missed Savings").
3. Dispatches formatted fuel plans to drivers via Telegram.

### Existing Verified Files in Root Directory
Do NOT rewrite the core math from scratch — integrate and adapt these existing files:
- `PrototypeApp.tsx` — Working single-file React + Tailwind UI prototype (contains layout, KPI cards, sawtooth fuel chart, and offline state logic).
- `optimizer_core.py` — Tested Python State-Space Dynamic Programming optimization engine.
- `stations_corridor_i80.json` — Seed dataset of 60 truck stops along the I-80 corridor (`id`, `brand`, `state`, `exit_name`, `mile_marker`, `lat`, `lon`, `detour_miles`, `retail_price`, `discount`, `effective_price`).
- `wex_statement_sample.csv` — Sample fuel card statement with 50 driver transactions (`transaction_id,timestamp,truck_unit,driver_name,station_id,station_name,mile_marker,gallons,actual_price_paid`).

---

## 2. Target Tech Stack & Directory Structure
- **Backend (`/backend`):** Python 3.11+, FastAPI, SQLAlchemy 2.0 (SQLite `Fleet_fuel.db` for local run, PostgreSQL-compatible), Pydantic v2, HTTPX, Python-Multipart.
- **Frontend (`/frontend`):** Vite, React 18, TypeScript, Tailwind CSS, React-Leaflet (OpenStreetMap), Lucide React.

Target folder structure:
Fleet-fuel-optimizer/
├── SPEC.md
├── stations_corridor_i80.json
├── wex_statement_sample.csv
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── seed.py
│   └── services/
│       ├── optimizer_core.py
│       ├── route_service.py
│       ├── audit_service.py
│       └── telegram_service.py
└── frontend/
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── api/client.ts
        └── components/
            ├── SidebarControls.tsx
            ├── RouteMap.tsx
            ├── FuelProfileChart.tsx
            ├── AuditDashboard.tsx
            └── DispatchModal.tsx

---

## 3. Database Schema (`models.py`)

### 3.1. `Truck`
- `id` (Integer, PK)
- `unit_number` (String, unique, e.g., `"TRK-104"`)
- `driver_name` (String)
- `tank_capacity_gal` (Float, default: `200.0`)
- `mpg` (Float, default: `6.8`)
- `min_reserve_gal` (Float, default: `30.0`)
- `current_fuel_gal` (Float, default: `85.0`)
- `current_lat` (Float)
- `current_lon` (Float)

### 3.2. `FuelStation`
- `id` (String/Integer, PK)
- `brand` (String: `"Pilot"`, `"Love's"`, `"TA"`, `"Petro"`, `"Sapp Bros"`)
- `name` (String)
- `state` (String)
- `exit_name` (String)
- `mile_marker` (Float — distance along corridor from start)
- `lat` (Float)
- `lon` (Float)
- `detour_miles` (Float — one-way off-highway distance)
- `retail_price` (Float)
- `discount` (Float)
- `effective_price` (Float — `retail_price - discount`)

### 3.3. `RoutePlan`
- `id` (Integer, PK)
- `truck_id` (Integer, FK -> `Truck.id`, nullable for custom slider runs)
- `origin_name` (String, default: `"Chicago, IL"`)
- `dest_name` (String, default: `"Salt Lake City, UT"`)
- `total_miles` (Float)
- `baseline_cost` (Float)
- `optimal_cost` (Float)
- `estimated_savings` (Float)
- `created_at` (DateTime)

### 3.4. `PlannedStop`
- `id` (Integer, PK)
- `route_plan_id` (Integer, FK -> `RoutePlan.id`)
- `station_id` (String/Integer, FK -> `FuelStation.id`)
- `stop_order` (Integer)
- `mile_marker` (Float)
- `detour_miles` (Float)
- `arrival_fuel_gal` (Float)
- `gallons_to_buy` (Float)
- `departure_fuel_gal` (Float)
- `effective_price` (Float)
- `total_stop_cost` (Float)

### 3.5. `FuelTransaction` (Audit Table)
- `id` (Integer, PK)
- `transaction_id` (String)
- `timestamp` (String)
- `truck_unit` (String)
- `driver_name` (String)
- `station_id` (String)
- `station_name` (String)
- `mile_marker` (Float)
- `gallons` (Float)
- `actual_price_paid` (Float)
- `optimal_station_id` (String, nullable)
- `optimal_station_name` (String, nullable)
- `optimal_effective_price` (Float)
- `missed_savings` (Float — `max(0, (actual_price_paid - optimal_effective_price) * gallons)`)
- `is_violation` (Boolean — `True` if `missed_savings > 5.0`)

---

## 4. Mathematical & Business Logic Rules
1. **Round-Trip Detour Fuel Burn:** Leaving the highway for a station at distance `d` (`detour_miles` one-way) burns extra fuel equal to:
   `detour_fuel_gal = (2.0 * d) / MPG`
2. **Safety & Capacity Constraints:** At every point along the route, fuel in tank `F` must strictly satisfy:
   `min_reserve_gal <= F <= tank_capacity_gal`
3. **Minimum Purchase Rule:** Do not schedule a refueling stop for less than `25.0` gallons unless strictly necessary to prevent dropping below reserve.
4. **Baseline Cost Calculation:** Compare the optimal plan against a baseline driver who buys fuel at the corridor's average `retail_price` whenever the tank approaches `min_reserve_gal`.
5. **Audit Radius Window:** When auditing a transaction at `tx.mile_marker`, search all `FuelStation` records where `abs(station.mile_marker - tx.mile_marker) <= 15.0` miles. Compare `tx.actual_price_paid` against the minimum `effective_price` in that window.

---

## 5. REST API Contract (`/api/...`)
Enable full CORS (`allow_origins=["*"]`) on FastAPI so the Vite frontend (`http://localhost:5173`) communicates seamlessly with `http://localhost:8000`.

- `GET /api/trucks` — Returns list of all seeded trucks.
- `GET /api/stations` — Returns all fuel stations along the corridor.
- `POST /api/routes/optimize`
  - **Request Body:** `{ "truck_id": 1, "current_fuel_gal": 85, "tank_capacity_gal": 200, "mpg": 6.8, "min_reserve_gal": 30 }`
  - **Response:** Full `RoutePlan` object including ordered `stops[]`, `fuel_profile[]` (mile-by-mile tank level points for the sawtooth chart), `baseline_cost`, `optimal_cost`, and `estimated_savings`.
- `POST /api/routes/{route_plan_id}/dispatch` — Generates driver message with Google Maps links (`[https://www.google.com/maps/search/?api=1&query=](https://www.google.com/maps/search/?api=1&query=){lat},{lon}`), sends via Telegram Bot API if `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` exist in environment, and returns `{ "sent_to_telegram": bool, "message_text": str }`.
- `GET /api/audit/summary` — Returns audited transactions list, `total_gallons`, `total_spend`, `total_missed_savings`, and `compliance_rate_pct`.
- `POST /api/audit/upload-csv` — Accepts multipart CSV file upload, runs the 15-mile audit comparison, updates records, and returns the updated audit summary.

---

## 6. Strict Coding Instructions for AI
- Write **complete, self-contained, runnable files**. Never leave `// TODO`, `# ... rest of code`, or truncated functions.
- Seed the SQLite database automatically inside FastAPI's `lifespan` startup event using `stations_corridor_i80.json` and `wex_statement_sample.csv` if the tables are empty.
- In the frontend API client (`client.ts`), implement an automatic fallback ("Offline Demo Mode") so if the FastAPI backend is not reachable, the frontend gracefully uses the embedded local data and JS optimizer from `PrototypeApp.tsx`.