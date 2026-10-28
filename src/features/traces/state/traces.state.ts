import type {
  TraceSummary,
  TraceDetailResult,
} from "../models/traces.model";

export interface TracesStateData {
  traces: TraceSummary[];
  selectedTrace: TraceDetailResult | null;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export class TracesState {
  private data: TracesStateData;
  private listeners: Set<(state: TracesStateData) => void> = new Set();

  constructor(initialData?: Partial<TracesStateData>) {
    this.data = {
      traces: initialData?.traces ?? [],
      selectedTrace: initialData?.selectedTrace ?? null,
      isLoading: initialData?.isLoading ?? false,
      hasError: initialData?.hasError ?? false,
      errorMessage: initialData?.errorMessage ?? null,
    };
  }

  getSnapshot(): TracesStateData {
    return this.data;
  }

  subscribe(listener: (state: TracesStateData) => void): () => void {
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

  setTraces(traces: TraceSummary[]): void {
    this.data = {
      ...this.data,
      traces,
      isLoading: false,
      hasError: false,
      errorMessage: null,
    };
    this.notify();
  }

  setSelectedTrace(trace: TraceDetailResult | null): void {
    this.data = { ...this.data, selectedTrace: trace };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.data));
  }
}

export const tracesStateInstance = new TracesState();
