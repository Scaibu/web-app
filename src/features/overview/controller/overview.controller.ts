import type { OverviewFilterModel } from "../models/overview.model";
import { overviewAdapter, type OverviewAdapterPort } from "../adapter/overview.adapter";
import { overviewStateInstance, OverviewState } from "../state/overview.state";

export class OverviewController {
  constructor(
    private readonly state: OverviewState = overviewStateInstance,
    private readonly adapter: OverviewAdapterPort = overviewAdapter
  ) {}

  async loadOverviewData(filter: OverviewFilterModel = {}): Promise<void> {
    this.state.setLoading(true);
    try {
      const [kpis, health, recentTraces] = await Promise.all([
        this.adapter.fetchKPISummary(filter),
        this.adapter.fetchSystemHealth(),
        this.adapter.fetchRecentTraces(),
      ]);

      this.state.setData({
        kpis,
        health,
        recentTraces,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load overview data";
      this.state.setError(msg);
    }
  }
}

export const overviewController = new OverviewController();
