import type { Meta, StoryObj } from '@storybook/react';
import { CostsTrendChart } from './CostsTrendChart';
import { trendPointsToUplotData } from './costs-ui.utils';
import type { CostTrendPoint } from '../types';

const TREND: CostTrendPoint[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0] ?? '',
  cost_usd: 40 + Math.sin(i / 3) * 10 + Math.random() * 5,
  token_count: 400000 + Math.floor(Math.sin(i / 4) * 50000 + Math.random() * 30000),
}));

const BASELINE: CostTrendPoint[] = TREND.map((p) => ({
  ...p,
  cost_usd: p.cost_usd * 0.8,
}));

const [timestamps, costs, tokens] = trendPointsToUplotData(TREND);
const [, baselineCosts] = trendPointsToUplotData(BASELINE);

const meta: Meta<typeof CostsTrendChart> = {
  title: 'Features/Costs/CostsTrendChart',
  component: CostsTrendChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { onModeChange: () => {} },
};

export default meta;
type Story = StoryObj<typeof CostsTrendChart>;

export const CostView: Story = {
  args: { timestamps, costs, tokens, mode: 'cost' },
};

export const TokenView: Story = {
  args: { timestamps, costs, tokens, mode: 'tokens' },
};

export const WithBaseline: Story = {
  args: {
    timestamps,
    costs,
    tokens,
    baselineTimestamps: timestamps,
    baselineCosts,
    baselineLabel: 'Last month import',
    mode: 'cost',
  },
};

export const Loading: Story = {
  args: { timestamps: [], costs: [], tokens: [], mode: 'cost', isLoading: true },
};

export const Empty: Story = {
  args: { timestamps: [], costs: [], tokens: [], mode: 'cost' },
};

export const Error: Story = {
  args: {
    timestamps: [],
    costs: [],
    tokens: [],
    mode: 'cost',
    error: 'Failed to load trend data. Service returned HTTP 503.',
  },
};

export const TallHeight: Story = {
  args: { timestamps, costs, tokens, mode: 'cost', height: 320 },
};
