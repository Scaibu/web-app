export interface QualitySummaryResult {
  avg_quality_score: number;
  score_delta_pct: number;
  below_slo_count: number;
  total_evaluated_prompts: number;
}

export interface QualityTrendPoint {
  date: string;
  avg_quality_score: number;
  toxicity_alerts: number;
  hallucination_alerts: number;
}

export interface ModelQualityBreakdown {
  model: string;
  avg_score: number;
  min_score: number;
  max_score: number;
  evaluation_count: number;
  pass_rate_pct: number;
}

export interface FlaggedContentAlert {
  id: string;
  span_id: string;
  alert_type: "toxicity" | "hallucination" | "pii_leak" | "bias";
  severity: "critical" | "warning" | "info";
  confidence_score: number;
  prompt_snippet: string;
  timestamp: string;
}

export interface QualityFilterModel {
  model?: string;
  timeRange?: string;
  service?: string;
  environment?: string;
}
