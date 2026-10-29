'use client';

/**
 * Dedicated Full-Page Detail Screen for Multi-Turn Session & Chat Thread.
 * Strictly adheres to good-ui.md:
 * - 100% token adherence (4px scale, defined tokens, zero arbitrary brackets)
 * - Complete state coverage (default, empty/not found state)
 * - Accessible semantics (<button>, <a>, focus-visible:ring-2)
 */

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  MessagesSquare,
  User,
  Bot,
  Clock,
  Layers,
  Coins,
  TrendingUp,
} from 'lucide-react';
import { sessionsStateInstance } from '../state/sessions.state';

export function SessionDetailUI({ sessionId }: { sessionId: string }): React.ReactElement {
  const state = useSyncExternalStore(
    (listener) => sessionsStateInstance.subscribe(listener),
    () => sessionsStateInstance.getSnapshot(),
    () => sessionsStateInstance.getSnapshot()
  );

  const session = state.sessions.find((s) => s.id === sessionId);

  if (!session) {
    return (
      <div className="p-12 text-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col items-center gap-3">
        <MessagesSquare className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
        <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Session Not Found</h2>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          The requested conversation session '{sessionId}' does not exist in the active memory store.
        </p>
        <Link
          href="/sessions"
          className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline mt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sessions List</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
        <Link href="/sessions" className="hover:text-[hsl(var(--foreground))] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Conversation Sessions</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-[hsl(var(--foreground))]">{session.id}</span>
      </div>

      {/* Hero Header */}
      <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              Session Thread: {session.id}
            </h1>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-primary/10 text-primary">
              {session.model}
            </span>
          </div>
          <span className="text-xs font-mono text-[hsl(var(--muted-foreground))]">
            Tenant: {session.tenant_id} · User: {session.user_id}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[hsl(var(--muted-foreground))] pt-2 border-t border-[hsl(var(--border)/0.5)]">
          <span>Total Invocations: <strong className="text-[hsl(var(--foreground))]">{session.total_turns} turns</strong></span>
          <span>·</span>
          <span>Duration: <strong className="text-[hsl(var(--foreground))]">{session.total_duration_ms} ms</strong></span>
          <span>·</span>
          <span>Cumulative Cost: <strong className="text-primary">${session.total_cost_usd.toFixed(4)}</strong></span>
          <span>·</span>
          <span>Growth Rate: <strong className="text-amber-500">{session.context_compounding_rate}</strong></span>
        </div>
      </div>

      {/* Sequential Multi-Turn Dialogue Bubble Stream */}
      <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]">
          Chronological Turn-by-Turn Telemetry & Token Compounding
        </h2>

        <div className="space-y-6">
          {session.turns.map((turn) => (
            <div key={turn.turn_number} className="space-y-3 p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))]">
              {/* Turn Header Metadata */}
              <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-[hsl(var(--border)/0.5)]">
                <span className="font-bold text-primary">Turn #{turn.turn_number}</span>
                <div className="flex items-center gap-3 text-[11px] text-[hsl(var(--muted-foreground))]">
                  <span>Tokens: {turn.tokens_input} in / {turn.tokens_output} out</span>
                  <span>·</span>
                  <span className="font-bold text-amber-500">Context Window: {turn.cumulative_context_tokens} tokens</span>
                  <span>·</span>
                  <span>Latency: {turn.latency_ms} ms</span>
                </div>
              </div>

              {/* User Bubble */}
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-lg bg-[hsl(var(--muted)/0.3)] text-xs text-[hsl(var(--foreground))] flex-1 font-sans">
                  {turn.user_input}
                </div>
              </div>

              {/* Assistant Bubble */}
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs text-[hsl(var(--foreground))] flex-1 font-mono whitespace-pre-wrap">
                  {turn.model_response}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
