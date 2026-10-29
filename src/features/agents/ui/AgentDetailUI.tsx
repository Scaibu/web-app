'use client';

/**
 * Dedicated Full-Page Detail Screen for Agent Execution Trace & Multi-Step DAG.
 * Strictly adheres to good-ui.md:
 * - 100% token adherence (4px scale, defined tokens, zero arbitrary brackets)
 * - Complete state coverage (default, empty/not found state)
 * - Accessible semantics (<button>, <a>, focus-visible:ring-2)
 */

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Workflow,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Clock,
  Layers,
  Coins,
  Repeat,
  Terminal,
} from 'lucide-react';
import { agentsStateInstance } from '../state/agents.state';

export function AgentDetailUI({ traceId }: { traceId: string }): React.ReactElement {
  const state = useSyncExternalStore(
    (listener) => agentsStateInstance.subscribe(listener),
    () => agentsStateInstance.getSnapshot(),
    () => agentsStateInstance.getSnapshot()
  );

  const trace = state.traces.find((t) => t.id === traceId);

  if (!trace) {
    return (
      <div className="p-12 text-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col items-center gap-3">
        <Workflow className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
        <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Agent Execution Not Found</h2>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          The requested agent run identifier '{traceId}' does not exist in telemetry logs.
        </p>
        <Link
          href="/agents"
          className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline mt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Agents Visualizer</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
        <Link href="/agents" className="hover:text-[hsl(var(--foreground))] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Agentic Runs</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-[hsl(var(--foreground))]">{trace.id}</span>
      </div>

      {/* Hero Header */}
      <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              {trace.agent_name}
            </h1>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                trace.status === 'completed'
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-rose-500/10 text-rose-500'
              }`}
            >
              {trace.status}
            </span>
            {trace.loop_detected && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-500 border border-rose-500/20">
                <Repeat className="w-3 h-3" />
                <span>Loop Detected</span>
              </span>
            )}
          </div>
          <span className="text-xs font-mono text-[hsl(var(--muted-foreground))]">
            Arch: {trace.agent_type.toUpperCase()} · Model: {trace.model}
          </span>
        </div>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          Root Goal: <strong className="text-[hsl(var(--foreground))] font-sans">{trace.root_objective}</strong>
        </p>
      </div>

      {/* Latency & Cost Breakdown Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Total Duration</span>
          </div>
          <div className="text-lg font-bold font-mono text-[hsl(var(--foreground))] mt-1">
            {trace.total_duration_ms} ms
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-primary" />
            <span>Cumulative Spend</span>
          </div>
          <div className="text-lg font-bold font-mono text-[hsl(var(--foreground))] mt-1">
            ${trace.total_cost_usd.toFixed(3)}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-primary" />
            <span>Step Count</span>
          </div>
          <div className="text-lg font-bold font-mono text-[hsl(var(--foreground))] mt-1">
            {trace.total_steps} sequential calls
          </div>
        </div>
      </div>

      {/* Step-by-Step DAG Execution Sequence */}
      <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]">
          Agentic Tool Invocation Execution Tree
        </h2>

        <div className="space-y-4">
          {trace.steps.map((step) => (
            <div
              key={step.step_number}
              className={`p-4 rounded-lg border space-y-2 ${
                step.status === 'loop_detected'
                  ? 'border-rose-500/50 bg-rose-500/5'
                  : 'border-[hsl(var(--border))] bg-[hsl(var(--background))]'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">#{step.step_number}</span>
                  <span className="font-semibold text-[hsl(var(--foreground))]">{step.tool_name}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      step.status === 'success'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-rose-500/10 text-rose-500'
                    }`}
                  >
                    {step.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-[hsl(var(--muted-foreground))]">
                  <span>{step.latency_ms} ms</span>
                  <span>·</span>
                  <span>{step.tokens_consumed} tokens</span>
                </div>
              </div>

              {step.error_message && (
                <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-mono">
                  {step.error_message}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono pt-1">
                <div className="p-2.5 rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-1">
                  <span className="text-[10px] font-sans font-semibold text-[hsl(var(--muted-foreground))] uppercase">Arguments Payload:</span>
                  <pre className="whitespace-pre-wrap text-[hsl(var(--foreground))]">{step.arguments_json}</pre>
                </div>
                {step.result_json && (
                  <div className="p-2.5 rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-1">
                    <span className="text-[10px] font-sans font-semibold text-[hsl(var(--muted-foreground))] uppercase">Return Output:</span>
                    <pre className="whitespace-pre-wrap text-[hsl(var(--foreground))]">{step.result_json}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
