import type { LatencyFilterModel } from "../models/latency.model";
import { latencyAdapter, type LatencyAdapterPort } from "../adapter/latency.adapter";
import { latencyStateInstance, LatencyState } from "../state/latency.state";

export class LatencyController {
  constructor(
    private readonly state: LatencyState = latencyStateInstance,
    private readonly adapter: LatencyAdapterPort = latencyAdapter
  ) {}

  async loadLatencyMetrics(filter: LatencyFilterModel = {}): Promise<void> {
    this.state.setLoading(true);
    try {
      const [percentiles, slo, baseline, attribution] = await Promise.all([
        this.adapter.fetchPercentiles(filter),
        this.adapter.fetchSLO(filter),
        this.adapter.fetchBaseline(filter),
        this.adapter.fetchAttribution(filter),
      ]);

      this.state.setData({
        percentiles,
        slo,
        attribution,
        baseline,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load latency data";
      this.state.setError(msg);
    }
  }
}

export const latencyController = new LatencyController();
