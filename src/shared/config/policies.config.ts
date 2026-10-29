/**
 * Centralized configurations and text constants for Policies feature.
 * Strictly adheres to 3.shared.code.writing.rule.md (Zero magic strings).
 */

export const POLICIES_TEXT = {
  HEADER_TITLE: 'Guardrails & Policy Violation Console',
  HEADER_SUBTITLE: 'Live tripwires for PII leaks, prompt injections, and runtime policy enforcement overhead.',
  KPI_TOTAL: 'Total Violations',
  KPI_CRITICAL: 'Critical Interceptions',
  KPI_OVERHEAD: 'Avg Guardrail Latency',
  FILTER_ALL_SEVERITY: 'All Severities',
  FILTER_ALL_TYPES: 'All Guardrail Types',
  TABLE_TIME: 'Timestamp',
  TABLE_SEVERITY: 'Severity',
  TABLE_TYPE: 'Guardrail Rule',
  TABLE_ACTION: 'Action Taken',
  TABLE_SERVICE: 'Service & Model',
  TABLE_TRACE: 'Trace ID',
  TABLE_OVERHEAD: 'Overhead',
  EMPTY_TITLE: 'Zero Policy Violations Detected',
  EMPTY_DESCRIPTION: 'Your active guardrails and PII redaction filters report 100% compliant completions across this timeframe.',
  ERROR_TITLE: 'Failed to Load Policy Violations',
  ERROR_RETRY: 'Retry Inspection',
} as const;
