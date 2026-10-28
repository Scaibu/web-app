import type {
  TraceSummary,
  TraceDetailResult,
  TracesFilterModel,
} from "../models/traces.model";

export interface TracesAdapterPort {
  listTraces(filter: TracesFilterModel): Promise<TraceSummary[]>;
  getTraceDetail(traceId: string): Promise<TraceDetailResult>;
}

export class TracesMockAdapter implements TracesAdapterPort {
  async listTraces(filter: TracesFilterModel): Promise<TraceSummary[]> {
    return [
      {
        id: "tr-9481a8b2",
        root_span_name: "chat_completion",
        service: filter.service || "copilot-agent",
        model: filter.model || "gpt-4o",
        duration_ms: 342,
        total_tokens: 1840,
        cost_usd: 0.0125,
        status: "success",
        timestamp: new Date().toISOString(),
      },
      {
        id: "tr-8392bc11",
        root_span_name: "rag_pipeline_retrieve",
        service: "rag-service",
        model: "claude-3-5-sonnet",
        duration_ms: 512,
        total_tokens: 2950,
        cost_usd: 0.0241,
        status: "success",
        timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      },
      {
        id: "tr-7104de49",
        root_span_name: "generate_summary",
        service: "summarizer",
        model: "gpt-4o",
        duration_ms: 820,
        total_tokens: 4120,
        cost_usd: 0.0315,
        status: "error",
        timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      },
    ];
  }

  async getTraceDetail(traceId: string): Promise<TraceDetailResult> {
    return {
      trace_id: traceId,
      root_span_name: "chat_completion",
      total_duration_ms: 342,
      spans: [
        {
          id: "span-root",
          name: "chat_completion",
          kind: "SERVER",
          service: "copilot-agent",
          model: "gpt-4o",
          start_time_offset_ms: 0,
          duration_ms: 342,
          status: "success",
          attributes: {
            "http.method": "POST",
            "http.status_code": 200,
          },
          children: [
            {
              id: "span-guardrail",
              parent_id: "span-root",
              name: "input_guardrail",
              kind: "INTERNAL",
              service: "copilot-agent",
              start_time_offset_ms: 5,
              duration_ms: 25,
              status: "success",
            },
            {
              id: "span-inference",
              parent_id: "span-root",
              name: "llm_generate",
              kind: "CLIENT",
              service: "copilot-agent",
              model: "gpt-4o",
              start_time_offset_ms: 32,
              duration_ms: 280,
              status: "success",
              attributes: {
                "llm.usage.prompt_tokens": 1420,
                "llm.usage.completion_tokens": 420,
              },
            },
          ],
        },
      ],
    };
  }
}

export const tracesAdapter: TracesAdapterPort = new TracesMockAdapter();
