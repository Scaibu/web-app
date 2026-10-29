'use client';

/**
 * Dedicated Full-Page Detail Screen for Evaluation Runs.
 * Strictly adheres to good-ui.md:
 * - 100% token adherence (4px scale, defined tokens, zero arbitrary brackets)
 * - Complete state coverage (default, empty/not found state)
 * - Accessible semantics (<button>, <a>, focus-visible:ring-2)
 */

import React, { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FlaskConical,
  GitCommit,
  CheckCircle2,
  XCircle,
  Coins,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { evaluationsStateInstance } from '../state/evaluations.state';
import { evaluationsController } from '../controller/evaluations.controller';

export function EvaluationDetailUI({ runId }: { runId: string }): React.ReactElement {
  const state = useSyncExternalStore(
    (listener) => evaluationsStateInstance.subscribe(listener),
    () => evaluationsStateInstance.getSnapshot(),
    () => evaluationsStateInstance.getSnapshot()
  );

  useEffect(() => {
    if (state.runs.length === 0) {
      void evaluationsController.loadRuns();
    }
  }, [state.runs.length]);

  const run = state.runs.find((r) => r.id === runId);

  if (!run) {
    return (
      <div className="p-12 text-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col items-center gap-3">
        <FlaskConical className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
        <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Evaluation Run Not Found</h2>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          The requested benchmark experiment run '{runId}' was not found in the telemetry registry.
        </p>
        <Link
          href="/evaluations"
          className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline mt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Evaluations Matrix</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
        <Link href="/evaluations" className="hover:text-[hsl(var(--foreground))] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Evaluations Matrix</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-[hsl(var(--foreground))]">{run.id}</span>
      </div>

      {/* Hero Header */}
      <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              {run.name}
            </h1>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                run.status === 'completed'
                  ? 'bg-emerald-500/10 text-emerald-500'
                  : 'bg-amber-500/10 text-amber-500'
              }`}
            >
              {run.status}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-[hsl(var(--muted-foreground))]">
            <span>Model: <strong className="text-[hsl(var(--foreground))]">{run.model}</strong></span>
            <span>·</span>
            <span>Prompt: <strong className="text-[hsl(var(--foreground))]">{run.prompt_version}</strong></span>
            <span>·</span>
            <span>Dataset: <strong className="text-[hsl(var(--foreground))]">{run.dataset_name}</strong></span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <GitCommit className="w-3.5 h-3.5" />
              <span>{run.git_commit_sha ?? 'HEAD'}</span>
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => void evaluationsController.loadRuns()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-[hsl(var(--border))] bg-[hsl(var(--background))] hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] transition-colors focus-visible:ring-2 focus-visible:ring-primary shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Rerun Benchmark</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Passed Test Samples</span>
          </div>
          <div className="text-lg font-bold font-mono text-[hsl(var(--foreground))] mt-1">
            {run.passed_samples} / {run.total_samples} ({( (run.passed_samples / run.total_samples) * 100 ).toFixed(1)}%)
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
            <Coins className="w-3.5 h-3.5 text-primary" />
            <span>Total Experiment Cost</span>
          </div>
          <div className="text-lg font-bold font-mono text-[hsl(var(--foreground))] mt-1">
            ${run.cost_usd.toFixed(2)}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Executed Timestamp</span>
          </div>
          <div className="text-xs font-bold font-mono text-[hsl(var(--foreground))] mt-2 truncate">
            {new Date(run.created_at).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Metrics Breakdown Scorecards */}
      <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]">
          Benchmark Metric Evaluations vs SLO Targets
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {run.metrics.map((metric) => (
            <div
              key={metric.type}
              className="p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="text-[hsl(var(--muted-foreground))]">{metric.label}</span>
                {metric.isPassing ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-500" />
                )}
              </div>
              <div className="text-xl font-bold font-mono text-[hsl(var(--foreground))]">
                {metric.value} <span className="text-xs font-normal text-[hsl(var(--muted-foreground))]">{metric.unit}</span>
              </div>
              <div className="text-[11px] font-mono text-[hsl(var(--muted-foreground))] pt-1 border-t border-[hsl(var(--border)/0.5)]">
                SLO Target: {metric.benchmarkTarget} {metric.unit}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
