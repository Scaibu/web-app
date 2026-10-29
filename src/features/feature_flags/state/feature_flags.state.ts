/**
 * Central State Container for Feature Flags.
 * Strictly adheres to Part III (Frontend Feature Structure: State Role).
 */

import type { FeatureFlagRule } from '../models/feature_flags.model';
import { DUMMY_FEATURE_FLAGS } from '../adapter/feature_flags.adapter';

export interface FeatureFlagsStateData {
  flags: FeatureFlagRule[];
  selectedFlag: FeatureFlagRule | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export class FeatureFlagsState {
  private data: FeatureFlagsStateData;
  private listeners: Set<(state: FeatureFlagsStateData) => void> = new Set();

  constructor() {
    this.data = {
      flags: DUMMY_FEATURE_FLAGS,
      selectedFlag: DUMMY_FEATURE_FLAGS[0] ?? null,
      isLoading: false,
      hasError: false,
      errorMessage: null,
    };
  }

  getSnapshot(): FeatureFlagsStateData {
    return this.data;
  }

  subscribe(listener: (state: FeatureFlagsStateData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  toggleFlag(id: string): void {
    const updated = this.data.flags.map((f) =>
      f.id === id ? { ...f, enabled: !f.enabled } : f
    );
    this.data = { ...this.data, flags: updated };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.data));
  }
}

export const featureFlagsStateInstance = new FeatureFlagsState();
