/**
 * Domain Models for SLO & Error Budget Management.
 * Strictly adheres to Part III (Frontend Feature Structure: Model Role).
 */

export interface SLOPolicyRule {
  id: string;
  name: string;
  target_service: string;
  metric: 'p95_latency' | 'p99_latency' | 'time_to_first_token' | 'error_rate' | 'hallucination_rate';
  slo_target_threshold: number;
  slo_unit: 'ms' | '%';
  current_performance: number;
  error_budget_remaining_pct: number;
  burn_rate_ratio: number;
  breach_status: 'healthy' | 'at_risk' | 'breached';
  window_hours: number;
}
