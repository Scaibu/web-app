'use client';

import React from 'react';
import { GitCompare, TrendingUp, TrendingDown, Minus, MousePointerClick } from 'lucide-react';
import { Skeleton } from '../../../components/ui/Skeleton';
import { cn } from '../../../lib/utils/cn';
import type { CostByProvider } from '../models/costs.model';

export interface ComparisonDelta {
  costDeltaAbs: number;
  costDeltaPct: number;
  tokenDeltaAbs: number;
  tokenDeltaPct: number;
  effDeltaPct: number;
}

export interface CostsComparisonViewProps {
  modelOptions: string[];
  modelA: string;
  modelB: string;
  rowA: CostByProvider | null;
  rowB: CostByProvider | null;
  delta: ComparisonDelta | null;
  onModelAChange: (model: string) => void;
  onModelBChange: (model: string) => void;
  isLoading?: boolean;
  className?: string;
}

function DeltaBadge({ value, higherIsWorse = false }: { value: number; higherIsWorse?: boolean }) {
  const isNeutral = value === 0;
  const isPositive = value > 0;
  const isBad = higherIsWorse ? isPositive : !isPositive;
  const Icon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold',
        isNeutral
          ? 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]'
          : isBad
          ? 'bg-[hsl(var(--severity-bad)/.12)] text-[hsl(var(--severity-bad))]'
          : 'bg-[hsl(var(--severity-good)/.12)] text-[hsl(var(--severity-good))]',
      )}
    >
      <Icon className="w-3 h-3" />
      {isPositive && '+'}
      {value.toFixed(1)}%
    </span>
  );
}

interface MetricRowProps {
  label: string;
  absValue: string;
  pctValue: number;
  higherIsWorse?: boolean;
}

function DeltaMetricRow({ label, absValue, pctValue, higherIsWorse }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[hsl(var(--border))] last:border-0">
      <span className="text-xs text-[hsl(var(--muted-foreground))]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-bold text-[hsl(var(--foreground))]">{absValue}</span>
        <DeltaBadge value={pctValue} higherIsWorse={higherIsWorse} />
      </div>
    </div>
  );
}

function ProviderMetricCard({ row, side }: { row: CostByProvider | null; side: 'A' | 'B' }) {
  if (!row) {
    return (
      <div className="flex-1 rounded-[var(--radius-lg)] border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted)/.1)] p-4 flex flex-col items-center justify-center gap-2 min-h-[100px]">
        <MousePointerClick className="w-4 h-4 text-[hsl(var(--muted-foreground)/.4)]" />
        <span className="text-xs text-[hsl(var(--muted-foreground))]">Select Model {side}</span>
      </div>
    );
  }
  const borderColor = side === 'A' ? 'border-[hsl(var(--primary)/.3)]' : 'border-[hsl(var(--severity-warn)/.3)]';
  const labelColor = side === 'A' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--severity-warn))]';

  return (
    <div className={cn('flex-1 rounded-[var(--radius-lg)] border bg-[hsl(var(--card))] p-4 flex flex-col gap-2', borderColor)}>
      <div className={cn('text-[10px] font-bold uppercase tracking-wide', labelColor)}>Model {side}</div>
      <div className="text-xs font-semibold text-[hsl(var(--foreground))] truncate">{row.model}</div>
      <div className="text-[10px] text-[hsl(var(--muted-foreground))]">{row.provider}</div>
      <div className="text-xl font-bold text-[hsl(var(--severity-good))] mt-1">${row.cost_usd.toFixed(2)}</div>
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex items-center justify-between text-[10px] text-[hsl(var(--muted-foreground))]">
          <span>Tokens</span>
          <span className="font-mono">{row.token_count.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-[hsl(var(--muted-foreground))]">
          <span>Share</span>
          <span className="font-semibold">{row.pct_of_total}%</span>
        </div>
      </div>
    </div>
  );
}

const selectCls = cn(
  'h-9 w-full rounded-[var(--radius-lg)] border border-[hsl(var(--input))] bg-[hsl(var(--background))]',
  'px-2.5 text-xs text-[hsl(var(--foreground))]',
  'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]',
  'cursor-pointer transition-all duration-[var(--motion-duration-fast)]',
);

export function CostsComparisonView({
  modelOptions,
  modelA,
  modelB,
  rowA,
  rowB,
  delta,
  onModelAChange,
  onModelBChange,
  isLoading = false,
  className,
}: CostsComparisonViewProps) {
  if (isLoading) {
    return (
      <div className={cn('rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 flex flex-col gap-4', className)}>
        <Skeleton className="h-5 w-1/3" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="flex-1 h-[120px]" />
          <Skeleton className="flex-1 h-[120px]" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn('rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 flex flex-col gap-4', className)}>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <GitCompare className="w-4 h-4 text-[hsl(var(--primary))]" />
        <span>Model Comparison</span>
        {!modelA && !modelB && (
          <span className="ml-auto text-[10px] font-normal text-[hsl(var(--muted-foreground))]">Select two models to compare</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wide text-[hsl(var(--primary))]">Model A</span>
          <select value={modelA} onChange={(e) => onModelAChange(e.target.value)} className={selectCls}>
            <option value="">— Select —</option>
            {modelOptions.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wide text-[hsl(var(--severity-warn))]">Model B</span>
          <select value={modelB} onChange={(e) => onModelBChange(e.target.value)} className={selectCls}>
            <option value="">— Select —</option>
            {modelOptions.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <ProviderMetricCard row={rowA} side="A" />
        <ProviderMetricCard row={rowB} side="B" />
      </div>

      {delta && (
        <div className="rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.15)] p-3 flex flex-col">
          <DeltaMetricRow label="Cost (A vs B)" absValue={`${delta.costDeltaAbs >= 0 ? '+' : ''}$${delta.costDeltaAbs.toFixed(2)}`} pctValue={delta.costDeltaPct} higherIsWorse />
          <DeltaMetricRow label="Token Volume" absValue={`${delta.tokenDeltaAbs >= 0 ? '+' : ''}${delta.tokenDeltaAbs.toLocaleString()}`} pctValue={delta.tokenDeltaPct} />
          <DeltaMetricRow label="Cost Efficiency" absValue="" pctValue={delta.effDeltaPct} higherIsWorse />
        </div>
      )}
    </div>
  );
}
