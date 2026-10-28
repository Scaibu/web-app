'use client';

import React from 'react';
import { Calculator, AlertTriangle, TrendingUp, DollarSign, Zap, Clock } from 'lucide-react';
import { Skeleton } from '../../../components/ui/Skeleton';
import { cn } from '../../../lib/utils/cn';
import type { CostCalculatorResult } from '../models/costs.model';

export interface CostsCalculatorProps {
  tokensPerDay: number;
  costPer1kTokens: number;
  budgetUsd: number;
  modelOptions: string[];
  selectedModel: string;
  result: CostCalculatorResult;
  onTokensPerDayChange: (value: number) => void;
  onCostPer1kChange: (value: number) => void;
  onBudgetChange: (value: number) => void;
  onModelChange: (model: string) => void;
  isLoading?: boolean;
  className?: string;
}

interface ResultTileProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
  bgAccent?: string;
}

function ResultTile({ icon, label, value, accent, bgAccent }: ResultTileProps) {
  return (
    <div className={cn('rounded-[var(--radius-lg)] border border-[hsl(var(--border))] p-3 flex flex-col gap-1.5', bgAccent ?? 'bg-[hsl(var(--card))]')}>
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] uppercase font-bold tracking-wide text-[hsl(var(--muted-foreground))]">{label}</span>
      </div>
      <span className={cn('text-lg font-bold font-mono', accent ?? 'text-[hsl(var(--foreground))]')}>{value}</span>
    </div>
  );
}

const inputCls = cn(
  'flex h-9 w-full rounded-[var(--radius-lg)] border border-[hsl(var(--input))] bg-[hsl(var(--background))]',
  'px-3 text-xs text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))]',
  'focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-[hsl(var(--ring))]',
  'transition-all duration-[var(--motion-duration-fast)]',
);

export function CostsCalculator({
  tokensPerDay,
  costPer1kTokens,
  budgetUsd,
  modelOptions,
  selectedModel,
  result,
  onTokensPerDayChange,
  onCostPer1kChange,
  onBudgetChange,
  onModelChange,
  isLoading = false,
  className,
}: CostsCalculatorProps) {
  const budgetUsedPct = budgetUsd > 0 ? Math.min((result.monthly_cost_usd / budgetUsd) * 100, 100) : 0;

  if (isLoading) {
    return (
      <div className={cn('rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 flex flex-col gap-4', className)}>
        <Skeleton className="h-5 w-1/3" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}
        </div>
        <Skeleton className="h-[120px] w-full" />
      </div>
    );
  }

  return (
    <div className={cn('rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 flex flex-col gap-5', className)}>
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Calculator className="w-4 h-4 text-[hsl(var(--primary))]" />
        <span>Cost Calculator</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wide text-[hsl(var(--muted-foreground))]">Tokens / Day</span>
          <input id="calc-tokens-per-day" type="number" min={0} value={tokensPerDay} onChange={(e) => onTokensPerDayChange(Number(e.target.value))} className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wide text-[hsl(var(--muted-foreground))]">Cost / 1k Tokens ($)</span>
          <input id="calc-cost-per-1k" type="number" min={0} step={0.0001} value={costPer1kTokens} onChange={(e) => onCostPer1kChange(Number(e.target.value))} className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wide text-[hsl(var(--muted-foreground))]">Monthly Budget ($)</span>
          <input id="calc-budget" type="number" min={0} value={budgetUsd} onChange={(e) => onBudgetChange(Number(e.target.value))} className={inputCls} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-bold tracking-wide text-[hsl(var(--muted-foreground))]">Model</span>
          <select id="calc-model" value={selectedModel} onChange={(e) => onModelChange(e.target.value)} className={cn(inputCls, 'cursor-pointer')}>
            {modelOptions.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ResultTile
          icon={<DollarSign className="w-3 h-3 text-[hsl(var(--severity-good))]" />}
          label="Daily Cost"
          value={`$${result.daily_cost_usd.toFixed(4)}`}
          accent="text-[hsl(var(--severity-good))]"
          bgAccent="bg-[hsl(var(--severity-good)/.05)] border-[hsl(var(--severity-good)/.2)]"
        />
        <ResultTile
          icon={<TrendingUp className="w-3 h-3 text-[hsl(var(--primary))]" />}
          label="Monthly Cost"
          value={`$${result.monthly_cost_usd.toFixed(2)}`}
          accent={result.over_budget ? 'text-[hsl(var(--severity-bad))]' : 'text-[hsl(var(--foreground))]'}
          bgAccent={result.over_budget ? 'bg-[hsl(var(--severity-bad)/.05)] border-[hsl(var(--severity-bad)/.2)]' : undefined}
        />
        <ResultTile
          icon={<Zap className="w-3 h-3 text-[hsl(var(--severity-warn))]" />}
          label="Cost / 1k Tokens"
          value={`$${result.cost_per_1k.toFixed(4)}`}
          accent="text-[hsl(var(--severity-warn))]"
        />
        <ResultTile
          icon={<Clock className="w-3 h-3 text-[hsl(var(--muted-foreground))]" />}
          label="Days to Budget"
          value={result.days_until_budget_hit != null ? `${result.days_until_budget_hit}d` : '—'}
          accent={result.over_budget ? 'text-[hsl(var(--severity-bad))]' : 'text-[hsl(var(--severity-good))]'}
        />
      </div>

      {budgetUsd > 0 && (
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px] text-[hsl(var(--muted-foreground))]">
            <span>Budget Utilisation</span>
            <span className={cn('font-bold', result.over_budget ? 'text-[hsl(var(--severity-bad))]' : 'text-[hsl(var(--foreground))]')}>
              {budgetUsedPct.toFixed(0)}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-[hsl(var(--muted)/.4)] overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-[var(--motion-duration-slow)]',
                result.over_budget
                  ? 'bg-[hsl(var(--severity-bad))]'
                  : budgetUsedPct > 75
                  ? 'bg-[hsl(var(--severity-warn))]'
                  : 'bg-[hsl(var(--severity-good))]',
              )}
              style={{ width: `${budgetUsedPct}%` }}
            />
          </div>
        </div>
      )}

      {result.over_budget && (
        <div className="flex items-center gap-2 p-2.5 rounded-[var(--radius-lg)] bg-[hsl(var(--destructive)/.08)] border border-[hsl(var(--destructive)/.25)]">
          <AlertTriangle className="w-3.5 h-3.5 text-[hsl(var(--destructive))] shrink-0" />
          <span className="text-xs text-[hsl(var(--destructive))]">Projected spend exceeds monthly budget.</span>
        </div>
      )}
    </div>
  );
}
