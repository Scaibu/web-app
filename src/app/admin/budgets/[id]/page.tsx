import { Metadata } from 'next';
import { BudgetDetailUI } from '@/features/budgets';

export const metadata: Metadata = {
  title: 'Budget Policy Details & Burn Rate | LLM Observability',
  description: 'Forensic inspection of model spending caps, burn rate projections, and kill-switch triggers.',
};

export default async function AdminBudgetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  return <BudgetDetailUI budgetId={resolvedParams.id} />;
}
