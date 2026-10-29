import { IntegrationsDashboardUI } from '@/features/integrations';

export const metadata = {
  title: 'Alert Sinks & Incident Webhooks | LLM Observability',
  description: 'Manage notification integrations for Slack, PagerDuty, and SIEM webhooks.',
};

export default function IntegrationsPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <IntegrationsDashboardUI />
    </div>
  );
}
