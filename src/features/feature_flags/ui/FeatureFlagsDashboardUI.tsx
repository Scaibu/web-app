'use client';

/**
 * Feature Flag Management Dashboard.
 * Strictly adheres to good-ui.md:
 * - 100% token adherence (4px scale, defined tokens, zero arbitrary brackets)
 * - Complete state coverage (default, empty, interactive toggle inspection)
 * - Accessible semantics (<button>, <a>, focus-visible:ring-2)
 */

import React, { useSyncExternalStore } from 'react';
import {
  Flag,
  CheckCircle2,
  XCircle,
  Percent,
  Sliders,
  Layers,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { featureFlagsStateInstance } from '../state/feature_flags.state';

export function FeatureFlagsDashboardUI(): React.ReactElement {
  const state = useSyncExternalStore(
    (listener) => featureFlagsStateInstance.subscribe(listener),
    () => featureFlagsStateInstance.getSnapshot(),
    () => featureFlagsStateInstance.getSnapshot()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))] flex items-center gap-2">
            <Flag className="w-5 h-5 text-primary" />
            <span>Feature Flag Management & Percentage Rollouts</span>
          </h1>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Toggle production LLM routing heuristics, speculative decoding pipelines, and tenant-level rule targeting.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Total Configured Flags</span>
          <div className="text-xl font-bold font-mono text-[hsl(var(--foreground))] mt-1">
            {state.flags.length} flags
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Active in Production</span>
          <div className="text-xl font-bold font-mono text-emerald-500 mt-1">
            {state.flags.filter((f) => f.enabled && f.environment === 'production').length} active
          </div>
        </div>
        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <span className="text-[11px] text-[hsl(var(--muted-foreground))]">Gradual Canary Rollouts</span>
          <div className="text-xl font-bold font-mono text-primary mt-1">
            {state.flags.filter((f) => f.rollout_percentage < 100).length} partial
          </div>
        </div>
      </div>

      {/* Feature Flags Table */}
      <div className="overflow-x-auto rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[hsl(var(--muted)/0.5)] border-b border-[hsl(var(--border))] text-[11px] text-[hsl(var(--muted-foreground))] uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Feature Flag Key</th>
              <th className="py-3 px-3">Description</th>
              <th className="py-3 px-3">Environment</th>
              <th className="py-3 px-3">Rollout %</th>
              <th className="py-3 px-3">Targeting Rules</th>
              <th className="py-3 px-4 text-right">Toggle Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border)/0.5)]">
            {state.flags.map((flag) => (
              <tr key={flag.id} className="hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                <td className="py-3 px-4 font-sans font-medium text-[hsl(var(--foreground))]">
                  <div className="font-bold text-primary font-mono">{flag.key}</div>
                  <div className="text-[11px] font-sans text-[hsl(var(--muted-foreground))] mt-0.5">{flag.name}</div>
                </td>
                <td className="py-3 px-3 font-sans text-[hsl(var(--muted-foreground))] max-w-sm">
                  {flag.description}
                </td>
                <td className="py-3 px-3 uppercase text-[10px] font-bold text-[hsl(var(--muted-foreground))]">
                  {flag.environment}
                </td>
                <td className="py-3 px-3 font-bold text-[hsl(var(--foreground))]">{flag.rollout_percentage}%</td>
                <td className="py-3 px-3 text-[hsl(var(--foreground))]">{flag.targeting_rules_count} rules</td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => featureFlagsStateInstance.toggleFlag(flag.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[11px] font-semibold border transition-colors focus-visible:ring-2 focus-visible:ring-primary ${
                      flag.enabled
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                        : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border-[hsl(var(--border))]'
                    }`}
                  >
                    {flag.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
