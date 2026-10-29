/**
 * Central State Container for Cost Budgets & Hard Kill-Switches.
 * Strictly adheres to Part III (Frontend Feature Structure: State Role).
 */

import type { CostBudgetRule } from '../models/budgets.model';
import { DUMMY_BUDGET_RULES } from '../adapter/budgets.adapter';

export interface BudgetsStateData {
  budgets: CostBudgetRule[];
  selectedBudget: CostBudgetRule | null;
  statusFilter: string;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export class BudgetsState {
  private data: BudgetsStateData;
  private listeners: Set<(state: BudgetsStateData) => void> = new Set();

  constructor() {
    this.data = {
      budgets: DUMMY_BUDGET_RULES,
      selectedBudget: DUMMY_BUDGET_RULES[0] ?? null,
      statusFilter: 'all',
      isLoading: false,
      hasError: false,
      errorMessage: null,
    };
  }

  getSnapshot(): BudgetsStateData {
    return this.data;
  }

  subscribe(listener: (state: BudgetsStateData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  selectBudget(budget: CostBudgetRule | null): void {
    this.data = { ...this.data, selectedBudget: budget };
    this.notify();
  }

  setStatusFilter(filter: string): void {
    this.data = { ...this.data, statusFilter: filter };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.data));
  }
}

export const budgetsStateInstance = new BudgetsState();
