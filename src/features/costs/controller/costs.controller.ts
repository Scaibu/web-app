import type { CostsFilterModel } from "../models/costs.model";
import { costsAdapter, type CostsAdapterPort } from "../adapter/costs.adapter";
import { costsStateInstance, CostsState } from "../state/costs.state";

export class CostsController {
  constructor(
    private readonly state: CostsState = costsStateInstance,
    private readonly adapter: CostsAdapterPort = costsAdapter
  ) {}

  async loadCostMetrics(filter: CostsFilterModel = {}): Promise<void> {
    this.state.setLoading(true);
    try {
      const [summary, providers] = await Promise.all([
        this.adapter.fetchCostSummary(filter),
        this.adapter.fetchCostProviders(filter),
      ]);

      this.state.setData({ summary, providers });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load cost metrics";
      this.state.setError(msg);
    }
  }
}

export const costsController = new CostsController();
