/**
 * Adapter & Mock Data for Alert Sinks and Integrations.
 * Strictly adheres to Part III (Frontend Feature Structure: Adapter Role).
 */

import type { AlertSink, DispatchedAlertLog } from '../models/integrations.model';

export const INITIAL_SINKS: AlertSink[] = [
  {
    id: 'sink-slack-prod-sec',
    name: 'SecOps Critical Alerts',
    type: 'slack',
    enabled: true,
    targetEndpoint: 'https://hooks.slack.com/services/T00/B00/sec-prod-alerts',
    subscribedEvents: ['guardrail.pii_leak', 'guardrail.prompt_injection', 'budget.hard_kill'],
    minSeverity: 'high',
    lastDispatchedAt: '2026-10-29T17:42:10Z',
    status: 'healthy',
    deliverySuccessRate: 99.8,
  },
  {
    id: 'sink-pd-oncall',
    name: 'PagerDuty AI Tier-1 Escalation',
    type: 'pagerduty',
    enabled: true,
    targetEndpoint: 'https://events.pagerduty.com/v2/enqueue',
    subscribedEvents: ['budget.hard_kill', 'slo.ttft_breach_p99'],
    minSeverity: 'critical',
    lastDispatchedAt: '2026-10-29T16:15:00Z',
    status: 'healthy',
    deliverySuccessRate: 100.0,
  },
  {
    id: 'sink-custom-siem',
    name: 'Enterprise Splunk SIEM Webhook',
    type: 'custom_webhook',
    enabled: true,
    targetEndpoint: 'https://siem-collector.internal.corp/v1/llm-audit',
    subscribedEvents: ['policy.all_violations', 'eval.regression_detected'],
    minSeverity: 'medium',
    lastDispatchedAt: '2026-10-29T18:04:33Z',
    status: 'healthy',
    deliverySuccessRate: 99.4,
  },
  {
    id: 'sink-slack-finops',
    name: 'FinOps Budget Notifications',
    type: 'slack',
    enabled: false,
    targetEndpoint: 'https://hooks.slack.com/services/T00/B00/finops-feed',
    subscribedEvents: ['budget.soft_warning_80'],
    minSeverity: 'medium',
    lastDispatchedAt: '2026-10-28T09:10:00Z',
    status: 'degraded',
    deliverySuccessRate: 91.2,
  },
];

export const INITIAL_ALERT_LOGS: DispatchedAlertLog[] = [
  {
    id: 'log-891',
    sinkId: 'sink-slack-prod-sec',
    sinkName: 'SecOps Critical Alerts',
    event: 'guardrail.prompt_injection',
    severity: 'critical',
    dispatchedAt: '2026-10-29T17:42:10Z',
    httpStatus: 200,
    payloadSummary: 'Blocked SQL jailbreak payload targeting finance agent prompt template.',
  },
  {
    id: 'log-890',
    sinkId: 'sink-custom-siem',
    sinkName: 'Enterprise Splunk SIEM Webhook',
    event: 'policy.pii_anonymized',
    severity: 'medium',
    dispatchedAt: '2026-10-29T18:04:33Z',
    httpStatus: 200,
    payloadSummary: 'Redacted 4 SSNs and 2 email addresses before forwarding span to analytics.',
  },
  {
    id: 'log-889',
    sinkId: 'sink-pd-oncall',
    sinkName: 'PagerDuty AI Tier-1 Escalation',
    event: 'budget.hard_kill',
    severity: 'critical',
    dispatchedAt: '2026-10-29T16:15:00Z',
    httpStatus: 202,
    payloadSummary: 'Agentic Tool recursive looping breached $100/hr emergency budget ceiling.',
  },
];
