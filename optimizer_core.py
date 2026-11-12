#!/usr/bin/env python3
"""Математичне ядро оптимізації палива (State-Space Dynamic Programming).

Маршрут: I-80 (Chicago, IL -> Salt Lake City, UT, дистанція 1400 миль).
Дискретизація станів бака: крок 2 галони.
Враховує:
- витрати палива на round-trip з'їзд із траси (2 * detour_miles / mpg),
- обмеження бака (min_reserve_gal <= fuel <= tank_capacity_gal),
- мінімальну купівлю 25 галонів на зупинці (min_purchase_gal = 25.0).
"""

from dataclasses import dataclass
import json
import os
from typing import Any, Dict, List, Optional


@dataclass
class RouteConfig:
  corridor_miles: float = 1400.0
  tank_capacity_gal: int = 150
  min_reserve_gal: int = 20
  initial_fuel_gal: int = 70
  step_gal: int = 2
  min_purchase_gal: float = 25.0


class FuelOptimizerDP:
  """Алгоритм динамічного програмування (State-Space DP) для пошуку глобального

    мінімуму вартості палива вздовж транспортного коридору.
    """

  def __init__(
      self,
      stations: List[Dict[str, Any]],
      config: Optional[RouteConfig] = None,
  ):
    self.config = config or RouteConfig()
    if (
        self.config.tank_capacity_gal - self.config.min_reserve_gal
    ) % self.config.step_gal != 0:
      raise ValueError(
          "Різниця між tank_capacity_gal та min_reserve_gal має ділитися на"
          " step_gal."
      )

    # Сортуємо станції за mile_marker у межах коридору
    self.stations = sorted(
        [
            s
            for s in stations
            if 0.0 < float(s["mile_marker"]) < self.config.corridor_miles
        ],
        key=lambda x: float(x["mile_marker"]),
    )

    # Дискретна сітка станів рівня палива в баку (крок 2 галони):
    # [min_reserve_gal, min_reserve_gal + 2, ..., tank_capacity_gal]
    self.fuel_grid: List[int] = list(
        range(
            self.config.min_reserve_gal,
            self.config.tank_capacity_gal + 1,
            self.config.step_gal,
        )
    )
    self.fuel_to_idx: Dict[int, int] = {
        f: idx for idx, f in enumerate(self.fuel_grid)
    }

  def _quantize_to_step(self, gallons: float) -> int:
    """Округлює значення галонів до найближчого кратного step_gal."""
    step = self.config.step_gal
    return int(round(gallons / step) * step)

  def optimize(self, mpg: float) -> Dict[str, Any]:
    """Знаходить глобальний оптимум вартості поїздки методом State-Space DP.

        Вузли маршруту:
          - Вузол 0: Старт (Chicago, IL, mile_marker = 0.0)
          - Вузли 1..N: 60 вантажних заправок уздовж I-80
          - Вузол N+1: Фініш (Salt Lake City, UT, mile_marker = 1400.0)

        Перехід між вузлами здійснюється по дискретизованій сітці палива з
        кроком 2 галони:
          - Якщо вантажівка проїжджає повз заправку (без зупинки), витрати на
          detour = 0,
            вартість = $0.
          - Якщо вантажівка зупиняється на заправці i:
            1) Витрачається паливо на round-trip з'їзд із траси: detour_fuel = 2
            * detour_miles / mpg.
            2) Перевіряється обмеження резерву бака при з'їзді: arrival_fuel -
            detour_fuel >= min_reserve_gal.
            3) Обирається цільовий дискретний стан палива при поверненні на
            трасу f_dep у сітці fuel_grid
               (min_reserve_gal <= f_dep <= tank_capacity_gal).
            4) Кількість куплених галонів g = (f_dep - arrival_fuel) +
            detour_fuel має задовольняти:
               g >= min_purchase_gal (25 галонів) та не перевищувати місткість
               бака.
            5) Додається вартість заправки: g * effective_price.
        """
    if mpg <= 0:
      raise ValueError("MPG має бути додатним числом.")

    cfg = self.config

    # Формуємо список усіх вузлів маршруту (0 = Origin, 1..N = Stations, N+1 = Destination)
    nodes: List[Dict[str, Any]] = [{
        "id": "ORIGIN",
        "brand": "Origin",
        "state": "IL",
        "exit_name": "Chicago, IL (Start)",
        "mile_marker": 0.0,
        "detour_miles": 0.0,
        "effective_price": 0.0,
        "retail_price": 0.0,
        "discount": 0.0,
        "is_terminal": True,
    }]
    for s in self.stations:
      node = dict(s)
      node["is_terminal"] = False
      nodes.append(node)
    nodes.append({
        "id": "DESTINATION",
        "brand": "Destination",
        "state": "UT",
        "exit_name": "Salt Lake City, UT (Finish)",
        "mile_marker": cfg.corridor_miles,
        "detour_miles": 0.0,
        "effective_price": 0.0,
        "retail_price": 0.0,
        "discount": 0.0,
        "is_terminal": True,
    })

    num_nodes = len(nodes)
    num_states = len(self.fuel_grid)

    # Для уникнення накопичення похибки округлення на 60 коротких сегментах
    # використовуємо телескопічну дискретизацію кумулятивної витрати палива по трасі (крок 2 галони):
    cum_hwy_gal_quantized = [
        self._quantize_to_step(float(n["mile_marker"]) / mpg) for n in nodes
    ]
    segment_hwy_burn = [
        cum_hwy_gal_quantized[i + 1] - cum_hwy_gal_quantized[i]
        for i in range(num_nodes - 1)
    ]

    # Таблиці DP:
    # dp[i][f_idx] — мінімальна вартість дістатися до вузла i з дискретним залишком палива fuel_grid[f_idx]
    INF = float("inf")
    dp = [[INF] * num_states for _ in range(num_nodes)]
    parent = [[None] * num_states for _ in range(num_nodes)]

    start_fuel = self._quantize_to_step(cfg.initial_fuel_gal)
    if start_fuel not in self.fuel_to_idx:
      raise ValueError(
          f"Початковий рівень палива {start_fuel} поза межами"
          f" [{cfg.min_reserve_gal}, {cfg.tank_capacity_gal}]."
      )
    dp[0][self.fuel_to_idx[start_fuel]] = 0.0

    # Прямий хід алгоритму динамічного програмування по вузлах i = 0 .. num_nodes - 2
    for i in range(num_nodes - 1):
      node = nodes[i]
      burn_to_next = segment_hwy_burn[i]
      is_terminal = node["is_terminal"]
      detour_fuel = (
          0.0 if is_terminal else (2.0 * float(node["detour_miles"]) / mpg)
      )
      price = float(node["effective_price"])

      for f_arr_idx, f_arr in enumerate(self.fuel_grid):
        current_cost = dp[i][f_arr_idx]
        if current_cost == INF:
          continue

        # Варіант 1: Проїхати вузол i без заправки (detour = 0, куплено = 0 галонів)
        f_next_pass = f_arr - burn_to_next
        if f_next_pass >= cfg.min_reserve_gal:
          next_idx = self.fuel_to_idx[f_next_pass]
          if current_cost < dp[i + 1][next_idx]:
            dp[i + 1][next_idx] = current_cost
            parent[i + 1][next_idx] = (
                f_arr_idx,
                False,
                0.0,
                0.0,
                f_arr,
                0.0,
            )

        # Варіант 2: З'їхати на заправку у вузлі i (доступно для станцій 1..N)
        if not is_terminal:
          # Перевірка: чи вистачає палива на з'їзд із траси без порушення незнижуваного резерву
          fuel_after_detour = f_arr - detour_fuel
          if fuel_after_detour < cfg.min_reserve_gal:
            continue

          # Перебираємо дискретні стани палива після повернення на трасу f_dep (крок 2 галони)
          for f_dep_idx, f_dep in enumerate(self.fuel_grid):
            # Кількість куплених галонів компенсує зміну дискретного стану + витрату на round-trip detour
            gallons_bought = (f_dep - f_arr) + detour_fuel

            # Обмеження мінімальної заправки 25 галонів
            if gallons_bought < cfg.min_purchase_gal - 1e-9:
              continue

            # Перевірка місткості бака безпосередньо біля колонки (після половини detour)
            fuel_at_pump_after_fill = (
                f_arr - (detour_fuel / 2.0) + gallons_bought
            )
            if fuel_at_pump_after_fill > cfg.tank_capacity_gal + 1e-9:
              continue

            # Перевірка досяжності наступного вузла з f_dep
            f_next = f_dep - burn_to_next
            if f_next < cfg.min_reserve_gal:
              continue

            next_idx = self.fuel_to_idx[f_next]
            stop_cost = gallons_bought * price
            new_total_cost = current_cost + stop_cost

            if new_total_cost < dp[i + 1][next_idx]:
              dp[i + 1][next_idx] = new_total_cost
              parent[i + 1][next_idx] = (
                  f_arr_idx,
                  True,
                  gallons_bought,
                  stop_cost,
                  f_dep,
                  detour_fuel,
              )

    # Знаходимо глобальний мінімум на фініші (вузол N+1) серед усіх допустимих кінцевих станів
    dest_node_idx = num_nodes - 1
    best_final_idx = -1
    min_total_cost = INF
    for f_idx in range(num_states):
      if dp[dest_node_idx][f_idx] < min_total_cost:
        min_total_cost = dp[dest_node_idx][f_idx]
        best_final_idx = f_idx

    if best_final_idx == -1 or min_total_cost == INF:
      raise RuntimeError(
          f"Маршрут нездійсненний для MPG={mpg} за заданих обмежень бака."
      )

    # Відновлення оптимального маршруту та графіка зупинок (Backtracking)
    stops_plan: List[Dict[str, Any]] = []
    curr_f_idx = best_final_idx
    total_detour_miles = 0.0
    total_detour_fuel = 0.0
    total_gallons_purchased = 0.0

    for i in range(dest_node_idx - 1, -1, -1):
      info = parent[i + 1][curr_f_idx]
      assert info is not None
      prev_f_idx, stopped, gallons_bought, stop_cost, f_dep, detour_fuel = info
      if stopped:
        st = nodes[i]
        retail_cost = gallons_bought * float(st["retail_price"])
        savings = gallons_bought * float(st["discount"])
        stops_plan.append({
            "station_id": st["id"],
            "brand": st["brand"],
            "state": st["state"],
            "exit_name": st["exit_name"],
            "mile_marker": st["mile_marker"],
            "detour_miles_one_way": st["detour_miles"],
            "detour_miles_round_trip": round(2.0 * float(st["detour_miles"]), 2),
            "detour_fuel_gal": round(detour_fuel, 3),
            "arrival_fuel_gal": self.fuel_grid[prev_f_idx],
            "departure_fuel_gal": f_dep,
            "gallons_purchased": round(gallons_bought, 2),
            "retail_price": st["retail_price"],
            "discount": st["discount"],
            "effective_price": st["effective_price"],
            "stop_cost_usd": round(stop_cost, 2),
            "retail_cost_usd": round(retail_cost, 2),
            "discount_savings_usd": round(savings, 2),
        })
        total_detour_miles += 2.0 * float(st["detour_miles"])
        total_detour_fuel += detour_fuel
        total_gallons_purchased += gallons_bought
      curr_f_idx = prev_f_idx

    stops_plan.reverse()

    exact_highway_fuel = cfg.corridor_miles / mpg
    quantized_highway_fuel = cum_hwy_gal_quantized[-1]
    final_fuel_gal = self.fuel_grid[best_final_idx]
    total_retail_cost = sum(s["retail_cost_usd"] for s in stops_plan)
    total_discount_savings = sum(s["discount_savings_usd"] for s in stops_plan)
    weighted_avg_price = (
        (min_total_cost / total_gallons_purchased)
        if total_gallons_purchased > 0
        else 0.0
    )

    return {
        "mpg": mpg,
        "corridor_miles": cfg.corridor_miles,
        "tank_capacity_gal": cfg.tank_capacity_gal,
        "min_reserve_gal": cfg.min_reserve_gal,
        "initial_fuel_gal": start_fuel,
        "final_fuel_gal": final_fuel_gal,
        "highway_fuel_exact_gal": round(exact_highway_fuel, 2),
        "highway_fuel_discretized_gal": quantized_highway_fuel,
        "total_detour_miles_round_trip": round(total_detour_miles, 2),
        "total_detour_fuel_gal": round(total_detour_fuel, 2),
        "total_fuel_burned_gal": round(
            quantized_highway_fuel + total_detour_fuel, 2
        ),
        "num_stops": len(stops_plan),
        "total_gallons_purchased": round(total_gallons_purchased, 2),
        "weighted_avg_effective_price": round(weighted_avg_price, 3),
        "total_retail_cost_usd": round(total_retail_cost, 2),
        "total_discount_savings_usd": round(total_discount_savings, 2),
        "total_optimal_cost_usd": round(min_total_cost, 2),
        "cost_per_mile_usd": round(min_total_cost / cfg.corridor_miles, 4),
        "stops": stops_plan,
    }


def run_scenarios(stations_path: str) -> List[Dict[str, Any]]:
  """Запускає тестування алгоритму на 3 сценаріях MPG (5.8, 6.8, 7.6)."""
  with open(stations_path, "r", encoding="utf-8") as f:
    stations = json.load(f)

  optimizer = FuelOptimizerDP(stations)
  scenarios = [
      ("Поганий (MPG = 5.8)", 5.8),
      ("Середній (MPG = 6.8)", 6.8),
      ("Хороший (MPG = 7.6)", 7.6),
  ]

  results = []
  for label, mpg in scenarios:
    res = optimizer.optimize(mpg)
    res["scenario_label"] = label
    results.append(res)
  return results


if __name__ == "__main__":
  default_path = os.path.join(
      os.path.dirname(os.path.abspath(__file__)), "stations_corridor_i80.json"
  )
  if not os.path.exists(default_path):
    default_path = "stations_corridor_i80.json"

  scenario_results = run_scenarios(default_path)

  print("=" * 112)
  print(
      "РЕЗУЛЬТАТИ ОПТИМІЗАЦІЇ ПАЛИВА (STATE-SPACE DP, КРОК 2 ГАЛОНИ) НА ТРАСІ"
      " I-80 (1400 МИЛЬ)"
  )
  print("=" * 112)
  header = (
      f"{'Сценарій':<22} | {'MPG':>4} | {'Зупинок':>7} | {'Витрата (gal)':>13} |"
      f" {'Detour (mi/gal)':>16} | {'Куплено (gal)':>13} | {'Сер. ціна':>9} |"
      f" {'Економія ($)':>12} | {'Вартість ($)':>12}"
  )
  print(header)
  print("-" * 112)
  for r in scenario_results:
    detour_str = f"{r['total_detour_miles_round_trip']:.2f} / {r['total_detour_fuel_gal']:.2f}"
    print(
        f"{r['scenario_label']:<22} | {r['mpg']:>4.1f} | {r['num_stops']:>7d} |"
        f" {r['total_fuel_burned_gal']:>13.2f} | {detour_str:>16} |"
        f" {r['total_gallons_purchased']:>13.2f} |"
        f" ${r['weighted_avg_effective_price']:>8.3f} |"
        f" ${r['total_discount_savings_usd']:>11.2f} |"
        f" ${r['total_optimal_cost_usd']:>11.2f}"
    )
  print("=" * 112)

  for r in scenario_results:
    print(
        f"\nДеталізація зупинок для сценарію: {r['scenario_label']} (Початковий"
        f" бак: {r['initial_fuel_gal']} gal, Фініш: {r['final_fuel_gal']} gal)"
    )
    for idx, s in enumerate(r["stops"], 1):
      print(
          f"  {idx}. [{s['station_id']}] {s['brand']} ({s['state']}, MM"
          f" {s['mile_marker']}) - {s['exit_name']} | Залишок:"
          f" {s['arrival_fuel_gal']} -> {s['departure_fuel_gal']} gal | Detour"
          f" RT: {s['detour_miles_round_trip']} mi ({s['detour_fuel_gal']} gal)"
          f" | Куплено: {s['gallons_purchased']:.2f} gal @ ${s['effective_price']:.2f}/gal"
          f" (retail ${s['retail_price']:.2f}, знижка ${s['discount']:.2f}) ="
          f" ${s['stop_cost_usd']:.2f}"
      )