/**
 * Integrations & Webhook Alert Sinks Models.
 * Strictly adheres to Part III (Frontend Feature Structure: Model Role).
 */

export type SinkType = 'slack' | 'pagerduty' | 'custom_webhook' | 'email';
export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'info';

export interface AlertSink {
  id: string;
  name: string;
  type: SinkType;
  enabled: boolean;
  targetEndpoint: string;
  subscribedEvents: string[];
  minSeverity: IncidentSeverity;
  lastDispatchedAt: string;
  status: 'healthy' | 'degraded' | 'failing';
  deliverySuccessRate: number;
}

export interface DispatchedAlertLog {
  id: string;
  sinkId: string;
  sinkName: string;
  event: string;
  severity: IncidentSeverity;
  dispatchedAt: string;
  httpStatus: number;
  payloadSummary: string;
}
