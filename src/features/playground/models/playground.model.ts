/**
 * Domain Models for Prompt Playground & Side-by-Side Diffing.
 * Strictly adheres to Part III (Frontend Feature Structure: Model Role).
 */

export interface ModelParameters {
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
}

export interface PromptVariant {
  id: string;
  label: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  parameters: ModelParameters;
  completion?: string;
  durationMs?: number;
  tokenCount?: number;
  costUsd?: number;
  status: 'idle' | 'running' | 'completed' | 'failed';
}

export interface DiffMetrics {
  durationDeltaMs: number;
  costDeltaUsd: number;
  tokensDelta: number;
}
