import type { Meta, StoryObj } from '@storybook/react';
import { CostsPeriodComparison } from './CostsPeriodComparison';
import { buildPeriodComparisonUplotData } from './costs-ui.utils';
import type { CostTrendPoint } from '../types';

const CURRENT: CostTrendPoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0] ?? '',
  cost_usd: 40 + Math.sin(i / 3) * 10,
  token_count: 400000,
}));

const PREVIOUS: CostTrendPoint[] = CURRENT.map((p) => ({ ...p, cost_usd: p.cost_usd * 0.82 }));

const [indices30, currVals30, prevVals30] = buildPeriodComparisonUplotData(CURRENT, PREVIOUS);
const [indices7, currVals7, prevVals7] = buildPeriodComparisonUplotData(CURRENT.slice(0, 7), PREVIOUS.slice(0, 7));

const currentSummary = { total_cost_usd: 1420.50, daily_avg_usd: 47.35 };
const previousSummary = { total_cost_usd: 1162.81, daily_avg_usd: 38.76 };

const meta: Meta<typeof CostsPeriodComparison> = {
  title: 'Features/Costs/CostsPeriodComparison',
  component: CostsPeriodComparison,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    onRangeChange: () => {},
    currentLabel: 'Current Period',
    previousLabel: 'Previous Period',
    currentSummary,
    previousSummary,
  },
};

export default meta;
type Story = StoryObj<typeof CostsPeriodComparison>;

export const ThirtyDays: Story = {
  args: {
    selectedRange: '30d',
    indices: indices30,
    currentValues: currVals30,
    previousValues: prevVals30,
    deltaPct: 22.2,
  },
};

export const SevenDays: Story = {
  args: {
    selectedRange: '7d',
    indices: indices7,
    currentValues: currVals7,
    previousValues: prevVals7,
    deltaPct: 18.5,
  },
};

export const SpendDecreased: Story = {
  args: {
    selectedRange: '30d',
    indices: indices30,
    currentValues: currVals30.map((v) => v * 0.7),
    previousValues: prevVals30,
    deltaPct: -30.0,
    currentSummary: { total_cost_usd: 994.35, daily_avg_usd: 33.14 },
  },
};

export const NoChange: Story = {
  args: {
    selectedRange: '30d',
    indices: indices30,
    currentValues: currVals30,
    previousValues: currVals30,
    deltaPct: 0,
  },
};

export const Loading: Story = {
  args: {
    selectedRange: '30d',
    indices: [],
    currentValues: [],
    previousValues: [],
    deltaPct: 0,
    isLoading: true,
  },
};

export const Error: Story = {
  args: {
    selectedRange: '30d',
    indices: indices30,
    currentValues: currVals30,
    previousValues: prevVals30,
    deltaPct: 22.2,
    error: 'Historical data unavailable for previous period.',
  },
};
