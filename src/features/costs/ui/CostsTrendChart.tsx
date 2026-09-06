'use client';

import React, { useEffect, useRef } from 'react';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { BarChart2, AlertCircle } from 'lucide-react';
import { Skeleton } from '../../../components/ui/Skeleton';
import { cn } from '../../../lib/utils/cn';

export type CostsTrendChartMode = 'cost' | 'tokens';

export interface CostsTrendChartProps {
  timestamps: number[];
  costs: number[];
  tokens: number[];
  baselineTimestamps?: number[];
  baselineCosts?: number[];
  baselineLabel?: string;
  mode: CostsTrendChartMode;
  onModeChange: (mode: CostsTrendChartMode) => void;
  height?: number;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

function ToggleButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-[var(--radius-md)] text-xs font-semibold',
        'transition-all duration-[var(--motion-duration-fast)]',
        active
          ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm'
          : 'bg-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted)/.5)]',
      )}
    >
      {children}
    </button>
  );
}

export function CostsTrendChart({
  timestamps,
  costs,
  tokens,
  baselineTimestamps,
  baselineCosts,
  baselineLabel,
  mode,
  onModeChange,
  height = 200,
  isLoading = false,
  error = null,
  className,
}: CostsTrendChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const plotRef = useRef<uPlot | null>(null);

  useEffect(() => {
    if (isLoading || error || typeof window === 'undefined' || containerRef.current === null) return;
    if (timestamps.length === 0) return;

    const yData = mode === 'cost' ? costs : tokens;
    const seriesArr: uPlot.Series[] = [
      {},
      {
        label: mode === 'cost' ? 'Cost (USD)' : 'Tokens',
        stroke: 'hsl(var(--primary))',
        width: 2,
        fill: 'hsl(var(--primary) / 0.12)',
        points: { show: false },
      },
    ];
    const dataArr: uPlot.AlignedData = [timestamps, yData];

    if (baselineTimestamps && baselineCosts && baselineCosts.length > 0) {
      seriesArr.push({
        label: baselineLabel ?? 'Baseline',
        stroke: 'hsl(var(--severity-warn))',
        width: 2,
        dash: [4, 4],
        points: { show: false },
      });
      dataArr.push(baselineCosts);
    }

    const opts: uPlot.Options = {
      width: containerRef.current.offsetWidth || 600,
      height,
      scales: { x: { time: mode === 'cost' }, y: { auto: true } },
      series: seriesArr,
      axes: [
        { grid: { show: true, stroke: 'hsl(var(--border) / 0.4)' }, ticks: { show: true, stroke: 'hsl(var(--border))' } },
        { grid: { show: true, stroke: 'hsl(var(--border) / 0.4)' }, ticks: { show: true, stroke: 'hsl(var(--border))' } },
      ],
      cursor: { drag: { setScale: false } },
    };

    const plot = new uPlot(opts, dataArr, containerRef.current);
    plotRef.current = plot;

    return () => {
      plot.destroy();
      plotRef.current = null;
    };
  }, [timestamps, costs, tokens, baselineTimestamps, baselineCosts, baselineLabel, mode, height, isLoading, error]);

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center p-0.5 rounded-[var(--radius-md)] bg-[hsl(var(--muted)/.4)]">
          <ToggleButton active={mode === 'cost'} onClick={() => onModeChange('cost')}>Cost (USD)</ToggleButton>
          <ToggleButton active={mode === 'tokens'} onClick={() => onModeChange('tokens')}>Token Volume</ToggleButton>
        </div>
        {baselineLabel && (
          <div className="flex items-center gap-3 text-[10px] text-[hsl(var(--muted-foreground))]">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 rounded bg-[hsl(var(--primary))] inline-block" />
              <span>Live</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 border-t-2 border-dashed border-[hsl(var(--severity-warn))] inline-block" />
              <span>{baselineLabel}</span>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2 p-3 rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton style={{ height }} />
        </div>
      )}

      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center gap-2 p-6 rounded-[var(--radius-lg)] border border-[hsl(var(--destructive)/.3)] bg-[hsl(var(--destructive)/.05)]" style={{ minHeight: height }}>
          <AlertCircle className="w-5 h-5 text-[hsl(var(--destructive))]" />
          <span className="text-xs text-[hsl(var(--destructive))] text-center">{error}</span>
        </div>
      )}

      {!isLoading && !error && timestamps.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--muted)/.1)]" style={{ minHeight: height }}>
          <BarChart2 className="w-6 h-6 text-[hsl(var(--muted-foreground)/.5)]" />
          <span className="text-xs text-[hsl(var(--muted-foreground))]">No trend data available</span>
        </div>
      )}

      {!isLoading && !error && timestamps.length > 0 && (
        <div
          ref={containerRef}
          className="rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 overflow-hidden"
        />
      )}
    </div>
  );
}
