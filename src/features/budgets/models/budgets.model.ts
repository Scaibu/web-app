/**
 * Domain Models for Cost & Token Burn Budget Alerts.
 * Strictly adheres to Part III (Frontend Feature Structure: Model Role).
 */

export interface CostBudgetRule {
  id: string;
  name: string;
  scope: 'model' | 'service' | 'tenant';
  target_identifier: string;
  monthly_budget_usd: number;
  current_spend_usd: number;
  projected_spend_usd: number;
  burn_rate_usd_per_hour: number;
  time_to_breach_days: number | null;
  hard_limit_action: 'throttle_rate' | 'hard_kill_switch' | 'notify_only';
  status: 'healthy' | 'warning' | 'breached';
  last_updated: string;
}
