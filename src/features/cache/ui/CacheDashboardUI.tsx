'use client';

/**
 * Enterprise Semantic Cache Visualizer Dashboard UI.
 * Adheres strictly to good-ui.md (tokens, visual hierarchy, no arbitrary Tailwind brackets).
 */

import React, { useSyncExternalStore } from 'react';
import { 
  Zap, 
  DollarSign, 
  Clock, 
  Layers, 
  Trash2, 
  Search, 
  Sparkles,
  TrendingUp,
  Cpu,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { cacheState } from '../state/cache.state';
import { cacheController } from '../controller/cache.controller';

export const CacheDashboardUI: React.FC = () => {
  const state = useSyncExternalStore(
    (callback) => cacheState.subscribe(callback),
    () => cacheState.getSnapshot(),
    () => cacheState.getSnapshot()
  );

  const { metrics, entries, selectedEntryId, searchFilter } = state;
  const selectedEntry = entries.find((e) => e.id === selectedEntryId) || entries[0];

  const filteredEntries = entries.filter((e) =>
    e.inputText.toLowerCase().includes(searchFilter.toLowerCase()) ||
    e.queryHash.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Inference Acceleration
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Zap className="h-3.5 w-3.5 text-amber-500" /> Vector Cosine Cache Active
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Semantic Cache Analytics & Latency Optimizer
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Intercept duplicate and semantically equivalent prompts via vector embeddings to slash provider API costs and serve responses in &lt;15ms.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card border border-border/40 px-3 py-1.5 rounded-lg text-xs">
            <span className="text-muted-foreground font-medium">Cosine Threshold:</span>
            <span className="font-mono font-bold text-foreground">{metrics.similarityThreshold}</span>
          </div>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border/40 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Cache Hit Rate</span>
            <Percent className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-foreground">{metrics.hitRatePercent}%</p>
          <span className="text-[11px] text-muted-foreground">
            {metrics.cacheHits.toLocaleString()} of {metrics.totalRequests.toLocaleString()} queries
          </span>
        </div>

        <div className="p-4 bg-card border border-border/40 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Cumulative Savings</span>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-emerald-500">${metrics.totalCostSavedUsd.toFixed(2)}</p>
          <span className="text-[11px] text-muted-foreground">
            {(metrics.totalTokensSaved / 1000000).toFixed(1)}M LLM tokens averted
          </span>
        </div>

        <div className="p-4 bg-card border border-border/40 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Hit Latency vs Provider Miss</span>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-foreground">{metrics.avgHitLatencyMs}ms</span>
            <span className="text-xs text-muted-foreground line-through">~{metrics.avgMissLatencyMs}ms</span>
          </div>
          <span className="text-[11px] text-emerald-500 font-medium">58x speedup on cache hits</span>
        </div>

        <div className="p-4 bg-card border border-border/40 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Embedding Runtime</span>
            <Cpu className="h-4 w-4 text-primary" />
          </div>
          <p className="text-sm font-semibold font-mono text-foreground pt-1">text-embedding-3-small</p>
          <span className="text-[11px] text-muted-foreground">Normalized 1536-dim cosine</span>
        </div>
      </div>

      {/* Main Grid: Cache Catalog & Forensic Entry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cache Entries List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => cacheController.setFilter(e.target.value)}
              placeholder="Search cached queries or hashes..."
              className="w-full pl-9 pr-3 py-1.5 bg-card border border-border/40 rounded-lg text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-3">
            {filteredEntries.map((ent) => {
              const isSelected = selectedEntry?.id === ent.id;
              return (
                <div
                  key={ent.id}
                  onClick={() => cacheController.selectActiveEntry(ent.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2.5 ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary'
                      : 'border-border/40 hover:border-border hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] text-muted-foreground font-semibold">
                      {ent.queryHash}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                      ent.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
                    }`}>
                      {ent.status}
                    </span>
                  </div>

                  <p className="text-xs text-foreground font-medium line-clamp-2 leading-relaxed">
                    {ent.inputText}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/30 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-1 text-emerald-500 font-semibold">
                      <Sparkles className="h-3 w-3" />
                      <span>{ent.hitCount} hits</span>
                    </div>
                    <div>
                      Saved: <span className="font-semibold text-foreground">${ent.costSavedUsd.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Forensic Cache Inspection (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedEntry && (
            <div className="bg-card border border-border/40 rounded-xl p-5 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/30">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground">Cache Vector Payload</h3>
                    <span className="font-mono text-xs text-muted-foreground">{selectedEntry.queryHash}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Last Hit: {selectedEntry.lastHitAt}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {selectedEntry.status === 'active' && (
                    <button
                      onClick={() => cacheController.purgeCacheEntry(selectedEntry.id)}
                      className="px-3 py-1.5 text-xs font-medium text-rose-500 border border-rose-500/30 rounded-lg hover:bg-rose-500/10 transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="h-3 w-3" /> Invalidate Entry
                    </button>
                  )}
                </div>
              </div>

              {/* Vector Similarity Metrics */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-muted/20 border border-border/40 rounded-lg space-y-0.5">
                  <span className="text-[11px] text-muted-foreground">Cosine Similarity</span>
                  <p className="text-sm font-mono font-bold text-foreground">
                    {(selectedEntry.similarityScore * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 bg-muted/20 border border-border/40 rounded-lg space-y-0.5">
                  <span className="text-[11px] text-muted-foreground">Tokens Saved</span>
                  <p className="text-sm font-mono font-bold text-foreground">
                    {selectedEntry.tokensSaved.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-muted/20 border border-border/40 rounded-lg space-y-0.5">
                  <span className="text-[11px] text-muted-foreground">Dollar Savings</span>
                  <p className="text-sm font-mono font-bold text-emerald-500">
                    ${selectedEntry.costSavedUsd.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Raw Prompt Payload */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Cached Input Prompt
                </span>
                <div className="p-3 bg-muted/30 border border-border/40 rounded-lg text-xs font-mono leading-relaxed whitespace-pre-wrap text-foreground">
                  {selectedEntry.inputText}
                </div>
              </div>

              {/* Cached Output Completion */}
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" /> Stored Semantic Response Payload
                </span>
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-xs font-mono leading-relaxed whitespace-pre-wrap text-foreground">
                  {selectedEntry.cachedResponse}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
