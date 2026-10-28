'use client';

import React from 'react';
import { DollarSign, TrendingUp, Calendar, PieChart, Cpu, Upload, X, BarChart2 } from 'lucide-react';
import { cn } from '../../../lib/utils/cn';
import { Skeleton } from '../../../components/ui/Skeleton';
import { Button } from '../../../components/primitives/Button';
import type { CostSummaryResult, CostByProvider, CostTrendPoint, CostCalculatorResult, ImportedSnapshot } from '../models/costs.model';
import { CostsSearchBar } from './CostsSearchBar';
import { CostsDetailDialog } from './CostsDetailDialog';
import { CostsTrendChart, type CostsTrendChartMode } from './CostsTrendChart';
import { CostsProviderChart, type DonutSlice } from './CostsProviderChart';
import { CostsCalculator } from './CostsCalculator';
import { CostsComparisonView, type ComparisonDelta } from './CostsComparisonView';
import { CostsPeriodComparison, type PeriodRange, type PeriodSummary } from './CostsPeriodComparison';
import { CostsImportDialog } from './CostsImportDialog';
import { computeDetailMetrics } from './costs-ui.utils';

export interface CostsDashboardUIProps {
  summary: CostSummaryResult | null;
  providers: CostByProvider[];
  filteredProviders: CostByProvider[];
  trendData?: CostTrendPoint[];
  loading?: boolean;
  error?: string | null;

  searchQuery: string;
  onSearchChange: (q: string) => void;

  selectedRow: CostByProvider | null;
  detailOpen: boolean;
  onRowClick: (row: CostByProvider) => void;
  onDetailOpenChange: (open: boolean) => void;

  trendChartTimestamps: number[];
  trendChartCosts: number[];
  trendChartTokens: number[];
  trendMode: CostsTrendChartMode;
  onTrendModeChange: (mode: CostsTrendChartMode) => void;

  donutSlices: DonutSlice[];

  calculatorTokensPerDay: number;
  calculatorCostPer1k: number;
  calculatorBudgetUsd: number;
  calculatorSelectedModel: string;
  calculatorResult: CostCalculatorResult;
  calculatorModelOptions: string[];
  onCalculatorTokensChange: (v: number) => void;
  onCalculatorCostPer1kChange: (v: number) => void;
  onCalculatorBudgetChange: (v: number) => void;
  onCalculatorModelChange: (m: string) => void;

  comparisonModelA: string;
  comparisonModelB: string;
  comparisonRowA: CostByProvider | null;
  comparisonRowB: CostByProvider | null;
  comparisonDelta: ComparisonDelta | null;
  onComparisonModelAChange: (m: string) => void;
  onComparisonModelBChange: (m: string) => void;

  periodRange: PeriodRange;
  periodIndices: number[];
  periodCurrentValues: number[];
  periodPreviousValues: number[];
  periodCurrentSummary: PeriodSummary;
  periodPreviousSummary: PeriodSummary;
  periodDeltaPct: number;
  onPeriodRangeChange: (r: PeriodRange) => void;

  importDialogOpen: boolean;
  importPastedJson: string;
  importParseError: string | null;
  importParseSuccess: boolean;
  importedSnapshot: ImportedSnapshot | null;
  onImportDialogOpen: () => void;
  onImportDialogOpenChange: (open: boolean) => void;
  onImportPastedJsonChange: (v: string) => void;
  onImportFileSelected: (file: File) => void;
  onImportConfirm: () => void;
  onImportClear: () => void;
  onImportedSnapshotDismiss: () => void;
}

function KpiCard({ label, value, sub, icon }: { label: string; value: string; sub: string; icon: React.ReactNode }) {
  return (
    <div className="p-4 rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
        <span>{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-[hsl(var(--foreground))]">{value}</div>
      <div className="text-xs text-[hsl(var(--muted-foreground))]">{sub}</div>
    </div>
  );
}

export function CostsDashboardUI(props: CostsDashboardUIProps) {
  const {
    summary, providers, filteredProviders, loading = false, error = null,
    searchQuery, onSearchChange,
    selectedRow, detailOpen, onRowClick, onDetailOpenChange,
    trendChartTimestamps, trendChartCosts, trendChartTokens, trendMode, onTrendModeChange,
    donutSlices,
    calculatorTokensPerDay, calculatorCostPer1k, calculatorBudgetUsd, calculatorSelectedModel,
    calculatorResult, calculatorModelOptions, onCalculatorTokensChange, onCalculatorCostPer1kChange,
    onCalculatorBudgetChange, onCalculatorModelChange,
    comparisonModelA, comparisonModelB, comparisonRowA, comparisonRowB, comparisonDelta,
    onComparisonModelAChange, onComparisonModelBChange,
    periodRange, periodIndices, periodCurrentValues, periodPreviousValues,
    periodCurrentSummary, periodPreviousSummary, periodDeltaPct, onPeriodRangeChange,
    importDialogOpen, importPastedJson, importParseError, importParseSuccess, importedSnapshot,
    onImportDialogOpen, onImportDialogOpenChange, onImportPastedJsonChange,
    onImportFileSelected, onImportConfirm, onImportClear, onImportedSnapshotDismiss,
  } = props;

  const detailMetrics = selectedRow ? computeDetailMetrics(selectedRow) : null;
  const modelOptions = providers.map((p) => p.model);

  if (loading) {
    return (
      <div className="flex flex-col gap-6" role="status" aria-label="Loading cost analytics">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm flex flex-col gap-3">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          ))}
        </div>
        <Skeleton className="h-[200px] w-full rounded-[var(--radius-xl)]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {error && (
        <div className="p-3 rounded-[var(--radius-lg)] bg-[hsl(var(--destructive)/.1)] border border-[hsl(var(--destructive)/.2)] text-[hsl(var(--destructive))] text-xs font-medium">
          {error}
        </div>
      )}

      {importedSnapshot && (
        <div className="flex items-center justify-between p-3 rounded-[var(--radius-lg)] bg-[hsl(var(--severity-warn)/.1)] border border-[hsl(var(--severity-warn)/.3)]">
          <span className="text-xs font-semibold text-[hsl(var(--severity-warn))]">
            Comparing imported snapshot: <span className="font-bold">{importedSnapshot.label}</span>
          </span>
          <button
            type="button"
            onClick={onImportedSnapshotDismiss}
            aria-label="Dismiss imported snapshot"
            className="text-[hsl(var(--severity-warn))] hover:opacity-70 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KpiCard
          label="Total USD Spend"
          value={summary ? `$${summary.total_cost_usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}
          sub="Current billing cycle"
          icon={<DollarSign className="w-4 h-4 text-[hsl(var(--severity-good))]" />}
        />
        <KpiCard
          label="Daily Average Spend"
          value={summary ? `$${summary.daily_avg_usd.toFixed(2)}` : '—'}
          sub="Rolling daily rate"
          icon={<Calendar className="w-4 h-4 text-[hsl(var(--primary))]" />}
        />
        <KpiCard
          label="Pace Delta %"
          value={summary ? `${summary.cost_delta_pct >= 0 ? '+' : ''}${summary.cost_delta_pct}%` : '—'}
          sub="vs previous billing period"
          icon={<TrendingUp className="w-4 h-4 text-[hsl(var(--severity-warn))]" />}
        />
        <KpiCard
          label="Projected Monthly Spend"
          value={summary ? `$${summary.projected_monthly_usd.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}
          sub="Run-rate forecast"
          icon={<PieChart className="w-4 h-4 text-[hsl(var(--severity-bad))]" />}
        />
      </div>

      {trendChartTimestamps.length > 0 && (
        <div className="p-5 rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <BarChart2 className="w-4 h-4 text-[hsl(var(--primary))]" />
            <span>Cost Trend</span>
          </div>
          <CostsTrendChart
            timestamps={trendChartTimestamps}
            costs={trendChartCosts}
            tokens={trendChartTokens}
            baselineTimestamps={importedSnapshot?.trend ? importedSnapshot.trend.map((p) => Math.floor(new Date(p.date).getTime() / 1000)) : undefined}
            baselineCosts={importedSnapshot?.trend?.map((p) => p.cost_usd)}
            baselineLabel={importedSnapshot?.label}
            mode={trendMode}
            onModeChange={onTrendModeChange}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm flex flex-col gap-3">
          <span className="text-sm font-semibold">Spend by Provider</span>
          <CostsProviderChart slices={donutSlices} />
        </div>

        <CostsCalculator
          tokensPerDay={calculatorTokensPerDay}
          costPer1kTokens={calculatorCostPer1k}
          budgetUsd={calculatorBudgetUsd}
          modelOptions={calculatorModelOptions}
          selectedModel={calculatorSelectedModel}
          result={calculatorResult}
          onTokensPerDayChange={onCalculatorTokensChange}
          onCostPer1kChange={onCalculatorCostPer1kChange}
          onBudgetChange={onCalculatorBudgetChange}
          onModelChange={onCalculatorModelChange}
        />
      </div>

      <CostsComparisonView
        modelOptions={modelOptions}
        modelA={comparisonModelA}
        modelB={comparisonModelB}
        rowA={comparisonRowA}
        rowB={comparisonRowB}
        delta={comparisonDelta}
        onModelAChange={onComparisonModelAChange}
        onModelBChange={onComparisonModelBChange}
      />

      <CostsPeriodComparison
        selectedRange={periodRange}
        indices={periodIndices}
        currentValues={periodCurrentValues}
        previousValues={periodPreviousValues}
        currentLabel="Current Period"
        previousLabel="Previous Period"
        currentSummary={periodCurrentSummary}
        previousSummary={periodPreviousSummary}
        deltaPct={periodDeltaPct}
        onRangeChange={onPeriodRangeChange}
      />

      <div className="p-5 rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Cpu className="w-4 h-4 text-[hsl(var(--primary))]" />
            <span>Cost Spend Breakdown by Provider &amp; Model</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-bold text-[hsl(var(--muted-foreground))]">
              {providers.length} Models Tracked
            </span>
            <CostsSearchBar value={searchQuery} onChange={onSearchChange} />
            <Button
              id="costs-import-btn"
              variant="outline"
              size="sm"
              onClick={onImportDialogOpen}
              className="flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Import
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredProviders.length === 0 ? (
            <div className="text-xs text-[hsl(var(--muted-foreground))] py-6 text-center">
              No cost breakdown data available for the active filters.
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead>
                <tr className={cn('border-b border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]')}>
                  <th className="py-2.5">Provider</th>
                  <th className="py-2.5">Model</th>
                  <th className="py-2.5">Total Spend</th>
                  <th className="py-2.5">Token Consumption</th>
                  <th className="py-2.5">% Share</th>
                </tr>
              </thead>
              <tbody>
                {filteredProviders.map((p) => (
                  <tr
                    key={`${p.provider}-${p.model}`}
                    className="border-b border-[hsl(var(--border))] hover:bg-[hsl(var(--muted)/.2)] cursor-pointer transition-colors duration-[var(--motion-duration-fast)]"
                    onClick={() => onRowClick(p)}
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onRowClick(p)}
                    role="button"
                    aria-label={`View details for ${p.provider} ${p.model}`}
                  >
                    <td className="py-2.5 font-medium">{p.provider}</td>
                    <td className="py-2.5 font-mono font-semibold">{p.model}</td>
                    <td className="py-2.5 font-bold text-[hsl(var(--severity-good))]">${p.cost_usd.toFixed(2)}</td>
                    <td className="py-2.5 font-mono">{p.token_count.toLocaleString()} tokens</td>
                    <td className="py-2.5 font-semibold text-[hsl(var(--primary))]">{p.pct_of_total}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {detailMetrics && (
        <CostsDetailDialog
          row={selectedRow}
          open={detailOpen}
          onOpenChange={onDetailOpenChange}
          costPer1k={detailMetrics.costPer1k}
          dailyRunRate={detailMetrics.dailyRunRate}
          projectedMonthly={detailMetrics.projectedMonthly}
          inputPct={detailMetrics.inputPct}
          outputPct={detailMetrics.outputPct}
        />
      )}

      <CostsImportDialog
        open={importDialogOpen}
        onOpenChange={onImportDialogOpenChange}
        pastedJson={importPastedJson}
        parseError={importParseError}
        parseSuccess={importParseSuccess}
        onPastedJsonChange={onImportPastedJsonChange}
        onFileSelected={onImportFileSelected}
        onConfirm={onImportConfirm}
        onClear={onImportClear}
      />
    </div>
  );
}
