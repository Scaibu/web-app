import type {
  OverviewKPIAggregates,
  SystemHealthSLOBanner,
  RecentTracePreview,
  OverviewFilterModel,
} from "../models/overview.model";

export interface OverviewAdapterPort {
  fetchKPISummary(filter: OverviewFilterModel): Promise<OverviewKPIAggregates>;
  fetchSystemHealth(): Promise<SystemHealthSLOBanner>;
  fetchRecentTraces(): Promise<RecentTracePreview[]>;
}

export class OverviewMockAdapter implements OverviewAdapterPort {
  async fetchKPISummary(_filter: OverviewFilterModel): Promise<OverviewKPIAggregates> {
    return {
      p95_latency_ms: 382,
      quality_avg_score: 0.948,
      total_spend_usd: 14820.5,
      active_spans_count: 142500,
      p95_latency_delta_pct: -6.4,
      quality_delta_pct: 1.8,
      spend_delta_pct: -4.2,
    };
  }

  async fetchSystemHealth(): Promise<SystemHealthSLOBanner> {
    return {
      status: "healthy",
      fast_burn_active: false,
      medium_burn_active: false,
      active_alerts_count: 0,
      message: "All model endpoints operating within target latency and quality SLOs.",
    };
  }

  async fetchRecentTraces(): Promise<RecentTracePreview[]> {
    return [
      {
        id: "tr-9481a8b2",
        span_name: "chat_completion",
        service: "copilot-agent",
        model: "gpt-4o",
        duration_ms: 342,
        cost_usd: 0.0125,
        status: "success",
        timestamp: new Date().toISOString(),
      },
      {
        id: "tr-8392bc11",
        span_name: "rag_retrieve",
        service: "rag-service",
        model: "claude-3-5-sonnet",
        duration_ms: 512,
        cost_usd: 0.0241,
        status: "success",
        timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      },
      {
        id: "tr-7104de49",
        span_name: "generate_summary",
        service: "summarizer",
        model: "gpt-4o",
        duration_ms: 820,
        cost_usd: 0.0315,
        status: "error",
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      },
    ];
  }
}

export const overviewAdapter: OverviewAdapterPort = new OverviewMockAdapter();
