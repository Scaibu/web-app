/**
 * Domain Models for Policy Enforcement & Guardrail Violations.
 * Strictly adheres to Part III (Frontend Feature Structure: Model Role).
 */

export type ViolationSeverity = 'critical' | 'high' | 'medium' | 'low';

export type GuardrailType =
  | 'pii_leakage'
  | 'prompt_injection'
  | 'jailbreak_attempt'
  | 'toxic_output'
  | 'context_leak'
  | 'unauthorized_tool_call';

export type ViolationAction = 'blocked' | 'redacted' | 'flagged' | 'quarantined';

export interface PolicyViolation {
  id: string;
  trace_id: string;
  span_id?: string;
  timestamp: string;
  guardrail_type: GuardrailType;
  severity: ViolationSeverity;
  action_taken: ViolationAction;
  model: string;
  service: string;
  rule_id: string;
  rule_name: string;
  raw_snippet: string;
  redacted_snippet?: string;
  latency_overhead_ms: number;
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
}

export interface PolicySummaryStats {
  totalViolations: number;
  criticalBlocked: number;
  avgOverheadMs: number;
  topOffendingService: string;
}
