import type {
  PercentilesResult,
  SLOResult,
  BaselinePoint,
  AttributionResult,
} from "../models/latency.model";

export interface LatencyStateData {
  percentiles: PercentilesResult | null;
  slo: SLOResult | null;
  attribution: AttributionResult | null;
  baseline: BaselinePoint[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export class LatencyState {
  private data: LatencyStateData;
  private listeners: Set<(state: LatencyStateData) => void> = new Set();

  constructor(initialData?: Partial<LatencyStateData>) {
    this.data = {
      percentiles: initialData?.percentiles ?? null,
      slo: initialData?.slo ?? null,
      attribution: initialData?.attribution ?? null,
      baseline: initialData?.baseline ?? [],
      isLoading: initialData?.isLoading ?? false,
      hasError: initialData?.hasError ?? false,
      errorMessage: initialData?.errorMessage ?? null,
    };
  }

  getSnapshot(): LatencyStateData {
    return this.data;
  }

  subscribe(listener: (state: LatencyStateData) => void): () => void {
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

  setData(payload: {
    percentiles: PercentilesResult;
    slo: SLOResult;
    attribution: AttributionResult;
    baseline: BaselinePoint[];
  }): void {
    this.data = {
      ...this.data,
      ...payload,
      isLoading: false,
      hasError: false,
      errorMessage: null,
    };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.data));
  }
}

export const latencyStateInstance = new LatencyState();
