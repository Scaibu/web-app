/**
 * Central State Container for Admin Compliance.
 * Strictly adheres to Part III (Frontend Feature Structure: State Role).
 */

import type { CompliancePolicyRule } from '../models/compliance.model';
import { DUMMY_COMPLIANCE_RULES } from '../adapter/compliance.adapter';

export interface ComplianceStateData {
  rules: CompliancePolicyRule[];
  selectedRule: CompliancePolicyRule | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export class ComplianceState {
  private data: ComplianceStateData;
  private listeners: Set<(state: ComplianceStateData) => void> = new Set();

  constructor() {
    this.data = {
      rules: DUMMY_COMPLIANCE_RULES,
      selectedRule: DUMMY_COMPLIANCE_RULES[0] ?? null,
      isLoading: false,
      hasError: false,
      errorMessage: null,
    };
  }

  getSnapshot(): ComplianceStateData {
    return this.data;
  }

  subscribe(listener: (state: ComplianceStateData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  selectRule(rule: CompliancePolicyRule | null): void {
    this.data = { ...this.data, selectedRule: rule };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.data));
  }
}

export const complianceStateInstance = new ComplianceState();
