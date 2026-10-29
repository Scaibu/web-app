'use client';

/**
 * Enterprise Golden Datasets Curation Dashboard UI.
 * Adheres strictly to good-ui.md (tokens, visual hierarchy, no arbitrary Tailwind brackets).
 */

import React, { useSyncExternalStore } from 'react';
import Link from 'next/link';
import { 
  Database, 
  Download, 
  Sparkles, 
  FileJson, 
  CheckCircle, 
  Search, 
  ExternalLink,
  Layers,
  Star,
  Tag,
  ArrowRight
} from 'lucide-react';
import { datasetsState } from '../state/datasets.state';
import { datasetsController } from '../controller/datasets.controller';

export const DatasetsDashboardUI: React.FC = () => {
  const state = useSyncExternalStore(
    (callback) => datasetsState.subscribe(callback),
    () => datasetsState.getSnapshot(),
    () => datasetsState.getSnapshot()
  );

  const filteredDatasets = state.datasets.filter((ds) =>
    ds.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    ds.targetModel.toLowerCase().includes(state.searchQuery.toLowerCase())
  );

  const handleExportJSONL = (datasetName: string, items: any[]) => {
    const jsonlContent = items
      .map((item) =>
        JSON.stringify({
          messages: [
            { role: 'user', content: item.inputPrompt },
            { role: 'assistant', content: item.idealCompletion },
          ],
        })
      )
      .join('\n');

    const blob = new Blob([jsonlContent], { type: 'application/jsonl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${datasetName.toLowerCase().replace(/\s+/g, '_')}_dataset.jsonl`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              Model Alignment
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Human-Curated Gold Standards
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Golden Datasets & Fine-Tuning Exports
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Curate verified 5-star production traces into training datasets for fine-tuning, regression testing, and RLHF.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/traces"
            className="px-4 py-2 text-xs font-medium border border-border/50 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-1.5"
          >
            Curate from Traces <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
          </Link>
        </div>
      </div>

      {/* Search & Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-card border border-border/40 rounded-xl space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Active Gold Datasets</span>
          <p className="text-2xl font-bold text-foreground">{state.datasets.length}</p>
        </div>
        <div className="p-4 bg-card border border-border/40 rounded-xl space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Curated Exemplars</span>
          <p className="text-2xl font-bold text-foreground">
            {state.datasets.reduce((acc, curr) => acc + curr.itemCount, 0).toLocaleString()}
          </p>
        </div>
        <div className="p-4 bg-card border border-border/40 rounded-xl space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Total Token Volume</span>
          <p className="text-2xl font-bold text-foreground">
            {(state.datasets.reduce((acc, curr) => acc + curr.totalTokens, 0) / 1000000).toFixed(2)}M
          </p>
        </div>
        <div className="p-4 bg-card border border-border/40 rounded-xl space-y-1">
          <span className="text-xs text-muted-foreground font-medium">Supported Formats</span>
          <p className="text-sm font-semibold text-foreground pt-1">OpenAI JSONL, ShareGPT, Alpaca</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          value={state.searchQuery}
          onChange={(e) => datasetsController.updateSearch(e.target.value)}
          placeholder="Filter datasets by name or target model architecture..."
          className="w-full pl-10 pr-4 py-2 bg-card border border-border/40 rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Datasets Catalog Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredDatasets.map((ds) => (
          <div
            key={ds.id}
            className="p-5 bg-card border border-border/40 rounded-xl shadow-sm hover:border-border transition-all space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-foreground">{ds.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-primary/10 text-primary">
                    {ds.exportFormat}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1 max-w-2xl">{ds.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportJSONL(ds.name, ds.items)}
                  className="px-3.5 py-1.5 text-xs font-medium border border-border/50 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> Export JSONL
                </button>
                <Link
                  href={`/datasets/${ds.id}`}
                  className="px-3.5 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                >
                  Review Samples ({ds.items.length}) <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Meta Tags & Target Model */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border/30">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground">Target Model:</span>
                <span className="font-mono bg-muted/60 px-2 py-0.5 rounded">{ds.targetModel}</span>
              </div>
              <div>
                <span className="font-semibold text-foreground">Tokens:</span> {(ds.totalTokens / 1000).toFixed(0)}k
              </div>
              <div>
                <span className="font-semibold text-foreground">Exemplars:</span> {ds.itemCount} verified
              </div>
              <div className="text-[11px] text-muted-foreground font-mono ml-auto">
                Updated: {ds.lastUpdatedAt}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
