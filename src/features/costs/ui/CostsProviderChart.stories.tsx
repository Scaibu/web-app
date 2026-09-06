import type { Meta, StoryObj } from '@storybook/react';
import { CostsProviderChart, buildDonutSlices } from './CostsProviderChart';

const PROVIDERS = [
  { provider: 'OpenAI', cost_usd: 850.40, pct_of_total: 59.8 },
  { provider: 'Anthropic', cost_usd: 420.10, pct_of_total: 29.5 },
  { provider: 'OpenAI', cost_usd: 150.00, pct_of_total: 10.7 },
];

const SINGLE_PROVIDER = [
  { provider: 'OpenAI', cost_usd: 1420.50, pct_of_total: 100 },
];

const MANY_PROVIDERS = [
  { provider: 'OpenAI', cost_usd: 600, pct_of_total: 42.3 },
  { provider: 'Anthropic', cost_usd: 400, pct_of_total: 28.2 },
  { provider: 'Google', cost_usd: 250, pct_of_total: 17.6 },
  { provider: 'Cohere', cost_usd: 100, pct_of_total: 7.0 },
  { provider: 'Mistral', cost_usd: 68, pct_of_total: 4.8 },
];

const meta: Meta<typeof CostsProviderChart> = {
  title: 'Features/Costs/CostsProviderChart',
  component: CostsProviderChart,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof CostsProviderChart>;

export const MultipleProviders: Story = {
  args: { slices: buildDonutSlices(PROVIDERS) },
};

export const SingleProvider: Story = {
  args: { slices: buildDonutSlices(SINGLE_PROVIDER) },
};

export const ManyProviders: Story = {
  args: { slices: buildDonutSlices(MANY_PROVIDERS) },
};

export const Loading: Story = {
  args: { slices: [], isLoading: true },
};

export const Empty: Story = {
  args: { slices: [] },
};

export const Error: Story = {
  args: { slices: [], error: 'Failed to load provider spend data.' },
};
