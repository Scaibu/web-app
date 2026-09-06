import type { Meta, StoryObj } from '@storybook/react';
import { CostsCalculator } from './CostsCalculator';
import { computeCalculatorResult } from './costs-ui.utils';

const MODEL_OPTIONS = ['gpt-4o', 'claude-3-5-sonnet', 'text-embedding-3-small', 'gemini-1.5-pro'];

const meta: Meta<typeof CostsCalculator> = {
  title: 'Features/Costs/CostsCalculator',
  component: CostsCalculator,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    onTokensPerDayChange: () => {},
    onCostPer1kChange: () => {},
    onBudgetChange: () => {},
    onModelChange: () => {},
    modelOptions: MODEL_OPTIONS,
    selectedModel: MODEL_OPTIONS[0],
  },
};

export default meta;
type Story = StoryObj<typeof CostsCalculator>;

export const Default: Story = {
  args: {
    tokensPerDay: 500000,
    costPer1kTokens: 0.03,
    budgetUsd: 1500,
    result: computeCalculatorResult(500000, 0.03, 1500),
  },
};

export const LowUsage: Story = {
  args: {
    tokensPerDay: 10000,
    costPer1kTokens: 0.001,
    budgetUsd: 100,
    result: computeCalculatorResult(10000, 0.001, 100),
  },
};

export const OverBudget: Story = {
  args: {
    tokensPerDay: 8000000,
    costPer1kTokens: 0.06,
    budgetUsd: 500,
    result: computeCalculatorResult(8000000, 0.06, 500),
  },
};

export const NearBudget: Story = {
  args: {
    tokensPerDay: 2000000,
    costPer1kTokens: 0.03,
    budgetUsd: 1800,
    result: computeCalculatorResult(2000000, 0.03, 1800),
  },
};

export const NoBudgetSet: Story = {
  args: {
    tokensPerDay: 500000,
    costPer1kTokens: 0.03,
    budgetUsd: 0,
    result: computeCalculatorResult(500000, 0.03, 0),
  },
};

export const Loading: Story = {
  args: {
    tokensPerDay: 0,
    costPer1kTokens: 0,
    budgetUsd: 0,
    result: computeCalculatorResult(0, 0, 0),
    isLoading: true,
  },
};

export const HighCostModel: Story = {
  args: {
    tokensPerDay: 100000,
    costPer1kTokens: 0.15,
    budgetUsd: 1000,
    result: computeCalculatorResult(100000, 0.15, 1000),
  },
};
