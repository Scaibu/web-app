import type {
  CostSummaryResult,
  CostByProvider,
  CostsFilterModel,
} from "../models/costs.model";

export interface CostsAdapterPort {
  fetchCostSummary(filter: CostsFilterModel): Promise<CostSummaryResult>;
  fetchCostProviders(filter: CostsFilterModel): Promise<CostByProvider[]>;
}

export class CostsMockAdapter implements CostsAdapterPort {
  async fetchCostSummary(_filter: CostsFilterModel): Promise<CostSummaryResult> {
    return {
      total_cost_usd: 14820.5,
      daily_avg_usd: 494.0,
      cost_delta_pct: -4.2,
      projected_monthly_usd: 15300.0,
    };
  }

  async fetchCostProviders(_filter: CostsFilterModel): Promise<CostByProvider[]> {
    return [
      {
        provider: "OpenAI",
        model: "gpt-4o",
        cost_usd: 8450.2,
        token_count: 65000000,
        pct_of_total: 57.0,
        input_tokens: 45000000,
        output_tokens: 20000000,
      },
      {
        provider: "Anthropic",
        model: "claude-3-5-sonnet",
        cost_usd: 4210.8,
        token_count: 41000000,
        pct_of_total: 28.4,
        input_tokens: 30000000,
        output_tokens: 11000000,
      },
      {
        provider: "Mistral",
        model: "mistral-large",
        cost_usd: 1420.5,
        token_count: 12500000,
        pct_of_total: 9.6,
        input_tokens: 9000000,
        output_tokens: 3500000,
      },
      {
        provider: "Local / vLLM",
        model: "llama-3.1-70b",
        cost_usd: 739.0,
        token_count: 6000000,
        pct_of_total: 5.0,
        input_tokens: 4500000,
        output_tokens: 1500000,
      },
    ];
  }
}

export const costsAdapter: CostsAdapterPort = new CostsMockAdapter();
