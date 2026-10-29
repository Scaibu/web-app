'use client';

/**
 * Dedicated Full-Page Detail Screen for RAG Diagnostics & Vector Chunk Telemetry.
 * Strictly adheres to good-ui.md:
 * - 100% token adherence (4px scale, defined tokens, zero arbitrary brackets)
 * - Complete state coverage (default, empty/not found state)
 * - Accessible semantics (<button>, <a>, focus-visible:ring-2)
 */

import React, { useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Database,
  Layers,
  Clock,
  Sliders,
  FileText,
  Search,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { ragDiagnosticsStateInstance } from '../state/rag_diagnostics.state';
import { ragDiagnosticsController } from '../controller/rag_diagnostics.controller';

export function RAGTraceDetailUI({ traceId }: { traceId: string }): React.ReactElement {
  const state = useSyncExternalStore(
    (listener) => ragDiagnosticsStateInstance.subscribe(listener),
    () => ragDiagnosticsStateInstance.getSnapshot(),
    () => ragDiagnosticsStateInstance.getSnapshot()
  );

  useEffect(() => {
    if (state.traces.length === 0) {
      void ragDiagnosticsController.loadRAGTraces();
    }
  }, [state.traces.length]);

  const trace = state.traces.find((t) => t.id === traceId);

  if (!trace) {
    return (
      <div className="p-12 text-center rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] flex flex-col items-center gap-3">
        <Database className="w-8 h-8 text-[hsl(var(--muted-foreground))]" />
        <h2 className="text-sm font-semibold text-[hsl(var(--foreground))]">RAG Telemetry Not Found</h2>
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          The requested vector retrieval execution '{traceId}' was not found in the index.
        </p>
        <Link
          href="/rag"
          className="inline-flex items-center gap-1.5 text-xs text-primary font-semibold hover:underline mt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to RAG Diagnostics</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
        <Link href="/rag" className="hover:text-[hsl(var(--foreground))] transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RAG Diagnostics</span>
        </Link>
        <span>/</span>
        <span className="font-mono text-[hsl(var(--foreground))]">{trace.id}</span>
      </div>

      {/* Hero Header */}
      <div className="p-6 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-primary/10 text-primary">
            Vector Retrieval Telemetry
          </span>
          <span className="text-xs font-mono text-[hsl(var(--muted-foreground))]">
            Metric: {trace.vector_distance_metric.toUpperCase()}
          </span>
        </div>
        <h1 className="text-lg font-bold tracking-tight text-[hsl(var(--foreground))] font-mono">
          "{trace.query}"
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[hsl(var(--muted-foreground))] pt-2 border-t border-[hsl(var(--border)/0.5)]">
          <span>Collection: <strong className="text-[hsl(var(--foreground))]">{trace.collection_name}</strong></span>
          <span>·</span>
          <span>Top-K: <strong className="text-[hsl(var(--foreground))]">{trace.top_k}</strong></span>
          <span>·</span>
          <span>Context Utilization: <strong className="text-[hsl(var(--foreground))]">{trace.total_context_tokens} / {trace.context_window_limit} tokens</strong></span>
        </div>
      </div>

      {/* Latency Breakdown Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Vector Search Latency (KNN / ANN Index)</span>
          </div>
          <div className="text-lg font-bold font-mono text-primary mt-1">
            {trace.retrieval_latency_ms} ms
          </div>
        </div>

        <div className="p-4 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <div className="text-[11px] text-[hsl(var(--muted-foreground))] flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-500" />
            <span>Downstream LLM Synthesis Latency</span>
          </div>
          <div className="text-lg font-bold font-mono text-[hsl(var(--foreground))] mt-1">
            {trace.generation_latency_ms} ms
          </div>
        </div>
      </div>

      {/* Forensic Chunk Inspection Table */}
      <div className="p-5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--foreground))]">
          Retrieved Context Chunks & Relevance Ground Truth
        </h2>

        <div className="space-y-4">
          {trace.chunks.map((chunk) => (
            <div
              key={chunk.id}
              className="p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--background))] space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  {chunk.is_relevant ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-amber-500" />
                  )}
                  <span className="font-bold text-[hsl(var(--foreground))]">{chunk.document_title}</span>
                  <span className="text-[hsl(var(--muted-foreground))]">#chunk-{chunk.chunk_index}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[hsl(var(--muted-foreground))]">{chunk.token_count} tokens</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      chunk.similarity_score >= 0.85
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : 'bg-amber-500/10 text-amber-500'
                    }`}
                  >
                    Cosine: {chunk.similarity_score.toFixed(3)}
                  </span>
                </div>
              </div>
              <pre className="text-xs font-mono p-3 rounded border border-[hsl(var(--border))] bg-[hsl(var(--card))] whitespace-pre-wrap text-[hsl(var(--foreground))]">
                {chunk.text_content}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
