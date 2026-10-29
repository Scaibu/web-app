/**
 * Central State Container for SLO & Error Budget Management.
 * Strictly adheres to Part III (Frontend Feature Structure: State Role).
 */

import type { SLOPolicyRule } from '../models/slos.model';
import { DUMMY_SLO_RULES } from '../adapter/slos.adapter';

export interface SLOStateData {
  rules: SLOPolicyRule[];
  selectedRule: SLOPolicyRule | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export class SLOState {
  private data: SLOStateData;
  private listeners: Set<(state: SLOStateData) => void> = new Set();

  constructor() {
    this.data = {
      rules: DUMMY_SLO_RULES,
      selectedRule: DUMMY_SLO_RULES[0] ?? null,
      isLoading: false,
      hasError: false,
      errorMessage: null,
    };
  }

  getSnapshot(): SLOStateData {
    return this.data;
  }

  subscribe(listener: (state: SLOStateData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  selectRule(rule: SLOPolicyRule | null): void {
    this.data = { ...this.data, selectedRule: rule };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.data));
  }
}

export const sloStateInstance = new SLOState();
