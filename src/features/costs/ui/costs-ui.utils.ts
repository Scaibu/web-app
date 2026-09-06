import type { CostByProvider, CostTrendPoint, CostCalculatorResult, ImportedSnapshot } from '../types';

export function filterProviders(providers: CostByProvider[], query: string): CostByProvider[] {
  const q = query.trim().toLowerCase();
  if (!q) return providers;
  return providers.filter(
    (p) => p.provider.toLowerCase().includes(q) || p.model.toLowerCase().includes(q),
  );
}

export function computeDetailMetrics(row: CostByProvider) {
  const costPer1k = row.token_count > 0 ? (row.cost_usd / row.token_count) * 1000 : 0;
  const dailyRunRate = row.cost_usd / 30;
  const projectedMonthly = dailyRunRate * 30;
  const inputPct =
    row.input_tokens != null && row.token_count > 0
      ? (row.input_tokens / row.token_count) * 100
      : null;
  const outputPct =
    row.output_tokens != null && row.token_count > 0
      ? (row.output_tokens / row.token_count) * 100
      : null;
  return { costPer1k, dailyRunRate, projectedMonthly, inputPct, outputPct };
}

export function computeCalculatorResult(
  tokensPerDay: number,
  costPer1kTokens: number,
  budgetUsd: number,
): CostCalculatorResult {
  const dailyCostUsd = (tokensPerDay / 1000) * costPer1kTokens;
  const monthlyCostUsd = dailyCostUsd * 30;
  const daysUntilBudgetHit = budgetUsd > 0 && dailyCostUsd > 0 ? Math.floor(budgetUsd / dailyCostUsd) : null;
  return {
    daily_cost_usd: dailyCostUsd,
    monthly_cost_usd: monthlyCostUsd,
    cost_per_1k: costPer1kTokens,
    days_until_budget_hit: daysUntilBudgetHit,
    over_budget: monthlyCostUsd > budgetUsd && budgetUsd > 0,
  };
}

export function computeComparisonDelta(a: CostByProvider, b: CostByProvider) {
  const costDeltaAbs = a.cost_usd - b.cost_usd;
  const costDeltaPct = b.cost_usd > 0 ? ((a.cost_usd - b.cost_usd) / b.cost_usd) * 100 : 0;
  const tokenDeltaAbs = a.token_count - b.token_count;
  const tokenDeltaPct = b.token_count > 0 ? ((a.token_count - b.token_count) / b.token_count) * 100 : 0;
  const effA = a.token_count > 0 ? a.cost_usd / a.token_count : 0;
  const effB = b.token_count > 0 ? b.cost_usd / b.token_count : 0;
  const effDeltaPct = effB > 0 ? ((effA - effB) / effB) * 100 : 0;
  return { costDeltaAbs, costDeltaPct, tokenDeltaAbs, tokenDeltaPct, effDeltaPct };
}

export function trendPointsToUplotData(points: CostTrendPoint[]): [number[], number[], number[]] {
  const timestamps = points.map((p) => Math.floor(new Date(p.date).getTime() / 1000));
  const costs = points.map((p) => p.cost_usd);
  const tokens = points.map((p) => p.token_count);
  return [timestamps, costs, tokens];
}

export function parseImportedJson(raw: string): ImportedSnapshot | null {
  try {
    const parsed = JSON.parse(raw);
    const providers: CostByProvider[] = Array.isArray(parsed) ? parsed : parsed.providers ?? [];
    const trend: CostTrendPoint[] | undefined = Array.isArray(parsed.trend) ? parsed.trend : undefined;
    const label: string = typeof parsed.label === 'string' ? parsed.label : 'Imported Snapshot';
    return { label, providers, trend, imported_at: new Date().toISOString() };
  } catch {
    return null;
  }
}

export function buildPeriodComparisonUplotData(
  current: CostTrendPoint[],
  previous: CostTrendPoint[],
): [number[], number[], number[]] {
  const len = Math.max(current.length, previous.length);
  const indices = Array.from({ length: len }, (_, i) => i);
  const curr = indices.map((i) => current[i]?.cost_usd ?? 0);
  const prev = indices.map((i) => previous[i]?.cost_usd ?? 0);
  return [indices, curr, prev];
}
