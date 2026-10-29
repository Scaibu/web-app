/**
 * Central State Container for Policies & Guardrail Violations.
 * Strictly adheres to Part III (Frontend Feature Structure: State Role).
 */

import type {
  PolicyViolation,
  PolicySummaryStats,
  ViolationSeverity,
  GuardrailType,
} from '../models/policies.model';

export interface PoliciesStateData {
  violations: PolicyViolation[];
  selectedViolation: PolicyViolation | null;
  stats: PolicySummaryStats;
  severityFilter: ViolationSeverity | 'all';
  typeFilter: GuardrailType | 'all';
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export class PoliciesState {
  private data: PoliciesStateData;
  private listeners: Set<(state: PoliciesStateData) => void> = new Set();

  constructor(initialData?: Partial<PoliciesStateData>) {
    this.data = {
      violations: initialData?.violations ?? [],
      selectedViolation: initialData?.selectedViolation ?? null,
      stats: initialData?.stats ?? {
        totalViolations: 0,
        criticalBlocked: 0,
        avgOverheadMs: 0,
        topOffendingService: '-',
      },
      severityFilter: initialData?.severityFilter ?? 'all',
      typeFilter: initialData?.typeFilter ?? 'all',
      isLoading: initialData?.isLoading ?? false,
      hasError: initialData?.hasError ?? false,
      errorMessage: initialData?.errorMessage ?? null,
    };
  }

  getSnapshot(): PoliciesStateData {
    return this.data;
  }

  subscribe(listener: (state: PoliciesStateData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  setLoading(isLoading: boolean): void {
    this.data = { ...this.data, isLoading };
    this.notify();
  }

  setError(errorMessage: string): void {
    this.data = {
      ...this.data,
      hasError: true,
      errorMessage,
      isLoading: false,
    };
    this.notify();
  }

  setViolations(violations: PolicyViolation[], stats: PolicySummaryStats): void {
    this.data = {
      ...this.data,
      violations,
      stats,
      isLoading: false,
      hasError: false,
      errorMessage: null,
    };
    this.notify();
  }

  selectViolation(violation: PolicyViolation | null): void {
    this.data = { ...this.data, selectedViolation: violation };
    this.notify();
  }

  setSeverityFilter(severity: ViolationSeverity | 'all'): void {
    this.data = { ...this.data, severityFilter: severity };
    this.notify();
  }

  setTypeFilter(type: GuardrailType | 'all'): void {
    this.data = { ...this.data, typeFilter: type };
    this.notify();
  }

  updateViolationStatus(id: string, status: PolicyViolation['status']): void {
    const updated = this.data.violations.map((v) =>
      v.id === id ? { ...v, status } : v
    );
    const selected = this.data.selectedViolation?.id === id
      ? { ...this.data.selectedViolation, status }
      : this.data.selectedViolation;

    this.data = {
      ...this.data,
      violations: updated,
      selectedViolation: selected,
    };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.data));
  }
}

export const policiesStateInstance = new PoliciesState();
