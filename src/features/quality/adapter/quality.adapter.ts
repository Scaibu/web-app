import type {
  QualitySummaryResult,
  QualityTrendPoint,
  ModelQualityBreakdown,
  FlaggedContentAlert,
  QualityFilterModel,
} from "../models/quality.model";

export interface QualityAdapterPort {
  fetchQualitySummary(filter: QualityFilterModel): Promise<QualitySummaryResult>;
  fetchQualityTrend(filter: QualityFilterModel): Promise<QualityTrendPoint[]>;
  fetchModelBreakdown(filter: QualityFilterModel): Promise<ModelQualityBreakdown[]>;
  fetchFlaggedContent(filter: QualityFilterModel): Promise<FlaggedContentAlert[]>;
}

export class QualityMockAdapter implements QualityAdapterPort {
  async fetchQualitySummary(_filter: QualityFilterModel): Promise<QualitySummaryResult> {
    return {
      avg_quality_score: 0.942,
      score_delta_pct: 3.2,
      below_slo_count: 8,
      total_evaluated_prompts: 42100,
    };
  }

  async fetchQualityTrend(_filter: QualityFilterModel): Promise<QualityTrendPoint[]> {
    const dates = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];
    return dates.map((date, idx) => ({
      date,
      avg_quality_score: 0.92 + idx * 0.005,
      toxicity_alerts: idx === 3 ? 1 : 0,
      hallucination_alerts: idx === 5 ? 2 : 1,
    }));
  }

  async fetchModelBreakdown(_filter: QualityFilterModel): Promise<ModelQualityBreakdown[]> {
    return [
      {
        model: "gpt-4o",
        avg_score: 0.962,
        min_score: 0.81,
        max_score: 0.99,
        evaluation_count: 22000,
        pass_rate_pct: 99.1,
      },
      {
        model: "claude-3-5-sonnet",
        avg_score: 0.958,
        min_score: 0.79,
        max_score: 0.99,
        evaluation_count: 14000,
        pass_rate_pct: 98.7,
      },
      {
        model: "mistral-large",
        avg_score: 0.914,
        min_score: 0.71,
        max_score: 0.97,
        evaluation_count: 6100,
        pass_rate_pct: 94.5,
      },
    ];
  }

  async fetchFlaggedContent(_filter: QualityFilterModel): Promise<FlaggedContentAlert[]> {
    return [
      {
        id: "alert-1",
        span_id: "sp-7104de49",
        alert_type: "hallucination",
        severity: "warning",
        confidence_score: 0.89,
        prompt_snippet: "Explain the historical earnings per share for XYZ in 1992...",
        timestamp: new Date().toISOString(),
      },
      {
        id: "alert-2",
        span_id: "sp-9821bb30",
        alert_type: "pii_leak",
        severity: "critical",
        confidence_score: 0.96,
        prompt_snippet: "Credit card number embedded in context: 4111-XXXX-XXXX-1234",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      },
    ];
  }
}

export const qualityAdapter: QualityAdapterPort = new QualityMockAdapter();
