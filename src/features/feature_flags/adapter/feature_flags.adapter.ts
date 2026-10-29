/**
 * Outbound Adapter & Telemetry Data for Feature Flags.
 * Adheres strictly to Part III (Frontend Feature Structure: Adapter Role).
 */

import type { FeatureFlagRule } from '../models/feature_flags.model';

export const DUMMY_FEATURE_FLAGS: FeatureFlagRule[] = [
  {
    id: 'ff-llm-fallback-chain',
    key: 'ENABLE_LLM_PROVIDER_FALLBACK',
    name: 'Dynamic Claude to GPT-4o Automatic Fallback Mesh',
    description: 'Enables automatic rerouting upon Anthropic or OpenAI 5xx / 429 rate limit errors.',
    enabled: true,
    rollout_percentage: 100,
    targeting_rules_count: 3,
    environment: 'production',
    created_at: '2026-10-14T08:00:00Z',
  },
  {
    id: 'ff-pii-masker-v2',
    key: 'STRICT_PII_ZERO_LOG_MASKING',
    name: 'Strict Zero-Knowledge PII Sanitization Engine',
    description: 'Redacts Social Security Numbers, Credit Cards, and API keys before persisting spans.',
    enabled: true,
    rollout_percentage: 100,
    targeting_rules_count: 5,
    environment: 'production',
    created_at: '2026-10-18T10:30:00Z',
  },
  {
    id: 'ff-speculative-decoding',
    key: 'SPECULATIVE_DECODING_ACCELERATOR',
    name: 'Speculative Token Decoding via Small Draft Model',
    description: 'Uses Llama-3-8B draft model to achieve 2.4x speedup on 70B completions.',
    enabled: false,
    rollout_percentage: 25,
    targeting_rules_count: 1,
    environment: 'staging',
    created_at: '2026-10-27T16:00:00Z',
  },
];

export interface FeatureFlagsAdapterPort {
  listFlags(): Promise<FeatureFlagRule[]>;
  toggleFlag(id: string, enabled: boolean): Promise<void>;
}

export class FeatureFlagsMockAdapter implements FeatureFlagsAdapterPort {
  private inMemoryFlags = [...DUMMY_FEATURE_FLAGS];

  async listFlags(): Promise<FeatureFlagRule[]> {
    return [...this.inMemoryFlags];
  }

  async toggleFlag(id: string, enabled: boolean): Promise<void> {
    const idx = this.inMemoryFlags.findIndex((f) => f.id === id);
    if (idx >= 0) {
      this.inMemoryFlags[idx].enabled = enabled;
    }
  }
}

export const featureFlagsAdapter = new FeatureFlagsMockAdapter();
