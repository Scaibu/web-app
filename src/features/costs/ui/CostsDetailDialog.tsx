'use client';

import React from 'react';
import { Cpu, DollarSign, TrendingUp } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '../../../components/primitives/Dialog';
import { Button } from '../../../components/primitives/Button';
import { cn } from '../../../lib/utils/cn';
import type { CostByProvider } from '../models/costs.model';

export interface CostsDetailDialogProps {
  row: CostByProvider | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  costPer1k: number;
  dailyRunRate: number;
  projectedMonthly: number;
  inputPct: number | null;
  outputPct: number | null;
}

interface MetricRowProps {
  label: string;
  value: string;
  accent?: string;
}

function MetricRow({ label, value, accent }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[hsl(var(--border))] last:border-0">
      <span className="text-xs text-[hsl(var(--muted-foreground))]">{label}</span>
      <span className={cn('text-xs font-bold font-mono', accent ?? 'text-[hsl(var(--foreground))]')}>{value}</span>
    </div>
  );
}

export function CostsDetailDialog({
  row,
  open,
  onOpenChange,
  costPer1k,
  dailyRunRate,
  projectedMonthly,
  inputPct,
  outputPct,
}: CostsDetailDialogProps) {
  if (!row) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md flex flex-col gap-5">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-sm font-semibold">
            <Cpu className="w-4 h-4 text-[hsl(var(--primary))]" />
            {row.model}
          </DialogTitle>
          <DialogDescription>
            Provider: <span className="font-medium text-[hsl(var(--foreground))]">{row.provider}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 p-3 rounded-[var(--radius-lg)] bg-[hsl(var(--severity-good)/.1)] border border-[hsl(var(--severity-good)/.2)]">
          <DollarSign className="w-5 h-5 text-[hsl(var(--severity-good))] shrink-0" />
          <div>
            <div className="text-xl font-bold text-[hsl(var(--severity-good))]">
              ${row.cost_usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-[hsl(var(--severity-good)/.7)] uppercase font-bold tracking-wide">
              Total spend · {row.pct_of_total}% of budget
            </div>
          </div>
        </div>

        <div className="flex flex-col">
          <MetricRow label="Total Tokens" value={row.token_count.toLocaleString()} />
          {inputPct != null && (
            <MetricRow label="Input Token Share" value={`${inputPct.toFixed(1)}%`} accent="text-[hsl(var(--primary))]" />
          )}
          {outputPct != null && (
            <MetricRow label="Output Token Share" value={`${outputPct.toFixed(1)}%`} accent="text-[hsl(var(--accent-foreground))]" />
          )}
          <MetricRow label="Cost per 1k Tokens" value={`$${costPer1k.toFixed(4)}`} accent="text-[hsl(var(--severity-warn))]" />
          <MetricRow label="Daily Run-Rate (÷30d)" value={`$${dailyRunRate.toFixed(2)}`} accent="text-[hsl(var(--severity-bad))]" />
          <MetricRow label="Share of Total Spend" value={`${row.pct_of_total}%`} accent="text-[hsl(var(--primary))]" />
        </div>

        <div className="flex items-center gap-2 p-3 rounded-[var(--radius-lg)] bg-[hsl(var(--muted)/.3)] border border-[hsl(var(--border))]">
          <TrendingUp className="w-4 h-4 text-[hsl(var(--severity-warn))] shrink-0" />
          <span className="text-xs text-[hsl(var(--muted-foreground))]">
            Projected 30-day spend:{' '}
            <span className="font-bold text-[hsl(var(--severity-warn))]">${projectedMonthly.toFixed(2)}</span>
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between text-[10px] text-[hsl(var(--muted-foreground))] uppercase font-bold tracking-wide">
            <span>Spend Share</span>
            <span>{row.pct_of_total}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[hsl(var(--muted)/.4)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[hsl(var(--severity-good))] transition-all duration-[var(--motion-duration-slow)]"
              style={{ width: `${Math.min(row.pct_of_total, 100)}%` }}
            />
          </div>
        </div>

        <DialogClose asChild>
          <Button id="costs-detail-dialog-close" variant="secondary" size="sm" className="w-full">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
