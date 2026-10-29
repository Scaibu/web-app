/**
 * Outbound Adapter for RAG Telemetry and Retrieved Chunks.
 * Adheres strictly to Part III (Frontend Feature Structure: Adapter Role).
 */

import type { RAGDiagnosticsTrace } from '../models/rag_diagnostics.model';

export interface RAGAdapterPort {
  listRAGTraces(): Promise<RAGDiagnosticsTrace[]>;
}

export class RAGMockAdapter implements RAGAdapterPort {
  private inMemoryTraces: RAGDiagnosticsTrace[] = [
    {
      id: 'rag-trace-401',
      query: 'What was the Q3 operating margin in our SEC 10-K filing?',
      collection_name: 'sec_filings_hybrid_dense',
      top_k: 4,
      vector_distance_metric: 'cosine',
      total_context_tokens: 3120,
      context_window_limit: 8192,
      retrieval_latency_ms: 48,
      generation_latency_ms: 412,
      chunks: [
        {
          id: 'chk-01',
          document_title: '2026-Q3-10K-Consolidated.pdf',
          chunk_index: 14,
          similarity_score: 0.942,
          token_count: 780,
          text_content: 'Operating income for the third quarter settled at $9.4 million, representing an operating margin of 19.5% compared to 16.8% in the prior year period.',
          is_relevant: true,
        },
        {
          id: 'chk-02',
          document_title: '2026-Q3-10K-Consolidated.pdf',
          chunk_index: 15,
          similarity_score: 0.887,
          token_count: 820,
          text_content: 'Gross margin expanded 140 basis points to 68.2%, primarily reflecting optimized cloud infrastructure spend and favorable tiered licensing.',
          is_relevant: true,
        },
        {
          id: 'chk-03',
          document_title: '2025-Annual-Report.pdf',
          chunk_index: 82,
          similarity_score: 0.612,
          token_count: 740,
          text_content: 'Historical GAAP net loss for FY2025 included non-recurring severance charges of $3.2M associated with operational restructuring.',
          is_relevant: false,
        },
      ],
    },
    {
      id: 'rag-trace-402',
      query: 'List the primary SOC2 compliant cloud regions used for data residency.',
      collection_name: 'infrastructure_compliance_kb',
      top_k: 3,
      vector_distance_metric: 'cosine',
      total_context_tokens: 1840,
      context_window_limit: 8192,
      retrieval_latency_ms: 32,
      generation_latency_ms: 280,
      chunks: [
        {
          id: 'chk-11',
          document_title: 'Data-Residency-Matrix-v4.md',
          chunk_index: 2,
          similarity_score: 0.965,
          token_count: 620,
          text_content: 'All EU customer payloads are strictly pinned to AWS eu-central-1 (Frankfurt) with AES-256 KMS customer-managed keys.',
          is_relevant: true,
        },
        {
          id: 'chk-12',
          document_title: 'Data-Residency-Matrix-v4.md',
          chunk_index: 3,
          similarity_score: 0.912,
          token_count: 590,
          text_content: 'US East multi-tenant clusters reside in us-east-1 (N. Virginia) with redundant backups in us-west-2 (Oregon).',
          is_relevant: true,
        },
      ],
    },
  ];

  async listRAGTraces(): Promise<RAGDiagnosticsTrace[]> {
    return [...this.inMemoryTraces];
  }
}

export const ragAdapter = new RAGMockAdapter();
