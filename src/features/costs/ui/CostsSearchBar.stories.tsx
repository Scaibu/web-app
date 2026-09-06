import type { Meta, StoryObj } from '@storybook/react';
import { CostsSearchBar } from './CostsSearchBar';

const meta: Meta<typeof CostsSearchBar> = {
  title: 'Features/Costs/CostsSearchBar',
  component: CostsSearchBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { onChange: () => {} },
};

export default meta;
type Story = StoryObj<typeof CostsSearchBar>;

export const Empty: Story = {
  args: { value: '' },
};

export const WithQuery: Story = {
  args: { value: 'claude', resultCount: 1 },
};

export const NoResults: Story = {
  args: { value: 'nonexistent-model-xyz', resultCount: 0 },
};

export const Loading: Story = {
  args: { value: 'gpt', isLoading: true },
};

export const CustomPlaceholder: Story = {
  args: { value: '', placeholder: 'Filter by model name…' },
};
