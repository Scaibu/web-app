/**
 * Outbound Adapter for Prompt Execution and Inference Simulation.
 * Adheres strictly to Part III (Frontend Feature Structure: Adapter Role).
 */

import type { PromptVariant } from '../models/playground.model';

export interface PlaygroundAdapterPort {
  executePrompt(variant: PromptVariant): Promise<{
    completion: string;
    durationMs: number;
    tokenCount: number;
    costUsd: number;
  }>;
}

export class PlaygroundMockAdapter implements PlaygroundAdapterPort {
  async executePrompt(variant: PromptVariant): Promise<{
    completion: string;
    durationMs: number;
    tokenCount: number;
    costUsd: number;
  }> {
    const isClaude = variant.model.includes('claude');
    const baseDuration = isClaude ? 480 : 390;
    const tokens = 320;
    const cost = isClaude ? 0.0048 : 0.0032;

    const completion = isClaude
      ? `### Executive Financial Brief — Q3 2026\n\n- **Consolidated Revenue:** $48.2M (+14.2% YoY)\n- **Operating Income:** $9.4M (19.5% margin)\n- **Key Drivers:** B2B recurring SaaS subscriptions contributed 78% of expansion.\n\n| Segment | Revenue ($M) | YoY Growth |\n| :--- | :--- | :--- |\n| Core Platform | $37.6 | +12.0% |\n| Enterprise Add-ons | $10.6 | +23.1% |`
      : `Revenue for Q3 2026 reached $48.2 million, indicating a 14.2% increase compared to the prior year. Growth was largely sustained by enterprise subscription adoption and higher retention. Operating profit margins settled at 19.5%.`;

    return {
      completion,
      durationMs: baseDuration,
      tokenCount: tokens,
      costUsd: cost,
    };
  }
}

export const playgroundAdapter = new PlaygroundMockAdapter();
