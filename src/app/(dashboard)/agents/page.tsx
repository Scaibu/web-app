import { Metadata } from 'next';
import { AgentsDashboardUI } from '@/features/agents';

export const metadata: Metadata = {
  title: 'Agentic Tool & Function Call Visualizer | LLM Observability',
  description: 'Trace multi-turn agent DAGs, recursive tool call loops, schema validation failures, and token footprint.',
};

export default function AgentsPage() {
  return <AgentsDashboardUI />;
}
