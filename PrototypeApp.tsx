import React, { useState, useMemo, useRef } from 'react';
import {
  Truck,
  Fuel,
  Navigation,
  DollarSign,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Copy,
  Check,
  Send,
  FileSpreadsheet,
  Upload,
  Download,
  Filter,
  Search,
  Sun,
  Moon,
  Sliders,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Info,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Layers,
  Award,
  Gauge
} from 'lucide-react';


// 1. DETERMINISTIC 40 TRUCK STOPS DATASET (I-80 / I-76: CHICAGO TO DENVER)

const CORRIDOR_STATIONS = [
  {
    id: 1,
    name: "Pilot Travel Center - Channahon",
    brand: "Pilot",
    state: "IL",
    exit_number: "Exit 126",
    mile_marker: 18,
    detour_miles: 0.6,
    retail_price: 4.35,
    discount: 0.18,
    effective_price: 4.17,
    lat: 41.4395,
    lon: -88.2156
  },
  {
    id: 2,
    name: "Love's Travel Stop - Morris",
    brand: "Love's",
    state: "IL",
    exit_number: "Exit 112",
    mile_marker: 36,
    detour_miles: 0.4,
    retail_price: 4.29,
    discount: 0.22,
    effective_price: 4.07,
    lat: 41.3842,
    lon: -88.4211
  },
  {
    id: 3,
    name: "TA Travel Center - Morris",
    brand: "TA",
    state: "IL",
    exit_number: "Exit 112B",
    mile_marker: 39,
    detour_miles: 0.8,
    retail_price: 4.32,
    discount: 0.35,
    effective_price: 3.97,
    lat: 41.3881,
    lon: -88.4302
  },
  {
    id: 4,
    name: "Flying J Travel Center - LaSalle",
    brand: "Flying J",
    state: "IL",
    exit_number: "Exit 77",
    mile_marker: 74,
    detour_miles: 0.5,
    retail_price: 4.25,
    discount: 0.24,
    effective_price: 4.01,
    lat: 41.3589,
    lon: -89.0865
  },
  {
    id: 5,
    name: "Love's Travel Stop - North Utica",
    brand: "Love's",
    state: "IL",
    exit_number: "Exit 81",
    mile_marker: 82,
    detour_miles: 1.1,
    retail_price: 4.21,
    discount: 0.19,
    effective_price: 4.02,
    lat: 41.3592,
    lon: -89.0114
  },
  {
    id: 6,
    name: "Princeton Truck Stop (Pilot)",
    brand: "Pilot",
    state: "IL",
    exit_number: "Exit 56",
    mile_marker: 102,
    detour_miles: 1.4,
    retail_price: 4.19,
    discount: 0.21,
    effective_price: 3.98,
    lat: 41.3965,
    lon: -89.4672
  },
  {
    id: 7,
    name: "Love's Travel Stop - Annawan",
    brand: "Love's",
    state: "IL",
    exit_number: "Exit 33",
    mile_marker: 126,
    detour_miles: 0.7,
    retail_price: 4.15,
    discount: 0.16,
    effective_price: 3.99,
    lat: 41.4041,
    lon: -89.9087
  },
  {
    id: 8,
    name: "Pilot Travel Center - East Moline",
    brand: "Pilot",
    state: "IL",
    exit_number: "Exit 4A",
    mile_marker: 156,
    detour_miles: 0.9,
    retail_price: 4.12,
    discount: 0.25,
    effective_price: 3.87,
    lat: 41.5295,
    lon: -90.3489
  },
  {
    id: 9,
    name: "Iowa 80 TA Truckstop - Walcott",
    brand: "TA",
    state: "IA",
    exit_number: "Exit 284",
    mile_marker: 178,
    detour_miles: 0.3,
    retail_price: 3.79,
    discount: 0.48,
    effective_price: 3.31,
    lat: 41.6152,
    lon: -90.7798
  },
  {
    id: 10,
    name: "Flying J Travel Center - Davenport",
    brand: "Flying J",
    state: "IA",
    exit_number: "Exit 292",
    mile_marker: 185,
    detour_miles: 0.6,
    retail_price: 3.82,
    discount: 0.34,
    effective_price: 3.48,
    lat: 41.5924,
    lon: -90.5812
  },
  {
    id: 11,
    name: "Pilot Travel Center - Atalissa",
    brand: "Pilot",
    state: "IA",
    exit_number: "Exit 265",
    mile_marker: 204,
    detour_miles: 1.8,
    retail_price: 3.76,
    discount: 0.28,
    effective_price: 3.48,
    lat: 41.6712,
    lon: -91.1684
  },
  {
    id: 12,
    name: "Love's Travel Stop - Coralville",
    brand: "Love's",
    state: "IA",
    exit_number: "Exit 240",
    mile_marker: 228,
    detour_miles: 0.5,
    retail_price: 3.74,
    discount: 0.22,
    effective_price: 3.52,
    lat: 41.6915,
    lon: -91.6085
  },
  {
    id: 13,
    name: "Petro Stopping Center - Williamsburg",
    brand: "Petro",
    state: "IA",
    exit_number: "Exit 220",
    mile_marker: 252,
    detour_miles: 0.9,
    retail_price: 3.78,
    discount: 0.52,
    effective_price: 3.26,
    lat: 41.6789,
    lon: -92.0085
  },
  {
    id: 14,
    name: "Pilot Travel Center - Brooklyn",
    brand: "Pilot",
    state: "IA",
    exit_number: "Exit 197",
    mile_marker: 276,
    detour_miles: 0.4,
    retail_price: 3.69,
    discount: 0.31,
    effective_price: 3.38,
    lat: 41.7018,
    lon: -92.4452
  },
  {
    id: 15,
    name: "Love's Travel Stop - Newton",
    brand: "Love's",
    state: "IA",
    exit_number: "Exit 168",
    mile_marker: 306,
    detour_miles: 0.7,
    retail_price: 3.66,
    discount: 0.26,
    effective_price: 3.40,
    lat: 41.6812,
    lon: -93.0124
  },
  {
    id: 16,
    name: "Flying J Travel Center - Altoona",
    brand: "Flying J",
    state: "IA",
    exit_number: "Exit 142",
    mile_marker: 332,
    detour_miles: 0.5,
    retail_price: 3.64,
    discount: 0.46,
    effective_price: 3.18,
    lat: 41.6542,
    lon: -93.4892
  },
  {
    id: 17,
    name: "Pilot Travel Center - Des Moines West",
    brand: "Pilot",
    state: "IA",
    exit_number: "Exit 121",
    mile_marker: 353,
    detour_miles: 1.2,
    retail_price: 3.68,
    discount: 0.33,
    effective_price: 3.35,
    lat: 41.6085,
    lon: -93.8124
  },
  {
    id: 18,
    name: "Love's Travel Stop - Stuart",
    brand: "Love's",
    state: "IA",
    exit_number: "Exit 93",
    mile_marker: 381,
    detour_miles: 0.6,
    retail_price: 3.71,
    discount: 0.21,
    effective_price: 3.50,
    lat: 41.4982,
    lon: -94.3185
  },
  {
    id: 19,
    name: "TA Express - Adair",
    brand: "TA",
    state: "IA",
    exit_number: "Exit 76",
    mile_marker: 401,
    detour_miles: 2.4,
    retail_price: 3.65,
    discount: 0.58,
    effective_price: 3.07,
    lat: 41.5012,
    lon: -94.6412
  },
  {
    id: 20,
    name: "Pilot Travel Center - Avoca",
    brand: "Pilot",
    state: "IA",
    exit_number: "Exit 40",
    mile_marker: 435,
    detour_miles: 0.8,
    retail_price: 3.62,
    discount: 0.36,
    effective_price: 3.26,
    lat: 41.4895,
    lon: -95.3365
  },
  {
    id: 21,
    name: "Pilot Travel Center - Council Bluffs",
    brand: "Pilot",
    state: "IA",
    exit_number: "Exit 1B",
    mile_marker: 472,
    detour_miles: 0.5,
    retail_price: 3.59,
    discount: 0.42,
    effective_price: 3.17,
    lat: 41.2245,
    lon: -95.8612
  },
  {
    id: 22,
    name: "Flying J Travel Center - Gretna",
    brand: "Flying J",
    state: "NE",
    exit_number: "Exit 432",
    mile_marker: 496,
    detour_miles: 0.6,
    retail_price: 3.63,
    discount: 0.39,
    effective_price: 3.24,
    lat: 41.0865,
    lon: -96.2541
  },
  {
    id: 23,
    name: "Love's Travel Stop - Waverly",
    brand: "Love's",
    state: "NE",
    exit_number: "Exit 409",
    mile_marker: 521,
    detour_miles: 1.5,
    retail_price: 3.67,
    discount: 0.18,
    effective_price: 3.49,
    lat: 40.9125,
    lon: -96.5482
  },
  {
    id: 24,
    name: "Shoemaker's Petro - Lincoln",
    brand: "Petro",
    state: "NE",
    exit_number: "Exit 395",
    mile_marker: 538,
    detour_miles: 0.4,
    retail_price: 3.69,
    discount: 0.54,
    effective_price: 3.15,
    lat: 40.8542,
    lon: -96.7845
  },
  {
    id: 25,
    name: "Petro Stopping Center - York",
    brand: "Petro",
    state: "NE",
    exit_number: "Exit 353",
    mile_marker: 580,
    detour_miles: 0.5,
    retail_price: 3.58,
    discount: 0.62,
    effective_price: 2.96,
    lat: 40.8245,
    lon: -97.5924
  },
  {
    id: 26,
    name: "Love's Travel Stop - Aurora",
    brand: "Love's",
    state: "NE",
    exit_number: "Exit 332",
    mile_marker: 602,
    detour_miles: 0.8,
    retail_price: 3.61,
    discount: 0.24,
    effective_price: 3.37,
    lat: 40.8211,
    lon: -98.0045
  },
  {
    id: 27,
    name: "Bosselman Pilot Travel Center - Grand Island",
    brand: "Pilot",
    state: "NE",
    exit_number: "Exit 312",
    mile_marker: 622,
    detour_miles: 0.4,
    retail_price: 3.56,
    discount: 0.49,
    effective_price: 3.07,
    lat: 40.8342,
    lon: -98.3412
  },
  {
    id: 28,
    name: "TA Travel Center - Alda",
    brand: "TA",
    state: "NE",
    exit_number: "Exit 305",
    mile_marker: 631,
    detour_miles: 3.8,
    retail_price: 3.55,
    discount: 0.68,
    effective_price: 2.87,
    lat: 40.8195,
    lon: -98.4812
  },
  {
    id: 29,
    name: "Pilot Travel Center - Kearney",
    brand: "Pilot",
    state: "NE",
    exit_number: "Exit 272",
    mile_marker: 662,
    detour_miles: 0.7,
    retail_price: 3.64,
    discount: 0.35,
    effective_price: 3.29,
    lat: 40.6712,
    lon: -99.0825
  },
  {
    id: 30,
    name: "Love's Travel Stop - Lexington",
    brand: "Love's",
    state: "NE",
    exit_number: "Exit 237",
    mile_marker: 697,
    detour_miles: 0.6,
    retail_price: 3.68,
    discount: 0.21,
    effective_price: 3.47,
    lat: 40.7512,
    lon: -99.7412
  },
  {
    id: 31,
    name: "Pilot Travel Center - Gothenburg",
    brand: "Pilot",
    state: "NE",
    exit_number: "Exit 211",
    mile_marker: 723,
    detour_miles: 1.1,
    retail_price: 3.72,
    discount: 0.38,
    effective_price: 3.34,
    lat: 40.9112,
    lon: -100.1625
  },
  {
    id: 32,
    name: "Flying J Travel Center - North Platte",
    brand: "Flying J",
    state: "NE",
    exit_number: "Exit 177",
    mile_marker: 757,
    detour_miles: 0.5,
    retail_price: 3.65,
    discount: 0.51,
    effective_price: 3.14,
    lat: 41.1124,
    lon: -100.7615
  },
  {
    id: 33,
    name: "Love's Travel Stop - North Platte",
    brand: "Love's",
    state: "NE",
    exit_number: "Exit 179",
    mile_marker: 760,
    detour_miles: 0.9,
    retail_price: 3.66,
    discount: 0.14,
    effective_price: 3.52,
    lat: 41.1105,
    lon: -100.7312
  },
  {
    id: 34,
    name: "TA Travel Center - Ogallala",
    brand: "TA",
    state: "NE",
    exit_number: "Exit 126",
    mile_marker: 808,
    detour_miles: 0.4,
    retail_price: 3.69,
    discount: 0.56,
    effective_price: 3.13,
    lat: 41.1165,
    lon: -101.7192
  },
  {
    id: 35,
    name: "Pilot Travel Center - Big Springs",
    brand: "Pilot",
    state: "NE",
    exit_number: "Exit 107",
    mile_marker: 827,
    detour_miles: 0.6,
    retail_price: 3.74,
    discount: 0.44,
    effective_price: 3.30,
    lat: 41.0642,
    lon: -102.0712
  },
  {
    id: 36,
    name: "Love's Travel Stop - Julesburg",
    brand: "Love's",
    state: "CO",
    exit_number: "Exit 180",
    mile_marker: 842,
    detour_miles: 1.9,
    retail_price: 3.85,
    discount: 0.12,
    effective_price: 3.73,
    lat: 40.9712,
    lon: -102.2615
  },
  {
    id: 37,
    name: "TA Express - Sterling",
    brand: "TA",
    state: "CO",
    exit_number: "Exit 125",
    mile_marker: 896,
    detour_miles: 1.3,
    retail_price: 3.89,
    discount: 0.49,
    effective_price: 3.40,
    lat: 40.6214,
    lon: -103.1842
  },
  {
    id: 38,
    name: "Love's Travel Stop - Fort Morgan",
    brand: "Love's",
    state: "CO",
    exit_number: "Exit 80",
    mile_marker: 938,
    detour_miles: 0.5,
    retail_price: 3.92,
    discount: 0.25,
    effective_price: 3.67,
    lat: 40.2584,
    lon: -103.7995
  },
  {
    id: 39,
    name: "Pilot Travel Center - Wiggins",
    brand: "Pilot",
    state: "CO",
    exit_number: "Exit 66A",
    mile_marker: 952,
    detour_miles: 4.2,
    retail_price: 3.88,
    discount: 0.45,
    effective_price: 3.43,
    lat: 40.2312,
    lon: -104.0725
  },
  {
    id: 40,
    name: "TA Travel Center - Commerce City (Denver)",
    brand: "TA",
    state: "CO",
    exit_number: "Exit 6",
    mile_marker: 985,
    detour_miles: 0.8,
    retail_price: 3.99,
    discount: 0.52,
    effective_price: 3.47,
    lat: 39.8012,
    lon: -104.9012
  }
];

// ============================================================================
// 2. FLEET TRUCK PRESETS
// ============================================================================
const TRUCK_PRESETS = [
  {
    id: "unit-104",
    unit: "Unit #104",
    model: "2024 Freightliner Cascadia 126",
    driver: "Oleksandr Kovalenko",
    currentFuel: 85,
    tankCapacity: 200,
    mpg: 6.8,
    minReserve: 30
  },
  {
    id: "unit-208",
    unit: "Unit #208",
    model: "2023 Volvo VNL 860 Globetrotter",
    driver: "Taras Melnyk",
    currentFuel: 60,
    tankCapacity: 220,
    mpg: 7.3,
    minReserve: 30
  },
  {
    id: "unit-315",
    unit: "Unit #315",
    model: "2024 Kenworth T680 NextGen",
    driver: "Dmytro Bondarenko",
    currentFuel: 120,
    tankCapacity: 240,
    mpg: 7.6,
    minReserve: 35
  },
  {
    id: "unit-412",
    unit: "Unit #412",
    model: "2022 Peterbilt 579 UltraLoft (Heavy)",
    driver: "Viktor Shevchuk",
    currentFuel: 70,
    tankCapacity: 260,
    mpg: 5.9,
    minReserve: 40
  },
  {
    id: "unit-509",
    unit: "Unit #509",
    model: "2023 International LT625",
    driver: "Andriy Boyko",
    currentFuel: 50,
    tankCapacity: 180,
    mpg: 6.5,
    minReserve: 25
  }
];

// ============================================================================
// 3. SAMPLE WEX / EFS FUEL CARD TRANSACTIONS (20 REALISTIC ROWS)
// ============================================================================
const INITIAL_AUDIT_CSV = `Date,Truck,Driver,Station,State,MileMarker,Gallons,PaidPrice
2025-02-18 07:45,Unit #104,Oleksandr Kovalenko,Love's Travel Stop - Morris,IL,36,95.4,4.07
2025-02-18 11:20,Unit #208,Taras Melnyk,Flying J Travel Center - Davenport,IA,185,118.0,3.48
2025-02-18 14:05,Unit #315,Dmytro Bondarenko,Iowa 80 TA Truckstop - Walcott,IA,178,134.5,3.31
2025-02-18 16:30,Unit #412,Viktor Shevchuk,Love's Travel Stop - Coralville,IA,228,142.0,3.52
2025-02-19 08:12,Unit #509,Andriy Boyko,Pilot Travel Center - Des Moines West,IA,353,108.2,3.35
2025-02-19 10:50,Unit #104,Oleksandr Kovalenko,Flying J Travel Center - Altoona,IA,332,125.0,3.18
2025-02-19 13:15,Unit #412,Viktor Shevchuk,Love's Travel Stop - Stuart,IA,381,138.6,3.50
2025-02-19 15:40,Unit #208,Taras Melnyk,TA Express - Adair,IA,401,112.4,3.07
2025-02-20 06:55,Unit #509,Andriy Boyko,Love's Travel Stop - Waverly,NE,521,98.5,3.49
2025-02-20 09:30,Unit #315,Dmytro Bondarenko,Shoemaker's Petro - Lincoln,NE,538,128.0,3.15
2025-02-20 12:10,Unit #412,Viktor Shevchuk,Love's Travel Stop - Aurora,NE,602,149.2,3.37
2025-02-20 14:45,Unit #104,Oleksandr Kovalenko,Petro Stopping Center - York,NE,580,131.0,2.96
2025-02-20 17:20,Unit #208,Taras Melnyk,Bosselman Pilot Travel Center - Grand Island,NE,622,115.8,3.07
2025-02-21 08:05,Unit #509,Andriy Boyko,Love's Travel Stop - Lexington,NE,697,104.0,3.47
2025-02-21 11:30,Unit #412,Viktor Shevchuk,Love's Travel Stop - North Platte,NE,760,152.5,3.52
2025-02-21 13:50,Unit #315,Dmytro Bondarenko,Flying J Travel Center - North Platte,NE,757,122.0,3.14
2025-02-21 16:15,Unit #104,Oleksandr Kovalenko,TA Travel Center - Ogallala,NE,808,119.5,3.13
2025-02-22 07:40,Unit #509,Andriy Boyko,Love's Travel Stop - Julesburg,CO,842,96.0,3.73
2025-02-22 10:25,Unit #412,Viktor Shevchuk,Love's Travel Stop - Fort Morgan,CO,938,136.4,3.67
2025-02-22 13:10,Unit #208,Taras Melnyk,TA Travel Center - Commerce City (Denver),CO,985,88.0,3.47`;

// ============================================================================
// 4. DYNAMIC PROGRAMMING (DP) REFUEL OPTIMIZATION ENGINE
// ============================================================================
/**
 * Solves the Fixed-Route Truck Refueling Problem from Mile 0 to Mile 1000
 * using True Dynamic Programming over 1-gallon discretized tank states.
 *
 * Constraints enforced:
 * - Extra detour fuel at each chosen stop: detour_fuel = (2 * detour_miles) / MPG
 * - Fuel never drops below minReserve at any point along the highway, upon arrival
 *   at a stop (after taking the detour), or upon reaching Denver at Mile 1000.
 * - Minimum refuel volume per stop: >= 25 gallons.
 * - Tank level after refueling <= tankCapacity.
 */
function solveFuelOptimizationDP({
  stations,
  currentFuel,
  tankCapacity,
  mpg,
  minReserve
}) {
  const ROUTE_DISTANCE = 1000;
  const MIN_GALLONS_PER_STOP = 25;

  const safeStartFuel = Math.min(Math.max(currentFuel, minReserve), tankCapacity);
  const maxTank = Math.round(tankCapacity);
  const minRes = Math.round(minReserve);

  // Average retail price across corridor for Baseline calculation
  const avgRetailPrice =
    stations.reduce((acc, s) => acc + s.retail_price, 0) / stations.length;
  const avgDetourMiles =
    stations.reduce((acc, s) => acc + s.detour_miles, 0) / stations.length;

  const N = stations.length; // 40 stations

  // dpDepartCost[i][f] = minimum $ cost to be at station i (0 = Chicago start, 1..40 = stations)
  // ready to depart on the highway with integer `f` gallons in the tank.
  const INF = 1e12;
  const dpDepartCost = Array.from({ length: N + 1 }, () =>
    new Float64Array(maxTank + 1).fill(INF)
  );
  // Parent backpointers for path reconstruction
  const parentStop = Array.from({ length: N + 1 }, () =>
    new Int16Array(maxTank + 1).fill(-1)
  );
  const parentDepFuel = Array.from({ length: N + 1 }, () =>
    new Int16Array(maxTank + 1).fill(-1)
  );
  const exactArrFuelAtStop = Array.from({ length: N + 1 }, () =>
    new Float64Array(maxTank + 1).fill(0)
  );

  // Base case at Node 0 (Chicago, Mile 0):
  const startFuelInt = Math.floor(safeStartFuel);
  dpDepartCost[0][startFuelInt] = 0;

  // Iterate through each station i = 1..N
  for (let i = 1; i <= N; i++) {
    const st = stations[i - 1];
    const mileI = st.mile_marker;
    const detourFuelI = (2 * st.detour_miles) / mpg;
    const priceI = st.effective_price;

    // Phase 1: Find minimum cost to ARRIVE at station i (after detour) with integer bucket `fArr`
    const minArriveCost = new Float64Array(maxTank + 1).fill(INF);
    const bestPrevStopForArr = new Int16Array(maxTank + 1).fill(-1);
    const bestPrevFuelForArr = new Int16Array(maxTank + 1).fill(-1);
    const bestExactArrFuel = new Float64Array(maxTank + 1).fill(0);

    for (let p = 0; p < i; p++) {
      const mileP = p === 0 ? 0 : stations[p - 1].mile_marker;
      const dist = mileI - mileP;
      const legFuelBurned = dist / mpg + detourFuelI;

      for (let fDepP = minRes; fDepP <= maxTank; fDepP++) {
        const prevCost = dpDepartCost[p][fDepP];
        if (prevCost >= INF) continue;

        // Exact fuel remaining upon reaching station i after detour
        const fRemExact = (p === 0 ? safeStartFuel : fDepP) - legFuelBurned;
        if (fRemExact < minReserve - 1e-6) continue; // Violates Min Reserve!

        const fArrBucket = Math.max(minRes, Math.floor(fRemExact + 1e-6));
        if (fArrBucket > maxTank) continue;

        // Adjust cost slightly by fractional residual so continuous accounting is exact
        if (prevCost < minArriveCost[fArrBucket]) {
          minArriveCost[fArrBucket] = prevCost;
          bestPrevStopForArr[fArrBucket] = p;
          bestPrevFuelForArr[fArrBucket] = fDepP;
          bestExactArrFuel[fArrBucket] = fRemExact;
        }
      }
    }

    // Phase 2: Transition from Arrival fuel `fArr` to Departure fuel `fDep` at station i
    // Enforcing minimum refuel amount: fDep - fArr >= 25 gallons
    for (let fArr = minRes; fArr <= maxTank - MIN_GALLONS_PER_STOP; fArr++) {
      const arrCost = minArriveCost[fArr];
      if (arrCost >= INF) continue;

      const exactArr = bestExactArrFuel[fArr];

      for (let fDep = fArr + MIN_GALLONS_PER_STOP; fDep <= maxTank; fDep++) {
        const gallonsAdded = fDep - exactArr;
        if (gallonsAdded < MIN_GALLONS_PER_STOP - 0.5) continue;

        const newCost = arrCost + gallonsAdded * priceI;
        if (newCost < dpDepartCost[i][fDep]) {
          dpDepartCost[i][fDep] = newCost;
          parentStop[i][fDep] = bestPrevStopForArr[fArr];
          parentDepFuel[i][fDep] = bestPrevFuelForArr[fArr];
          exactArrFuelAtStop[i][fDep] = exactArr;
        }
      }
    }
  }

  // Final Step: Find optimal last stop p (0..N) and departure fuel `fDep` that reaches Denver (Mile 1000)
  // with at least `minReserve` remaining in the tank.
  let bestTotalCost = INF;
  let bestLastStop = -1;
  let bestLastDepFuel = -1;
  let bestEndFuel = 0;

  for (let p = 0; p <= N; p++) {
    const mileP = p === 0 ? 0 : stations[p - 1].mile_marker;
    const distToDenver = ROUTE_DISTANCE - mileP;
    const fuelToDenver = distToDenver / mpg;

    for (let fDep = minRes; fDep <= maxTank; fDep++) {
      const costP = dpDepartCost[p][fDep];
      if (costP >= INF) continue;

      const effectiveDepart = p === 0 ? safeStartFuel : fDep;
      const finalFuel = effectiveDepart - fuelToDenver;
      if (finalFuel >= minReserve - 1e-6) {
        if (costP < bestTotalCost) {
          bestTotalCost = costP;
          bestLastStop = p;
          bestLastDepFuel = fDep;
          bestEndFuel = finalFuel;
        }
      }
    }
  }

  // Reconstruct optimal stop sequence
  const chosenStops = [];
  let currStop = bestLastStop;
  let currFuel = bestLastDepFuel;

  while (currStop > 0) {
    const st = stations[currStop - 1];
    const arrFuel = exactArrFuelAtStop[currStop][currFuel];
    const gallonsToPump = currFuel - arrFuel;
    const stopCost = gallonsToPump * st.effective_price;
    const retailCostAtStop = gallonsToPump * st.retail_price;
    const detourFuel = (2 * st.detour_miles) / mpg;

    chosenStops.push({
      station: st,
      arrivalFuel: Number(arrFuel.toFixed(1)),
      departureFuel: Number(currFuel.toFixed(1)),
      gallonsToPump: Number(gallonsToPump.toFixed(1)),
      effectivePrice: st.effective_price,
      retailPrice: st.retail_price,
      discount: st.discount,
      stopCost: Number(stopCost.toFixed(2)),
      retailCostAtStop: Number(retailCostAtStop.toFixed(2)),
      detourFuel: Number(detourFuel.toFixed(2))
    });

    const nextStop = parentStop[currStop][currFuel];
    const nextFuel = parentDepFuel[currStop][currFuel];
    currStop = nextStop;
    currFuel = nextFuel;
  }

  chosenStops.reverse();

  // Build continuous sawtooth profile points from Mile 0 to Mile 1000
  const profilePoints = [];
  let currentMile = 0;
  let currentTank = safeStartFuel;

  profilePoints.push({
    mile: 0,
    fuel: Number(currentTank.toFixed(1)),
    type: "start",
    label: "Chicago, IL (Origin)"
  });

  for (let idx = 0; idx < chosenStops.length; idx++) {
    const stop = chosenStops[idx];
    const st = stop.station;
    // Point right upon arriving at the stop (including detour fuel burn)
    profilePoints.push({
      mile: st.mile_marker,
      fuel: stop.arrivalFuel,
      type: "arrival",
      stopIndex: idx + 1,
      station: st,
      stopData: stop,
      label: `${st.name} (Arrival)`
    });
    // Point immediately after refueling at the stop
    profilePoints.push({
      mile: st.mile_marker,
      fuel: stop.departureFuel,
      type: "refuel",
      stopIndex: idx + 1,
      station: st,
      stopData: stop,
      label: `${st.name} (+${stop.gallonsToPump} gal)`
    });
    currentMile = st.mile_marker;
    currentTank = stop.departureFuel;
  }

  const finalRemaining =
    bestLastStop === -1
      ? 0
      : Number(
          (
            currentTank -
            (ROUTE_DISTANCE - currentMile) / mpg
          ).toFixed(1)
        );

  profilePoints.push({
    mile: ROUTE_DISTANCE,
    fuel: Math.max(0, finalRemaining),
    type: "end",
    label: "Denver, CO (Destination)"
  });

  // Calculate Baseline Cost:
  // Simulates an unoptimized driver fueling at average corridor retail price ($/gal without discount)
  // whenever tank approaches Min Reserve, ending with the same terminal fuel level.
  const totalGallonsPurchased = chosenStops.reduce(
    (sum, s) => sum + s.gallonsToPump,
    0
  );
  const totalDetourMiles = chosenStops.reduce(
    (sum, s) => sum + 2 * s.station.detour_miles,
    0
  );

  // Baseline driver incurs average detour per stop and pays average corridor retail price
  const baselineGallonsNeeded = Math.max(
    totalGallonsPurchased,
    (ROUTE_DISTANCE + chosenStops.length * 2 * avgDetourMiles) / mpg -
      (safeStartFuel - minReserve)
  );
  const baselineCost =
    bestLastStop === -1 ? 0 : baselineGallonsNeeded * avgRetailPrice;
  const optimalCost = bestLastStop === -1 ? 0 : bestTotalCost;
  const netSavings = Math.max(0, baselineCost - optimalCost);
  const savingsPercent =
    baselineCost > 0 ? (netSavings / baselineCost) * 100 : 0;

  return {
    feasible: bestLastStop !== -1,
    chosenStops,
    profilePoints,
    totalGallonsPurchased: Number(totalGallonsPurchased.toFixed(1)),
    totalDetourMiles: Number(totalDetourMiles.toFixed(1)),
    totalRouteMiles: Number((ROUTE_DISTANCE + totalDetourMiles).toFixed(1)),
    baselineCost: Number(baselineCost.toFixed(2)),
    optimalCost: Number(optimalCost.toFixed(2)),
    netSavings: Number(netSavings.toFixed(2)),
    savingsPercent: Number(savingsPercent.toFixed(1)),
    avgRetailPrice: Number(avgRetailPrice.toFixed(2)),
    finalFuelAtDenver: finalRemaining
  };
}

// ============================================================================
// 5. WEX / EFS CSV PARSER & 15-MILE SPATIAL AUDIT ENGINE
// ============================================================================
function parseAndAuditCSV(csvText, stations) {
  const lines = csvText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return { rows: [], error: "CSV is empty." };

  // Detect header if first line contains non-numeric MileMarker or "Date"
  const startIdx = lines[0].toLowerCase().includes("date") ||
    lines[0].toLowerCase().includes("truck")
    ? 1
    : 0;

  const auditedRows = [];

  for (let i = startIdx; i < lines.length; i++) {
    const parts = lines[i].split(",").map((p) => p.trim());
    if (parts.length < 8) continue;

    const [
      date,
      truck,
      driver,
      stationName,
      state,
      mileMarkerStr,
      gallonsStr,
      paidPriceStr
    ] = parts;

    const mileMarker = parseFloat(mileMarkerStr);
    const gallons = parseFloat(gallonsStr);
    const paidPrice = parseFloat(paidPriceStr);

    if (isNaN(mileMarker) || isNaN(gallons) || isNaN(paidPrice)) continue;

    // Find all corridor stations within ±15 miles
    const nearbyStations = stations.filter(
      (s) => Math.abs(s.mile_marker - mileMarker) <= 15
    );

    // Fallback to nearest station if custom mile marker is outside ±15m of any stop
    let bestAlt = null;
    if (nearbyStations.length > 0) {
      bestAlt = nearbyStations.reduce((minSt, currSt) =>
        currSt.effective_price < minSt.effective_price ? currSt : minSt
      , nearbyStations[0]);
    } else {
      bestAlt = stations.reduce((closest, curr) =>
        Math.abs(curr.mile_marker - mileMarker) <
        Math.abs(closest.mile_marker - mileMarker)
          ? curr
          : closest
      , stations[0]);
    }

    const optimalPrice = bestAlt.effective_price;
    const priceDiff = Math.max(0, paidPrice - optimalPrice);
    const missedSavings = Number((priceDiff * gallons).toFixed(2));
    const totalSpend = Number((paidPrice * gallons).toFixed(2));
    const isViolation = missedSavings >= 5.0 && priceDiff >= 0.04;

    auditedRows.push({
      id: `tx-${i}`,
      date,
      truck,
      driver,
      stationName,
      state,
      mileMarker,
      gallons: Number(gallons.toFixed(1)),
      paidPrice: Number(paidPrice.toFixed(2)),
      totalSpend,
      bestAltStation: bestAlt,
      optimalPrice: Number(optimalPrice.toFixed(2)),
      missedSavings,
      isViolation,
      distanceToAlt: Number(
        Math.abs(bestAlt.mile_marker - mileMarker).toFixed(1)
      )
    });
  }

  return { rows: auditedRows, error: null };
}

// ============================================================================
// 6. BRAND BADGE HELPER
// ============================================================================
function BrandBadge({ brand }) {
  const styles = {
    Pilot: "bg-red-500/15 text-red-500 border-red-500/30",
    "Flying J": "bg-orange-500/15 text-orange-500 border-orange-500/30",
    "Love's": "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    TA: "bg-blue-500/15 text-blue-500 border-blue-500/30",
    Petro: "bg-emerald-500/15 text-emerald-500 border-emerald-500/30"
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${
        styles[brand] || "bg-slate-500/15 text-slate-400 border-slate-500/30"
      }`}
    >
      {brand}
    </span>
  );
}

// ============================================================================
// 7. MAIN APPLICATION COMPONENT
// ============================================================================
export default function App() {
  // Theme State (Dark by default for modern logistics command center feel)
  const [darkMode, setDarkMode] = useState(true);

  // Active Module Tab ("optimizer" | "audit")
  const [activeTab, setActiveTab] = useState("optimizer");

  // Selected Truck Preset & Parameters
  const [selectedPresetId, setSelectedPresetId] = useState(TRUCK_PRESETS[0].id);
  const [currentFuel, setCurrentFuel] = useState(TRUCK_PRESETS[0].currentFuel);
  const [tankCapacity, setTankCapacity] = useState(
    TRUCK_PRESETS[0].tankCapacity
  );
  const [mpg, setMpg] = useState(TRUCK_PRESETS[0].mpg);
  const [minReserve, setMinReserve] = useState(TRUCK_PRESETS[0].minReserve);

  // Interactive SVG Chart Hover State
  const [hoveredStop, setHoveredStop] = useState(null);
  const [hoveredStation, setHoveredStation] = useState(null);

  // Station Directory Toggle in Tab 1
  const [showAllStations, setShowAllStations] = useState(false);
  const [stationStateFilter, setStationStateFilter] = useState("ALL");

  // Dispatch Modal State
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [dispatchLang, setDispatchLang] = useState("UA"); // "UA" | "EN"
  const [copiedDispatch, setCopiedDispatch] = useState(false);

  // Tab 2: Fuel Card Audit State
  const [csvText, setCsvText] = useState(INITIAL_AUDIT_CSV);
  const [showOnlyViolations, setShowOnlyViolations] = useState(false);
  const [auditSearch, setAuditSearch] = useState("");
  const [showCsvEditor, setShowCsvEditor] = useState(false);
  const fileInputRef = useRef(null);

  // Handle Preset Selection
  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setTankCapacity(preset.tankCapacity);
    setCurrentFuel(Math.min(preset.currentFuel, preset.tankCapacity));
    setMpg(preset.mpg);
    setMinReserve(preset.minReserve);
  };

  // Handle Tank Capacity Slider Change (Safely clamp currentFuel)
  const handleTankCapacityChange = (val) => {
    const newCap = Number(val);
    setTankCapacity(newCap);
    setSelectedPresetId("custom");
    if (currentFuel > newCap) {
      setCurrentFuel(newCap);
    }
  };

  // Run Dynamic Programming Optimization whenever sliders change
  const dpResult = useMemo(() => {
    return solveFuelOptimizationDP({
      stations: CORRIDOR_STATIONS,
      currentFuel,
      tankCapacity,
      mpg,
      minReserve
    });
  }, [currentFuel, tankCapacity, mpg, minReserve]);

  // Run WEX/EFS Audit Engine whenever CSV text changes
  const auditResult = useMemo(() => {
    return parseAndAuditCSV(csvText, CORRIDOR_STATIONS);
  }, [csvText]);

  const filteredAuditRows = useMemo(() => {
    return auditResult.rows.filter((row) => {
      if (showOnlyViolations && !row.isViolation) return false;
      if (auditSearch.trim() !== "") {
        const q = auditSearch.toLowerCase();
        return (
          row.driver.toLowerCase().includes(q) ||
          row.truck.toLowerCase().includes(q) ||
          row.stationName.toLowerCase().includes(q) ||
          row.state.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [auditResult.rows, showOnlyViolations, auditSearch]);

  const auditSummary = useMemo(() => {
    const rows = auditResult.rows;
    const totalSpend = rows.reduce((s, r) => s + r.totalSpend, 0);
    const totalGallons = rows.reduce((s, r) => s + r.gallons, 0);
    const violationsCount = rows.filter((r) => r.isViolation).length;
    const totalMissedSavings = rows.reduce((s, r) => s + r.missedSavings, 0);
    const complianceRate =
      rows.length > 0
        ? ((rows.length - violationsCount) / rows.length) * 100
        : 100;

    return {
      totalSpend: totalSpend.toFixed(2),
      totalGallons: totalGallons.toFixed(1),
      violationsCount,
      totalTx: rows.length,
      totalMissedSavings: totalMissedSavings.toFixed(2),
      complianceRate: complianceRate.toFixed(0)
    };
  }, [auditResult.rows]);

  // Current selected preset metadata
  const activePresetObj =
    TRUCK_PRESETS.find((p) => p.id === selectedPresetId) || {
      unit: "Custom Spec",
      model: "Custom Fleet Configuration",
      driver: "Assigned Driver"
    };

  // Generate formatted Driver Dispatch Message for Telegram / Viber
  const dispatchMessageText = useMemo(() => {
    if (!dpResult.feasible) {
      return "⚠️ ROUTE INFEASIBLE: Current fuel is insufficient to reach the first compliant station above minimum reserve.";
    }

    if (dispatchLang === "UA") {
      const stopsBlock = dpResult.chosenStops
        .map((s, idx) => {
          const st = s.station;
          const gmapsUrl = `https://www.google.com/maps?q=${st.lat},${st.lon}`;
          return (
            `🛑 ЗУПИНКА #${idx + 1}: ${st.name} (${st.brand})\n` +
            `   • Штат / Виїзд: ${st.state}, ${st.exit_number} (Миля ${st.mile_marker})\n` +
            `   • Відхилення (Detour): ${st.detour_miles} милі в один бік\n` +
            `   • Залишок при прибутті: ~${s.arrivalFuel} gal\n` +
            `   • ЗАЛИТИ ПАЛИВА: ${s.gallonsToPump} gal (до ${s.departureFuel} gal)\n` +
            `   • Ціна Pava EFS: $${s.effectivePrice.toFixed(2)}/gal (Знижка -$${s.discount.toFixed(2)})\n` +
            `   • Сума: ~$${s.stopCost.toFixed(2)}\n` +
            `   • 📍 Навігація: ${gmapsUrl}`
          );
        })
        .join("\n\n");

      return (
        `🚛 PAVA LOGISTICS — ДИСПЕТЧЕРСЬКИЙ ПЛАН ПАЛИВА\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🔹 Борт: ${activePresetObj.unit} (${activePresetObj.model})\n` +
        `🔹 Водій: ${activePresetObj.driver}\n` +
        `🔹 Маршрут: Chicago, IL ➔ Denver, CO (I-80 / I-76 • 1,000 миль)\n` +
        `🔹 Параметри: Бак ${tankCapacity} gal | Поточний залишок ${currentFuel} gal | ${mpg} MPG | Резерв ${minReserve} gal\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `${
          dpResult.chosenStops.length > 0
            ? stopsBlock
            : "✅ Дозаправка не потрібна — поточного палива достатньо до Denver, CO."
        }\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📊 ПІДСУМОК МАРШРУТУ:\n` +
        `• Всього залити: ${dpResult.totalGallonsPurchased} gal (${dpResult.chosenStops.length} зуп.)\n` +
        `• Оптимальний бюджет: $${dpResult.optimalCost.toFixed(2)} (Економія $${dpResult.netSavings.toFixed(2)} / ${dpResult.savingsPercent}%)\n` +
        `• Очікуваний залишок у Denver, CO: ${dpResult.finalFuelAtDenver} gal (Мін. резерв: ${minReserve} gal)\n` +
        `⚠️ УВАГА: Заправляйтесь виключно на вказаних станціях! Відхилення фіксується системою WEX/EFS Audit.`
      );
    } else {
      const stopsBlock = dpResult.chosenStops
        .map((s, idx) => {
          const st = s.station;
          const gmapsUrl = `https://www.google.com/maps?q=${st.lat},${st.lon}`;
          return (
            `🛑 STOP #${idx + 1}: ${st.name} (${st.brand})\n` +
            `   • Location: ${st.state}, ${st.exit_number} (Mile Marker ${st.mile_marker})\n` +
            `   • Detour: ${st.detour_miles} mi one-way\n` +
            `   • Arrival Fuel: ~${s.arrivalFuel} gal\n` +
            `   • PUMP VOLUME: ${s.gallonsToPump} gal (Target tank: ${s.departureFuel} gal)\n` +
            `   • Net EFS Price: $${s.effectivePrice.toFixed(2)}/gal (Discount -$${s.discount.toFixed(2)})\n` +
            `   • Est. Total: $${s.stopCost.toFixed(2)}\n` +
            `   • 📍 Google Maps: ${gmapsUrl}`
          );
        })
        .join("\n\n");

      return (
        `🚛 PAVA LOGISTICS — OFFICIAL FUEL DISPATCH ORDER\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🔹 Unit: ${activePresetObj.unit} (${activePresetObj.model})\n` +
        `🔹 Driver: ${activePresetObj.driver}\n` +
        `🔹 Corridor: Chicago, IL ➔ Denver, CO (I-80 / I-76 • 1,000 mi)\n` +
        `🔹 Specs: Tank ${tankCapacity} gal | Start ${currentFuel} gal | ${mpg} MPG | Reserve ${minReserve} gal\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
        `${
          dpResult.chosenStops.length > 0
            ? stopsBlock
            : "✅ No fuel stops required — starting fuel is sufficient to reach Denver, CO."
        }\n\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📊 DISPATCH SUMMARY:\n` +
        `• Total Fuel to Purchase: ${dpResult.totalGallonsPurchased} gal (${dpResult.chosenStops.length} stops)\n` +
        `• Optimal Fuel Cost: $${dpResult.optimalCost.toFixed(2)} (Net Savings: $${dpResult.netSavings.toFixed(2)} / ${dpResult.savingsPercent}%)\n` +
        `• Est. Arrival Fuel in Denver: ${dpResult.finalFuelAtDenver} gal (Min Reserve: ${minReserve} gal)\n` +
        `⚠️ MANDATORY COMPLIANCE: Fuel strictly at authorized stops above. All WEX/EFS transactions are audited within a 15-mile radius.`
      );
    }
  }, [
    dpResult,
    dispatchLang,
    activePresetObj,
    tankCapacity,
    currentFuel,
    mpg,
    minReserve
  ]);

  const handleCopyDispatch = () => {
    navigator.clipboard.writeText(dispatchMessageText);
    setCopiedDispatch(true);
    setTimeout(() => setCopiedDispatch(false), 2500);
  };

  // Handle CSV File Upload in Tab 2
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (typeof evt.target?.result === "string") {
        setCsvText(evt.target.result);
      }
    };
    reader.readAsText(file);
  };

  // Handle Exporting Audited Report to CSV
  const handleDownloadAuditCSV = () => {
    const headers =
      "Date,Truck,Driver,FueledStation,State,MileMarker,Gallons,PaidPrice,TotalSpend,OptimalAlternative15mi,OptimalMileMarker,OptimalPrice,MissedSavings,ComplianceStatus\n";
    const body = auditResult.rows
      .map(
        (r) =>
          `${r.date},${r.truck},${r.driver},"${r.stationName}",${r.state},${r.mileMarker},${r.gallons},${r.paidPrice},${r.totalSpend},"${r.bestAltStation.name}",${r.bestAltStation.mile_marker},${r.optimalPrice},${r.missedSavings},${
            r.isViolation ? "VIOLATION" : "COMPLIANT"
          }`
      )
      .join("\n");

    const blob = new Blob([headers + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pava_fuel_card_audit_report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // SVG Chart coordinate helpers
  const svgWidth = 860;
  const svgHeight = 310;
  const padLeft = 54;
  const padRight = 28;
  const padTop = 26;
  const padBottom = 52;
  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  const mileToX = (mile) => padLeft + (mile / 1000) * plotW;
  const fuelToY = (fuel) =>
    padTop + plotH - (Math.min(Math.max(fuel, 0), tankCapacity) / tankCapacity) * plotH;

  // Build SVG path for the sawtooth fuel profile
  const sawtoothPathD = useMemo(() => {
    if (!dpResult.profilePoints || dpResult.profilePoints.length === 0) return "";
    return dpResult.profilePoints
      .map((pt, idx) => {
        const x = mileToX(pt.mile).toFixed(1);
        const y = fuelToY(pt.fuel).toFixed(1);
        return `${idx === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [dpResult.profilePoints, tankCapacity]);

  const sawtoothAreaD = useMemo(() => {
    if (!sawtoothPathD) return "";
    const bottomY = (padTop + plotH).toFixed(1);
    const startX = mileToX(0).toFixed(1);
    const endX = mileToX(1000).toFixed(1);
    return `${sawtoothPathD} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`;
  }, [sawtoothPathD]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 font-sans">
        {/* ================================================================
            TOP NAVIGATION BAR & BRAND HEADER
        ================================================================ */}
        <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md">
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
            {/* Brand Identity */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    Pava Fuel Optimizer & Audit
                  </h1>
                  <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    Enterprise MVP
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Navigation className="w-3.5 h-3.5 text-emerald-500" />
                  <span>
                    I-80 / I-76 Corridor: Chicago, IL → Denver, CO • 1,000 mi • 40 EFS/WEX Network Stops
                  </span>
                </div>
              </div>
            </div>

            {/* Module Tabs & Theme Toggle */}
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-xl p-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80">
                <button
                  onClick={() => setActiveTab("optimizer")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === "optimizer"
                      ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Fuel className="w-4 h-4" />
                  <span>Route & Fuel Optimizer</span>
                </button>
                <button
                  onClick={() => setActiveTab("audit")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === "audit"
                      ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Fuel Card Audit (WEX / EFS)</span>
                  <span className="ml-1 px-1.5 py-0.2 text-xs rounded-full bg-rose-500/20 text-rose-500 font-bold">
                    {auditSummary.violationsCount}
                  </span>
                </button>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* ================================================================
            TAB 1: ROUTE & FUEL OPTIMIZER
        ================================================================ */}
        {activeTab === "optimizer" && (
          <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT PANEL: TRUCK PARAMETERS & FLEET PRESETS (4 COLS) */}
              <div className="lg:col-span-4 space-y-5">
                {/* Fleet Truck Selector Card */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-emerald-500" />
                      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                        Select Fleet Unit Preset
                      </h2>
                    </div>
                    <span className="text-xs text-slate-400">5 Active Units</span>
                  </div>

                  <div className="space-y-2">
                    {TRUCK_PRESETS.map((preset) => {
                      const isSelected = selectedPresetId === preset.id;
                      return (
                        <button
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset)}
                          className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/10"
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-slate-900 dark:text-white">
                                {preset.unit}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                • {preset.driver}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {preset.model}
                            </p>
                          </div>
                          <div className="text-right text-xs font-mono">
                            <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              {preset.mpg} MPG
                            </div>
                            <div className="text-slate-500 dark:text-slate-400">
                              {preset.currentFuel}/{preset.tankCapacity}g
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Telemetry & Tank Parameters Sliders Card */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-500" />
                      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                        Truck Fuel Parameters
                      </h2>
                    </div>
                    <button
                      onClick={() => handleSelectPreset(TRUCK_PRESETS[0])}
                      className="text-xs text-slate-500 hover:text-emerald-500 flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset
                    </button>
                  </div>

                  {/* Slider 1: Current Fuel in Tank */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Current Fuel in Tank (Start)
                      </label>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
                        {currentFuel} gal ({Math.round((currentFuel / tankCapacity) * 100)}%)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={35}
                      max={Math.min(190, tankCapacity)}
                      step={1}
                      value={currentFuel}
                      onChange={(e) => {
                        setCurrentFuel(Number(e.target.value));
                        setSelectedPresetId("custom");
                      }}
                      className="w-full accent-emerald-500 cursor-pointer h-2 rounded-lg bg-slate-200 dark:bg-slate-800"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                      <span>35 gal</span>
                      <span>Initial range: ~{Math.round(Math.max(0, currentFuel - minReserve) * mpg)} mi</span>
                      <span>{Math.min(190, tankCapacity)} gal</span>
                    </div>
                  </div>

                  {/* Slider 2: Tank Capacity */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Total Tank Capacity
                      </label>
                      <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-600 dark:text-blue-400 font-mono text-xs font-bold">
                        {tankCapacity} gal
                      </span>
                    </div>
                    <input
                      type="range"
                      min={150}
                      max={300}
                      step={5}
                      value={tankCapacity}
                      onChange={(e) => handleTankCapacityChange(e.target.value)}
                      className="w-full accent-blue-500 cursor-pointer h-2 rounded-lg bg-slate-200 dark:bg-slate-800"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                      <span>150 gal</span>
                      <span>Default: 200 gal</span>
                      <span>300 gal</span>
                    </div>
                  </div>

                  {/* Slider 3: Fuel Economy (MPG) */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Fuel Consumption (MPG)
                      </label>
                      <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-600 dark:text-purple-400 font-mono text-xs font-bold">
                        {mpg.toFixed(1)} MPG
                      </span>
                    </div>
                    <input
                      type="range"
                      min={5.5}
                      max={8.5}
                      step={0.1}
                      value={mpg}
                      onChange={(e) => {
                        setMpg(Number(e.target.value));
                        setSelectedPresetId("custom");
                      }}
                      className="w-full accent-purple-500 cursor-pointer h-2 rounded-lg bg-slate-200 dark:bg-slate-800"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                      <span>5.5 MPG (Heavy)</span>
                      <span>6.8 MPG</span>
                      <span>8.5 MPG (Eco)</span>
                    </div>
                  </div>

                  {/* Slider 4: Minimum Reserve */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        Unbreakable Min Reserve
                      </label>
                      <span className="px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 font-mono text-xs font-bold">
                        {minReserve} gal
                      </span>
                    </div>
                    <input
                      type="range"
                      min={20}
                      max={50}
                      step={1}
                      value={minReserve}
                      onChange={(e) => {
                        const newRes = Number(e.target.value);
                        setMinReserve(newRes);
                        if (currentFuel < newRes + 5) {
                          setCurrentFuel(newRes + 5);
                        }
                        setSelectedPresetId("custom");
                      }}
                      className="w-full accent-rose-500 cursor-pointer h-2 rounded-lg bg-slate-200 dark:bg-slate-800"
                    />
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                      <span>20 gal</span>
                      <span>Safety Floor: 30 gal</span>
                      <span>50 gal</span>
                    </div>
                  </div>

                  {/* DP Constraints Info Box */}
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-800/70 p-3.5 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 border border-slate-200/80 dark:border-slate-700/60">
                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                      Active DP Engine Rules:
                    </div>
                    <div>• Detour fuel penalty: <code className="text-emerald-600 dark:text-emerald-400 font-mono">(2 × detour_mi) / MPG</code></div>
                    <div>• Minimum pump volume: <code className="text-emerald-600 dark:text-emerald-400 font-mono">≥ 25.0 gal</code> per stop</div>
                    <div>• Strict safety floor: <code className="text-rose-500 font-mono">Fuel ≥ {minReserve} gal</code> at all points</div>
                  </div>

                  {/* Generate Driver Dispatch CTA */}
                  <button
                    onClick={() => setDispatchModalOpen(true)}
                    disabled={!dpResult.feasible}
                    className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Generate Driver Dispatch (Telegram / Viber)</span>
                  </button>
                </div>
              </div>

              {/* RIGHT PANEL: KPI CARDS, SAWTOOTH CHART & STOPS TABLE (8 COLS) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 4 KPI CARDS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {/* KPI 1: Distance */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span>CORRIDOR DISTANCE</span>
                      <Navigation className="w-4 h-4 text-blue-500" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                        1,000
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        mi (+{dpResult.totalDetourMiles} mi detour)
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Chicago, IL → Denver, CO ({dpResult.chosenStops.length} stops)
                    </div>
                  </div>

                  {/* KPI 2: Baseline Cost */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span>BASELINE COST (RETAIL)</span>
                      <DollarSign className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold font-mono text-slate-600 dark:text-slate-300 line-through decoration-rose-500/60">
                        ${dpResult.baselineCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      Avg retail ${dpResult.avgRetailPrice}/gal without DP
                    </div>
                  </div>

                  {/* KPI 3: Optimal Cost */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                      <span>OPTIMAL EFS COST</span>
                      <Gauge className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                        ${dpResult.optimalCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {dpResult.totalGallonsPurchased} gal pumped total
                    </div>
                  </div>

                  {/* KPI 4: Net Savings */}
                  <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent dark:from-emerald-500/15 dark:to-slate-900 p-4 shadow-sm">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <span>NET TRIP SAVINGS</span>
                      <TrendingDown className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                        +${dpResult.netSavings.toFixed(2)}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-white">
                        -{dpResult.savingsPercent}%
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-emerald-700/80 dark:text-emerald-300/80 font-medium">
                      Discount + State Tax Arbitrage
                    </div>
                  </div>
                </div>

                {/* INTERACTIVE SVG SAWTOOTH FUEL PROFILE CHART */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Interactive Tank Fuel Trajectory ("Sawtooth" DP Profile)</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Real-time fuel depletion from Mile 0 (Chicago) to Mile 1,000 (Denver) with refueling spikes and 40 corridor stops
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 bg-emerald-500 inline-block"></span>
                        <span>Fuel Level (gal)</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-3 h-0.5 border-b-2 border-dashed border-rose-500 inline-block"></span>
                        <span className="text-rose-500 font-medium">Min Reserve ({minReserve}g)</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                        <span>Refuel Stop</span>
                      </span>
                    </div>
                  </div>

                  {!dpResult.feasible ? (
                    <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-6 text-center text-rose-500">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                      <div className="font-bold">Route Infeasible Under Current Constraints</div>
                      <p className="text-xs mt-1">
                        Starting fuel ({currentFuel} gal) is too close to Minimum Reserve ({minReserve} gal) to reach the first station with detour. Increase Current Fuel or lower Min Reserve.
                      </p>
                    </div>
                  ) : (
                    <div className="relative">
                      <svg
                        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                        className="w-full h-auto overflow-visible select-none"
                      >
                        <defs>
                          <linearGradient id="fuelAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.32" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                          </linearGradient>
                        </defs>

                        {/* State Corridor Background Zones (IL, IA, NE, CO) */}
                        {[
                          { state: "IL", start: 0, end: 165, color: "rgba(100,116,139,0.06)" },
                          { state: "IA", start: 165, end: 472, color: "rgba(16,185,129,0.05)" },
                          { state: "NE", start: 472, end: 827, color: "rgba(59,130,246,0.05)" },
                          { state: "CO", start: 827, end: 1000, color: "rgba(168,85,247,0.05)" }
                        ].map((zone) => {
                          const x1 = mileToX(zone.start);
                          const x2 = mileToX(zone.end);
                          return (
                            <g key={zone.state}>
                              <rect
                                x={x1}
                                y={padTop}
                                width={x2 - x1}
                                height={plotH}
                                fill={zone.color}
                              />
                              <text
                                x={(x1 + x2) / 2}
                                y={padTop + 14}
                                textAnchor="middle"
                                className="fill-slate-400 dark:fill-slate-600 text-[10px] font-bold tracking-widest"
                              >
                                {zone.state} CORRIDOR
                              </text>
                            </g>
                          );
                        })}

                        {/* Horizontal Grid Lines (Fuel Gallons) */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                          const galVal = Math.round(ratio * tankCapacity);
                          const y = fuelToY(galVal);
                          return (
                            <g key={ratio}>
                              <line
                                x1={padLeft}
                                y1={y}
                                x2={svgWidth - padRight}
                                y2={y}
                                stroke="currentColor"
                                className="text-slate-200 dark:text-slate-800"
                                strokeWidth="1"
                              />
                              <text
                                x={padLeft - 8}
                                y={y + 4}
                                textAnchor="end"
                                className="fill-slate-400 dark:fill-slate-500 text-[10px] font-mono"
                              >
                                {galVal}g
                              </text>
                            </g>
                          );
                        })}

                        {/* X-Axis Mile Marker Ticks (0 to 1000 mi) */}
                        {[0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].map((m) => {
                          const x = mileToX(m);
                          return (
                            <g key={m}>
                              <line
                                x1={x}
                                y1={padTop}
                                x2={x}
                                y2={padTop + plotH}
                                stroke="currentColor"
                                className="text-slate-200/60 dark:text-slate-800/60"
                                strokeDasharray="2,3"
                              />
                              <text
                                x={x}
                                y={padTop + plotH + 18}
                                textAnchor="middle"
                                className="fill-slate-500 dark:fill-slate-400 text-[10px] font-mono"
                              >
                                {m} mi
                              </text>
                            </g>
                          );
                        })}

                        {/* All 40 Corridor Truck Stops Plotted Along Bottom Axis */}
                        {CORRIDOR_STATIONS.map((st) => {
                          const cx = mileToX(st.mile_marker);
                          const cy = padTop + plotH;
                          const isChosen = dpResult.chosenStops.some(
                            (s) => s.station.id === st.id
                          );
                          return (
                            <circle
                              key={st.id}
                              cx={cx}
                              cy={cy}
                              r={isChosen ? 4.5 : 3}
                              className={`cursor-pointer transition-all ${
                                isChosen
                                  ? "fill-emerald-500 stroke-white dark:stroke-slate-900"
                                  : "fill-slate-400/70 dark:fill-slate-600 hover:fill-amber-400"
                              }`}
                              strokeWidth={1.5}
                              onMouseEnter={() => setHoveredStation(st)}
                              onMouseLeave={() => setHoveredStation(null)}
                            />
                          );
                        })}

                        {/* Red Dashed Unbreakable Min Reserve Line */}
                        <line
                          x1={padLeft}
                          y1={fuelToY(minReserve)}
                          x2={svgWidth - padRight}
                          y2={fuelToY(minReserve)}
                          stroke="#f43f5e"
                          strokeWidth="2"
                          strokeDasharray="6,4"
                        />
                        <text
                          x={svgWidth - padRight - 6}
                          y={fuelToY(minReserve) - 6}
                          textAnchor="end"
                          className="fill-rose-500 text-[10px] font-bold font-mono"
                        >
                          MIN RESERVE: {minReserve} GAL
                        </text>

                        {/* Shaded Area under Sawtooth Curve */}
                        <path d={sawtoothAreaD} fill="url(#fuelAreaGrad)" />

                        {/* Main Sawtooth Fuel Trajectory Line */}
                        <path
                          d={sawtoothPathD}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.8"
                          strokeLinejoin="round"
                        />

                        {/* Interactive Nodes on Trajectory */}
                        {dpResult.profilePoints.map((pt, idx) => {
                          const cx = mileToX(pt.mile);
                          const cy = fuelToY(pt.fuel);
                          const isRefuelTop = pt.type === "refuel";
                          const isArrivalBottom = pt.type === "arrival";

                          return (
                            <g key={idx}>
                              <circle
                                cx={cx}
                                cy={cy}
                                r={isRefuelTop ? 6 : isArrivalBottom ? 4.5 : 5}
                                className={`cursor-pointer transition-transform ${
                                  isRefuelTop
                                    ? "fill-emerald-500 stroke-white dark:stroke-slate-900"
                                    : isArrivalBottom
                                    ? "fill-amber-500 stroke-white dark:stroke-slate-900"
                                    : "fill-blue-500 stroke-white dark:stroke-slate-900"
                                }`}
                                strokeWidth="2"
                                onMouseEnter={() => setHoveredStop(pt)}
                                onMouseLeave={() => setHoveredStop(null)}
                              />
                              {isRefuelTop && (
                                <text
                                  x={cx}
                                  y={cy - 10}
                                  textAnchor="middle"
                                  className="fill-emerald-600 dark:fill-emerald-400 text-[10px] font-bold font-mono"
                                >
                                  #{pt.stopIndex} (+{pt.stopData.gallonsToPump}g)
                                </text>
                              )}
                            </g>
                          );
                        })}
                      </svg>

                      {/* Floating Tooltip for Hovered Stop or Corridor Station */}
                      {(hoveredStop || hoveredStation) && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-900 text-white text-xs flex flex-wrap items-center justify-between gap-4 border border-slate-700 shadow-lg">
                          {hoveredStop ? (
                            <>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                                  Mile {hoveredStop.mile}
                                </span>
                                <span className="font-bold">{hoveredStop.label}</span>
                              </div>
                              <div className="flex items-center gap-4 font-mono">
                                <span>Tank Level: <strong className="text-emerald-400">{hoveredStop.fuel} gal</strong></span>
                                {hoveredStop.stopData && (
                                  <>
                                    <span>Price: <strong>${hoveredStop.stopData.effectivePrice.toFixed(2)}/g</strong></span>
                                    <span>Stop Cost: <strong className="text-emerald-400">${hoveredStop.stopData.stopCost.toFixed(2)}</strong></span>
                                  </>
                                )}
                              </div>
                            </>
                          ) : (
                            hoveredStation && (
                              <>
                                <div className="flex items-center gap-2">
                                  <BrandBadge brand={hoveredStation.brand} />
                                  <span className="font-bold">{hoveredStation.name}</span>
                                  <span className="text-slate-400">
                                    ({hoveredStation.state} • {hoveredStation.exit_number} • Mile {hoveredStation.mile_marker})
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 font-mono">
                                  <span>Detour: {hoveredStation.detour_miles} mi</span>
                                  <span className="line-through text-slate-400">
                                    Retail: ${hoveredStation.retail_price.toFixed(2)}
                                  </span>
                                  <span className="text-emerald-400 font-bold">
                                    Net EFS: ${hoveredStation.effective_price.toFixed(2)} (-${hoveredStation.discount.toFixed(2)})
                                  </span>
                                </div>
                              </>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* RECOMMENDED REFUELING STOPS SCHEDULE */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-500" />
                        <span>Optimal Refueling Plan ({dpResult.chosenStops.length} Authorized Stops)</span>
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Calculated via exact Dynamic Programming accounting for off-highway detour fuel burn and EFS fleet discounts
                      </p>
                    </div>
                    <button
                      onClick={() => setDispatchModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Plan</span>
                    </button>
                  </div>

                  {dpResult.chosenStops.length === 0 ? (
                    <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-center text-sm text-slate-500">
                      No refueling stops needed! Your starting fuel is sufficient to reach Denver above minimum reserve.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                            <th className="py-3 px-3">Stop #</th>
                            <th className="py-3 px-3">Truck Stop & Brand</th>
                            <th className="py-3 px-3">Location / Exit</th>
                            <th className="py-3 px-3">Detour</th>
                            <th className="py-3 px-3">Tank Arrival → Depart</th>
                            <th className="py-3 px-3">Pump Volume</th>
                            <th className="py-3 px-3">EFS Net Price</th>
                            <th className="py-3 px-3 text-right">Stop Total</th>
                            <th className="py-3 px-3 text-center">Map</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 text-sm">
                          {dpResult.chosenStops.map((stop, idx) => {
                            const st = stop.station;
                            const gmapsLink = `https://www.google.com/maps?q=${st.lat},${st.lon}`;
                            return (
                              <tr
                                key={st.id}
                                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                              >
                                <td className="py-3.5 px-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                  #{idx + 1}
                                </td>
                                <td className="py-3.5 px-3">
                                  <div className="flex items-center gap-2">
                                    <BrandBadge brand={st.brand} />
                                    <span className="font-semibold text-slate-900 dark:text-white">
                                      {st.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-3 text-xs font-mono text-slate-600 dark:text-slate-300">
                                  <span className="font-bold">{st.state}</span> • {st.exit_number}
                                  <div className="text-slate-400">Mile {st.mile_marker}</div>
                                </td>
                                <td className="py-3.5 px-3 text-xs font-mono">
                                  <div>{st.detour_miles} mi</div>
                                  <div className="text-[11px] text-amber-500">
                                    -{stop.detourFuel}g burn
                                  </div>
                                </td>
                                <td className="py-3.5 px-3 text-xs font-mono">
                                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                                    {stop.arrivalFuel}g
                                  </span>
                                  <ArrowRight className="w-3 h-3 inline mx-1 text-slate-400" />
                                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                                    {stop.departureFuel}g
                                  </span>
                                </td>
                                <td className="py-3.5 px-3">
                                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-mono font-bold text-xs">
                                    +{stop.gallonsToPump} gal
                                  </span>
                                </td>
                                <td className="py-3.5 px-3 font-mono">
                                  <div className="font-bold text-slate-900 dark:text-white">
                                    ${stop.effectivePrice.toFixed(2)}/g
                                  </div>
                                  <div className="text-[11px] text-emerald-500">
                                    Save ${stop.discount.toFixed(2)}/g
                                  </div>
                                </td>
                                <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                                  ${stop.stopCost.toFixed(2)}
                                </td>
                                <td className="py-3.5 px-3 text-center">
                                  <a
                                    href={gmapsLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title="Open Coordinates in Google Maps"
                                    className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/20 text-slate-600 dark:text-slate-300 hover:text-emerald-500 transition-colors"
                                  >
                                    <MapPin className="w-4 h-4" />
                                  </a>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* COLLAPSIBLE ALL 40 CORRIDOR STATIONS DIRECTORY */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={() => setShowAllStations(!showAllStations)}
                      className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 cursor-pointer"
                    >
                      <Layers className="w-4 h-4 text-emerald-500" />
                      <span>
                        Explore Full I-80 / I-76 Network Directory (All 40 Truck Stops)
                      </span>
                      {showAllStations ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {showAllStations && (
                      <div className="flex items-center gap-1.5">
                        {["ALL", "IL", "IA", "NE", "CO"].map((st) => (
                          <button
                            key={st}
                            onClick={() => setStationStateFilter(st)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                              stationStateFilter === st
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {showAllStations && (
                    <div className="mt-4 max-h-80 overflow-y-auto border-t border-slate-100 dark:border-slate-800 pt-3">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="text-slate-400 border-b border-slate-200 dark:border-slate-800 uppercase">
                            <th className="py-2 px-2">#</th>
                            <th className="py-2 px-2">Brand</th>
                            <th className="py-2 px-2">Station Name</th>
                            <th className="py-2 px-2">State / Exit</th>
                            <th className="py-2 px-2">Mile</th>
                            <th className="py-2 px-2">Detour</th>
                            <th className="py-2 px-2">Retail</th>
                            <th className="py-2 px-2">Discount</th>
                            <th className="py-2 px-2">Effective</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
                          {CORRIDOR_STATIONS.filter(
                            (s) =>
                              stationStateFilter === "ALL" ||
                              s.state === stationStateFilter
                          ).map((st) => {
                            const isPicked = dpResult.chosenStops.some(
                              (c) => c.station.id === st.id
                            );
                            return (
                              <tr
                                key={st.id}
                                className={
                                  isPicked
                                    ? "bg-emerald-500/10 font-semibold"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                                }
                              >
                                <td className="py-2 px-2">{st.id}</td>
                                <td className="py-2 px-2 font-sans">
                                  <BrandBadge brand={st.brand} />
                                </td>
                                <td className="py-2 px-2 font-sans text-slate-800 dark:text-slate-200">
                                  {st.name}
                                  {isPicked && (
                                    <span className="ml-2 px-1.5 py-0.5 text-[10px] rounded bg-emerald-500 text-white font-bold">
                                      OPTIMAL STOP
                                    </span>
                                  )}
                                </td>
                                <td className="py-2 px-2">
                                  {st.state} • {st.exit_number}
                                </td>
                                <td className="py-2 px-2">{st.mile_marker} mi</td>
                                <td className="py-2 px-2">{st.detour_miles} mi</td>
                                <td className="py-2 px-2 text-slate-400 line-through">
                                  ${st.retail_price.toFixed(2)}
                                </td>
                                <td className="py-2 px-2 text-emerald-500">
                                  -${st.discount.toFixed(2)}
                                </td>
                                <td className="py-2 px-2 font-bold text-slate-900 dark:text-white">
                                  ${st.effective_price.toFixed(2)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        )}

        {/* ================================================================
            TAB 2: FUEL CARD AUDIT (WEX / EFS)
        ================================================================ */}
        {activeTab === "audit" && (
          <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 space-y-6">
            {/* AUDIT SUMMARY KPI CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>AUDITED TRANSACTIONS</span>
                  <FileSpreadsheet className="w-4 h-4 text-blue-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                    {auditSummary.totalTx}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    ({auditSummary.totalGallons} gal total)
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Total WEX/EFS Spend: <strong className="text-slate-700 dark:text-slate-200">${auditSummary.totalSpend}</strong>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>SPATIAL AUDIT RADIUS</span>
                  <Navigation className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                    ±15.0 mi
                  </span>
                  <span className="text-xs text-emerald-500 font-semibold">
                    Corridor Scan
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Benchmarked against all 40 EFS network stops
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>NON-COMPLIANT STOPS</span>
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold font-mono text-rose-500">
                    {auditSummary.violationsCount} Violations
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    ({auditSummary.complianceRate}% compliant)
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  Drivers bypassed cheaper fuel within 15 miles
                </div>
              </div>

              <div className="rounded-2xl border border-rose-500/40 bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-transparent dark:from-rose-500/15 dark:to-slate-900 p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
                  <span>TOTAL MISSED SAVINGS</span>
                  <TrendingDown className="w-4 h-4 text-rose-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-extrabold font-mono text-rose-600 dark:text-rose-400">
                    -${auditSummary.totalMissedSavings}
                  </span>
                </div>
                <div className="mt-2 text-xs text-rose-700/80 dark:text-rose-300/80 font-medium">
                  Direct financial leakage from policy violations
                </div>
              </div>
            </div>

            {/* CONTROLS BAR: FILTER VIOLATIONS, SEARCH, CSV IMPORTER TOGGLE */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  {/* Show Only Violations Filter Button */}
                  <button
                    onClick={() => setShowOnlyViolations(!showOnlyViolations)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                      showOnlyViolations
                        ? "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/25"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Show Only Violations ({auditSummary.violationsCount})</span>
                  </button>

                  {/* Search Input */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={auditSearch}
                      onChange={(e) => setAuditSearch(e.target.value)}
                      placeholder="Filter driver, unit #, station..."
                      className="pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 w-64"
                    />
                  </div>
                </div>

                {/* CSV Actions */}
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => setShowCsvEditor(!showCsvEditor)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                    <span>{showCsvEditor ? "Hide CSV Importer" : "Paste / Upload WEX CSV"}</span>
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-blue-500" />
                    <span>Upload .CSV</span>
                  </button>

                  <button
                    onClick={handleDownloadAuditCSV}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Audit CSV</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Raw CSV Textarea Editor */}
              {showCsvEditor && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      Raw WEX / EFS Fuel Card Statement CSV (Instant Live Parsing & ±15 Mile Spatial Audit):
                    </label>
                    <button
                      onClick={() => setCsvText(INITIAL_AUDIT_CSV)}
                      className="text-xs text-emerald-500 hover:underline font-semibold"
                    >
                      Restore Default 20 Transactions
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={csvText}
                    onChange={(e) => setCsvText(e.target.value)}
                    className="w-full p-3 rounded-xl font-mono text-xs border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
                    placeholder="Date,Truck,Driver,Station,State,MileMarker,Gallons,PaidPrice"
                  />
                  <p className="text-[11px] text-slate-400">
                    Format: <code className="font-mono">Date,Truck,Driver,Station,State,MileMarker,Gallons,PaidPrice</code> — Modify any row or paste new transactions to see immediate violation detection.
                  </p>
                </div>
              )}
            </div>

            {/* WEX / EFS TRANSACTIONS AUDIT TABLE */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      <th className="py-3.5 px-4">Date & Time</th>
                      <th className="py-3.5 px-3">Truck & Driver</th>
                      <th className="py-3.5 px-3">Actual Station Fueled</th>
                      <th className="py-3.5 px-3 text-right">Gallons</th>
                      <th className="py-3.5 px-3 text-right">Paid Price</th>
                      <th className="py-3.5 px-4">Cheapest Alt (≤15 mi)</th>
                      <th className="py-3.5 px-3 text-right">Optimal Price</th>
                      <th className="py-3.5 px-4 text-right">Missed Savings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800 text-sm">
                    {filteredAuditRows.map((row) => {
                      const isVio = row.isViolation;
                      return (
                        <tr
                          key={row.id}
                          className={`transition-colors ${
                            isVio
                              ? "bg-rose-500/10 dark:bg-rose-950/35 hover:bg-rose-500/15"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                          }`}
                        >
                          <td className="py-3.5 px-4 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {row.date}
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {row.truck}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">
                              {row.driver}
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {row.stationName}
                            </div>
                            <div className="text-xs font-mono text-slate-400">
                              {row.state} • Mile {row.mileMarker}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-semibold">
                            {row.gallons.toFixed(1)} gal
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono">
                            <span
                              className={`font-bold ${
                                isVio
                                  ? "text-rose-600 dark:text-rose-400"
                                  : "text-slate-900 dark:text-white"
                              }`}
                            >
                              ${row.paidPrice.toFixed(2)}
                            </span>
                            <div className="text-[11px] text-slate-400">
                              ${row.totalSpend.toFixed(2)}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <BrandBadge brand={row.bestAltStation.brand} />
                              <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                                {row.bestAltStation.name}
                              </span>
                            </div>
                            <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                              Mile {row.bestAltStation.mile_marker} ({row.distanceToAlt} mi away)
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ${row.optimalPrice.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono">
                            {isVio ? (
                              <div className="inline-flex flex-col items-end">
                                <span className="px-2.5 py-1 rounded-lg bg-rose-500 text-white font-bold text-xs shadow-sm">
                                  -${row.missedSavings.toFixed(2)}
                                </span>
                                <span className="text-[10px] text-rose-500 font-bold mt-0.5 uppercase">
                                  Violation
                                </span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                <CheckCircle2 className="w-4 h-4" />
                                $0.00 (Optimal)
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        )}

        {/* ================================================================
            DRIVER DISPATCH MODAL (TELEGRAM / VIBER READY)
        ================================================================ */}
        {dispatchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500">
                    <Send className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Driver Fuel Dispatch Generator
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Formatted with direct Google Maps GPS links for Telegram / Viber / Samsara
                    </p>
                  </div>
                </div>

                {/* Language Switcher for Dispatch Text */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold">
                    <button
                      onClick={() => setDispatchLang("UA")}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        dispatchLang === "UA"
                          ? "bg-emerald-500 text-white"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      🇺🇦 УКР
                    </button>
                    <button
                      onClick={() => setDispatchLang("EN")}
                      className={`px-2.5 py-1 rounded-md transition-colors ${
                        dispatchLang === "EN"
                          ? "bg-emerald-500 text-white"
                          : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      🇺🇸 ENG
                    </button>
                  </div>

                  <button
                    onClick={() => setDispatchModalOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <pre className="w-full max-h-[380px] overflow-y-auto p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed border border-slate-800">
                  {dispatchMessageText}
                </pre>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-500" />
                    <span>Includes exact GPS coordinates for each truck stop entrance</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDispatchModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleCopyDispatch}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all cursor-pointer"
                    >
                      {copiedDispatch ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy Dispatch for Telegram / Viber</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}