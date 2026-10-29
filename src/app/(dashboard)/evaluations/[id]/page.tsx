import { Metadata } from 'next';
import { EvaluationDetailUI } from '@/features/evaluations';

export const metadata: Metadata = {
  title: 'Evaluation Run Analysis | LLM Observability',
  description: 'Deep sample-by-sample analysis, regression deltas, and failure classification.',
};

export default async function EvaluationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <EvaluationDetailUI runId={resolvedParams.id} />;
}
