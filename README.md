# 🚛 Pava Fuel Optimizer & Audit (MVP)

**🔗 [Launch Interactive Live Demo](https://ТВОЄ_ПОСИЛАННЯ_З_VERCEL.vercel.app)**

An automated fleet fuel management, route cost optimization, and transaction auditing platform designed for US trucking logistics operations (I-80 / I-76 corridor prototype).

---

## 🎯 Project Status: Interactive Frontend Prototype & Core Logic

> **Note for Reviewers:** The currently deployed web application is a **functional MVP prototype** operating in client-side simulation mode to demonstrate the UI/UX, dynamic programming fuel optimization engine, and WEX/EFS transaction audit workflows. Full-stack backend integration is actively in progress (see Roadmap below).

### ✅ What is Currently Implemented & Testable:
* **Dynamic Programming (DP) Fuel Stop Optimizer:** Calculates optimal refueling stops along the 1,000-mile Chicago, IL → Denver, CO corridor based on net discounted prices (EFS/WEX card rebates + state IFTA tax arbitrage), tank capacity, MPG, safety fuel floor, and out-of-route detour penalties.
* **Interactive "Sawtooth" Fuel Trajectory:** Real-time SVG visualization of tank fuel levels, safety reserves, and exact gallon purchase recommendations per stop.
* **Fleet Unit Presets:** Instant switching between different truck configurations (Freightliner Cascadia, Volvo VNL, Kenworth T680, Peterbilt 579, International LT) with unique MPG and tank capacities.
* **Automated WEX/EFS Fuel Card Audit Engine:** Parses fuel card statements, cross-references transactions against nearby network stations within a 15-mile radius, flags non-network/overpriced purchases, and quantifies missed savings.
* **One-Click Driver Dispatch Generator:** Formats optimized fueling instructions with Google Maps links ready for Telegram/Viber dispatch.
* **Core Python Algorithm (`optimizer_core.py`):** Standalone dynamic programming solver and station dataset (`stations_corridor_i80.json`) ready for API binding.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Lucide Icons
* **Core Optimization & Data:** Python 3, Dynamic Programming (`optimizer_core.py`), JSON/CSV datasets
* **Planned Backend & Infrastructure:** FastAPI, SQLAlchemy, SQLite/PostgreSQL, Leaflet/OSRM Routing, Telegram Bot API

---

## 🗺️ Development Roadmap (Next Steps)

- [x] **Phase 1: Core Algorithm & Data Modeling** — DP fuel optimization logic (`optimizer_core.py`) and realistic I-80 corridor station/WEX datasets.
- [x] **Phase 2: Interactive Frontend MVP** — Real-time simulation dashboard, sawtooth fuel profile chart, and client-side CSV audit interface deployed on Vercel.
- [ ] **Phase 3: FastAPI Backend & Persistence (In Progress)** — Exposing `/api/optimize` and `/api/audit/upload` REST endpoints with SQLite/SQLAlchemy storage for historical trip and audit tracking.
- [ ] **Phase 4: Geospatial Routing & Live Maps** — Replacing schematic trajectory with interactive OpenStreetMap / Leaflet maps and real road geometry via OSRM API.
- [ ] **Phase 5: Automated Dispatch & ELD Integration** — Direct Telegram Bot API notifications to drivers and live fuel level telemetry ingestion (Samsara / Motive).

---

## 💻 Local Setup

To run the frontend prototype locally:

```bash
cd frontend
npm install
npm run dev
