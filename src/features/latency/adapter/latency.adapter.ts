import type {
  PercentilesResult,
  SLOResult,
  BaselinePoint,
  AttributionResult,
  LatencyFilterModel,
} from "../models/latency.model";

export interface LatencyAdapterPort {
  fetchPercentiles(filter: LatencyFilterModel): Promise<PercentilesResult>;
  fetchSLO(filter: LatencyFilterModel): Promise<SLOResult>;
  fetchBaseline(filter: LatencyFilterModel): Promise<BaselinePoint[]>;
  fetchAttribution(filter: LatencyFilterModel): Promise<AttributionResult>;
}

export class LatencyMockAdapter implements LatencyAdapterPort {
  async fetchPercentiles(_filter: LatencyFilterModel): Promise<PercentilesResult> {
    return {
      p50: 142,
      p95: 395,
      p99: 620,
      sample_count: 14200,
    };
  }

  async fetchSLO(_filter: LatencyFilterModel): Promise<SLOResult> {
    return {
      burn_fast: 0.12,
      burn_medium: 0.45,
      burn_slow: 0.88,
      budget_remaining_pct: 98.4,
      slo_threshold_ms: 500,
    };
  }

  async fetchBaseline(_filter: LatencyFilterModel): Promise<BaselinePoint[]> {
    const dates = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
    return dates.map((date, idx) => ({
      date,
      p99_ttft_ms: 85 + idx * 4,
      p99_total_ms: 450 + Math.sin(idx) * 60,
    }));
  }

  async fetchAttribution(_filter: LatencyFilterModel): Promise<AttributionResult> {
    return {
      dns: 12,
      tcp: 24,
      queue: 45,
      inference: 314,
    };
  }
}

export const latencyAdapter: LatencyAdapterPort = new LatencyMockAdapter();
