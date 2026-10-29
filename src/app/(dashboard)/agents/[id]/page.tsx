import { Metadata } from 'next';
import { AgentDetailUI } from '@/features/agents';

export const metadata: Metadata = {
  title: 'Agent Tool Invocation Forensic Audit | LLM Observability',
  description: 'Forensic inspection of agentic multi-turn DAG steps, JSON arguments, and execution loops.',
};

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <AgentDetailUI traceId={resolvedParams.id} />;
}
