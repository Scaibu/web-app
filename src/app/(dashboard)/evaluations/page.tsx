import { Metadata } from 'next';
import { EvaluationsDashboardUI } from '@/features/evaluations';

export const metadata: Metadata = {
  title: 'Evaluations & Benchmark Experiments | LLM Observability',
  description: 'Evaluate model performance, track regressions, and benchmark prompt versions before deployment.',
};

export default function EvaluationsPage() {
  return <EvaluationsDashboardUI />;
}
