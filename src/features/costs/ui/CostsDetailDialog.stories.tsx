import type { Meta, StoryObj } from '@storybook/react';
import { CostsDetailDialog } from './CostsDetailDialog';
import { computeDetailMetrics } from './costs-ui.utils';
import type { CostByProvider } from '../types';

const FULL_ROW: CostByProvider = {
  provider: 'OpenAI',
  model: 'gpt-4o',
  cost_usd: 850.40,
  token_count: 14200000,
  pct_of_total: 59.8,
  input_tokens: 10000000,
  output_tokens: 4200000,
};

const MINIMAL_ROW: CostByProvider = {
  provider: 'Cohere',
  model: 'command-r-plus',
  cost_usd: 42.10,
  token_count: 900000,
  pct_of_total: 3.1,
};

const fullMetrics = computeDetailMetrics(FULL_ROW);
const minimalMetrics = computeDetailMetrics(MINIMAL_ROW);

const meta: Meta<typeof CostsDetailDialog> = {
  title: 'Features/Costs/CostsDetailDialog',
  component: CostsDetailDialog,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof CostsDetailDialog>;

export const OpenWithFullData: Story = {
  args: {
    open: true,
    row: FULL_ROW,
    onOpenChange: () => {},
    ...fullMetrics,
  },
};

export const OpenWithMinimalData: Story = {
  args: {
    open: true,
    row: MINIMAL_ROW,
    onOpenChange: () => {},
    ...minimalMetrics,
  },
};

export const OpenHighSpend: Story = {
  args: {
    open: true,
    row: { ...FULL_ROW, cost_usd: 9800, pct_of_total: 92.3 },
    onOpenChange: () => {},
    ...computeDetailMetrics({ ...FULL_ROW, cost_usd: 9800, pct_of_total: 92.3 }),
  },
};

export const Closed: Story = {
  args: {
    open: false,
    row: FULL_ROW,
    onOpenChange: () => {},
    ...fullMetrics,
  },
};
