'use client';

/**
 * Dedicated Full-Page Detail Screen for Prompt Templates.
 * Strictly adheres to good-ui.md:
 * - Real data content first, 100% token adherence
 * - Full state coverage (default, empty/not found state)
 * - Accessible semantics and breadcrumb navigation
 */

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Cpu,
  GitBranch,
  Layers,
  Clock,
  Coins,
  Copy,
  Check,
} from 'lucide-react';
import { promptsStateInstance } from '../state/prompts.state';

export function PromptsDetailUI({ promptId }: { promptId: string }): React.ReactElement {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);

  const state = useSyncExternalStore(
    (listener) => promptsStateInstance.subscribe(listener),
    () => promptsStateInstance.getSnapshot(),
    () => promptsStateInstance.getSnapshot()
  );

  const prompt = state.items.find((p) => p.id === promptId || p.slug === promptId);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!prompt) {
    return (
      <div className="p-12 text-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col items-center gap-3">
        <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Prompt Template Not Found</h2>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          The requested prompt template identifier '{promptId}' does not exist in the active registry.
        </p>
        <Link
          href="/prompts"
          className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline mt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Prompts Registry</span>
        </Link>
      </div>
    );
  }

  const activeVersion = prompt.versions.find((v) => v.is_active) ?? prompt.versions[0];

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
        <Link href="/prompts" className="hover:text-[hsl(var(--foreground))] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Prompts Registry</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-[hsl(var(--foreground))]">{prompt.slug}</span>
      </div>

      {/* Hero Header */}
      <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              {prompt.name}
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
              {prompt.status}
            </span>
            <span className="text-xs font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
              {prompt.active_version}
            </span>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1.5 max-w-2xl">
            {prompt.description}
          </p>
          <div className="flex items-center gap-4 mt-3 text-xs font-mono text-[hsl(var(--muted-foreground))]">
            <span>Service: <strong className="text-[hsl(var(--foreground))]">{prompt.service}</strong></span>
            <span>·</span>
            <span>Target Model: <strong className="text-[hsl(var(--foreground))]">{prompt.model}</strong></span>
            <span>·</span>
            <span>24h Invocations: <strong className="text-[hsl(var(--foreground))]">{prompt.total_invocations_24h}</strong></span>
          </div>
        </div>

        <Link
          href="/prompts/playground"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-primary shrink-0"
        >
          <Cpu className="w-4 h-4" />
          <span>Fork to Playground</span>
        </Link>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Average Execution Latency</span>
          </div>
          <div className="text-lg font-bold font-mono text-[hsl(var(--foreground))] mt-1">
            {activeVersion.avg_latency_ms} ms
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>P95 Token Footprint</span>
          </div>
          <div className="text-lg font-bold font-mono text-[hsl(var(--foreground))] mt-1">
            {activeVersion.token_usage_p95} tokens
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-primary" />
            <span>Average Unit Cost</span>
          </div>
          <div className="text-lg font-bold font-mono text-[hsl(var(--foreground))] mt-1">
            ${activeVersion.avg_cost_usd.toFixed(4)}
          </div>
        </div>
      </div>

      {/* System Instructions & Template Editor Box */}
      <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]">
            Production System Instructions
          </h2>
          <button
            type="button"
            onClick={() => handleCopy(activeVersion.system_instructions, 'system')}
            className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            {copiedKey === 'system' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy</span>
          </button>
        </div>
        <pre className="text-xs font-mono p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] whitespace-pre-wrap text-[hsl(var(--foreground))]">
          {activeVersion.system_instructions}
        </pre>

        <div className="flex items-center justify-between pt-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]">
            Template Parameterization Body
          </h2>
          <button
            type="button"
            onClick={() => handleCopy(activeVersion.template_text, 'template')}
            className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            {copiedKey === 'template' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy</span>
          </button>
        </div>
        <pre className="text-xs font-mono p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] whitespace-pre-wrap text-[hsl(var(--foreground))]">
          {activeVersion.template_text}
        </pre>
      </div>

      {/* Version Regression History Table */}
      <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-3">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]">
            Version Rollout History & Regression Telemetry
          </h2>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[hsl(var(--border))]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[hsl(var(--muted)/0.5)] border-b border-[hsl(var(--border))] text-[11px] text-[hsl(var(--muted-foreground))] uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Version</th>
                <th className="py-2.5 px-3">P95 Tokens</th>
                <th className="py-2.5 px-3">Avg Latency</th>
                <th className="py-2.5 px-3">Avg Cost</th>
                <th className="py-2.5 px-3">Deployed At</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border)/0.5)]">
              {prompt.versions.map((ver) => (
                <tr key={ver.version} className={ver.is_active ? 'bg-primary/5' : ''}>
                  <td className="py-2.5 px-3 font-bold text-[hsl(var(--foreground))]">{ver.version}</td>
                  <td className="py-2.5 px-3">{ver.token_usage_p95}</td>
                  <td className="py-2.5 px-3">{ver.avg_latency_ms} ms</td>
                  <td className="py-2.5 px-3">${ver.avg_cost_usd.toFixed(4)}</td>
                  <td className="py-2.5 px-3 text-[hsl(var(--muted-foreground))]">{ver.deployed_at}</td>
                  <td className="py-2.5 px-3 text-right">
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        ver.is_active
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
                      }`}
                    >
                      {ver.is_active ? 'Active' : 'Archived'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
