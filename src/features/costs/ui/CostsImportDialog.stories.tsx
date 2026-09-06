import type { Meta, StoryObj } from '@storybook/react';
import { CostsImportDialog } from './CostsImportDialog';
import type { CostByProvider } from '../types';

const SAMPLE_JSON: CostByProvider[] = [
  { provider: 'OpenAI', model: 'gpt-4o', cost_usd: 720.10, token_count: 12000000, pct_of_total: 62.3 },
  { provider: 'Anthropic', model: 'claude-3-5-sonnet', cost_usd: 380.50, token_count: 7500000, pct_of_total: 32.9 },
  { provider: 'OpenAI', model: 'text-embedding-3-small', cost_usd: 55.00, token_count: 18000000, pct_of_total: 4.8 },
];

const meta: Meta<typeof CostsImportDialog> = {
  title: 'Features/Costs/CostsImportDialog',
  component: CostsImportDialog,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    onOpenChange: () => {},
    onPastedJsonChange: () => {},
    onFileSelected: () => {},
    onConfirm: () => {},
    onClear: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof CostsImportDialog>;

export const OpenEmpty: Story = {
  args: {
    open: true,
    pastedJson: '',
    parseError: null,
    parseSuccess: false,
  },
};

export const WithValidJson: Story = {
  args: {
    open: true,
    pastedJson: JSON.stringify(SAMPLE_JSON, null, 2),
    parseError: null,
    parseSuccess: true,
  },
};

export const WithParseError: Story = {
  args: {
    open: true,
    pastedJson: '{ bad json structure here }',
    parseError: 'Invalid JSON: Unexpected token b at position 2.',
    parseSuccess: false,
  },
};

export const WithSchemaError: Story = {
  args: {
    open: true,
    pastedJson: JSON.stringify([{ wrong_field: 'value' }]),
    parseError: 'Schema validation failed: missing required fields (provider, model, cost_usd).',
    parseSuccess: false,
  },
};

export const Closed: Story = {
  args: {
    open: false,
    pastedJson: '',
    parseError: null,
    parseSuccess: false,
  },
};

export const ReadyToApply: Story = {
  args: {
    open: true,
    pastedJson: JSON.stringify(SAMPLE_JSON),
    parseError: null,
    parseSuccess: true,
  },
};
