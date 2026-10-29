/**
 * Outbound Adapter & Telemetry Data for SLO Rules.
 * Adheres strictly to Part III (Frontend Feature Structure: Adapter Role).
 */

import type { SLOPolicyRule } from '../models/slos.model';

export const DUMMY_SLO_RULES: SLOPolicyRule[] = [
  {
    id: 'slo-ttft-copilot',
    name: 'Streaming TTFT (Time-To-First-Token) Guarantee',
    target_service: 'copilot-agent',
    metric: 'time_to_first_token',
    slo_target_threshold: 450,
    slo_unit: 'ms',
    current_performance: 382,
    error_budget_remaining_pct: 88.4,
    burn_rate_ratio: 0.8,
    breach_status: 'healthy',
    window_hours: 24,
  },
  {
    id: 'slo-p99-rag-dense',
    name: 'RAG Hybrid Vector P99 Latency SLA',
    target_service: 'rag-service',
    metric: 'p99_latency',
    slo_target_threshold: 850,
    slo_unit: 'ms',
    current_performance: 920,
    error_budget_remaining_pct: 14.2,
    burn_rate_ratio: 3.4,
    breach_status: 'breached',
    window_hours: 24,
  },
  {
    id: 'slo-hallucination-cap',
    name: 'Institutional SEC Extraction Hallucination Ceiling',
    target_service: 'summarizer-agent',
    metric: 'hallucination_rate',
    slo_target_threshold: 4.0,
    slo_unit: '%',
    current_performance: 3.8,
    error_budget_remaining_pct: 32.0,
    burn_rate_ratio: 1.9,
    breach_status: 'at_risk',
    window_hours: 72,
  },
];

export interface SLOAdapterPort {
  listSLORules(): Promise<SLOPolicyRule[]>;
}

export class SLOMockAdapter implements SLOAdapterPort {
  async listSLORules(): Promise<SLOPolicyRule[]> {
    return [...DUMMY_SLO_RULES];
  }
}

export const sloAdapter = new SLOMockAdapter();
