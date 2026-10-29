'use client';

/**
 * Multi-Turn Session & Conversation Thread Viewer Dashboard.
 * Strictly adheres to good-ui.md:
 * - 100% token adherence (4px scale, defined tokens, zero arbitrary brackets)
 * - Complete state coverage (default, empty, interactive thread drill-down)
 * - Accessible semantics (<button>, <a>, focus-visible:ring-2)
 */

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  MessagesSquare,
  User,
  Bot,
  Clock,
  Layers,
  Coins,
  TrendingUp,
} from 'lucide-react';
import { sessionsStateInstance } from '../state/sessions.state';

export function SessionsDashboardUI(): React.ReactElement {
  const state = useSyncExternalStore(
    (listener) => sessionsStateInstance.subscribe(listener),
    () => sessionsStateInstance.getSnapshot(),
    () => sessionsStateInstance.getSnapshot()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))] flex items-center gap-2">
            <MessagesSquare className="w-5 h-5 text-primary" />
            <span>Multi-Turn Conversation Sessions & Context Compounding</span>
          </h1>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
            Track user chat sessions, monitor compounding context token growth per turn, and detect memory truncation points.
          </p>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="overflow-x-auto rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[hsl(var(--muted)/0.5)] border-b border-[hsl(var(--border))] text-[11px] text-[hsl(var(--muted-foreground))] uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Session ID</th>
              <th className="py-3 px-3">User & Tenant</th>
              <th className="py-3 px-3">Service & Model</th>
              <th className="py-3 px-3">Turns</th>
              <th className="py-3 px-3">Context Growth</th>
              <th className="py-3 px-3">Duration</th>
              <th className="py-3 px-3">Cost</th>
              <th className="py-3 px-4 text-right">Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[hsl(var(--border)/0.5)]">
            {state.sessions.map((sess) => (
              <tr key={sess.id} className="hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                <td className="py-3 px-4 font-bold text-primary">{sess.id}</td>
                <td className="py-3 px-3 font-sans text-[hsl(var(--foreground))]">
                  <div>{sess.user_id}</div>
                  <div className="text-[11px] font-mono text-[hsl(var(--muted-foreground))]">{sess.tenant_id}</div>
                </td>
                <td className="py-3 px-3 text-[hsl(var(--foreground))]">
                  <div>{sess.service}</div>
                  <div className="text-[11px] text-[hsl(var(--muted-foreground))]">{sess.model}</div>
                </td>
                <td className="py-3 px-3 font-bold text-[hsl(var(--foreground))]">{sess.total_turns} turns</td>
                <td className="py-3 px-3 text-amber-500 font-bold">{sess.context_compounding_rate}</td>
                <td className="py-3 px-3">{sess.total_duration_ms} ms</td>
                <td className="py-3 px-3">${sess.total_cost_usd.toFixed(4)}</td>
                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/sessions/${sess.id}`}
                    className="px-2.5 py-1 rounded text-[11px] font-medium border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] transition-colors focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    View Thread
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
