/**
 * Central State Container for Evaluations & Benchmark Experiments.
 * Strictly adheres to Part III (Frontend Feature Structure: State Role).
 */

import type {
  EvaluationRun,
  EvaluationComparison,
  EvalRunStatus,
} from '../models/evaluations.model';

export interface EvaluationsStateData {
  runs: EvaluationRun[];
  selectedRun: EvaluationRun | null;
  comparison: EvaluationComparison | null;
  selectedModelFilter: string | null;
  statusFilter: EvalRunStatus | 'all';
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export class EvaluationsState {
  private data: EvaluationsStateData;
  private listeners: Set<(state: EvaluationsStateData) => void> = new Set();

  constructor(initialData?: Partial<EvaluationsStateData>) {
    this.data = {
      runs: initialData?.runs ?? [],
      selectedRun: initialData?.selectedRun ?? null,
      comparison: initialData?.comparison ?? null,
      selectedModelFilter: initialData?.selectedModelFilter ?? null,
      statusFilter: initialData?.statusFilter ?? 'all',
      isLoading: initialData?.isLoading ?? false,
      hasError: initialData?.hasError ?? false,
      errorMessage: initialData?.errorMessage ?? null,
    };
  }

  getSnapshot(): EvaluationsStateData {
    return this.data;
  }

  subscribe(listener: (state: EvaluationsStateData) => void): () => void {
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

  setRuns(runs: EvaluationRun[]): void {
    this.data = {
      ...this.data,
      runs,
      isLoading: false,
      hasError: false,
      errorMessage: null,
    };
    this.notify();
  }

  selectRun(run: EvaluationRun | null): void {
    this.data = { ...this.data, selectedRun: run };
    this.notify();
  }

  setComparison(comparison: EvaluationComparison | null): void {
    this.data = { ...this.data, comparison };
    this.notify();
  }

  setModelFilter(model: string | null): void {
    this.data = { ...this.data, selectedModelFilter: model };
    this.notify();
  }

  setStatusFilter(status: EvalRunStatus | 'all'): void {
    this.data = { ...this.data, statusFilter: status };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.data));
  }
}

export const evaluationsStateInstance = new EvaluationsState();
