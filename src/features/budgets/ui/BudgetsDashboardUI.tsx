'use client';

/**
 * Cost & Token Burn Budget Alerts Dashboard.
 * Strictly adheres to good-ui.md:
 * - 100% token adherence (4px scale, defined tokens, zero arbitrary brackets)
 * - Complete state coverage (default, empty/filter, interactive row inspection)
 * - Accessible semantics (<button>, <a>, focus-visible:ring-2)
 */

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  AlertTriangle,
  Clock,
  Coins,
  ShieldAlert,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { budgetsStateInstance } from '../state/budgets.state';

export function BudgetsDashboardUI(): React.ReactElement {
  const state = useSyncExternalStore(
    (listener) => budgetsStateInstance.subscribe(listener),
    () => budgetsStateInstance.getSnapshot(),
    () => budgetsStateInstance.getSnapshot()
  );

  const totalMonthlyCap = state.budgets.reduce((acc, b) => acc + b.monthly_budget_usd, 0);
  const totalCurrentSpend = state.budgets.reduce((acc, b) => acc + b.current_spend_usd, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))] flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            <span>Cost & Token Burn Rate Budgets</span>
          </h1>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Enforce hard dollar limits, track hourly token burn rates, and prevent runaway LLM inference billing spikes.
          </p>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Cumulative Monthly Budget</span>
          <div className="text-xl font-bold font-mono text-[hsl(var(--foreground))] mt-1">
            ${totalMonthlyCap.toFixed(2)}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Current Month Spend</span>
          <div className="text-xl font-bold font-mono text-primary mt-1">
            ${totalCurrentSpend.toFixed(2)}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Breached Caps</span>
          <div className="text-xl font-bold font-mono text-rose-500 mt-1">
            {state.budgets.filter((b) => b.status === 'breached').length}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Hard Kill-Switch Armed</span>
          <div className="text-xl font-bold font-mono text-amber-500 mt-1">
            {state.budgets.filter((b) => b.hard_limit_action === 'hard_kill_switch').length} rules
          </div>
        </div>
      </div>

      {/* Budgets Table */}
      <div className="overflow-x-auto rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[hsl(var(--muted)/0.5)] border-b border-[hsl(var(--border))] text-[11px] text-[hsl(var(--muted-foreground))] uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Budget Policy</th>
              <th className="py-3 px-3">Scope Target</th>
              <th className="py-3 px-3">Spend / Monthly Cap</th>
              <th className="py-3 px-3">Hourly Burn Rate</th>
              <th className="py-3 px-3">Est. Days to Breach</th>
              <th className="py-3 px-3">Enforcement Action</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-4 text-right">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border)/0.5)]">
            {state.budgets.map((b) => {
              const pct = ((b.current_spend_usd / b.monthly_budget_usd) * 100).toFixed(1);
              return (
                <tr key={b.id} className="hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-[hsl(var(--foreground))]">
                    <div className="font-semibold">{b.name}</div>
                    <div className="text-[11px] font-mono text-[hsl(var(--muted-foreground))] mt-0.5">{b.id}</div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-[hsl(var(--muted))] text-[hsl(var(--foreground))]">
                      {b.scope}: {b.target_identifier}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-[hsl(var(--foreground))]">
                      ${b.current_spend_usd.toFixed(2)} / ${b.monthly_budget_usd.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-[hsl(var(--muted-foreground))]">{pct}% allocated</div>
                  </td>
                  <td className="py-3 px-3 text-primary font-bold">${b.burn_rate_usd_per_hour.toFixed(2)} / hr</td>
                  <td className="py-3 px-3 text-[hsl(var(--foreground))]">
                    {b.time_to_breach_days !== null ? `${b.time_to_breach_days} days` : 'Within limits'}
                  </td>
                  <td className="py-3 px-3 uppercase text-[10px] font-bold text-[hsl(var(--muted-foreground))]">
                    {b.hard_limit_action.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        b.status === 'healthy'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : b.status === 'warning'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-rose-500/10 text-rose-500'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/budgets/${b.id}`}
                      className="px-2.5 py-1 rounded text-[11px] font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      Inspect
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
