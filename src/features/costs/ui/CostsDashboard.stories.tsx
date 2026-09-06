import type { Meta, StoryObj } from '@storybook/react';
import { CostsDashboardUI } from './CostsDashboardUI';
import { buildDonutSlices } from './CostsProviderChart';
import {
  computeCalculatorResult,
  trendPointsToUplotData,
  buildPeriodComparisonUplotData,
  computeComparisonDelta,
} from './costs-ui.utils';
import type { CostByProvider, CostTrendPoint } from '../types';

const PROVIDERS: CostByProvider[] = [
  { provider: 'OpenAI', model: 'gpt-4o', cost_usd: 850.40, token_count: 14200000, pct_of_total: 59.8, input_tokens: 10000000, output_tokens: 4200000 },
  { provider: 'Anthropic', model: 'claude-3-5-sonnet', cost_usd: 420.10, token_count: 8900000, pct_of_total: 29.5, input_tokens: 6000000, output_tokens: 2900000 },
  { provider: 'OpenAI', model: 'text-embedding-3-small', cost_usd: 150.00, token_count: 45000000, pct_of_total: 10.7 },
];

const TREND: CostTrendPoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0] ?? '',
  cost_usd: 40 + Math.sin(i / 3) * 10 + 5,
  token_count: 400000 + Math.floor(Math.sin(i / 4) * 50000),
}));

const PREVIOUS_TREND: CostTrendPoint[] = TREND.map((p) => ({ ...p, cost_usd: p.cost_usd * 0.82 }));

const [timestamps, costs, tokens] = trendPointsToUplotData(TREND);
const [periodIndices, periodCurrentValues, periodPreviousValues] = buildPeriodComparisonUplotData(TREND, PREVIOUS_TREND);

const CURRENT_SUMMARY = {
  total_cost_usd: TREND.reduce((s, p) => s + p.cost_usd, 0),
  daily_avg_usd: TREND.reduce((s, p) => s + p.cost_usd, 0) / 30,
};
const PREVIOUS_SUMMARY = {
  total_cost_usd: PREVIOUS_TREND.reduce((s, p) => s + p.cost_usd, 0),
  daily_avg_usd: PREVIOUS_TREND.reduce((s, p) => s + p.cost_usd, 0) / 30,
};
const PERIOD_DELTA_PCT =
  PREVIOUS_SUMMARY.total_cost_usd > 0
    ? ((CURRENT_SUMMARY.total_cost_usd - PREVIOUS_SUMMARY.total_cost_usd) / PREVIOUS_SUMMARY.total_cost_usd) * 100
    : 0;

const MODEL_OPTIONS = PROVIDERS.map((p) => p.model);
const NOOP = () => {};

const BASE_PROPS = {
  summary: { total_cost_usd: 1420.50, daily_avg_usd: 47.35, cost_delta_pct: 5.8, projected_monthly_usd: 1450.00 },
  providers: PROVIDERS,
  filteredProviders: PROVIDERS,
  trendData: TREND,
  loading: false,
  error: null,
  searchQuery: '',
  onSearchChange: NOOP,
  selectedRow: null,
  detailOpen: false,
  onRowClick: NOOP,
  onDetailOpenChange: NOOP,
  trendChartTimestamps: timestamps,
  trendChartCosts: costs,
  trendChartTokens: tokens,
  trendMode: 'cost' as const,
  onTrendModeChange: NOOP,
  donutSlices: buildDonutSlices(PROVIDERS),
  calculatorTokensPerDay: 500000,
  calculatorCostPer1k: 0.03,
  calculatorBudgetUsd: 1500,
  calculatorSelectedModel: MODEL_OPTIONS[0] ?? '',
  calculatorResult: computeCalculatorResult(500000, 0.03, 1500),
  calculatorModelOptions: MODEL_OPTIONS,
  onCalculatorTokensChange: NOOP,
  onCalculatorCostPer1kChange: NOOP,
  onCalculatorBudgetChange: NOOP,
  onCalculatorModelChange: NOOP,
  comparisonModelA: '',
  comparisonModelB: '',
  comparisonRowA: null,
  comparisonRowB: null,
  comparisonDelta: null,
  onComparisonModelAChange: NOOP,
  onComparisonModelBChange: NOOP,
  periodRange: '30d' as const,
  periodIndices,
  periodCurrentValues,
  periodPreviousValues,
  periodCurrentSummary: CURRENT_SUMMARY,
  periodPreviousSummary: PREVIOUS_SUMMARY,
  periodDeltaPct: PERIOD_DELTA_PCT,
  onPeriodRangeChange: NOOP,
  importDialogOpen: false,
  importPastedJson: '',
  importParseError: null,
  importParseSuccess: false,
  importedSnapshot: null,
  onImportDialogOpen: NOOP,
  onImportDialogOpenChange: NOOP,
  onImportPastedJsonChange: NOOP,
  onImportFileSelected: NOOP,
  onImportConfirm: NOOP,
  onImportClear: NOOP,
  onImportedSnapshotDismiss: NOOP,
};

const meta: Meta<typeof CostsDashboardUI> = {
  title: 'Features/Costs/CostsDashboardUI',
  component: CostsDashboardUI,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof CostsDashboardUI>;

export const FullDashboard: Story = {
  args: BASE_PROPS,
};

export const GlobalLoading: Story = {
  args: { ...BASE_PROPS, summary: null, providers: [], filteredProviders: [], trendChartTimestamps: [], loading: true },
};

export const GlobalError: Story = {
  args: {
    ...BASE_PROPS,
    summary: null,
    providers: [],
    filteredProviders: [],
    trendChartTimestamps: [],
    error: 'Failed to connect to Cost Analytics Engine (HTTP 500 Internal Server Error)',
  },
};

export const EmptyData: Story = {
  args: {
    ...BASE_PROPS,
    summary: null,
    providers: [],
    filteredProviders: [],
    trendChartTimestamps: [],
    donutSlices: [],
  },
};

export const SearchActive: Story = {
  args: {
    ...BASE_PROPS,
    searchQuery: 'claude',
    filteredProviders: PROVIDERS.filter((p) => p.model.includes('claude')),
  },
};

export const WithComparisonActive: Story = {
  args: {
    ...BASE_PROPS,
    comparisonModelA: PROVIDERS[0]?.model ?? '',
    comparisonModelB: PROVIDERS[1]?.model ?? '',
    comparisonRowA: PROVIDERS[0] ?? null,
    comparisonRowB: PROVIDERS[1] ?? null,
    comparisonDelta: PROVIDERS[0] && PROVIDERS[1] ? computeComparisonDelta(PROVIDERS[0], PROVIDERS[1]) : null,
  },
};

export const WithImportedSnapshot: Story = {
  args: {
    ...BASE_PROPS,
    importedSnapshot: {
      label: 'Last month export',
      providers: PROVIDERS.map((p) => ({ ...p, cost_usd: p.cost_usd * 0.85 })),
      trend: PREVIOUS_TREND,
      imported_at: new Date().toISOString(),
    },
  },
};

export const ImportDialogOpen: Story = {
  args: {
    ...BASE_PROPS,
    importDialogOpen: true,
    importPastedJson: '',
    importParseError: null,
    importParseSuccess: false,
  },
};

export const DetailDialogOpen: Story = {
  args: {
    ...BASE_PROPS,
    selectedRow: PROVIDERS[0] ?? null,
    detailOpen: true,
  },
};

export const OverBudgetCalculator: Story = {
  args: {
    ...BASE_PROPS,
    calculatorTokensPerDay: 8000000,
    calculatorCostPer1k: 0.06,
    calculatorBudgetUsd: 500,
    calculatorResult: computeCalculatorResult(8000000, 0.06, 500),
  },
};
