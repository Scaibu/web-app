import type { QualityFilterModel } from "../models/quality.model";
import { qualityAdapter, type QualityAdapterPort } from "../adapter/quality.adapter";
import { qualityStateInstance, QualityState } from "../state/quality.state";

export class QualityController {
  constructor(
    private readonly state: QualityState = qualityStateInstance,
    private readonly adapter: QualityAdapterPort = qualityAdapter
  ) {}

  async loadQualityMetrics(filter: QualityFilterModel = {}): Promise<void> {
    this.state.setLoading(true);
    try {
      const [summary, trend, modelBreakdown, flaggedContent] = await Promise.all([
        this.adapter.fetchQualitySummary(filter),
        this.adapter.fetchQualityTrend(filter),
        this.adapter.fetchModelBreakdown(filter),
        this.adapter.fetchFlaggedContent(filter),
      ]);

      this.state.setData({
        summary,
        trend,
        modelBreakdown,
        flaggedContent,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load quality metrics";
      this.state.setError(msg);
    }
  }
}

export const qualityController = new QualityController();
