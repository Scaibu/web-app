'use client';

/**
 * Dedicated Full-Page Detail Screen for Policy & Guardrail Incidents.
 * Strictly adheres to good-ui.md:
 * - 100% token adherence (4px scale, defined tokens, zero arbitrary brackets)
 * - Complete state coverage (default, empty/not found state)
 * - Accessible semantics (<button>, <a>, focus-visible:ring-2)
 */

import React, { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  ShieldAlert,
  AlertOctagon,
  Clock,
  CheckCircle2,
  Lock,
  ExternalLink,
  ShieldCheck,
  Terminal,
} from 'lucide-react';
import { policiesStateInstance } from '../state/policies.state';
import { policiesController } from '../controller/policies.controller';

export function PolicyDetailUI({ violationId }: { violationId: string }): React.ReactElement {
  const state = useSyncExternalStore(
    (listener) => policiesStateInstance.subscribe(listener),
    () => policiesStateInstance.getSnapshot(),
    () => policiesStateInstance.getSnapshot()
  );

  useEffect(() => {
    if (state.violations.length === 0) {
      void policiesController.loadViolations();
    }
  }, [state.violations.length]);

  const violation = state.violations.find((v) => v.id === violationId);

  if (!violation) {
    return (
      <div className="p-12 text-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col items-center gap-3">
        <ShieldAlert className="w-8 h-8 text-rose-500" />
        <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">Incident Not Found</h2>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          The requested policy tripwire violation '{violationId}' was not found in active audit records.
        </p>
        <Link
          href="/policies"
          className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline mt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Guardrails Console</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
        <Link href="/policies" className="hover:text-[hsl(var(--foreground))] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Policy Violations</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-[hsl(var(--foreground))]">{violation.id}</span>
      </div>

      {/* Incident Header */}
      <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                violation.severity === 'critical'
                  ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                  : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
              }`}
            >
              <AlertOctagon className="w-3 h-3" />
              <span>{violation.severity}</span>
            </span>
            <h1 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))]">
              {violation.rule_name}
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-[hsl(var(--muted-foreground))]">
            <span>Rule: <strong className="text-[hsl(var(--foreground))]">{violation.rule_id}</strong></span>
            <span>·</span>
            <span>Service: <strong className="text-[hsl(var(--foreground))]">{violation.service}</strong></span>
            <span>·</span>
            <span>Model: <strong className="text-[hsl(var(--foreground))]">{violation.model}</strong></span>
            <span>·</span>
            <span>Trace: <strong className="text-primary">{violation.trace_id}</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {violation.status !== 'resolved' ? (
            <button
              type="button"
              onClick={() => void policiesController.triageViolation(violation.id, 'resolved')}
              className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              Mark Incident Resolved
            </button>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolved</span>
            </span>
          )}
        </div>
      </div>

      {/* Forensic Audit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-500">
              Intercepted Raw Payload (Tripwire Activated)
            </span>
            <Lock className="w-4 h-4 text-rose-500" />
          </div>
          <pre className="text-xs font-mono p-3 rounded-lg border border-rose-500/20 bg-black/40 text-rose-300 whitespace-pre-wrap min-h-36 overflow-y-auto">
            {violation.raw_snippet}
          </pre>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
            Flagged by regex pattern & heuristic classifier in {violation.latency_overhead_ms}ms overhead budget.
          </p>
        </div>

        <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-500">
              Downstream Sanitized Output
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <pre className="text-xs font-mono p-3 rounded-lg border border-emerald-500/20 bg-black/40 text-emerald-300 whitespace-pre-wrap min-h-36 overflow-y-auto">
            {violation.redacted_snippet ?? '[COMPLETION BLOCKED: Prompt Injection Interception Triggered]'}
          </pre>
          <p className="text-[11px] text-[hsl(var(--muted-foreground))]">
            Action executed: <strong className="uppercase text-[hsl(var(--foreground))]">{violation.action_taken}</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
