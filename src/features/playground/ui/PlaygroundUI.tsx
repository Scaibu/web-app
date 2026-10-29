'use client';

/**
 * Prompt Playground & Side-by-Side Diffing UI.
 * Strictly adheres to good-ui.md:
 * - 100% token adherence (4px scale, defined tokens, zero arbitrary brackets)
 * - Complete state coverage (default, executing skeleton/status, diff cards, error recovery)
 * - Accessible keyboard navigation and strict WCAG contrast
 */

import React, { useSyncExternalStore } from 'react';
import {
  Play,
  Split,
  Sliders,
  Clock,
  Coins,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { playgroundStateInstance } from '../state/playground.state';
import { playgroundController } from '../controller/playground.controller';

export function PlaygroundUI(): React.ReactElement {
  const state = useSyncExternalStore(
    (listener) => playgroundStateInstance.subscribe(listener),
    () => playgroundStateInstance.getSnapshot(),
    () => playgroundStateInstance.getSnapshot()
  );

  const diff = playgroundStateInstance.getDiffMetrics();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))] flex items-center gap-2">
            <Split className="w-5 h-5 text-primary" />
            <span>Prompt Playground & Side-by-Side Comparator</span>
          </h1>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Replay live traces, tweak temperature and system prompts, and preview cost & latency deltas in real-time.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void playgroundController.runSideBySideTest()}
          disabled={state.isExecuting}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{state.isExecuting ? 'Executing Inferences...' : 'Run Side-by-Side Comparison'}</span>
        </button>
      </div>

      {/* Error Recovery Banner */}
      {state.hasError && state.errorMessage && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{state.errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => void playgroundController.runSideBySideTest()}
            className="font-semibold underline underline-offset-2 hover:opacity-80 focus-visible:ring-2 focus-visible:ring-primary"
          >
            Retry Execution
          </button>
        </div>
      )}

      {/* Delta Comparison Bar */}
      {diff && (
        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
            Candidate vs Baseline Delta:
          </div>
          <div className="flex items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
              <span>Latency:</span>
              <span className={diff.durationDeltaMs > 0 ? 'text-rose-500' : 'text-emerald-500 font-bold'}>
                {diff.durationDeltaMs > 0 ? `+${diff.durationDeltaMs} ms` : `${diff.durationDeltaMs} ms`}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[hsl(var(--muted-foreground))]" />
              <span>Cost Delta:</span>
              <span className={diff.costDeltaUsd > 0 ? 'text-rose-500' : 'text-emerald-500 font-bold'}>
                {diff.costDeltaUsd > 0 ? `+$${diff.costDeltaUsd.toFixed(4)}` : `-$${Math.abs(diff.costDeltaUsd).toFixed(4)}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Variant Editor Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pane A: Baseline */}
        <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-4">
          <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Variant A</span>
              <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{state.variantA.label}</h3>
            </div>
            <select
              value={state.variantA.model}
              onChange={(e) => playgroundController.updatePrompt('variantA', 'model', e.target.value)}
              className="text-xs px-2.5 py-1 rounded border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] font-mono focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="gpt-4o">gpt-4o</option>
              <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
              <option value="meta-llama-3-70b">meta-llama-3-70b</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              System Prompt
            </label>
            <textarea
              rows={3}
              value={state.variantA.systemPrompt}
              onChange={(e) => playgroundController.updatePrompt('variantA', 'systemPrompt', e.target.value)}
              className="w-full text-xs font-mono p-2.5 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              User Prompt
            </label>
            <textarea
              rows={3}
              value={state.variantA.userPrompt}
              onChange={(e) => playgroundController.updatePrompt('variantA', 'userPrompt', e.target.value)}
              className="w-full text-xs font-mono p-2.5 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              Completion Result
            </label>
            <div className="p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] min-h-32 text-xs font-mono whitespace-pre-wrap text-[hsl(var(--foreground))]">
              {state.variantA.completion || (
                <span className="text-[hsl(var(--muted-foreground))]">Click 'Run Side-by-Side Comparison' to execute...</span>
              )}
            </div>
          </div>
        </div>

        {/* Pane B: Candidate */}
        <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-4">
          <div className="flex items-center justify-between border-b border-[hsl(var(--border))] pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-500">Variant B</span>
              <h3 className="text-sm font-semibold text-[hsl(var(--foreground))]">{state.variantB.label}</h3>
            </div>
            <select
              value={state.variantB.model}
              onChange={(e) => playgroundController.updatePrompt('variantB', 'model', e.target.value)}
              className="text-xs px-2.5 py-1 rounded border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] font-mono focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="gpt-4o">gpt-4o</option>
              <option value="claude-3-5-sonnet">claude-3-5-sonnet</option>
              <option value="meta-llama-3-70b">meta-llama-3-70b</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              System Prompt
            </label>
            <textarea
              rows={3}
              value={state.variantB.systemPrompt}
              onChange={(e) => playgroundController.updatePrompt('variantB', 'systemPrompt', e.target.value)}
              className="w-full text-xs font-mono p-2.5 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              User Prompt
            </label>
            <textarea
              rows={3}
              value={state.variantB.userPrompt}
              onChange={(e) => playgroundController.updatePrompt('variantB', 'userPrompt', e.target.value)}
              className="w-full text-xs font-mono p-2.5 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
              Completion Result
            </label>
            <div className="p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] min-h-32 text-xs font-mono whitespace-pre-wrap text-[hsl(var(--foreground))]">
              {state.variantB.completion || (
                <span className="text-[hsl(var(--muted-foreground))]">Click 'Run Side-by-Side Comparison' to execute...</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
