/**
 * Controller for RAG Context & Semantic Diagnostics.
 * Adheres strictly to Part III (Frontend Feature Structure: Controller Role).
 */

import {
  ragDiagnosticsStateInstance,
  RAGDiagnosticsState,
} from '../state/rag_diagnostics.state';
import {
  ragAdapter,
  type RAGAdapterPort,
} from '../adapter/rag_diagnostics.adapter';
import type { RAGDiagnosticsTrace, RetrievedChunk } from '../models/rag_diagnostics.model';

export class RAGDiagnosticsController {
  constructor(
    private readonly state: RAGDiagnosticsState = ragDiagnosticsStateInstance,
    private readonly adapter: RAGAdapterPort = ragAdapter
  ) {}

  async loadRAGTraces(): Promise<void> {
    this.state.setLoading(true);
    try {
      const traces = await this.adapter.listRAGTraces();
      this.state.setTraces(traces);
      if (traces.length > 0 && !this.state.getSnapshot().selectedTrace) {
        this.state.selectTrace(traces[0]);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load RAG telemetry';
      this.state.setError(msg);
    } finally {
      this.state.setLoading(false);
    }
  }

  selectTrace(trace: RAGDiagnosticsTrace | null): void {
    this.state.selectTrace(trace);
  }

  selectChunk(chunk: RetrievedChunk | null): void {
    this.state.selectChunk(chunk);
  }

  setMinSimilarity(minScore: number): void {
    this.state.setMinSimilarity(minScore);
  }
}

export const ragDiagnosticsController = new RAGDiagnosticsController();
