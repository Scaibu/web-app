import type { Meta, StoryObj } from '@storybook/react';
import { CostsComparisonView } from './CostsComparisonView';
import { computeComparisonDelta } from './costs-ui.utils';
import type { CostByProvider } from '../types';

const MODEL_OPTIONS = ['gpt-4o', 'claude-3-5-sonnet', 'text-embedding-3-small', 'gemini-1.5-pro'];

const ROW_A: CostByProvider = {
  provider: 'OpenAI',
  model: 'gpt-4o',
  cost_usd: 850.40,
  token_count: 14200000,
  pct_of_total: 59.8,
};

const ROW_B: CostByProvider = {
  provider: 'Anthropic',
  model: 'claude-3-5-sonnet',
  cost_usd: 420.10,
  token_count: 8900000,
  pct_of_total: 29.5,
};

const ROW_EQUAL: CostByProvider = {
  provider: 'Google',
  model: 'gemini-1.5-pro',
  cost_usd: 850.40,
  token_count: 14200000,
  pct_of_total: 59.8,
};

const meta: Meta<typeof CostsComparisonView> = {
  title: 'Features/Costs/CostsComparisonView',
  component: CostsComparisonView,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    onModelAChange: () => {},
    onModelBChange: () => {},
    modelOptions: MODEL_OPTIONS,
  },
};

export default meta;
type Story = StoryObj<typeof CostsComparisonView>;

export const NothingSelected: Story = {
  args: { modelA: '', modelB: '', rowA: null, rowB: null, delta: null },
};

export const OnlyASelected: Story = {
  args: { modelA: ROW_A.model, modelB: '', rowA: ROW_A, rowB: null, delta: null },
};

export const BothSelected: Story = {
  args: {
    modelA: ROW_A.model,
    modelB: ROW_B.model,
    rowA: ROW_A,
    rowB: ROW_B,
    delta: computeComparisonDelta(ROW_A, ROW_B),
  },
};

export const EqualCost: Story = {
  args: {
    modelA: ROW_A.model,
    modelB: ROW_EQUAL.model,
    rowA: ROW_A,
    rowB: ROW_EQUAL,
    delta: computeComparisonDelta(ROW_A, ROW_EQUAL),
  },
};

export const Loading: Story = {
  args: { modelA: '', modelB: '', rowA: null, rowB: null, delta: null, isLoading: true },
};

export const LargeSpendDelta: Story = {
  args: {
    modelA: ROW_A.model,
    modelB: 'text-embedding-3-small',
    rowA: ROW_A,
    rowB: { provider: 'OpenAI', model: 'text-embedding-3-small', cost_usd: 15.00, token_count: 45000000, pct_of_total: 1.1 },
    delta: computeComparisonDelta(ROW_A, { provider: 'OpenAI', model: 'text-embedding-3-small', cost_usd: 15.00, token_count: 45000000, pct_of_total: 1.1 }),
  },
};
