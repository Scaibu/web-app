/**
 * Outbound Adapter & Realistic Telemetry Data for Cost Budgets.
 * Adheres strictly to Part III (Frontend Feature Structure: Adapter Role).
 */

import type { CostBudgetRule } from '../models/budgets.model';

export const DUMMY_BUDGET_RULES: CostBudgetRule[] = [
  {
    id: 'bgt-gpt4o-global',
    name: 'GPT-4o Production Monthly Cap',
    scope: 'model',
    target_identifier: 'gpt-4o',
    monthly_budget_usd: 1500.0,
    current_spend_usd: 1240.5,
    projected_spend_usd: 1820.0,
    burn_rate_usd_per_hour: 2.14,
    time_to_breach_days: 5.2,
    hard_limit_action: 'throttle_rate',
    status: 'warning',
    last_updated: new Date().toISOString(),
  },
  {
    id: 'bgt-copilot-service',
    name: 'Copilot Agent Autonomous Workspace',
    scope: 'service',
    target_identifier: 'copilot-agent',
    monthly_budget_usd: 800.0,
    current_spend_usd: 340.2,
    projected_spend_usd: 620.0,
    burn_rate_usd_per_hour: 0.65,
    time_to_breach_days: null,
    hard_limit_action: 'hard_kill_switch',
    status: 'healthy',
    last_updated: new Date().toISOString(),
  },
  {
    id: 'bgt-claude35-rag',
    name: 'Claude 3.5 Sonnet Financial Extraction',
    scope: 'model',
    target_identifier: 'claude-3-5-sonnet',
    monthly_budget_usd: 2500.0,
    current_spend_usd: 2580.0,
    projected_spend_usd: 3100.0,
    burn_rate_usd_per_hour: 4.82,
    time_to_breach_days: 0,
    hard_limit_action: 'hard_kill_switch',
    status: 'breached',
    last_updated: new Date().toISOString(),
  },
];

export interface BudgetsAdapterPort {
  listBudgets(): Promise<CostBudgetRule[]>;
}

export class BudgetsMockAdapter implements BudgetsAdapterPort {
  async listBudgets(): Promise<CostBudgetRule[]> {
    return [...DUMMY_BUDGET_RULES];
  }
}

export const budgetsAdapter = new BudgetsMockAdapter();
