export interface CostSummaryResult {
  total_cost_usd: number;
  daily_avg_usd: number;
  cost_delta_pct: number;
  projected_monthly_usd: number;
}

export interface CostByProvider {
  provider: string;
  model: string;
  cost_usd: number;
  token_count: number;
  pct_of_total: number;
  input_tokens?: number;
  output_tokens?: number;
}

export interface TokenConsumptionPoint {
  date: string;
  input_tokens: number;
  output_tokens: number;
  total_cost_usd: number;
}

export interface CostTrendPoint {
  date: string;
  cost_usd: number;
  token_count: number;
}

export interface CostCalculatorInput {
  tokens_per_day: number;
  model: string;
  cost_per_1k_tokens: number;
  budget_usd: number;
}

export interface CostCalculatorResult {
  daily_cost_usd: number;
  monthly_cost_usd: number;
  cost_per_1k: number;
  days_until_budget_hit: number | null;
  over_budget: boolean;
}

export interface ImportedSnapshot {
  label: string;
  providers: CostByProvider[];
  trend?: CostTrendPoint[];
  imported_at: string;
}

export interface CostsFilterModel {
  timeRange?: string;
  model?: string;
  service?: string;
  environment?: string;
}
