/**
 * Central State Container for Prompt Playground.
 * Strictly adheres to Part III (Frontend Feature Structure: State Role).
 */

import type {
  PromptVariant,
  ModelParameters,
  DiffMetrics,
} from '../models/playground.model';

export interface PlaygroundStateData {
  variantA: PromptVariant;
  variantB: PromptVariant;
  isExecuting: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

const defaultParams: ModelParameters = {
  temperature: 0.7,
  maxTokens: 1024,
  topP: 1.0,
  frequencyPenalty: 0.0,
};

export class PlaygroundState {
  private data: PlaygroundStateData;
  private listeners: Set<(state: PlaygroundStateData) => void> = new Set();

  constructor(initialData?: Partial<PlaygroundStateData>) {
    this.data = {
      variantA: initialData?.variantA ?? {
        id: 'var-a',
        label: 'Baseline (Production v1)',
        model: 'gpt-4o',
        systemPrompt: 'You are an accurate financial advisor. Always format dates in ISO 8601.',
        userPrompt: 'Summarize the revenue trends for Q3 2026.',
        parameters: { ...defaultParams },
        status: 'idle',
      },
      variantB: initialData?.variantB ?? {
        id: 'var-b',
        label: 'Candidate (Optimized v2)',
        model: 'claude-3-5-sonnet',
        systemPrompt: 'You are an expert financial analyst. Return a concise bullet summary and strict markdown tables.',
        userPrompt: 'Summarize the revenue trends for Q3 2026.',
        parameters: { ...defaultParams, temperature: 0.2 },
        status: 'idle',
      },
      isExecuting: initialData?.isExecuting ?? false,
      hasError: initialData?.hasError ?? false,
      errorMessage: initialData?.errorMessage ?? null,
    };
  }

  getSnapshot(): PlaygroundStateData {
    return this.data;
  }

  subscribe(listener: (state: PlaygroundStateData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  updatePrompt(
    variantKey: 'variantA' | 'variantB',
    field: 'systemPrompt' | 'userPrompt' | 'model',
    value: string
  ): void {
    this.data = {
      ...this.data,
      [variantKey]: {
        ...this.data[variantKey],
        [field]: value,
      },
    };
    this.notify();
  }

  updateParameters(
    variantKey: 'variantA' | 'variantB',
    params: Partial<ModelParameters>
  ): void {
    this.data = {
      ...this.data,
      [variantKey]: {
        ...this.data[variantKey],
        parameters: {
          ...this.data[variantKey].parameters,
          ...params,
        },
      },
    };
    this.notify();
  }

  setExecuting(isExecuting: boolean): void {
    this.data = {
      ...this.data,
      isExecuting,
      variantA: {
        ...this.data.variantA,
        status: isExecuting ? 'running' : this.data.variantA.status,
      },
      variantB: {
        ...this.data.variantB,
        status: isExecuting ? 'running' : this.data.variantB.status,
      },
    };
    this.notify();
  }

  setResults(
    resultA: { completion: string; durationMs: number; tokenCount: number; costUsd: number },
    resultB: { completion: string; durationMs: number; tokenCount: number; costUsd: number }
  ): void {
    this.data = {
      ...this.data,
      isExecuting: false,
      hasError: false,
      errorMessage: null,
      variantA: {
        ...this.data.variantA,
        ...resultA,
        status: 'completed',
      },
      variantB: {
        ...this.data.variantB,
        ...resultB,
        status: 'completed',
      },
    };
    this.notify();
  }

  setError(errorMessage: string): void {
    this.data = {
      ...this.data,
      hasError: true,
      errorMessage,
      isExecuting: false,
      variantA: { ...this.data.variantA, status: 'failed' },
      variantB: { ...this.data.variantB, status: 'failed' },
    };
    this.notify();
  }

  getDiffMetrics(): DiffMetrics | null {
    const a = this.data.variantA;
    const b = this.data.variantB;
    if (a.durationMs === undefined || b.durationMs === undefined) return null;

    return {
      durationDeltaMs: b.durationMs - a.durationMs,
      costDeltaUsd: (b.costUsd ?? 0) - (a.costUsd ?? 0),
      tokensDelta: (b.tokenCount ?? 0) - (a.tokenCount ?? 0),
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.data));
  }
}

export const playgroundStateInstance = new PlaygroundState();
