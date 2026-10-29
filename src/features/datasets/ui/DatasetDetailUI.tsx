'use client';

/**
 * Enterprise Golden Dataset Deep Forensic Reviewer UI.
 * Adheres strictly to good-ui.md (tokens, visual hierarchy, no arbitrary Tailwind brackets).
 */

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Download, 
  Star, 
  Tag, 
  ExternalLink, 
  MessageSquare, 
  Sparkles,
  UserCheck
} from 'lucide-react';
import { datasetsState } from '../state/datasets.state';

interface DatasetDetailUIProps {
  datasetId: string;
}

export const DatasetDetailUI: React.FC<DatasetDetailUIProps> = ({ datasetId }) => {
  const state = useSyncExternalStore(
    (callback) => datasetsState.subscribe(callback),
    () => datasetsState.getSnapshot(),
    () => datasetsState.getSnapshot()
  );

  const dataset = state.datasets.find((ds) => ds.id === datasetId) || state.datasets[0];

  if (!dataset) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-muted-foreground text-sm">Dataset not found.</p>
        <Link href="/datasets" className="text-primary text-xs underline">Back to datasets</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/40 gap-4">
        <div>
          <Link
            href="/datasets"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Datasets Catalog
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{dataset.name}</h1>
            <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase rounded bg-primary/10 text-primary">
              {dataset.exportFormat}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl">{dataset.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm">
            <Download className="h-3.5 w-3.5" /> Download Full JSONL
          </button>
        </div>
      </div>

      {/* Dataset Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-card border border-border/40 rounded-xl space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Target Architecture</span>
          <p className="text-sm font-mono font-semibold text-foreground">{dataset.targetModel}</p>
        </div>
        <div className="p-4 bg-card border border-border/40 rounded-xl space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Exemplar Count</span>
          <p className="text-sm font-semibold text-foreground">{dataset.itemCount} Verified Pairs</p>
        </div>
        <div className="p-4 bg-card border border-border/40 rounded-xl space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Estimated Token Size</span>
          <p className="text-sm font-semibold text-foreground">{(dataset.totalTokens / 1000).toFixed(0)}k Tokens</p>
        </div>
      </div>

      {/* Exemplar Inspection List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" /> Curated Exemplar Pairs ({dataset.items.length})
          </h2>
          <span className="text-xs text-muted-foreground">Showing verified human-reviewed samples</span>
        </div>

        <div className="space-y-4">
          {dataset.items.map((item, idx) => (
            <div
              key={item.id}
              className="p-5 bg-card border border-border/40 rounded-xl space-y-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-mono font-semibold text-foreground">{item.sourceSpan}</span>
                  <Link
                    href={`/traces/${item.traceId}`}
                    className="text-[11px] font-mono text-primary hover:underline flex items-center gap-1"
                  >
                    {item.traceId} <ExternalLink className="h-2.5 w-2.5" />
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center text-amber-500 gap-0.5">
                    {Array.from({ length: item.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <UserCheck className="h-3 w-3 text-emerald-500" /> {item.annotator}
                  </span>
                </div>
              </div>

              {/* Input Prompt & Ideal Completion Side-by-Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Input Prompt (User Turn)
                  </span>
                  <div className="p-3 bg-muted/30 border border-border/40 rounded-lg text-xs text-foreground font-mono leading-relaxed whitespace-pre-wrap">
                    {item.inputPrompt}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">
                    Ideal Gold Completion (Target)
                  </span>
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-xs text-foreground font-mono leading-relaxed whitespace-pre-wrap">
                    {item.idealCompletion}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <Tag className="h-3 w-3 text-muted-foreground" />
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-muted/60 text-muted-foreground border border-border/30"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
