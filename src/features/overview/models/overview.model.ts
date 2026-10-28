export interface OverviewKPIAggregates {
  p95_latency_ms: number;
  quality_avg_score: number;
  total_spend_usd: number;
  active_spans_count: number;
  p95_latency_delta_pct: number;
  quality_delta_pct: number;
  spend_delta_pct: number;
}

export interface SystemHealthSLOBanner {
  status: "healthy" | "warning" | "critical";
  fast_burn_active: boolean;
  medium_burn_active: boolean;
  active_alerts_count: number;
  message: string;
}

export interface RecentTracePreview {
  id: string;
  span_name: string;
  service: string;
  model: string;
  duration_ms: number;
  cost_usd: number;
  status: "success" | "error";
  timestamp: string;
}

export interface OverviewFilterModel {
  timeRange?: string;
  environment?: string;
}
