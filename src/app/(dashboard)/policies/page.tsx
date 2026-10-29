import { Metadata } from 'next';
import { PoliciesDashboardUI } from '@/features/policies';

export const metadata: Metadata = {
  title: 'Policy Violations & Guardrail Incidents | LLM Observability',
  description: 'Real-time telemetry and audit logs for prompt injections, PII leaks, and guardrail latency overhead.',
};

export default function PoliciesPage() {
  return <PoliciesDashboardUI />;
}
