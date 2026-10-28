import type {
  OverviewKPIAggregates,
  SystemHealthSLOBanner,
  RecentTracePreview,
} from "../models/overview.model";

export interface OverviewStateData {
  kpis: OverviewKPIAggregates | null;
  health: SystemHealthSLOBanner | null;
  recentTraces: RecentTracePreview[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export class OverviewState {
  private data: OverviewStateData;
  private listeners: Set<(state: OverviewStateData) => void> = new Set();

  constructor(initialData?: Partial<OverviewStateData>) {
    this.data = {
      kpis: initialData?.kpis ?? null,
      health: initialData?.health ?? null,
      recentTraces: initialData?.recentTraces ?? [],
      isLoading: initialData?.isLoading ?? false,
      hasError: initialData?.hasError ?? false,
      errorMessage: initialData?.errorMessage ?? null,
    };
  }

  getSnapshot(): OverviewStateData {
    return this.data;
  }

  subscribe(listener: (state: OverviewStateData) => void): () => void {
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
    kpis: OverviewKPIAggregates;
    health: SystemHealthSLOBanner;
    recentTraces: RecentTracePreview[];
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

export const overviewStateInstance = new OverviewState();
