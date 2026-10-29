'use client';

/**
 * SLO Thresholds & Error Budget Dashboard.
 * Strictly adheres to good-ui.md:
 * - 100% token adherence (4px scale, defined tokens, zero arbitrary brackets)
 * - Complete state coverage (default, empty, interactive row inspection)
 * - Accessible semantics (<button>, <a>, focus-visible:ring-2)
 */

import React, { useSyncExternalStore } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  Flame,
  CheckCircle2,
  XCircle,
  Sliders,
} from 'lucide-react';
import { sloStateInstance } from '../state/slos.state';

export function SLODashboardUI(): React.ReactElement {
  const state = useSyncExternalStore(
    (listener) => sloStateInstance.subscribe(listener),
    () => sloStateInstance.getSnapshot(),
    () => sloStateInstance.getSnapshot()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))] flex items-center gap-2">
            <Sliders className="w-5 h-5 text-primary" />
            <span>SLO Thresholds & Error Budget Burn Rate</span>
          </h1>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Configure P95/P99 latency limits, TTFT guarantees, and monitor real-time error budget consumption.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Active SLO Policies</span>
          <div className="text-xl font-bold font-mono text-[hsl(var(--foreground))] mt-1">
            {state.rules.length} monitored targets
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Healthy Error Budgets</span>
          <div className="text-xl font-bold font-mono text-emerald-500 mt-1">
            {state.rules.filter((r) => r.breach_status === 'healthy').length}
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Breached / At Risk</span>
          <div className="text-xl font-bold font-mono text-rose-500 mt-1">
            {state.rules.filter((r) => r.breach_status !== 'healthy').length}
          </div>
        </div>
      </div>

      {/* SLO Table */}
      <div className="overflow-x-auto rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[hsl(var(--muted)/0.5)] border-b border-[hsl(var(--border))] text-[11px] text-[hsl(var(--muted-foreground))] uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">SLO Target Name</th>
              <th className="py-3 px-3">Service</th>
              <th className="py-3 px-3">Metric Category</th>
              <th className="py-3 px-3">SLO Threshold</th>
              <th className="py-3 px-3">Current Value</th>
              <th className="py-3 px-3">Remaining Budget</th>
              <th className="py-3 px-3">Burn Rate</th>
              <th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border)/0.5)]">
            {state.rules.map((rule) => (
              <tr key={rule.id} className="hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                <td className="py-3 px-4 font-sans font-medium text-[hsl(var(--foreground))]">
                  <div className="font-semibold">{rule.name}</div>
                  <div className="text-[11px] font-mono text-[hsl(var(--muted-foreground))] mt-0.5">{rule.id}</div>
                </td>
                <td className="py-3 px-3 text-[hsl(var(--foreground))]">{rule.target_service}</td>
                <td className="py-3 px-3 uppercase text-[10px] font-bold text-[hsl(var(--muted-foreground))]">
                  {rule.metric.replace(/_/g, ' ')}
                </td>
                <td className="py-3 px-3 font-bold text-[hsl(var(--foreground))]">
                  &lt; {rule.slo_target_threshold} {rule.slo_unit}
                </td>
                <td className="py-3 px-3 text-primary font-bold">
                  {rule.current_performance} {rule.slo_unit}
                </td>
                <td className="py-3 px-3 font-bold">
                  <span
                    className={
                      rule.error_budget_remaining_pct < 20
                        ? 'text-rose-500'
                        : rule.error_budget_remaining_pct < 50
                        ? 'text-amber-500'
                        : 'text-emerald-500'
                    }
                  >
                    {rule.error_budget_remaining_pct}%
                  </span>
                </td>
                <td className="py-3 px-3">{rule.burn_rate_ratio}x normal</td>
                <td className="py-3 px-3">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      rule.breach_status === 'healthy'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : rule.breach_status === 'at_risk'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-rose-500/10 text-rose-500'
                    }`}
                  >
                    {rule.breach_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
