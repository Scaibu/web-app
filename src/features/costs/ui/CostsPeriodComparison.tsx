'use client';

import React, { useEffect, useRef } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Skeleton } from '../../../components/ui/Skeleton';
import { cn } from '../../../lib/utils/cn';

export type PeriodRange = '7d' | '30d' | '90d';

export interface PeriodSummary {
  total_cost_usd: number;
  daily_avg_usd: number;
}

export interface CostsPeriodComparisonProps {
  indices: number[];
  currentValues: number[];
  previousValues: number[];
  currentLabel: string;
  previousLabel: string;
  currentSummary: PeriodSummary;
  previousSummary: PeriodSummary;
  deltaPct: number;
  selectedRange: PeriodRange;
  onRangeChange: (range: PeriodRange) => void;
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

const RANGES: PeriodRange[] = ['7d', '30d', '90d'];

export function CostsPeriodComparison({
  indices,
  currentValues,
  previousValues,
  currentLabel,
  previousLabel,
  currentSummary,
  previousSummary,
  deltaPct,
  selectedRange,
  onRangeChange,
  height = 180,
  isLoading = false,
  error = null,
  className,
}: CostsPeriodComparisonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<uPlot | null>(null);

  useEffect(() => {
    if (isLoading || error || typeof window === 'undefined' || containerRef.current === null) return;
    if (indices.length === 0) return;

    const opts: uPlot.Options = {
      width: containerRef.current.offsetWidth || 600,
      height,
      scales: { x: { time: false }, y: { auto: true } },
      series: [
        {},
        {
          label: currentLabel,
          stroke: 'hsl(var(--primary))',
          width: 2,
          fill: 'hsl(var(--primary) / 0.1)',
          points: { show: false },
        },
        {
          label: previousLabel,
          stroke: 'hsl(var(--severity-warn))',
          width: 2,
          dash: [4, 4],
          points: { show: false },
        },
      ],
      axes: [
        { grid: { show: true, stroke: 'hsl(var(--border) / 0.4)' }, ticks: { show: true, stroke: 'hsl(var(--border))' } },
        { grid: { show: true, stroke: 'hsl(var(--border) / 0.4)' }, ticks: { show: true, stroke: 'hsl(var(--border))' } },
      ],
      cursor: { drag: { setScale: false } },
    };

    const plot = new uPlot(opts, [indices, currentValues, previousValues], containerRef.current);
    plotRef.current = plot;

    return () => {
      plot.destroy();
      plotRef.current = null;
    };
  }, [indices, currentValues, previousValues, currentLabel, previousLabel, height, isLoading, error]);

  const isPositive = deltaPct > 0;
  const isNeutral = deltaPct === 0;
  const DeltaIcon = isNeutral ? Minus : isPositive ? ArrowUpRight : ArrowDownRight;
  const deltaColorClass = isNeutral
    ? 'text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted)/.4)]'
    : isPositive
    ? 'text-[hsl(var(--severity-bad))] bg-[hsl(var(--severity-bad)/.1)]'
    : 'text-[hsl(var(--severity-good))] bg-[hsl(var(--severity-good)/.1)]';

  if (isLoading) {
    return (
      <div className={cn('rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 flex flex-col gap-4', className)}>
        <Skeleton className="h-5 w-1/3" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Skeleton style={{ height }} className="w-full" />
      </div>
    );
  }

  return (
    <div className={cn('rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-[hsl(var(--foreground))]">Period Comparison</span>
          <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold', deltaColorClass)}>
            <DeltaIcon className="w-3.5 h-3.5" />
            {isPositive && '+'}{deltaPct.toFixed(1)}%
          </span>
        </div>
        <div className="flex items-center p-0.5 gap-0.5 rounded-[var(--radius-md)] bg-[hsl(var(--muted)/.4)]">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => onRangeChange(r)}
              className={cn(
                'px-2.5 py-1 rounded-[var(--radius-sm)] text-[10px] font-bold uppercase tracking-wide',
                'transition-all duration-[var(--motion-duration-fast)]',
                selectedRange === r
                  ? 'bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-sm'
                  : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]',
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[var(--radius-lg)] border border-[hsl(var(--primary)/.3)] bg-[hsl(var(--primary)/.05)] p-4 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] shrink-0" />
            <span className="text-[10px] uppercase font-bold tracking-wide text-[hsl(var(--primary))]">{currentLabel}</span>
          </div>
          <span className="text-2xl font-bold text-[hsl(var(--foreground))]">${currentSummary.total_cost_usd.toFixed(2)}</span>
          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Avg ${currentSummary.daily_avg_usd.toFixed(2)}/day</span>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--muted)/.15)] p-4 flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full border-2 border-dashed border-[hsl(var(--severity-warn))] shrink-0" />
            <span className="text-[10px] uppercase font-bold tracking-wide text-[hsl(var(--muted-foreground))]">{previousLabel}</span>
          </div>
          <span className="text-2xl font-bold text-[hsl(var(--foreground))]">${previousSummary.total_cost_usd.toFixed(2)}</span>
          <span className="text-[10px] text-[hsl(var(--muted-foreground))]">Avg ${previousSummary.daily_avg_usd.toFixed(2)}/day</span>
        </div>
      </div>

      {error && (
        <div className="text-xs text-[hsl(var(--destructive))] text-center py-2">{error}</div>
      )}

      <div
        ref={containerRef}
        className="rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 overflow-hidden"
      />

      <div className="flex items-center gap-4 text-[10px]">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 rounded bg-[hsl(var(--primary))] inline-block" />
          <span className="text-[hsl(var(--muted-foreground))]">{currentLabel}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 border-t-2 border-dashed border-[hsl(var(--severity-warn))] inline-block" />
          <span className="text-[hsl(var(--muted-foreground))]">{previousLabel}</span>
        </div>
      </div>
    </div>
  );
}
