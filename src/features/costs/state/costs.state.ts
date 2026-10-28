import type {
  CostSummaryResult,
  CostByProvider,
} from "../models/costs.model";

export interface CostsStateData {
  summary: CostSummaryResult | null;
  providers: CostByProvider[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export class CostsState {
  private data: CostsStateData;
  private listeners: Set<(state: CostsStateData) => void> = new Set();

  constructor(initialData?: Partial<CostsStateData>) {
    this.data = {
      summary: initialData?.summary ?? null,
      providers: initialData?.providers ?? [],
      isLoading: initialData?.isLoading ?? false,
      hasError: initialData?.hasError ?? false,
      errorMessage: initialData?.errorMessage ?? null,
    };
  }

  getSnapshot(): CostsStateData {
    return this.data;
  }

  subscribe(listener: (state: CostsStateData) => void): () => void {
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

  setData(payload: { summary: CostSummaryResult; providers: CostByProvider[] }): void {
    this.data = {
      ...this.data,
      summary: payload.summary,
      providers: payload.providers,
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

export const costsStateInstance = new CostsState();
