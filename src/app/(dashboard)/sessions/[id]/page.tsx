import { Metadata } from 'next';
import { SessionDetailUI } from '@/features/sessions';

export const metadata: Metadata = {
  title: 'Conversation Session Thread Audit | LLM Observability',
  description: 'Forensic inspection of turn-by-turn prompts, completions, and compounding token footprint.',
};

export default async function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <SessionDetailUI sessionId={resolvedParams.id} />;
}
