import { Metadata } from 'next';
import { PolicyDetailUI } from '@/features/policies';

export const metadata: Metadata = {
  title: 'Policy Violation Forensic Audit | LLM Observability',
  description: 'Forensic inspection of prompt injections, PII leakage, and tripwire enforcement actions.',
};

export default async function PolicyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <PolicyDetailUI violationId={resolvedParams.id} />;
}
