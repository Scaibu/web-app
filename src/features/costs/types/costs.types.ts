export interface CostSummaryResult {
  total_cost_usd: number;           // e.g. 1420.50
  daily_avg_usd: number;            // e.g. 47.35
  cost_delta_pct: number;           // e.g. +5.8
  projected_monthly_usd: number;    // e.g. 1450.00
}

export interface CostByProvider {
  provider: string;                 // e.g. "OpenAI", "Anthropic", "Cohere"
  model: string;                    // e.g. "gpt-4o", "claude-3-5-sonnet"
  cost_usd: number;
  token_count: number;
  pct_of_total: number;
  input_tokens?: number;            // breakdown for detail dialog
  output_tokens?: number;
}

export interface TokenConsumptionPoint {
  date: string;
  input_tokens: number;
  output_tokens: number;
  total_cost_usd: number;
}

/** A single day cost data point used for trend charts */
export interface CostTrendPoint {
  date: string;                     // ISO date e.g. "2025-08-15"
  cost_usd: number;
  token_count: number;
}

/** Input for the cost calculator estimator panel */
export interface CostCalculatorInput {
  tokens_per_day: number;
  model: string;
  cost_per_1k_tokens: number;
  budget_usd: number;
}

/** Output from the cost calculator */
export interface CostCalculatorResult {
  daily_cost_usd: number;
  monthly_cost_usd: number;
  cost_per_1k: number;
  days_until_budget_hit: number | null;
  over_budget: boolean;
}

/** An imported snapshot of provider cost data used as comparison baseline */
export interface ImportedSnapshot {
  label: string;                    // e.g. "Last month export"
  providers: CostByProvider[];
  trend?: CostTrendPoint[];
  imported_at: string;              // ISO timestamp
}

