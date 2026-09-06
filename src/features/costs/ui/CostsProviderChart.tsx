'use client';

import React from 'react';
import { PieChart, AlertCircle } from 'lucide-react';
import { Skeleton } from '../../../components/ui/Skeleton';
import { cn } from '../../../lib/utils/cn';

export interface DonutSlice {
  label: string;
  value: number;
  pct: number;
  color: string;
}

export interface CostsProviderChartProps {
  slices: DonutSlice[];
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

const COLORS: string[] = [
  'hsl(var(--primary))',
  'hsl(var(--severity-good))',
  'hsl(var(--severity-warn))',
  'hsl(var(--severity-bad))',
  'hsl(var(--accent-foreground))',
];

export function buildDonutSlices(providers: { provider: string; cost_usd: number; pct_of_total: number }[]): DonutSlice[] {
  const grouped: Record<string, number> = {};
  for (const p of providers) {
    grouped[p.provider] = (grouped[p.provider] ?? 0) + p.cost_usd;
  }
  const total = Object.values(grouped).reduce((s, v) => s + v, 0);
  return Object.entries(grouped).map(([label, value], i) => ({
    label,
    value,
    pct: total > 0 ? (value / total) * 100 : 0,
    color: COLORS[i % COLORS.length] ?? COLORS[0] ?? 'hsl(var(--primary))',
  }));
}

export function CostsProviderChart({ slices, isLoading = false, error = null, className }: CostsProviderChartProps) {
  const r = 40;
  const cx = 60;
  const cy = 60;
  const circumference = 2 * Math.PI * r;

  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-6', className)}>
        <Skeleton className="w-[120px] h-[120px] rounded-full" />
        <div className="flex flex-col gap-2 flex-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex items-center gap-2 p-4 rounded-[var(--radius-lg)] border border-[hsl(var(--destructive)/.3)] bg-[hsl(var(--destructive)/.05)]', className)}>
        <AlertCircle className="w-4 h-4 text-[hsl(var(--destructive))] shrink-0" />
        <span className="text-xs text-[hsl(var(--destructive))]">{error}</span>
      </div>
    );
  }

  if (slices.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center gap-2 py-8 rounded-[var(--radius-lg)] border border-dashed border-[hsl(var(--border))]', className)}>
        <PieChart className="w-6 h-6 text-[hsl(var(--muted-foreground)/.4)]" />
        <span className="text-xs text-[hsl(var(--muted-foreground))]">No provider data</span>
      </div>
    );
  }

  let offset = 0;
  const arcs = slices.map((slice) => {
    const dash = (slice.pct / 100) * circumference;
    const arc = { slice, dash, gap: circumference - dash, offset };
    offset += dash;
    return arc;
  });

  return (
    <div className={cn('flex items-center gap-6', className)}>
      <svg width={120} height={120} viewBox="0 0 120 120" role="img" aria-label="Provider spend share donut">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth={16} />
        {arcs.map(({ slice, dash, gap, offset: ao }) => (
          <circle
            key={slice.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={slice.color}
            strokeWidth={16}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-ao}
            strokeLinecap="butt"
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${cx}px ${cy}px`, transition: `stroke-dashoffset var(--motion-duration-slow)` }}
          />
        ))}
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="text-[8px] font-bold fill-[hsl(var(--foreground))]" fontSize={9}>
          {slices.length}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle" fontSize={6} className="fill-[hsl(var(--muted-foreground))]">
          providers
        </text>
      </svg>
      <ul className="flex flex-col gap-2.5 flex-1">
        {slices.map((slice) => (
          <li key={slice.label} className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: slice.color }} />
                <span className="text-xs text-[hsl(var(--muted-foreground))]">{slice.label}</span>
              </div>
              <span className="text-xs font-bold text-[hsl(var(--foreground))]">{slice.pct.toFixed(1)}%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-[hsl(var(--muted)/.4)] overflow-hidden ml-4">
              <div
                className="h-full rounded-full transition-all duration-[var(--motion-duration-slow)]"
                style={{ width: `${slice.pct}%`, background: slice.color }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
