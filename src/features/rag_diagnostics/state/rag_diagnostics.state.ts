/**
 * Central State Container for RAG Context & Semantic Drift Diagnostics.
 * Strictly adheres to Part III (Frontend Feature Structure: State Role).
 */

import type {
  RAGDiagnosticsTrace,
  RetrievedChunk,
} from '../models/rag_diagnostics.model';

export interface RAGStateData {
  traces: RAGDiagnosticsTrace[];
  selectedTrace: RAGDiagnosticsTrace | null;
  selectedChunk: RetrievedChunk | null;
  minSimilarityFilter: number;
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
}

export class RAGDiagnosticsState {
  private data: RAGStateData;
  private listeners: Set<(state: RAGStateData) => void> = new Set();

  constructor(initialData?: Partial<RAGStateData>) {
    this.data = {
      traces: initialData?.traces ?? [],
      selectedTrace: initialData?.selectedTrace ?? null,
      selectedChunk: initialData?.selectedChunk ?? null,
      minSimilarityFilter: initialData?.minSimilarityFilter ?? 0.7,
      isLoading: initialData?.isLoading ?? false,
      hasError: initialData?.hasError ?? false,
      errorMessage: initialData?.errorMessage ?? null,
    };
  }

  getSnapshot(): RAGStateData {
    return this.data;
  }

  subscribe(listener: (state: RAGStateData) => void): () => void {
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

  setTraces(traces: RAGDiagnosticsTrace[]): void {
    this.data = {
      ...this.data,
      traces,
      isLoading: false,
      hasError: false,
      errorMessage: null,
    };
    this.notify();
  }

  selectTrace(trace: RAGDiagnosticsTrace | null): void {
    this.data = {
      ...this.data,
      selectedTrace: trace,
      selectedChunk: trace?.chunks[0] ?? null,
    };
    this.notify();
  }

  selectChunk(chunk: RetrievedChunk | null): void {
    this.data = { ...this.data, selectedChunk: chunk };
    this.notify();
  }

  setMinSimilarity(minSimilarity: number): void {
    this.data = { ...this.data, minSimilarityFilter: minSimilarity };
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.data));
  }
}

export const ragDiagnosticsStateInstance = new RAGDiagnosticsState();
