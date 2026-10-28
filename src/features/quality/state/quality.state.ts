import type {
  QualitySummaryResult,
  QualityTrendPoint,
  ModelQualityBreakdown,
  FlaggedContentAlert,
} from "../models/quality.model";

export interface QualityStateData {
  summary: QualitySummaryResult | null;
  trend: QualityTrendPoint[];
  modelBreakdown: ModelQualityBreakdown[];
  flaggedContent: FlaggedContentAlert[];
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export class QualityState {
  private data: QualityStateData;
  private listeners: Set<(state: QualityStateData) => void> = new Set();

  constructor(initialData?: Partial<QualityStateData>) {
    this.data = {
      summary: initialData?.summary ?? null,
      trend: initialData?.trend ?? [],
      modelBreakdown: initialData?.modelBreakdown ?? [],
      flaggedContent: initialData?.flaggedContent ?? [],
      isLoading: initialData?.isLoading ?? false,
      hasError: initialData?.hasError ?? false,
      errorMessage: initialData?.errorMessage ?? null,
    };
  }

  getSnapshot(): QualityStateData {
    return this.data;
  }

  subscribe(listener: (state: QualityStateData) => void): () => void {
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
    summary: QualitySummaryResult;
    trend: QualityTrendPoint[];
    modelBreakdown: ModelQualityBreakdown[];
    flaggedContent: FlaggedContentAlert[];
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

export const qualityStateInstance = new QualityState();
