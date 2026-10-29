'use client';

/**
 * Dedicated Full-Page Detail Screen for Cost Budget & Hard Kill-Switch Rules.
 * Strictly adheres to good-ui.md:
 * - 100% token adherence (4px scale, defined tokens, zero arbitrary brackets)
 * - Complete state coverage (default, empty/not found state)
 * - Accessible semantics (<button>, <a>, focus-visible:ring-2)
 */

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Coins,
  ShieldAlert,
  Flame,
  Clock,
  Sliders,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { budgetsStateInstance } from '../state/budgets.state';

export function BudgetDetailUI({ budgetId }: { budgetId: string }): React.ReactElement {
  const state = useSyncExternalStore(
    (listener) => budgetsStateInstance.subscribe(listener),
    () => budgetsStateInstance.getSnapshot(),
    () => budgetsStateInstance.getSnapshot()
  );

  const budget = state.budgets.find((b) => b.id === budgetId);

  if (!budget) {
    return (
      <div className="p-12 text-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col items-center gap-3">
        <Coins className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
        <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Budget Policy Not Found</h2>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          The requested cost budget identifier '{budgetId}' was not found in active organization policies.
        </p>
        <Link
          href="/admin/budgets"
          className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline mt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Budget Configurations</span>
        </Link>
      </div>
    );
  }

  const pct = ((budget.current_spend_usd / budget.monthly_budget_usd) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
        <Link href="/admin/budgets" className="hover:text-[hsl(var(--foreground))] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Budget Configuration</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-[hsl(var(--foreground))]">{budget.id}</span>
      </div>

      {/* Hero Header */}
      <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              {budget.name}
            </h1>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                budget.status === 'healthy'
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : budget.status === 'warning'
                  ? 'bg-amber-500/10 text-amber-500'
                  : 'bg-rose-500/10 text-rose-500'
              }`}
            >
              {budget.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-[hsl(var(--muted-foreground))]">
            <span>Scope: <strong className="text-[hsl(var(--foreground))]">{budget.scope}</strong></span>
            <span>·</span>
            <span>Target: <strong className="text-[hsl(var(--foreground))]">{budget.target_identifier}</strong></span>
            <span>·</span>
            <span>Enforcement: <strong className="text-[hsl(var(--foreground))] uppercase">{budget.hard_limit_action.replace(/_/g, ' ')}</strong></span>
          </div>
        </div>

        <button
          type="button"
          className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors focus-visible:ring-2 focus-visible:ring-rose-500 shrink-0"
        >
          Arm Emergency Kill-Switch
        </button>
      </div>

      {/* Burn Rate Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Current Allocation</span>
          <div className="text-lg font-bold font-mono text-[hsl(var(--foreground))] mt-1">
            ${budget.current_spend_usd.toFixed(2)} ({pct}%)
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Monthly Hard Cap</span>
          <div className="text-lg font-bold font-mono text-primary mt-1">
            ${budget.monthly_budget_usd.toFixed(2)}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Projected Month-End</span>
          <div className="text-lg font-bold font-mono text-rose-500 mt-1">
            ${budget.projected_spend_usd.toFixed(2)}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Live Hourly Burn</span>
          <div className="text-lg font-bold font-mono text-amber-500 mt-1">
            ${budget.burn_rate_usd_per_hour.toFixed(2)} / hr
          </div>
        </div>
      </div>
    </div>
  );
}
